const tabButtons = document.querySelectorAll(".tab-button");
const content = document.querySelector("#content");

const views = {
  home: `
    <section class="card subscription-card">
      <div>
        <p class="eyebrow">Подписка активна</p>
        <h2>Metal Pro</h2>
      </div>
      <div class="time-remaining">
        <span>Осталось</span>
        <strong>12 дней · 6 часов</strong>
      </div>
      <div class="pulse-bar">
        <span></span>
      </div>
      <div class="subscription-meta">
        <div>
          <p class="label">Дата окончания</p>
          <p>12.12.2025</p>
        </div>
        <div style="text-align: right">
          <p class="label">Следующее списание</p>
          <p>799 ₽</p>
        </div>
      </div>
    </section>
    <section class="card speed-card">
      <header>Скорость</header>
      <div class="speed-graph">
        <svg viewBox="0 0 400 140" preserveAspectRatio="none">
          <defs>
            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3e88f7" />
              <stop offset="100%" stop-color="#5fa1ff" />
            </linearGradient>
          </defs>
          <path
            class="speed-path"
            d="M0,90 C40,70 80,110 120,80 C160,50 200,60 240,90 C280,120 320,70 360,80"
          />
        </svg>
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
    </section>
    <section class="card devices-card">
      <div>
        <p class="label">Устройств в подписке</p>
        <p class="count">4 из 6</p>
      </div>
      <button class="primary-btn">Добавить устройство</button>
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
};

const swapView = (viewKey) => {
  content.classList.add("fade");
  window.requestAnimationFrame(() => {
    content.innerHTML = views[viewKey];
    content.classList.remove("fade");
  });
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active")) return;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    swapView(button.dataset.view);
  });
});

