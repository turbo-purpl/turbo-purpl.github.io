# Настройка Ngrok

## Шаг 1: Регистрация и получение токена

1. Зарегистрируйтесь на https://dashboard.ngrok.com
2. Перейдите на https://dashboard.ngrok.com/get-started/your-authtoken
3. Скопируйте ваш authtoken

## Шаг 2: Установка токена

Выполните в терминале:
```bash
ngrok authtoken <ваш_токен>
```

Или установите через переменную окружения:
```bash
# Windows PowerShell
$env:NGROK_AUTHTOKEN="<ваш_токен>"

# Linux/Mac
export NGROK_AUTHTOKEN="<ваш_токен>"
```

## Шаг 3: Запуск бота

После настройки токена просто запустите бота:
```bash
python bot.py
```

Бот автоматически:
- Создаст ngrok туннель
- Получит публичный HTTPS URL
- Передаст его в WebApp через параметр `api_url`

## Примечание

При каждом перезапуске ngrok создает новый URL. Бот автоматически обновляет WebApp URL с новым ngrok адресом.

