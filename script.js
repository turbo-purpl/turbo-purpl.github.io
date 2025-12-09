// Конфигурация приложения
const CONFIG = {
    basePrice: 500,
    priceMultipliers: {
        devices: { 1: 1, 2: 1.5, custom: 2 },
        period: { 1: 1, 2: 1.8, 3: 2.5 }
    },
    languages: ['Русский', 'English', '中文', 'Español'],
    currencies: ['₽ (RUB)', '$ (USD)', '€ (EUR)', '¥ (CNY)']
};

// Утилиты
const Utils = {
    // Санитизация строки для безопасного отображения
    sanitizeString(str) {
        if (typeof str !== 'string') {
            return String(str || '');
        }
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Валидация и санитизация числа
    sanitizeNumber(value, min = null, max = null, defaultValue = 0) {
        const num = parseInt(value, 10);
        if (isNaN(num)) return defaultValue;
        if (min !== null && num < min) return min;
        if (max !== null && num > max) return max;
        return num;
    },

    // Валидация строки (только безопасные символы)
    validateString(str, maxLength = 1000) {
        if (typeof str !== 'string') return '';
        // Удаляем потенциально опасные символы
        const sanitized = str.replace(/[<>\"'&]/g, '').trim();
        return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
    },

    // Сохранение в localStorage с валидацией
    saveToStorage(key, value) {
        try {
            // Валидация ключа
            if (!key || typeof key !== 'string' || key.length > 100) {
                console.warn('Invalid storage key');
                return false;
            }
            
            // Ограничение размера данных
            const serialized = JSON.stringify(value);
            if (serialized.length > 1000000) { // 1MB лимит
                console.warn('Storage data too large');
                return false;
            }
            
            localStorage.setItem(key, serialized);
            return true;
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
            return false;
        }
    },

    // Загрузка из localStorage с валидацией
    loadFromStorage(key, defaultValue = null) {
        try {
            // Валидация ключа
            if (!key || typeof key !== 'string' || key.length > 100) {
                return defaultValue;
            }
            
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            
            const parsed = JSON.parse(item);
            // Проверка на циклические ссылки и большие объекты
            if (JSON.stringify(parsed).length > 1000000) {
                console.warn('Storage data too large');
                return defaultValue;
            }
            
            return parsed;
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
            return defaultValue;
        }
    },

    // Задержка
    delay(ms) {
        const sanitizedMs = Math.max(0, Math.min(ms, 60000)); // Максимум 60 секунд
        return new Promise(resolve => setTimeout(resolve, sanitizedMs));
    },

    // Форматирование цены
    formatPrice(amount, currency = '₽') {
        const sanitizedAmount = Utils.sanitizeNumber(amount, 0, 999999999);
        const sanitizedCurrency = Utils.validateString(currency, 10);
        return `${sanitizedAmount} ${sanitizedCurrency}`;
    }
};

// Управление навигацией
class NavigationManager {
    constructor() {
        this.currentView = 'home';
        this.init();
    }

    init() {
        const tabItems = document.querySelectorAll('.tab-item');
        tabItems.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });

        // Загружаем сохраненный вид
        const savedView = Utils.loadFromStorage('currentView', 'home');
        this.switchView(savedView, false);
    }

    switchView(viewName, animate = true) {
        if (this.currentView === viewName) return;

        const currentViewEl = document.querySelector(`[data-view="${this.currentView}"]`);
        const newViewEl = document.querySelector(`[data-view="${viewName}"]`);
        const currentTab = document.querySelector(`.tab-item[data-view="${this.currentView}"]`);
        const newTab = document.querySelector(`.tab-item[data-view="${viewName}"]`);

        if (!newViewEl || !newTab) return;

        // Скрываем текущий вид
        if (currentViewEl) {
            currentViewEl.style.display = 'none';
        }
        if (currentTab) {
            currentTab.classList.remove('active');
        }

        // Показываем новый вид
        newViewEl.style.display = 'block';
        newViewEl.style.opacity = '1';
        newTab.classList.add('active');

        this.currentView = viewName;
        Utils.saveToStorage('currentView', viewName);

        // Инициализируем платформу для страницы инструкций
        if (viewName === 'guide' && app && app.guide) {
            setTimeout(() => {
                app.guide.initPlatform();
            }, 0);
        }

        // Обновляем баланс и историю при открытии профиля
        if (viewName === 'profile' && modalManager) {
            modalManager.loadOperationsHistory();
            modalManager.updateBalance();
        }




        // Инициализируем обработчик для перехода на поддержку из инструкций
        if (viewName === 'guide' && app && app.profile) {
            setTimeout(() => {
                const supportInfoNote = document.getElementById('supportInfoNote');
                if (supportInfoNote) {
                    // Удаляем старые обработчики, если они есть
                    const newNote = supportInfoNote.cloneNode(true);
                    supportInfoNote.parentNode.replaceChild(newNote, supportInfoNote);
                    
                    // Добавляем новые обработчики
                    newNote.addEventListener('click', () => {
                        app.profile.highlightSupportButton();
                    });
                    newNote.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            app.profile.highlightSupportButton();
                        }
                    });
                }
            }, 0);
        }

        // Прокрутка наверх
        const main = document.querySelector('.main');
        if (main) {
            main.scrollTop = 0;
        }
    }
}

// Управление модальными окнами
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        // Кнопка пополнения
        const topupBtn = document.getElementById('topupBtn');
        if (topupBtn) {
            topupBtn.addEventListener('click', () => this.open('topupModal'));
        }

        // Закрытие модальных окон
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) this.close(modal.id);
            });
        });

        // Закрытие по клику на overlay
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(overlay.id);
                }
            });
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });
    }

    open(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('active');
        this.activeModal = modalId;
        document.body.style.overflow = 'hidden';

        // Инициализация модального окна
        if (modalId === 'topupModal') {
            this.initTopupModal();
        }
    }

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('active');
        this.activeModal = null;
        document.body.style.overflow = '';

        // Сброс состояния
        if (modalId === 'topupModal') {
            this.resetTopupModal();
        } else if (modalId === 'settingsModal') {
            this.resetSettingsModal();
        }
    }

    initTopupModal() {
        const amountButtons = document.querySelectorAll('.amount-btn');
        const customAmountInput = document.getElementById('customAmount');
        const paymentOptions = document.querySelectorAll('.payment-option');
        const confirmBtn = document.getElementById('confirmTopupBtn');

        // Выбор суммы
        amountButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                amountButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Очищаем поле ввода при выборе кнопки
                if (customAmountInput) {
                    customAmountInput.value = '';
                }
            });
        });

        // Кастомная сумма
        if (customAmountInput) {
            customAmountInput.addEventListener('input', (e) => {
                let value = Utils.sanitizeNumber(e.target.value, 1, 1000000, 0);
                // Ограничиваем минимум 1
                if (value < 1 && e.target.value !== '') {
                    e.target.value = '1';
                    value = 1;
                }
                // Убираем активность с кнопок при вводе
                if (e.target.value && value > 0) {
                    amountButtons.forEach(b => b.classList.remove('active'));
                }
            });

            // Обработка открытия клавиатуры на мобильных
            customAmountInput.addEventListener('focus', (e) => {
                // Небольшая задержка для того, чтобы клавиатура успела открыться
                setTimeout(() => {
                    // Прокручиваем к полю ввода, чтобы оно было видно
                    const modalContent = document.querySelector('.modal-content');
                    if (modalContent) {
                        const inputRect = e.target.getBoundingClientRect();
                        const modalRect = modalContent.getBoundingClientRect();
                        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                        
                        // Если поле ввода находится слишком низко (под клавиатурой)
                        if (inputRect.bottom > viewportHeight - 100) {
                            e.target.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center',
                                inline: 'nearest'
                            });
                        }
                    }
                }, 300);
            });
        }

        // Выбор способа оплаты
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });

        // Подтверждение
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const selectedAmount = this.getSelectedAmount();
                const selectedMethod = this.getSelectedPaymentMethod();
                
                if (selectedAmount && selectedMethod) {
                    console.log('Topup:', { amount: selectedAmount, method: selectedMethod });
                    // Добавляем операцию в историю
                    this.addOperationToHistory('Пополнение', selectedAmount, true, selectedMethod);
                    this.close('topupModal');
                }
            });
        }
    }

    getSelectedAmount() {
        const activeBtn = document.querySelector('.amount-btn.active');
        if (activeBtn) {
            const amount = Utils.sanitizeNumber(activeBtn.dataset.amount, 1, 1000000, null);
            if (amount !== null) return amount;
        }
        
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput && customAmountInput.value) {
            const amount = Utils.sanitizeNumber(customAmountInput.value, 1, 1000000, null);
            if (amount !== null) return amount;
        }
        
        return null;
    }

    getSelectedPaymentMethod() {
        const activeOption = document.querySelector('.payment-option.active');
        return activeOption ? activeOption.dataset.method : null;
    }

    resetTopupModal() {
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        const customInput = document.getElementById('customAmount');
        if (customInput) customInput.value = '';
    }

    addOperationToHistory(type, amount, isPositive, method = null) {
        const operationsList = document.querySelector('.operations-list');
        if (!operationsList) return;

        // Валидация и санитизация входных данных
        const sanitizedType = Utils.validateString(type, 100);
        const sanitizedAmount = Utils.sanitizeNumber(amount, 0, 999999999);
        const sanitizedIsPositive = Boolean(isPositive);
        const sanitizedMethod = method ? Utils.validateString(method, 50) : null;

        // Получаем текущую дату
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const date = `${day}.${month}.${year}`;

        // Сохраняем операцию в localStorage
        const operations = Utils.loadFromStorage('operations', []);
        if (!Array.isArray(operations)) {
            console.warn('Invalid operations data, resetting');
            Utils.saveToStorage('operations', []);
            return;
        }
        
        operations.unshift({
            type: sanitizedType,
            amount: sanitizedAmount,
            isPositive: sanitizedIsPositive,
            method: sanitizedMethod,
            date: date
        });
        
        // Ограничиваем количество операций (максимум 1000)
        if (operations.length > 1000) {
            operations.splice(1000);
        }
        
        Utils.saveToStorage('operations', operations);

        // Обновляем баланс
        this.updateBalance();

        // Создаем новый элемент операции безопасным способом
        const operationItem = document.createElement('div');
        operationItem.className = 'operation-item';
        
        const iconClass = sanitizedIsPositive ? 'positive' : 'negative';
        const iconSymbol = sanitizedIsPositive ? 'add' : 'remove';
        const amountClass = sanitizedIsPositive ? 'positive' : 'negative';

        // Создаем структуру через DOM API вместо innerHTML
        const operationContent = document.createElement('div');
        operationContent.className = 'operation-content';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = `material-symbols-outlined operation-icon ${iconClass}`;
        iconSpan.textContent = iconSymbol;
        
        const operationInfo = document.createElement('div');
        operationInfo.className = 'operation-info';
        
        const typeSpan = document.createElement('span');
        typeSpan.className = 'operation-type';
        const methodText = sanitizedMethod ? ` (${this.getPaymentMethodName(sanitizedMethod)})` : '';
        typeSpan.textContent = sanitizedType + methodText;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'operation-date';
        dateSpan.textContent = date;
        
        operationInfo.appendChild(typeSpan);
        operationInfo.appendChild(dateSpan);
        
        operationContent.appendChild(iconSpan);
        operationContent.appendChild(operationInfo);
        
        const amountSpan = document.createElement('span');
        amountSpan.className = `operation-amount ${amountClass}`;
        amountSpan.textContent = sanitizedAmount;
        
        operationItem.appendChild(operationContent);
        operationItem.appendChild(amountSpan);

        // Вставляем в начало списка
        operationsList.insertBefore(operationItem, operationsList.firstChild);
    }

    getPaymentMethodName(method) {
        const methods = {
            'telegram-stars': 'Telegram Stars',
            'ton-ton': 'TON-TON',
            'usdt-ton': 'USDT-TON'
        };
        return methods[method] || method;
    }

    updateBalance() {
        const operations = Utils.loadFromStorage('operations', []);
        let totalBalance = 0;
        let telegramStarsBalance = 0;
        let tonTonBalance = 0;
        let usdtTonBalance = 0;
        
        operations.forEach(op => {
            if (op.isPositive) {
                totalBalance += op.amount;
                
                // Подсчитываем баланс по способам оплаты
                if (op.method === 'telegram-stars') {
                    telegramStarsBalance += op.amount;
                } else if (op.method === 'ton-ton') {
                    tonTonBalance += op.amount;
                } else if (op.method === 'usdt-ton') {
                    usdtTonBalance += op.amount;
                }
            } else {
                totalBalance -= op.amount;
            }
        });

        const telegramStarsElement = document.getElementById('balanceTelegramStars');
        if (telegramStarsElement) {
            telegramStarsElement.textContent = telegramStarsBalance;
        }

        const tonTonElement = document.getElementById('balanceTonTon');
        if (tonTonElement) {
            tonTonElement.textContent = tonTonBalance;
        }

        const usdtTonElement = document.getElementById('balanceUsdtTon');
        if (usdtTonElement) {
            usdtTonElement.textContent = usdtTonBalance;
        }
    }

    loadOperationsHistory() {
        let operations = Utils.loadFromStorage('operations', []);
        const operationsList = document.querySelector('.operations-list');
        if (!operationsList) return;

        // Валидация данных из localStorage
        if (!Array.isArray(operations)) {
            console.warn('Invalid operations data, resetting');
            operations = [];
            Utils.saveToStorage('operations', []);
        }

        // Если операций нет, инициализируем статические
        if (operations.length === 0) {
            const staticOperations = [
                { type: 'Пополнение', amount: 500, isPositive: true, method: null, date: '10.01.2025' },
                { type: 'Подписка', amount: 500, isPositive: false, method: null, date: '01.01.2025' }
            ];
            Utils.saveToStorage('operations', staticOperations);
            operations = staticOperations;
        }

        // Очищаем все операции безопасным способом
        while (operationsList.firstChild) {
            operationsList.removeChild(operationsList.firstChild);
        }

        // Загружаем сохраненные операции безопасным способом
        operations.forEach(op => {
            // Валидация каждой операции
            if (!op || typeof op !== 'object') return;
            
            const sanitizedType = Utils.validateString(op.type || '', 100);
            const sanitizedAmount = Utils.sanitizeNumber(op.amount, 0, 999999999);
            const sanitizedIsPositive = Boolean(op.isPositive);
            const sanitizedMethod = op.method ? Utils.validateString(op.method, 50) : null;
            const sanitizedDate = Utils.validateString(op.date || '', 20);

            const operationItem = document.createElement('div');
            operationItem.className = 'operation-item';
            
            const iconClass = sanitizedIsPositive ? 'positive' : 'negative';
            const iconSymbol = sanitizedIsPositive ? 'add' : 'remove';
            const amountClass = sanitizedIsPositive ? 'positive' : 'negative';

            // Создаем структуру через DOM API
            const operationContent = document.createElement('div');
            operationContent.className = 'operation-content';
            
            const iconSpan = document.createElement('span');
            iconSpan.className = `material-symbols-outlined operation-icon ${iconClass}`;
            iconSpan.textContent = iconSymbol;
            
            const operationInfo = document.createElement('div');
            operationInfo.className = 'operation-info';
            
            const typeSpan = document.createElement('span');
            typeSpan.className = 'operation-type';
            const methodText = sanitizedMethod ? ` (${this.getPaymentMethodName(sanitizedMethod)})` : '';
            typeSpan.textContent = sanitizedType + methodText;
            
            const dateSpan = document.createElement('span');
            dateSpan.className = 'operation-date';
            dateSpan.textContent = sanitizedDate;
            
            operationInfo.appendChild(typeSpan);
            operationInfo.appendChild(dateSpan);
            
            operationContent.appendChild(iconSpan);
            operationContent.appendChild(operationInfo);
            
            const amountSpan = document.createElement('span');
            amountSpan.className = `operation-amount ${amountClass}`;
            amountSpan.textContent = sanitizedAmount;
            
            operationItem.appendChild(operationContent);
            operationItem.appendChild(amountSpan);

            operationsList.appendChild(operationItem);
        });
    }

    openSettingsModal(settingType) {
        const modal = document.getElementById('settingsModal');
        const title = modal.querySelector('.modal-title');
        const list = document.getElementById('settingsList');

        if (!modal || !title || !list) return;

        let options = [];
        let currentValue = '';

        if (settingType === 'language') {
            title.textContent = 'Выберите язык';
            options = CONFIG.languages;
            currentValue = Utils.loadFromStorage('language', 'Русский');
        } else if (settingType === 'currency') {
            title.textContent = 'Выберите валюту';
            options = CONFIG.currencies;
            currentValue = Utils.loadFromStorage('currency', '₽ (RUB)');
        }

        // Генерируем список опций безопасным способом
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        
        options.forEach(option => {
            // Валидация опции
            const sanitizedOption = Utils.validateString(option, 100);
            if (!sanitizedOption) return;
            
            const isSelected = sanitizedOption === currentValue;
            const item = document.createElement('div');
            item.className = `settings-list-item ${isSelected ? 'selected' : ''}`;
            item.dataset.value = sanitizedOption;
            
            const textSpan = document.createElement('span');
            textSpan.textContent = sanitizedOption;
            item.appendChild(textSpan);
            
            if (isSelected) {
                const checkIcon = document.createElement('span');
                checkIcon.className = 'material-symbols-outlined';
                checkIcon.textContent = 'check';
                item.appendChild(checkIcon);
            }
            
            list.appendChild(item);
        });

        // Обработчики кликов
        list.querySelectorAll('.settings-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                // Валидация значения
                const sanitizedValue = Utils.validateString(value, 100);
                if (!sanitizedValue) return;
                
                // Сохраняем выбор
                if (settingType === 'language') {
                    // Проверяем, что значение есть в списке допустимых
                    if (CONFIG.languages.includes(sanitizedValue)) {
                        Utils.saveToStorage('language', sanitizedValue);
                        const languageValueEl = document.getElementById('languageValue');
                        if (languageValueEl) {
                            languageValueEl.textContent = sanitizedValue;
                        }
                    }
                } else if (settingType === 'currency') {
                    // Проверяем, что значение есть в списке допустимых
                    if (CONFIG.currencies.includes(sanitizedValue)) {
                        Utils.saveToStorage('currency', sanitizedValue);
                        const currencyValueEl = document.getElementById('currencyValue');
                        if (currencyValueEl) {
                            currencyValueEl.textContent = sanitizedValue;
                        }
                    }
                }

                this.close('settingsModal');
            });
        });

        this.open('settingsModal');
    }

    resetSettingsModal() {
        const list = document.getElementById('settingsList');
        if (list) list.innerHTML = '';
    }
}

// Управление тарифами
class PlansManager {
    constructor() {
        this.selectedProtocol = 'openvpn';
        this.selectedDevices = 1;
        this.selectedPeriod = 1;
        this.init();
    }

    init() {
        // Segmented controls
        this.initSegmentedControl('protocolControl', 'protocol', 'openvpn');
        this.initSegmentedControl('locationControl', 'location', 'netherlands');
        this.initSegmentedControl('devicesControl', 'devices', '1');
        this.initSegmentedControl('periodControl', 'period', '1');

        // Загружаем сохраненные значения
        this.selectedDevices = Utils.sanitizeNumber(Utils.loadFromStorage('selectedDevices', '1'), 1, 10, 1);
        this.selectedPeriod = Utils.sanitizeNumber(Utils.loadFromStorage('selectedPeriod', '1'), 1, 3, 1);

        this.updatePrice();
    }

    initSegmentedControl(controlId, type, defaultValue) {
        const control = document.getElementById(controlId);
        if (!control) return;

        const buttons = control.querySelectorAll('.plan-option, .segment, .plan-option-card, .plan-option-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');

                const value = button.dataset.value;
                
                if (type === 'devices') {
                    this.selectedDevices = value === 'custom' ? 'custom' : Utils.sanitizeNumber(value, 1, 10, 1);
                    Utils.saveToStorage('selectedDevices', this.selectedDevices);
                    
                    // Показываем/скрываем поле ввода для кастомного значения
                    const customInput = document.getElementById('customDevicesInput');
                    const customValueInput = document.getElementById('customDevicesValue');
                    if (customInput && customValueInput) {
                        if (value === 'custom') {
                            customInput.style.display = 'block';
                            // Небольшая задержка для плавного появления
                            setTimeout(() => {
                                customValueInput.focus();
                                // Прокручиваем к полю ввода на мобильных
                                customValueInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                        } else {
                            customInput.style.display = 'none';
                            customValueInput.value = '';
                        }
                    }
                    
                    // Скролл к следующей секции (Срок)
                    this.scrollToNextSection('period');
                } else if (type === 'period') {
                    this.selectedPeriod = Utils.sanitizeNumber(value, 1, 3, 1);
                    Utils.saveToStorage('selectedPeriod', this.selectedPeriod);
                    
                    // Скролл к кнопке подключения
                    setTimeout(() => {
                        const connectBtn = document.getElementById('connectBtn');
                        if (connectBtn) {
                            connectBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                } else if (type === 'protocol') {
                    this.selectedProtocol = value;
                    Utils.saveToStorage('selectedProtocol', this.selectedProtocol);
                    
                    // Скролл к следующей секции (Локация)
                    this.scrollToNextSection('location');
                } else if (type === 'location') {
                    // Скролл к следующей секции (Количество устройств)
                    this.scrollToNextSection('devices');
                }

                this.updatePrice();
            });
        });

        // Обработчик для кастомного ввода
        if (type === 'devices') {
            const customValueInput = document.getElementById('customDevicesValue');
            if (customValueInput) {
                customValueInput.addEventListener('input', (e) => {
                    let value = parseInt(e.target.value);
                    // Ограничиваем максимум 10
                    if (value > 10) {
                        value = 10;
                        e.target.value = 10;
                    }
                    if (value && value > 0 && value <= 10) {
                        this.selectedDevices = value;
                        Utils.saveToStorage('selectedDevices', this.selectedDevices);
                        this.updatePrice();
                    }
                });
                
                // Предотвращаем ввод значений больше 10
                customValueInput.addEventListener('keydown', (e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                        e.preventDefault();
                    }
                });
            }
        }

        // Устанавливаем активную кнопку
        const savedValue = type === 'devices' 
            ? Utils.loadFromStorage('selectedDevices', defaultValue)
            : Utils.loadFromStorage('selectedPeriod', defaultValue);
        
        const buttonToActivate = Array.from(buttons).find(b => 
            b.dataset.value === String(savedValue)
        );
        if (buttonToActivate) {
            buttons.forEach(b => b.classList.remove('active'));
            buttonToActivate.classList.add('active');
            
            // Если выбран custom, показываем поле ввода
            if (type === 'devices' && savedValue === 'custom') {
                const customInput = document.getElementById('customDevicesInput');
                if (customInput) {
                    customInput.style.display = 'block';
                }
            }
        }
    }

    scrollToNextSection(sectionName) {
        setTimeout(() => {
            const nextSection = document.querySelector(`[data-section="${sectionName}"]`);
            if (nextSection) {
                const main = document.querySelector('.main');
                if (main) {
                    const sectionRect = nextSection.getBoundingClientRect();
                    const mainRect = main.getBoundingClientRect();
                    const scrollTop = main.scrollTop;
                    const targetScroll = scrollTop + sectionRect.top - mainRect.top - 20; // 20px отступ сверху
                    
                    main.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            }
        }, 150);
    }

    updatePrice() {
        const priceEl = document.getElementById('priceValue');
        if (!priceEl) return;

        let deviceMultiplier;
        if (this.selectedDevices === 'custom') {
            const customInput = document.getElementById('customDevicesValue');
            const customValue = customInput ? Utils.sanitizeNumber(customInput.value, 1, 10, 0) : 0;
            if (customValue && customValue > 0) {
                // Для кастомного значения используем формулу: базовый множитель * количество
                deviceMultiplier = CONFIG.priceMultipliers.devices.custom * (customValue / 2);
            } else {
                deviceMultiplier = CONFIG.priceMultipliers.devices.custom;
            }
        } else {
            deviceMultiplier = CONFIG.priceMultipliers.devices[this.selectedDevices] || 1;
        }
        
        const periodMultiplier = CONFIG.priceMultipliers.period[this.selectedPeriod];
        const totalPrice = Math.round(CONFIG.basePrice * deviceMultiplier * periodMultiplier);

        const currency = Utils.loadFromStorage('currency', '₽ (RUB)').split(' ')[0];
        priceEl.textContent = Utils.formatPrice(totalPrice, currency);
    }
}

// Управление инструкциями
class GuideManager {
    constructor() {
        this.currentPlatform = this.detectPlatform();
        this.init();
    }

    detectPlatform() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const platform = navigator.platform || '';

        // Определяем платформу
        if (/android/i.test(userAgent)) {
            return 'android';
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        }
        if (/Win/.test(platform) || /Windows/.test(userAgent)) {
            return 'windows';
        }
        if (/Mac/.test(platform) || /Macintosh/.test(userAgent)) {
            return 'macos';
        }
        
        // По умолчанию Android
        return 'android';
    }

    init() {
        const platformControl = document.getElementById('platformControl');
        if (platformControl) {
            const segments = platformControl.querySelectorAll('.segment');
            segments.forEach(segment => {
                segment.addEventListener('click', () => {
                    const platform = segment.dataset.platform;
                    this.switchPlatform(platform);
                });
            });

            // Инициализируем платформу, если страница инструкций уже видна
            setTimeout(() => {
                const guideView = document.querySelector('[data-view="guide"]');
                if (guideView && (guideView.style.display !== 'none' || !guideView.style.display)) {
                    this.initPlatform();
                }
            }, 100);
        }
    }

    switchPlatform(platform, force = false) {
        if (!force && this.currentPlatform === platform) return;

        // Обновляем сегменты
        const platformControl = document.getElementById('platformControl');
        if (platformControl) {
            platformControl.querySelectorAll('.segment').forEach(segment => {
                segment.classList.remove('active');
                if (segment.dataset.platform === platform) {
                    segment.classList.add('active');
                }
            });
        }

        // Обновляем контент
        document.querySelectorAll('.guide-platform').forEach(content => {
            if (content.dataset.platform === platform) {
                content.style.display = 'block';
                content.classList.add('active');
            } else {
                content.style.display = 'none';
                content.classList.remove('active');
            }
        });

        this.currentPlatform = platform;
    }

    initPlatform() {
        // Инициализируем платформу при первом открытии страницы
        const detectedPlatform = this.detectPlatform();
        this.switchPlatform(detectedPlatform, true);
    }
}

// Управление настройками профиля
class ProfileManager {
    constructor() {
        this.init();
    }

    init() {
        // Загружаем сохраненные настройки
        const language = Utils.loadFromStorage('language', 'Русский');
        const currency = Utils.loadFromStorage('currency', '₽ (RUB)');

        const languageValue = document.getElementById('languageValue');
        const currencyValue = document.getElementById('currencyValue');

        if (languageValue) languageValue.textContent = language;
        if (currencyValue) currencyValue.textContent = currency;

        // Загружаем историю операций и обновляем баланс
        if (modalManager) {
            modalManager.loadOperationsHistory();
            modalManager.updateBalance();
        }

        // Обработчики кликов на настройки
        document.querySelectorAll('.setting-item').forEach(item => {
            item.addEventListener('click', () => {
                const setting = item.dataset.setting;
                if (setting === 'language' || setting === 'currency') {
                    if (modalManager) {
                        modalManager.openSettingsModal(setting);
                    }
                } else if (setting === 'support') {
                    // Логика поддержки
                    console.log('Support clicked');
                }
            });
        });
    }

    highlightSupportButton() {
        // Переключаемся на страницу профиля
        if (navigationManager) {
            navigationManager.switchView('profile');
        }

        // Ждем немного, чтобы страница успела отобразиться
        setTimeout(() => {
            const supportButton = document.querySelector('.setting-item[data-setting="support"]');
            if (supportButton) {
                // Добавляем класс для выделения
                supportButton.classList.add('highlight-support');
                
                // Прокручиваем к кнопке
                supportButton.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });

                // Убираем выделение через 3 секунды
                setTimeout(() => {
                    supportButton.classList.remove('highlight-support');
                }, 3000);
            }
        }, 100);
    }
}

// Skeleton Loading Manager
class SkeletonManager {
    constructor() {
        this.fontsLoaded = false;
        this.iconsLoaded = false;
        this.init();
    }

    init() {
        // Проверяем загрузку шрифтов
        this.checkFontsLoaded();
        
        // Проверяем загрузку иконок
        this.checkIconsLoaded();
        
        // Симулируем загрузку данных
        this.simulateLoading();
    }

    // Проверка загрузки шрифтов
    async checkFontsLoaded() {
        const fonts = [
            'Inter',
            'Nunito Sans',
            'Work Sans',
            'Mr Dafoe'
        ];

        try {
            await Promise.all(fonts.map(font => document.fonts.load(`400 16px "${font}"`)));
            this.fontsLoaded = true;
            this.removeFontSkeletons();
        } catch (e) {
            console.warn('Font loading check failed:', e);
            // Fallback: убираем скелетоны через 3 секунды
            setTimeout(() => {
                this.fontsLoaded = true;
                this.removeFontSkeletons();
            }, 3000);
        }
    }

    // Проверка загрузки Material Symbols
    checkIconsLoaded() {
        // Проверяем, загружен ли шрифт Material Symbols
        const testIcon = document.createElement('span');
        testIcon.className = 'material-symbols-outlined';
        testIcon.textContent = 'check';
        testIcon.style.position = 'absolute';
        testIcon.style.visibility = 'hidden';
        testIcon.style.fontSize = '24px';
        document.body.appendChild(testIcon);

        const checkIcon = () => {
            const computedStyle = window.getComputedStyle(testIcon);
            const fontFamily = computedStyle.fontFamily;
            
            // Если шрифт загружен, fontFamily будет содержать Material Symbols
            if (fontFamily.includes('Material Symbols') || fontFamily.includes('MaterialSymbols')) {
                this.iconsLoaded = true;
                this.removeIconSkeletons();
                document.body.removeChild(testIcon);
            } else {
                // Проверяем снова через 100ms
                setTimeout(checkIcon, 100);
            }
        };

        // Начинаем проверку после небольшой задержки
        setTimeout(checkIcon, 100);

        // Fallback: убираем скелетоны через 3 секунды
        setTimeout(() => {
            if (!this.iconsLoaded) {
                this.iconsLoaded = true;
                this.removeIconSkeletons();
                if (document.body.contains(testIcon)) {
                    document.body.removeChild(testIcon);
                }
            }
        }, 3000);
    }

    // Убираем скелетоны для текста с внешними шрифтами
    removeFontSkeletons() {
        document.querySelectorAll('[data-skeleton="text"]').forEach(el => {
            if (el.classList.contains('skeleton-text')) {
                el.classList.remove('skeleton-text');
            }
        });
    }

    // Убираем скелетоны для иконок
    removeIconSkeletons() {
        document.querySelectorAll('.material-symbols-outlined').forEach(icon => {
            icon.classList.remove('skeleton-icon');
        });
    }

    async simulateLoading() {
        // Показываем skeleton на 1.5 секунды
        await Utils.delay(1500);
        
        // Убираем skeleton классы для остальных элементов
        document.querySelectorAll('[data-skeleton]').forEach(el => {
            if (el.dataset.skeleton === 'avatar') {
                el.classList.remove('skeleton-circle');
            }
        });
    }
}

// Инициализация приложения
class App {
    constructor() {
        this.navigation = new NavigationManager();
        this.modal = new ModalManager();
        this.plans = new PlansManager();
        this.guide = new GuideManager();
        this.profile = new ProfileManager();
        this.skeleton = new SkeletonManager();
    }

    init() {
        console.log('MetalVPN App initialized');
    }
}


// Глобальные экземпляры
let navigationManager;
let modalManager;
let app;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем скелетоны для иконок до загрузки
    document.querySelectorAll('.material-symbols-outlined').forEach(icon => {
        icon.classList.add('skeleton-icon');
    });
    
    app = new App();
    navigationManager = app.navigation;
    modalManager = app.modal;
    app.init();
    
    // Прокрутка вверх при клике на логотип
    const logoBtn = document.getElementById('logoBtn');
    const mainContent = document.querySelector('.main');
    
    if (logoBtn && mainContent) {
        const scrollToTop = () => {
            // Добавляем скелетон при клике
            logoBtn.classList.add('skeleton-logo');
            
            // Прокрутка вверх
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Убираем скелетон после завершения
            setTimeout(() => {
                logoBtn.classList.remove('skeleton-logo');
            }, 350);
        };
        
        logoBtn.addEventListener('click', scrollToTop);
        logoBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
    }
});
