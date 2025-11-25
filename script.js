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
    <section class="card">
      <h2>Тарифы MetalVPN</h2>
      <p class="subtitle">Выберите подходящий тариф и получите максимум скорости.</p>
      <div class="grid">
        <article class="widget">
          <p class="label">Lite</p>
          <p class="value">399 ₽·мес</p>
          <p class="muted">1 устройство · 100 Мбит/с</p>
        </article>
        <article class="widget">
          <p class="label">Pro</p>
          <p class="value">799 ₽·мес</p>
          <p class="muted">5 устройств · 500 Мбит/с</p>
        </article>
        <article class="widget">
          <p class="label">Infinite</p>
          <p class="value">1 199 ₽·мес</p>
          <p class="muted">∞ устройств · 1 Гбит/с</p>
        </article>
      </div>
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
  });
};

// initial render to keep markup in sync
swapView("home");

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

