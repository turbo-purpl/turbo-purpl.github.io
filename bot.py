import os
import json
import sqlite3
import hashlib
import time
import asyncio
import threading
from datetime import datetime
from typing import Optional, Dict, List
from aiohttp import web
import aiohttp_cors
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
import logging

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Конфигурация
BOT_TOKEN = "8542836849:AAE1FO7uB-MGYyqsw3hMkVMGrnPyh1PSDag"
WEB_APP_URL = "https://turbo-purpl.github.io/"
TON_WALLET = "UQAbbPSD6ww1BpZR4Y0XPrqThysNRTLPhXb6xkbII_GhN_fb"
API_PORT = 8080

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            username TEXT,
            first_name TEXT,
            last_name TEXT,
            avatar_url TEXT,
            telegram_stars INTEGER DEFAULT 0,
            ton_balance INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица операций
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS operations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT,
            amount INTEGER,
            method TEXT,
            status TEXT DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    ''')
    
    # Таблица платежей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount INTEGER,
            memo TEXT UNIQUE,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Генерация уникального мемо для платежа
def generate_memo(user_id: int, amount: int) -> str:
    timestamp = int(time.time())
    data = f"{user_id}_{amount}_{timestamp}"
    memo = hashlib.md5(data.encode()).hexdigest()[:16]
    return memo.upper()

# Получение данных пользователя
def get_user_data(user_id: int) -> Optional[Dict]:
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'user_id': row[0],
            'username': row[1],
            'first_name': row[2],
            'last_name': row[3],
            'avatar_url': row[4],
            'telegram_stars': row[5],
            'ton_balance': row[6],
            'created_at': row[7]
        }
    return None

# Создание или обновление пользователя
def create_or_update_user(user_id: int, username: Optional[str], first_name: Optional[str], 
                          last_name: Optional[str], avatar_url: Optional[str] = None):
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT OR REPLACE INTO users (user_id, username, first_name, last_name, avatar_url)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, username, first_name, last_name, avatar_url))
    
    conn.commit()
    conn.close()

# Получение операций пользователя
def get_user_operations(user_id: int, limit: int = 100) -> List[Dict]:
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT type, amount, method, status, created_at
        FROM operations
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    ''', (user_id, limit))
    
    operations = []
    for row in cursor.fetchall():
        operations.append({
            'type': row[0],
            'amount': row[1],
            'method': row[2],
            'status': row[3],
            'date': datetime.fromisoformat(row[4]).strftime('%d.%m.%Y') if row[4] else None
        })
    
    conn.close()
    return operations

# Создание платежа
def create_payment(user_id: int, amount: int) -> Dict:
    memo = generate_memo(user_id, amount)
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO payments (user_id, amount, memo, status)
        VALUES (?, ?, ?, 'pending')
    ''', (user_id, amount, memo))
    
    payment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Создаем ton:// ссылку
    amount_nano = amount * 1000000000  # Конвертируем в нанотоны
    ton_url = f"ton://transfer/{TON_WALLET}?amount={amount_nano}&text={memo}"
    
    return {
        'payment_id': payment_id,
        'memo': memo,
        'amount': amount,
        'wallet': TON_WALLET,
        'ton_url': ton_url
    }

# Проверка платежа по мемо
def check_payment_by_memo(memo: str) -> Optional[Dict]:
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM payments WHERE memo = ?', (memo,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'payment_id': row[0],
            'user_id': row[1],
            'amount': row[2],
            'memo': row[3],
            'status': row[4],
            'created_at': row[5]
        }
    return None

# Обновление статуса платежа
def update_payment_status(payment_id: int, status: str):
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE payments SET status = ? WHERE id = ?', (status, payment_id))
    conn.commit()
    conn.close()

# Зачисление средств на баланс
def add_balance(user_id: int, amount: int, method: str = 'ton-ton'):
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    
    if method == 'ton-ton':
        cursor.execute('UPDATE users SET ton_balance = ton_balance + ? WHERE user_id = ?', 
                      (amount, user_id))
    elif method == 'telegram-stars':
        cursor.execute('UPDATE users SET telegram_stars = telegram_stars + ? WHERE user_id = ?', 
                      (amount, user_id))
    
    # Добавляем операцию
    cursor.execute('''
        INSERT INTO operations (user_id, type, amount, method, status)
        VALUES (?, 'Пополнение', ?, ?, 'completed')
    ''', (user_id, amount, method))
    
    conn.commit()
    conn.close()

# Команда /start
async def start_command(message: types.Message):
    user = message.from_user
    user_id = user.id
    
    # Создаем или обновляем пользователя
    create_or_update_user(
        user_id=user_id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        avatar_url=None
    )
    
    # Создаем кнопку с веб-приложением
    builder = InlineKeyboardBuilder()
    builder.add(InlineKeyboardButton(
        text="🚀 Открыть приложение",
        web_app=WebAppInfo(url=WEB_APP_URL)
    ))
    
    await message.answer(
        "Добро пожаловать в MetalVPN! 🚀\n\nНажмите кнопку ниже, чтобы открыть личный кабинет:",
        reply_markup=builder.as_markup()
    )

# API: Получение данных пользователя
async def api_get_user(request):
    user_id = int(request.query.get('user_id', 0))
    if not user_id:
        return web.json_response({'error': 'user_id required'}, status=400)
    
    user_data = get_user_data(user_id)
    if not user_data:
        return web.json_response({'error': 'User not found'}, status=404)
    
    return web.json_response({
        'user_id': user_data['user_id'],
        'username': user_data['username'],
        'first_name': user_data['first_name'],
        'last_name': user_data['last_name'],
        'avatar_url': user_data['avatar_url'],
        'telegram_stars': user_data['telegram_stars'],
        'ton_balance': user_data['ton_balance']
    })

# API: Получение операций
async def api_get_operations(request):
    user_id = int(request.query.get('user_id', 0))
    if not user_id:
        return web.json_response({'error': 'user_id required'}, status=400)
    
    operations = get_user_operations(user_id)
    return web.json_response({'operations': operations})

# API: Создание платежа
async def api_create_payment(request):
    if request.method == 'OPTIONS':
        # Обработка preflight запроса для CORS
        return web.Response(
            status=200,
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )
    
    data = await request.json()
    user_id = int(data.get('user_id', 0))
    amount = int(data.get('amount', 0))
    method = data.get('method', 'ton-ton')
    
    if not user_id or not amount:
        return web.json_response({'error': 'user_id and amount required'}, status=400)
    
    if method != 'ton-ton':
        return web.json_response({'error': 'Only ton-ton method supported'}, status=400)
    
    payment = create_payment(user_id, amount)
    return web.json_response(payment)

# API: Проверка статуса платежа
async def api_check_payment(request):
    payment_id = int(request.query.get('payment_id', 0))
    if not payment_id:
        return web.json_response({'error': 'payment_id required'}, status=400)
    
    conn = sqlite3.connect('bot.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM payments WHERE id = ?', (payment_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return web.json_response({'error': 'Payment not found'}, status=404)
    
    return web.json_response({
        'payment_id': row[0],
        'status': row[4],
        'amount': row[2],
        'memo': row[3]
    })

# API: Подтверждение платежа
async def api_confirm_payment(request):
    if request.method == 'OPTIONS':
        return web.Response(
            status=200,
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )
    
    data = await request.json()
    memo = data.get('memo')
    
    if not memo:
        return web.json_response({'error': 'memo required'}, status=400)
    
    payment = check_payment_by_memo(memo)
    if not payment:
        return web.json_response({'error': 'Payment not found'}, status=404)
    
    if payment['status'] == 'completed':
        return web.json_response({'status': 'already_completed'})
    
    # Зачисляем средства
    add_balance(payment['user_id'], payment['amount'], 'ton-ton')
    update_payment_status(payment['payment_id'], 'completed')
    
    return web.json_response({'status': 'completed', 'user_id': payment['user_id']})

def setup_api_routes(app):
    # Добавляем обработку OPTIONS для всех маршрутов
    async def options_handler(request):
        return web.Response(
            status=200,
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )
    
    app.router.add_route('OPTIONS', '/api/user', options_handler)
    app.router.add_route('OPTIONS', '/api/operations', options_handler)
    app.router.add_route('OPTIONS', '/api/payment/create', options_handler)
    app.router.add_route('OPTIONS', '/api/payment/check', options_handler)
    app.router.add_route('OPTIONS', '/api/payment/confirm', options_handler)
    
    app.router.add_get('/api/user', api_get_user)
    app.router.add_get('/api/operations', api_get_operations)
    app.router.add_post('/api/payment/create', api_create_payment)
    app.router.add_get('/api/payment/check', api_check_payment)
    app.router.add_post('/api/payment/confirm', api_confirm_payment)

def run_api_server():
    """Запуск API сервера в отдельном потоке"""
    async def start_server():
        app = web.Application()
        cors = aiohttp_cors.setup(app, defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
                allow_methods="*"
            )
        })
        setup_api_routes(app)
        
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', API_PORT)
        await site.start()
        
        logger.info(f"API server running on http://0.0.0.0:{API_PORT}")
        
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            pass
        finally:
            await runner.cleanup()
    
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(start_server())
    except Exception as e:
        logger.error(f"API server error: {e}")

async def main():
    # Инициализация БД
    init_db()
    logger.info("Database initialized")
    
    # Запуск API сервера в отдельном потоке
    api_thread = threading.Thread(target=run_api_server, daemon=True)
    api_thread.start()
    
    # Небольшая задержка для запуска API сервера
    await asyncio.sleep(2)
    
    # Инициализация бота и диспетчера
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    
    # Регистрация обработчиков
    dp.message.register(start_command, Command("start"))
    
    logger.info("Bot starting...")
    logger.info("Press Ctrl+C to stop")
    
    try:
        await dp.start_polling(bot, drop_pending_updates=True)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        await bot.session.close()

if __name__ == '__main__':
    asyncio.run(main())
