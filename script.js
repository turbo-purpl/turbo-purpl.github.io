const tabButtons = document.querySelectorAll(".tab-button");
const content = document.querySelector("#content");

const views = {
  home: `
    <section class="card subscription">
      <header>
        <h2>Metal Pro</h2>
        <span class="tag">Активна</span>
      </header>
      <p class="subtitle">До окончания подписки осталось</p>
      <p class="time-left">12 дней 6 часов</p>
      <div class="progress">
        <div class="progress-value" style="width: 72%"></div>
      </div>
      <div class="meta">
        <div>
          <p class="label">Дата окончания</p>
          <p>06.12.2025</p>
        </div>
        <div>
          <p class="label">Следующее списание</p>
          <p>799 ₽</p>
        </div>
      </div>
    </section>
    <section class="card grid">
      <article class="widget">
        <p class="label">Активных устройств</p>
        <p class="value">4 из 6</p>
        <button class="text-link">Управлять</button>
      </article>
      <article class="widget">
        <p class="label">Скорость</p>
        <p class="value">480 Мбит/с</p>
        <p class="muted">Москва · WireGuard</p>
      </article>
      <article class="widget">
        <p class="label">IP-адрес</p>
        <p class="value">91.142.89.122</p>
        <p class="muted">Германия</p>
      </article>
      <article class="widget">
        <p class="label">Безопасность</p>
        <p class="value good">100%</p>
        <p class="muted">Шифрование активно</p>
      </article>
    </section>
    <section class="card actions">
      <h3>Быстрые действия</h3>
      <div class="action-buttons">
        <button class="action">
          <span>Продлить тариф</span>
        </button>
        <button class="action">
          <span>Подключить устройство</span>
        </button>
        <button class="action">
          <span>Получить поддержку</span>
        </button>
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
      <h2>Руководство</h2>
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

