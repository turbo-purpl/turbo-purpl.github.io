const tabButtons = document.querySelectorAll(".tab-button");
const content = document.querySelector("#content");

const views = {
  home: `
    <section class="card main-card">
      <div class="main-card-top">
        <div class="time-remaining">
          <span class="label">Осталось</span>
          <strong>12 дней · 6 часов</strong>
        </div>
        <div class="pulse-bar">
          <span></span>
        </div>
        <div class="subscription-meta">
          <div class="meta-item">
            <p class="label">Дата окончания</p>
            <p class="value-line">12.12.2025</p>
          </div>
          <div class="meta-item" style="text-align: right">
            <p class="label">Следующее списание</p>
            <p class="value-line">799 ₽</p>
          </div>
        </div>
        <div class="speed-meta">
          <div>
            <p class="label">Протокол</p>
            <p>OpenVPN</p>
          </div>
          <div style="text-align: right">
            <p class="label">Локация</p>
            <p>Нидерланды</p>
          </div>
        </div>
      </div>
      <div class="main-card-divider"></div>
      <div class="main-card-bottom">
        <div class="devices-section">
          <p class="label">Устройств в подписке</p>
          <div class="devices-row">
            <p class="count">1</p>
            <button class="add-device-btn">
              <span class="add-icon-skeleton"></span>
              <span class="material-symbols-outlined add-icon-loaded">add</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  plans: `
    <section class="plan-builder">
      <div class="plan-field">
        <p class="label">Протокол</p>
        <div class="segmented">
          <button class="segment active" data-type="protocol" data-value="openvpn">OpenVPN</button>
        </div>
      </div>

      <div class="plan-field">
        <p class="label">Количество устройств</p>
        <div class="segmented" data-segment="devices">
          <button class="segment active" data-type="devices" data-value="1">1</button>
          <button class="segment" data-type="devices" data-value="2">2</button>
          <button class="segment" data-type="devices" data-value="custom">Указать</button>
        </div>
        <div class="devices-custom hidden">
          <input type="number" min="1" placeholder="Например 5" inputmode="numeric" />
        </div>
      </div>

      <div class="plan-field">
        <p class="label">Срок</p>
        <div class="segmented" data-segment="months">
          <button class="segment active" data-type="months" data-value="1">1 месяц</button>
          <button class="segment" data-type="months" data-value="2">2 месяца</button>
          <button class="segment" data-type="months" data-value="3">3 месяца</button>
        </div>
      </div>

      <button class="plan-submit">Подключить • 50 ₽</button>
    </section>
  `,
  billing: `
    <section class="card">
      <h2>Оплата</h2>
      <p class="subtitle">Привяжите способ оплаты или пополните баланс вручную.</p>
      <ul class="payment-list">
        <li>••64 — MasterCard — автооплата активна</li>
        <li>••92 — MIR — резервный способ</li>
      </ul>
      <div class="action-buttons">
        <button class="action">Пополнить баланс</button>
        <button class="action">Добавить карту</button>
      </div>
    </section>
  `,
  guide: `
    <section class="card guide-section">
      <h2>Инструкция по подключению</h2>
      
      <div class="guide-downloads">
        <h3>Скачайте OpenVPN для вашей платформы:</h3>
        <div class="download-links">
          <a href="https://play.google.com/store/apps/details?id=net.openvpn.openvpn" target="_blank" class="download-link">
            <span class="material-symbols-outlined">android</span>
            <span>Android</span>
          </a>
          <a href="https://apps.apple.com/app/openvpn-connect/id590379981" target="_blank" class="download-link">
            <span class="material-symbols-outlined">phone_iphone</span>
            <span>iPhone / iPad</span>
          </a>
          <a href="https://openvpn.net/client-connect-vpn-for-windows/" target="_blank" class="download-link">
            <span class="material-symbols-outlined">desktop_windows</span>
            <span>Windows</span>
          </a>
          <a href="https://openvpn.net/client-connect-vpn-for-mac-os/" target="_blank" class="download-link">
            <span class="material-symbols-outlined">desktop_mac</span>
            <span>macOS</span>
          </a>
        </div>
      </div>

      <div class="guide-article">
        <h3>Как подключить файл конфигурации OpenVPN</h3>
        
        <div class="guide-step">
          <h4>1. Получите файл конфигурации</h4>
          <p>После оплаты подписки бот отправит вам файл конфигурации (обычно с расширением <code>.ovpn</code>). Сохраните этот файл на ваше устройство.</p>
        </div>

        <div class="guide-step">
          <h4>2. Установите приложение OpenVPN</h4>
          <p>Если вы еще не установили OpenVPN, скачайте его по ссылкам выше для вашей платформы.</p>
        </div>

        <div class="guide-step">
          <h4>3. Импортируйте файл конфигурации</h4>
          
          <div class="guide-platform">
            <strong>Android:</strong>
            <ol>
              <li>Откройте приложение OpenVPN Connect</li>
              <li>Нажмите на кнопку "IMPORT" или "Импорт"</li>
              <li>Выберите "FILE" или "Файл"</li>
              <li>Найдите и выберите файл <code>.ovpn</code>, который отправил бот</li>
              <li>Нажмите "ADD" или "Добавить"</li>
            </ol>
          </div>

          <div class="guide-platform">
            <strong>iPhone / iPad:</strong>
            <ol>
              <li>Откройте приложение OpenVPN Connect</li>
              <li>Нажмите на кнопку "+" в правом верхнем углу</li>
              <li>Выберите "Import from Files" или "Импорт из файлов"</li>
              <li>Найдите файл <code>.ovpn</code> в приложении "Файлы"</li>
              <li>Нажмите "ADD" или "Добавить"</li>
            </ol>
          </div>

          <div class="guide-platform">
            <strong>Windows:</strong>
            <ol>
              <li>Откройте приложение OpenVPN Connect</li>
              <li>Нажмите на кнопку "Add Profile" или "Добавить профиль"</li>
              <li>Выберите "File" или "Файл"</li>
              <li>Найдите и выберите файл <code>.ovpn</code></li>
              <li>Нажмите "Add" или "Добавить"</li>
            </ol>
          </div>

          <div class="guide-platform">
            <strong>macOS:</strong>
            <ol>
              <li>Откройте приложение OpenVPN Connect</li>
              <li>Нажмите на кнопку "+" или "Add Profile"</li>
              <li>Выберите "Import from file" или "Импорт из файла"</li>
              <li>Найдите и выберите файл <code>.ovpn</code></li>
              <li>Нажмите "Add" или "Добавить"</li>
            </ol>
          </div>
        </div>

        <div class="guide-step">
          <h4>4. Подключитесь к VPN</h4>
          <p>После импорта файла конфигурации:</p>
          <ol>
            <li>В списке профилей найдите добавленный профиль</li>
            <li>Нажмите на переключатель или кнопку "Connect" рядом с профилем</li>
            <li>При первом подключении может потребоваться ввести логин и пароль (если они указаны в файле конфигурации)</li>
            <li>Дождитесь установления соединения - индикатор станет зеленым</li>
          </ol>
        </div>

        <div class="guide-step">
          <h4>5. Проверьте подключение</h4>
          <p>После успешного подключения вы увидите статус "Connected" или "Подключено". Теперь весь ваш интернет-трафик будет проходить через VPN сервер MetalVPN.</p>
        </div>

        <div class="guide-note">
          <p><strong>Примечание:</strong> Если у вас возникли проблемы с подключением, убедитесь, что файл конфигурации не поврежден и содержит все необходимые данные. При необходимости обратитесь в поддержку.</p>
        </div>
      </div>
    </section>
  `,
  profile: `
    <div class="profile-container">
      <div class="profile-cover">
        <div class="profile-cover-grid"></div>
        <div class="new-year-decoration decoration-tree">🎄</div>
        <div class="new-year-decoration decoration-champagne">🍾</div>
        <div class="new-year-decoration decoration-snowflake">❄</div>
        <div class="new-year-decoration decoration-gift">🎁</div>
        <div class="new-year-decoration decoration-star">⭐</div>
      </div>
      <div class="profile-avatar-wrapper">
        <div class="profile-avatar">
          <span class="material-symbols-outlined">account_circle</span>
        </div>
      </div>
      <div class="profile-username">Incognito</div>
      
      <section class="card profile-settings-card">
        <div class="profile-settings-grid">
          <div class="profile-setting-item">
            <div class="setting-icon">
              <span class="setting-icon-skeleton"></span>
              <span class="material-symbols-outlined setting-icon-loaded">wallet</span>
            </div>
            <div class="setting-label-text">Баланс</div>
            <div class="setting-value">0 ₽</div>
          </div>
          
          <div class="profile-setting-item clickable" data-setting="language">
            <div class="setting-icon">
              <span class="setting-icon-skeleton"></span>
              <span class="material-symbols-outlined setting-icon-loaded">language</span>
            </div>
            <div class="setting-label-text">Язык</div>
            <div class="setting-value" id="languageValue">Русский</div>
          </div>
          
          <div class="profile-setting-item clickable" data-setting="currency">
            <div class="setting-icon">
              <span class="setting-icon-skeleton"></span>
              <span class="material-symbols-outlined setting-icon-loaded">attach_money</span>
            </div>
            <div class="setting-label-text">Валюта</div>
            <div class="setting-value" id="currencyValue">₽ (RUB)</div>
          </div>
          
          <div class="profile-setting-item clickable" data-setting="theme">
            <div class="setting-icon">
              <span class="setting-icon-skeleton"></span>
              <span class="material-symbols-outlined setting-icon-loaded">dark_mode</span>
            </div>
            <div class="setting-label-text">Тема</div>
            <div class="setting-value" id="themeValue">Темная</div>
          </div>
        </div>
      </section>
      
      <section class="card profile-history-card">
        <h3 class="history-title">История операций</h3>
        <div class="history-list">
          <div class="history-item">
            <div class="history-info">
              <div class="history-type">Пополнение</div>
              <div class="history-date">12.12.2024</div>
            </div>
            <div class="history-amount positive">+500 ₽</div>
          </div>
          
          <div class="history-divider"></div>
          
          <div class="history-item">
            <div class="history-info">
              <div class="history-type">Пополнение</div>
              <div class="history-date">05.12.2024</div>
            </div>
            <div class="history-amount positive">+1000 ₽</div>
          </div>
          
          <div class="history-divider"></div>
          
          <div class="history-item">
            <div class="history-info">
              <div class="history-type">Пополнение</div>
              <div class="history-date">28.11.2024</div>
            </div>
            <div class="history-amount positive">+799 ₽</div>
          </div>
        </div>
      </section>
    </div>
  `,
};

const swapView = (viewKey) => {
  content.classList.add("fade");
  window.requestAnimationFrame(() => {
    content.innerHTML = views[viewKey];
    content.classList.remove("fade");
    initDynamicView(viewKey);
  });
};

// initial render to keep markup in sync
swapView("home");
initDynamicView("home");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active")) return;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    swapView(button.dataset.view);
  });
});

// Topup modal
const topupModal = document.getElementById("topupModal");
const openTopupModal = document.getElementById("openTopupModal");
const closeTopupModal = document.getElementById("closeTopupModal");
const amountButtons = document.querySelectorAll(".amount-btn");
const amountInput = document.querySelector(".amount-input");
const modalPrimaryBtn = document.querySelector(".modal-primary-btn");

if (openTopupModal) {
  openTopupModal.addEventListener("click", () => {
    topupModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

if (closeTopupModal) {
  closeTopupModal.addEventListener("click", closeModal);
}

if (topupModal) {
  topupModal.addEventListener("click", (e) => {
    if (e.target === topupModal) {
      closeModal();
    }
  });
}

function closeModal() {
  topupModal.classList.remove("active");
  document.body.style.overflow = "";
}

amountButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    amountButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    amountInput.value = "";
  });
});

if (amountInput) {
  amountInput.addEventListener("input", () => {
    amountButtons.forEach((b) => b.classList.remove("selected"));
  });
}

// Payment method selection (using event delegation)
if (topupModal) {
  topupModal.addEventListener("click", (e) => {
    if (e.target.closest(".payment-method-btn")) {
      const btn = e.target.closest(".payment-method-btn");
      const paymentMethodButtons = topupModal.querySelectorAll(".payment-method-btn");
      paymentMethodButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    }
  });
  
  // Select first payment method by default when modal opens
  if (openTopupModal) {
    openTopupModal.addEventListener("click", () => {
      setTimeout(() => {
        const paymentMethodButtons = topupModal.querySelectorAll(".payment-method-btn");
        if (paymentMethodButtons.length > 0 && !topupModal.querySelector(".payment-method-btn.selected")) {
          paymentMethodButtons[0].classList.add("selected");
        }
      }, 100);
    });
  }
}

if (modalPrimaryBtn) {
  modalPrimaryBtn.addEventListener("click", () => {
    const selectedAmount = document.querySelector(".amount-btn.selected");
    const customAmount = amountInput.value;
    const amount = selectedAmount
      ? selectedAmount.dataset.amount
      : customAmount || "0";
    const selectedPaymentMethod = document.querySelector(".payment-method-btn.selected");
    const paymentMethod = selectedPaymentMethod
      ? selectedPaymentMethod.dataset.method
      : "telegram-stars";
    console.log("Пополнение на:", amount, "₽", "Способ оплаты:", paymentMethod);
    // Здесь будет логика пополнения
    closeModal();
  });
}

// Preloader logic
(function () {
  // Logo font loading
  const logo = document.querySelector(".app-header .logo");
  const logoSkeleton = document.querySelector(".logo-skeleton");

  if (logo && logoSkeleton) {
    // Check if font is loaded
    if (document.fonts && document.fonts.check) {
      const checkFont = () => {
        if (document.fonts.check('1em "Mr Dafoe"')) {
          logoSkeleton.classList.add("hidden");
          setTimeout(() => {
            logo.classList.add("loaded");
          }, 200);
        } else {
          setTimeout(checkFont, 100);
        }
      };
      checkFont();
    } else {
      // Fallback: wait for font to load
      setTimeout(() => {
        logoSkeleton.classList.add("hidden");
        setTimeout(() => {
          logo.classList.add("loaded");
        }, 200);
      }, 1500);
    }
  }

  // Icon loading
  const iconSkeletons = document.querySelectorAll(".icon-skeleton");
  const iconElements = document.querySelectorAll(".tab-button .icon.material-symbols-outlined");

  if (iconSkeletons.length && iconElements.length) {
    // Create a test element to check if font is actually loaded
    const testElement = document.createElement("span");
    testElement.className = "material-symbols-outlined";
    testElement.textContent = "home";
    testElement.style.position = "absolute";
    testElement.style.visibility = "hidden";
    testElement.style.fontSize = "24px";
    document.body.appendChild(testElement);

    const checkIcons = () => {
      // Check if Material Symbols font is actually loaded by measuring text width
      const testWidth = testElement.offsetWidth;
      const fallbackWidth = 24; // Approximate width with fallback font
      
      // Also check document.fonts API if available
      const fontsLoaded = document.fonts && document.fonts.check
        ? document.fonts.check('1em "Material Symbols Outlined"')
        : false;

      // Font is loaded if width is different from fallback OR fonts API confirms
      if (testWidth !== fallbackWidth || fontsLoaded) {
        // Double check by waiting a bit more to ensure font is fully rendered
        setTimeout(() => {
          iconSkeletons.forEach((skeleton) => {
            skeleton.classList.add("hidden");
          });
          iconElements.forEach((icon) => {
            icon.style.display = "inline-flex";
            icon.classList.add("loaded");
          });
          document.body.removeChild(testElement);
        }, 100);
      } else {
        setTimeout(checkIcons, 150);
      }
    };

    // Wait for fonts to be ready, then start checking
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(checkIcons, 100);
      });
    } else {
      // Fallback: start checking after a delay
      setTimeout(checkIcons, 300);
    }
  }
})();

function initDynamicView(viewKey) {
  if (viewKey === "plans") {
    initPlanBuilder();
  } else if (viewKey === "profile") {
    initProfileSettings();
  } else if (viewKey === "home") {
    checkAddIcon();
  }
}

function checkAddIcon() {
  const addIconSkeleton = document.querySelector(".add-icon-skeleton");
  const addIcon = document.querySelector(".add-icon-loaded");

  if (addIconSkeleton && addIcon) {
    // Create a test element to check if font is actually loaded
    const testElement = document.createElement("span");
    testElement.className = "material-symbols-outlined";
    testElement.textContent = "add";
    testElement.style.position = "absolute";
    testElement.style.visibility = "hidden";
    testElement.style.fontSize = "28px";
    document.body.appendChild(testElement);

    const checkIcon = () => {
      // Check if Material Symbols font is actually loaded by measuring text width
      const testWidth = testElement.offsetWidth;
      const fallbackWidth = 28; // Approximate width with fallback font
      
      // Also check document.fonts API if available
      const fontsLoaded = document.fonts && document.fonts.check
        ? document.fonts.check('1em "Material Symbols Outlined"')
        : false;

      // Font is loaded if width is different from fallback OR fonts API confirms
      if (testWidth !== fallbackWidth || fontsLoaded) {
        // Double check by waiting a bit more to ensure font is fully rendered
        setTimeout(() => {
          addIconSkeleton.classList.add("hidden");
          addIcon.style.display = "inline-flex";
          document.body.removeChild(testElement);
        }, 100);
      } else {
        setTimeout(checkIcon, 150);
      }
    };

    // Wait for fonts to be ready, then start checking
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(checkIcon, 100);
      });
    } else {
      // Fallback: start checking after a delay
      setTimeout(checkIcon, 300);
    }
  }
}

function initProfileSettings() {
  const settingItems = document.querySelectorAll(".profile-setting-item.clickable");
  
  settingItems.forEach((item) => {
    item.addEventListener("click", () => {
      const setting = item.dataset.setting;
      openSettingsModal(setting);
    });
  });
  
  // Загружаем сохраненные настройки для профиля
  loadSavedSettings();
  
  // Проверяем загрузку иконок профиля
  checkProfileIcons();
}

function checkProfileIcons() {
  const profileIconSkeletons = document.querySelectorAll(".setting-icon-skeleton");
  const profileIcons = document.querySelectorAll(".setting-icon-loaded");

  if (profileIconSkeletons.length && profileIcons.length) {
    // Create a test element to check if font is actually loaded
    const testElement = document.createElement("span");
    testElement.className = "material-symbols-outlined";
    testElement.textContent = "wallet";
    testElement.style.position = "absolute";
    testElement.style.visibility = "hidden";
    testElement.style.fontSize = "22px";
    document.body.appendChild(testElement);

    const checkIcons = () => {
      // Check if Material Symbols font is actually loaded by measuring text width
      const testWidth = testElement.offsetWidth;
      const fallbackWidth = 22; // Approximate width with fallback font
      
      // Also check document.fonts API if available
      const fontsLoaded = document.fonts && document.fonts.check
        ? document.fonts.check('1em "Material Symbols Outlined"')
        : false;

      // Font is loaded if width is different from fallback OR fonts API confirms
      if (testWidth !== fallbackWidth || fontsLoaded) {
        // Double check by waiting a bit more to ensure font is fully rendered
        setTimeout(() => {
          profileIconSkeletons.forEach((skeleton) => {
            skeleton.classList.add("hidden");
          });
          profileIcons.forEach((icon) => {
            icon.style.display = "inline-flex";
          });
          document.body.removeChild(testElement);
        }, 100);
      } else {
        setTimeout(checkIcons, 150);
      }
    };

    // Wait for fonts to be ready, then start checking
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(checkIcons, 100);
      });
    } else {
      // Fallback: start checking after a delay
      setTimeout(checkIcons, 300);
    }
  }
}

const settingsData = {
  language: {
    title: "Выберите язык",
    options: [
      { value: "Русский", label: "Русский" },
      { value: "English", label: "English" },
      { value: "中文", label: "中文" },
      { value: "Español", label: "Español" },
    ],
    currentValue: "Русский",
    valueElementId: "languageValue"
  },
  currency: {
    title: "Выберите валюту",
    options: [
      { value: "₽ (RUB)", label: "₽ (RUB)" },
      { value: "$ (USD)", label: "$ (USD)" },
      { value: "€ (EUR)", label: "€ (EUR)" },
      { value: "¥ (CNY)", label: "¥ (CNY)" },
    ],
    currentValue: "₽ (RUB)",
    valueElementId: "currencyValue"
  },
  theme: {
    title: "Выберите тему",
    options: [
      { value: "Темная", label: "Темная" },
      { value: "Светлая", label: "Светлая" },
      { value: "Авто", label: "Авто" },
    ],
    currentValue: "Темная",
    valueElementId: "themeValue"
  }
};

function openSettingsModal(settingType) {
  const modal = document.getElementById("settingsModal");
  const modalTitle = document.getElementById("settingsModalTitle");
  const optionsContainer = document.getElementById("settingsOptions");
  const setting = settingsData[settingType];
  
  if (!setting) return;
  
  modalTitle.textContent = setting.title;
  optionsContainer.innerHTML = "";
  
  setting.options.forEach((option) => {
    const optionElement = document.createElement("button");
    optionElement.className = "settings-option";
    if (option.value === setting.currentValue) {
      optionElement.classList.add("selected");
    }
    optionElement.textContent = option.label;
    
    // Добавляем иконку check для выбранной опции
    if (option.value === setting.currentValue) {
      const checkIcon = document.createElement("span");
      checkIcon.className = "material-symbols-outlined settings-check-icon";
      checkIcon.textContent = "check";
      optionElement.appendChild(checkIcon);
    }
    
    optionElement.addEventListener("click", () => {
      selectSetting(settingType, option.value);
      closeSettingsModal();
    });
    optionsContainer.appendChild(optionElement);
  });
  
  modal.classList.add("active");
}

function selectSetting(settingType, value) {
  const setting = settingsData[settingType];
  if (!setting) return;
  
  setting.currentValue = value;
  const valueElement = document.getElementById(setting.valueElementId);
  if (valueElement) {
    valueElement.textContent = value;
  }
  
  // Применяем изменения
  if (settingType === "theme") {
    applyTheme(value);
  } else if (settingType === "currency") {
    applyCurrency(value);
  } else if (settingType === "language") {
    applyLanguage(value);
  }
  
  // Сохраняем в localStorage
  localStorage.setItem(`setting_${settingType}`, value);
  console.log(`${settingType} изменен на: ${value}`);
}

function applyTheme(theme) {
  const root = document.documentElement;
  const body = document.body;
  
  // Удаляем предыдущие классы темы
  body.classList.remove("theme-light", "theme-dark", "theme-auto");
  
  if (theme === "Светлая") {
    body.classList.add("theme-light");
    root.style.colorScheme = "light";
  } else if (theme === "Темная") {
    body.classList.add("theme-dark");
    root.style.colorScheme = "dark";
  } else if (theme === "Авто") {
    body.classList.add("theme-auto");
    // Используем системную тему
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.style.colorScheme = prefersDark ? "dark" : "light";
  }
}

function applyCurrency(currency) {
  // Обновляем все цены на странице
  const currencySymbol = currency.split(" ")[0];
  
  // Обновляем историю операций
  const historyAmounts = document.querySelectorAll(".history-amount");
  historyAmounts.forEach((el) => {
    const text = el.textContent;
    // Ищем число (может быть с пробелами для разделения тысяч)
    const amountMatch = text.match(/([+-]?)(\d+[\s\d]*)/);
    if (amountMatch) {
      const sign = amountMatch[1] || "";
      const amount = amountMatch[2].replace(/\s/g, "");
      const formattedAmount = parseInt(amount).toLocaleString("ru-RU");
      el.textContent = `${sign}${formattedAmount} ${currencySymbol}`;
    }
  });
  
  // Обновляем цену в кнопке "Подключить" если она есть
  const submitBtn = document.querySelector(".plan-submit");
  if (submitBtn) {
    const currentText = submitBtn.textContent;
    // Ищем число в тексте кнопки
    const priceMatch = currentText.match(/(\d+[\s\d]*)/);
    if (priceMatch) {
      const price = priceMatch[1].replace(/\s/g, "");
      const formattedPrice = parseInt(price).toLocaleString("ru-RU");
      submitBtn.textContent = `Подключить • ${formattedPrice} ${currencySymbol}`;
    }
  }
  
  // Обновляем цену в билдере тарифов если он открыт
  const builder = document.querySelector(".plan-builder");
  if (builder) {
    // Переинициализируем билдер для обновления цены
    setTimeout(() => {
      initPlanBuilder();
    }, 100);
  }
}

function applyLanguage(language) {
  // Здесь можно добавить логику смены языка
  // Для демо просто сохраняем выбор
  console.log(`Язык изменен на: ${language}`);
  // В реальном приложении здесь была бы загрузка переводов
}

// Загружаем сохраненные настройки при загрузке
function loadSavedSettings() {
  Object.keys(settingsData).forEach((key) => {
    const saved = localStorage.getItem(`setting_${key}`);
    if (saved) {
      const setting = settingsData[key];
      setting.currentValue = saved;
      const valueElement = document.getElementById(setting.valueElementId);
      if (valueElement) {
        valueElement.textContent = saved;
      }
      // Применяем настройки
      if (key === "theme") {
        applyTheme(saved);
      } else if (key === "currency") {
        applyCurrency(saved);
      }
    } else {
      // Применяем настройки по умолчанию при первой загрузке
      if (key === "theme") {
        applyTheme(settingsData[key].currentValue);
      }
    }
  });
}

// Загружаем настройки при загрузке страницы
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", loadSavedSettings);
} else {
  loadSavedSettings();
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  modal.classList.remove("active");
}

// Инициализация модального окна настроек
(function() {
  const settingsModal = document.getElementById("settingsModal");
  const closeBtn = document.getElementById("closeSettingsModal");
  
  if (settingsModal && closeBtn) {
    closeBtn.addEventListener("click", closeSettingsModal);
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }
})();

function initPlanBuilder() {
  const builder = document.querySelector(".plan-builder");
  if (!builder) return;

  const PLAN_RATE = 50;
  let selectedDevices = 1;
  let selectedMonths = 1;
  let customSelected = false;

  const segmentedGroups = builder.querySelectorAll(".segmented [data-value]");
  const customInputWrap = builder.querySelector(".devices-custom");
  const customInput = builder.querySelector(".devices-custom input");
  const priceButton = builder.querySelector(".plan-submit");

  const setActive = (btn) => {
    const group = btn.closest(".segmented");
    group.querySelectorAll("[data-value]").forEach((el) => el.classList.remove("active"));
    btn.classList.add("active");
  };

  const updatePrice = () => {
    let devices = customSelected ? parseInt(customInput.value, 10) || 1 : selectedDevices;
    if (devices < 1) devices = 1;
    const price = devices * selectedMonths * PLAN_RATE;
    if (priceButton) {
      // Получаем текущую валюту из localStorage или используем по умолчанию
      const savedCurrency = localStorage.getItem("setting_currency");
      const currentCurrency = savedCurrency || settingsData.currency?.currentValue || "₽ (RUB)";
      const currencySymbol = currentCurrency.split(" ")[0];
      priceButton.textContent = `Подключить • ${price.toLocaleString("ru-RU")} ${currencySymbol}`;
    }
  };

  segmentedGroups.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;
      setActive(btn);

      if (type === "devices") {
        if (value === "custom") {
          customSelected = true;
          customInputWrap?.classList.remove("hidden");
          customInput?.focus();
        } else {
          customSelected = false;
          customInputWrap?.classList.add("hidden");
          selectedDevices = parseInt(value, 10);
        }
      }

      if (type === "months") {
        selectedMonths = parseInt(value, 10);
      }

      updatePrice();
    });
  });

  if (customInput) {
    customInput.addEventListener("input", () => {
      customSelected = true;
      updatePrice();
    });
  }

  updatePrice();
}

