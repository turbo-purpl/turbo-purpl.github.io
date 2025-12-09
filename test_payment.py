#!/usr/bin/env python3
"""
Тестовый скрипт для проверки создания платежа и генерации ton:// ссылки
"""

import sqlite3
import hashlib
import time

# Конфигурация
TON_WALLET = "UQAbbPSD6ww1BpZR4Y0XPrqThysNRTLPhXb6xkbII_GhN_fb"
TEST_USER_ID = 1455767363
TEST_AMOUNT = 100

def generate_memo(user_id: int, amount: int) -> str:
    """Генерация уникального мемо для платежа"""
    timestamp = int(time.time())
    data = f"{user_id}_{amount}_{timestamp}"
    memo = hashlib.md5(data.encode()).hexdigest()[:16]
    return memo.upper()

def create_payment(user_id: int, amount: int) -> dict:
    """Создание платежа"""
    memo = generate_memo(user_id, amount)
    
    # Создаем ton:// ссылку
    amount_nano = amount * 1000000000  # Конвертируем в нанотоны
    ton_url = f"ton://transfer/{TON_WALLET}?amount={amount_nano}&text={memo}"
    
    return {
        'payment_id': 1,  # Тестовый ID
        'memo': memo,
        'amount': amount,
        'wallet': TON_WALLET,
        'ton_url': ton_url,
        'amount_nano': amount_nano
    }

def test_payment_creation():
    """Тест создания платежа"""
    print("=" * 60)
    print("ТЕСТ СОЗДАНИЯ ПЛАТЕЖА")
    print("=" * 60)
    
    print(f"\nПараметры теста:")
    print(f"  User ID: {TEST_USER_ID}")
    print(f"  Amount: {TEST_AMOUNT} ₽")
    print(f"  TON Wallet: {TON_WALLET}")
    
    # Создаем платеж
    payment = create_payment(TEST_USER_ID, TEST_AMOUNT)
    
    print(f"\n✅ Платеж создан успешно!")
    print(f"\nДетали платежа:")
    print(f"  Payment ID: {payment['payment_id']}")
    print(f"  Memo: {payment['memo']}")
    print(f"  Amount: {payment['amount']} ₽")
    print(f"  Amount (nano): {payment['amount_nano']} nanoTON")
    print(f"  Wallet: {payment['wallet']}")
    
    print(f"\n📱 TON ссылка:")
    print(f"  {payment['ton_url']}")
    
    print(f"\n🔍 Проверка формата ссылки:")
    if payment['ton_url'].startswith('ton://transfer/'):
        print("  ✅ Формат ссылки корректен")
    else:
        print("  ❌ Неверный формат ссылки")
    
    if len(payment['memo']) == 16:
        print("  ✅ Длина мемо корректна (16 символов)")
    else:
        print(f"  ❌ Неверная длина мемо: {len(payment['memo'])}")
    
    if payment['amount_nano'] == TEST_AMOUNT * 1000000000:
        print("  ✅ Конвертация в нанотоны корректна")
    else:
        print(f"  ❌ Неверная конвертация: {payment['amount_nano']}")
    
    print("\n" + "=" * 60)
    print("ТЕСТ ЗАВЕРШЕН")
    print("=" * 60)
    
    return payment

if __name__ == '__main__':
    test_payment_creation()

