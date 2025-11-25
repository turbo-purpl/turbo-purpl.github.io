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
              <span class="material-symbols-outlined">add</span>
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
        <div class="segmented segmented-disabled">
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
    <section class="card">
      <h2>Инструкция</h2>
      <p class="subtitle">Быстрый старт подключения MetalVPN.</p>
      <ol class="guide-list">
        <li>Скачайте приложение для нужной платформы.</li>
        <li>Авторизуйтесь по Telegram или email.</li>
        <li>Выберите сервер и нажмите «Подключить».</li>
      </ol>
      <div class="action-buttons">
        <button class="action">Полная инструкция</button>
        <button class="action">Чат с поддержкой</button>
      </div>
    </section>
  `,
  profile: `
    <section class="card">
      <h2>Профиль</h2>
      <p class="subtitle">Управление аккаунтом и настройками.</p>
      <div class="action-buttons">
        <button class="action">Редактировать профиль</button>
        <button class="action">Настройки безопасности</button>
        <button class="action">Выйти</button>
      </div>
    </section>
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

if (modalPrimaryBtn) {
  modalPrimaryBtn.addEventListener("click", () => {
    const selectedAmount = document.querySelector(".amount-btn.selected");
    const customAmount = amountInput.value;
    const amount = selectedAmount
      ? selectedAmount.dataset.amount
      : customAmount || "0";
    console.log("Пополнение на:", amount, "₽");
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
    // Check if Material Symbols font is loaded
    const checkIcons = () => {
      let allLoaded = true;
      iconElements.forEach((icon) => {
        const computedStyle = window.getComputedStyle(icon);
        const fontFamily = computedStyle.fontFamily;
        if (!fontFamily.includes("Material Symbols")) {
          allLoaded = false;
        }
      });

      if (allLoaded || document.fonts.check('1em "Material Symbols Outlined"')) {
        iconSkeletons.forEach((skeleton) => {
          skeleton.classList.add("hidden");
        });
        iconElements.forEach((icon) => {
          icon.style.display = "inline-flex";
          icon.classList.add("loaded");
        });
      } else {
        setTimeout(checkIcons, 100);
      }
    };

    // Start checking after a short delay
    setTimeout(checkIcons, 200);
  }
})();

function initDynamicView(viewKey) {
  if (viewKey === "plans") {
    initPlanBuilder();
  }
}

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
      priceButton.textContent = `Подключить • ${price.toLocaleString("ru-RU")} ₽`;
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

