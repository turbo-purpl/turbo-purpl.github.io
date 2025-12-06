// Constants
const DELAYS = {
  VIEW_TRANSITION: 600,
  MODAL_INIT: 100,
  FONT_FALLBACK: 1500,
  FONT_CHECK: 200,
  ICON_CHECK: 100,
  ICON_FALLBACK: 300
};

const SELECTORS = {
  CONTENT: "#content",
  TOPUP_MODAL: "#topupModal",
  SETTINGS_MODAL: "#settingsModal",
  OPEN_TOPUP: "#openTopupModal",
  CLOSE_TOPUP: "#closeTopupModal",
  CLOSE_SETTINGS: "#closeSettingsModal"
};

// Content element
const content = document.querySelector(SELECTORS.CONTENT);

// Skeleton views for loading states
const skeletonViews = {
  home: `
    <section class="skeleton-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
        <div style="flex: 1;">
          <div class="skeleton-line short skeleton" style="margin-bottom: 8px;"></div>
          <div class="skeleton-line long skeleton" style="height: 32px;"></div>
        </div>
        <div class="skeleton-line skeleton" style="width: 80px; height: 28px; border-radius: 8px; flex-shrink: 0;"></div>
      </div>
      <div class="skeleton-line long skeleton" style="margin-top: 16px; height: 10px; border-radius: 999px;"></div>
      <div style="display: flex; gap: 16px; margin-top: 16px;">
        <div style="flex: 1;">
          <div class="skeleton-line short skeleton" style="margin-bottom: 8px;"></div>
          <div class="skeleton-line medium skeleton"></div>
        </div>
        <div style="flex: 1; text-align: right;">
          <div class="skeleton-line short skeleton" style="margin-bottom: 8px; margin-left: auto;"></div>
          <div class="skeleton-line medium skeleton" style="margin-left: auto;"></div>
        </div>
      </div>
    </section>
  `,
  plans: `
    <section class="plan-builder">
      <div class="plan-field">
        <div class="skeleton-line short skeleton" style="width: 30%; height: 14px; margin-bottom: 14px;"></div>
        <div class="skeleton-line long skeleton" style="height: 44px; border-radius: 12px;"></div>
      </div>
      <div class="plan-field">
        <div class="skeleton-line short skeleton" style="width: 40%; height: 14px; margin-bottom: 14px;"></div>
        <div class="skeleton-line long skeleton" style="height: 44px; border-radius: 12px;"></div>
      </div>
      <div class="plan-field">
        <div class="skeleton-line short skeleton" style="width: 25%; height: 14px; margin-bottom: 14px;"></div>
        <div class="skeleton-line long skeleton" style="height: 44px; border-radius: 12px;"></div>
      </div>
      <button class="plan-submit skeleton-button skeleton" style="margin-top: 24px; height: 48px; border-radius: 14px; width: 100%;"></button>
    </section>
  `,
  guide: `
    <section class="guide-section">
      <div class="guide-header">
        <div class="skeleton-line short skeleton" style="width: 50%; height: 32px; margin-bottom: 12px;"></div>
        <div class="skeleton-line medium skeleton" style="height: 20px;"></div>
      </div>
      <div class="guide-platform-tabs">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px;">
          <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
          <div class="skeleton-line short skeleton" style="height: 14px; width: 60px;"></div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px;">
          <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
          <div class="skeleton-line short skeleton" style="height: 14px; width: 60px;"></div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px;">
          <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
          <div class="skeleton-line short skeleton" style="height: 14px; width: 60px;"></div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px;">
          <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
          <div class="skeleton-line short skeleton" style="height: 14px; width: 60px;"></div>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
        <div style="flex: 1;">
          <div class="skeleton-line short skeleton" style="height: 22px; margin-bottom: 12px; width: 60%;"></div>
          <div class="skeleton-line long skeleton" style="height: 18px; margin-bottom: 4px;"></div>
          <div class="skeleton-line medium skeleton" style="height: 18px;"></div>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
        <div style="flex: 1;">
          <div class="skeleton-line short skeleton" style="height: 22px; margin-bottom: 12px; width: 70%;"></div>
          <div class="skeleton-line long skeleton" style="height: 18px; margin-bottom: 4px;"></div>
          <div class="skeleton-line medium skeleton" style="height: 18px;"></div>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
        <div style="flex: 1;">
          <div class="skeleton-line short skeleton" style="height: 22px; margin-bottom: 12px; width: 50%;"></div>
          <div class="skeleton-line medium skeleton" style="height: 18px; margin-bottom: 6px;"></div>
          <div class="skeleton-line medium skeleton" style="height: 18px; margin-bottom: 6px;"></div>
          <div class="skeleton-line medium skeleton" style="height: 18px; margin-bottom: 6px;"></div>
          <div class="skeleton-line short skeleton" style="height: 18px; width: 70%;"></div>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
        <div style="flex: 1;">
          <div class="skeleton-line short skeleton" style="height: 22px; margin-bottom: 12px; width: 40%;"></div>
          <div class="skeleton-line long skeleton" style="height: 18px;"></div>
        </div>
      </div>
    </section>
  `,
  profile: `
    <section class="guide-section">
      <div class="profile-header-card">
        <div class="skeleton-circle skeleton" style="width: 72px; height: 72px; border-radius: 50%;"></div>
        <div style="flex: 1;">
          <div class="skeleton-line short skeleton" style="height: 32px; margin-bottom: 12px; width: 40%;"></div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="skeleton-circle skeleton" style="width: 20px; height: 20px;"></div>
            <div class="skeleton-line short skeleton" style="height: 22px; width: 80px;"></div>
          </div>
          </div>
          </div>
      <div class="profile-settings-list">
        <div class="profile-setting-item">
          <div class="skeleton-line skeleton" style="width: 44px; height: 44px; border-radius: 12px;"></div>
          <div style="flex: 1;">
            <div class="skeleton-line short skeleton" style="height: 12px; width: 50px; margin-bottom: 6px;"></div>
            <div class="skeleton-line medium skeleton" style="height: 18px; width: 70%;"></div>
        </div>
          <div class="skeleton-line short skeleton" style="width: 20px; height: 20px;"></div>
    </div>
        <div class="profile-setting-item">
          <div class="skeleton-line skeleton" style="width: 44px; height: 44px; border-radius: 12px;"></div>
          <div style="flex: 1;">
            <div class="skeleton-line short skeleton" style="height: 12px; width: 60px; margin-bottom: 6px;"></div>
            <div class="skeleton-line medium skeleton" style="height: 18px; width: 80px;"></div>
          </div>
          <div class="skeleton-line short skeleton" style="width: 20px; height: 20px;"></div>
        </div>
      </div>
      <div class="profile-history-section">
        <div class="skeleton-line short skeleton" style="width: 45%; height: 32px; margin-bottom: 24px;"></div>
        <div class="history-item">
          <div class="skeleton-line skeleton" style="width: 44px; height: 44px; border-radius: 12px;"></div>
          <div style="flex: 1;">
            <div class="skeleton-line short skeleton" style="height: 18px; margin-bottom: 6px; width: 50%;"></div>
            <div class="skeleton-line short skeleton" style="height: 14px; width: 40%;"></div>
          </div>
          <div class="skeleton-line short skeleton" style="height: 23px; width: 90px;"></div>
        </div>
        <div class="history-item">
          <div class="skeleton-line skeleton" style="width: 44px; height: 44px; border-radius: 12px;"></div>
          <div style="flex: 1;">
            <div class="skeleton-line short skeleton" style="height: 18px; margin-bottom: 6px; width: 50%;"></div>
            <div class="skeleton-line short skeleton" style="height: 14px; width: 40%;"></div>
          </div>
          <div class="skeleton-line short skeleton" style="height: 23px; width: 100px;"></div>
        </div>
        <div class="history-item">
          <div class="skeleton-line skeleton" style="width: 44px; height: 44px; border-radius: 12px;"></div>
          <div style="flex: 1;">
            <div class="skeleton-line short skeleton" style="height: 18px; margin-bottom: 6px; width: 50%;"></div>
            <div class="skeleton-line short skeleton" style="height: 14px; width: 40%;"></div>
          </div>
          <div class="skeleton-line short skeleton" style="height: 23px; width: 85px;"></div>
        </div>
      </div>
    </section>
  `
};

// Generate skeleton dynamically from HTML structure
function generateSkeletonFromHTML(htmlString) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  
  function processElement(element) {
    const tagName = element.tagName?.toLowerCase();
    if (!tagName) return '';
    
    // Skip script, style, and other non-visual elements
    if (['script', 'style', 'noscript'].includes(tagName)) {
      return '';
    }
    
    // Get element classes
    const classes = element.className ? element.className.toString().split(' ').filter(c => c).join(' ') : '';
    const classAttr = classes ? ` class="${classes}"` : '';
    
    // Handle specific structures
    if (classes.includes('plan-field')) {
      let result = `<div class="plan-field">`;
      const label = element.querySelector('.label');
      if (label) {
        const labelText = label.textContent?.trim() || '';
        const labelWidth = labelText.length < 15 ? '30%' : labelText.length < 25 ? '40%' : '50%';
        result += `<div class="skeleton-line short skeleton" style="width: ${labelWidth}; height: 14px; margin-bottom: 14px;"></div>`;
      }
      const segmented = element.querySelector('.segmented');
      if (segmented) {
        result += `<div class="skeleton-line long skeleton" style="height: 44px; border-radius: 12px;"></div>`;
      }
      const input = element.querySelector('input');
      if (input && !element.querySelector('.segmented')) {
        result += `<div class="skeleton-line long skeleton" style="height: 44px; border-radius: 12px;"></div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('plan-builder')) {
      let result = `<section class="plan-builder">`;
      const fields = element.querySelectorAll('.plan-field');
      fields.forEach(field => {
        result += processElement(field);
      });
      const submitBtn = element.querySelector('.plan-submit, button[class*="submit"]');
      if (submitBtn) {
        result += `<button class="plan-submit skeleton-button skeleton" style="margin-top: 24px; height: 48px; border-radius: 14px;"></button>`;
      }
      result += `</section>`;
      return result;
    }
    
    if (tagName === 'button' && (classes.includes('plan-submit') || classes.includes('submit'))) {
      return `<button class="plan-submit skeleton-button skeleton" style="height: 48px; border-radius: 14px;"></button>`;
    }
    
    if (tagName === 'button' || (tagName === 'a' && !classes.includes('guide-link'))) {
      return `<div class="skeleton-button skeleton"></div>`;
    }
    
    if (tagName === 'input') {
      const inputType = element.type || 'text';
      if (inputType === 'number') {
        return `<div class="skeleton-line medium skeleton" style="height: 44px; border-radius: 12px;"></div>`;
      }
      return `<div class="skeleton-line long skeleton" style="height: 44px; border-radius: 12px;"></div>`;
    }
    
    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
      return `<div class="skeleton-title skeleton"></div>`;
    }
    
    if (tagName === 'p' && classes.includes('label')) {
      const text = element.textContent?.trim() || '';
      const width = text.length < 15 ? '30%' : text.length < 25 ? '40%' : '50%';
      return `<div class="skeleton-line short skeleton" style="width: ${width}; height: 14px;"></div>`;
    }
    
    if (classes.includes('segmented')) {
      return `<div class="skeleton-line long skeleton" style="height: 44px; border-radius: 12px;"></div>`;
    }
    
    if (classes.includes('profile-field')) {
      let result = `<div class="profile-field">`;
      const label = element.querySelector('.label');
      if (label) {
        const labelText = label.textContent?.trim() || '';
        const labelWidth = labelText.length < 15 ? '30%' : labelText.length < 25 ? '40%' : '50%';
        result += `<div class="skeleton-line short skeleton" style="width: ${labelWidth}; height: 14px; margin-bottom: 14px;"></div>`;
      }
      const button = element.querySelector('button');
      if (button) {
        result += `<div class="skeleton-line long skeleton" style="height: 24px; border-radius: 0;"></div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('profile-header')) {
      let result = `<div class="profile-header">`;
      const avatar = element.querySelector('.profile-avatar');
      if (avatar) {
        result += `<div class="skeleton-circle skeleton" style="width: 80px; height: 80px;"></div>`;
      }
      const info = element.querySelector('.profile-info');
      if (info) {
        result += `<div style="flex: 1;">
          <div class="skeleton-line medium skeleton" style="height: 28px; margin-bottom: 12px;"></div>
          <div class="skeleton-line short skeleton" style="height: 20px; width: 140px;"></div>
        </div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('profile-header-card')) {
      let result = `<div class="profile-header-card">`;
      const avatar = element.querySelector('.profile-avatar');
      if (avatar) {
        result += `<div class="skeleton-circle skeleton" style="width: 72px; height: 72px; border-radius: 50%;"></div>`;
      }
      const info = element.querySelector('.profile-info');
      if (info) {
        const h2 = info.querySelector('h2');
        const balance = info.querySelector('.profile-balance');
        result += `<div style="flex: 1;">`;
        if (h2) {
          const nameText = h2.textContent?.trim() || '';
          const nameWidth = nameText.length < 8 ? '40%' : nameText.length < 12 ? '50%' : '60%';
          result += `<div class="skeleton-line short skeleton" style="height: 32px; margin-bottom: 12px; width: ${nameWidth};"></div>`;
        }
        if (balance) {
          result += `<div style="display: flex; align-items: center; gap: 8px;">
            <div class="skeleton-circle skeleton" style="width: 20px; height: 20px;"></div>
            <div class="skeleton-line short skeleton" style="height: 22px; width: 80px;"></div>
          </div>`;
        }
        result += `</div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('profile-settings-list')) {
      let result = `<div class="profile-settings-list">`;
      const items = element.querySelectorAll('.profile-setting-item');
      items.forEach((item) => {
        result += processElement(item);
      });
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('profile-setting-item')) {
      let result = `<div class="profile-setting-item">`;
      const icon = element.querySelector('.setting-icon');
      if (icon) {
        result += `<div class="skeleton-line skeleton" style="width: 44px; height: 44px; border-radius: 12px;"></div>`;
      }
      const content = element.querySelector('.setting-content');
      if (content) {
        const label = content.querySelector('.setting-label');
        const value = content.querySelector('.setting-value');
        const labelText = label?.textContent?.trim() || '';
        const valueText = value?.textContent?.trim() || '';
        result += `<div style="flex: 1;">`;
        if (label) {
          const labelWidth = labelText.length < 8 ? '50px' : labelText.length < 12 ? '60px' : '70px';
          result += `<div class="skeleton-line short skeleton" style="height: 12px; width: ${labelWidth}; margin-bottom: 6px;"></div>`;
        }
        if (value) {
          const valueWidth = valueText.length < 10 ? '70%' : valueText.length < 15 ? '80px' : '100px';
          result += `<div class="skeleton-line medium skeleton" style="height: 18px; width: ${valueWidth};"></div>`;
        }
        result += `</div>`;
      }
      result += `<div class="skeleton-line short skeleton" style="width: 20px; height: 20px;"></div>`;
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('profile-history-section')) {
      let result = `<div class="profile-history-section">`;
      const title = element.querySelector('.section-title, h2');
      if (title) {
        result += `<div class="skeleton-line short skeleton" style="width: 45%; height: 32px; margin-bottom: 24px;"></div>`;
      }
      const items = element.querySelectorAll('.history-item');
      items.forEach((item) => {
        result += processElement(item);
      });
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('history-item')) {
      let result = `<div class="history-item">`;
      const icon = element.querySelector('.history-icon');
      if (icon) {
        result += `<div class="skeleton-line skeleton" style="width: 44px; height: 44px; border-radius: 12px;"></div>`;
      }
      const content = element.querySelector('.history-content');
      if (content) {
        const type = content.querySelector('.history-type');
        const date = content.querySelector('.history-date');
        result += `<div style="flex: 1;">`;
        if (type) {
          const typeText = type.textContent?.trim() || '';
          const typeWidth = typeText.length < 10 ? '50%' : typeText.length < 15 ? '60%' : '70%';
          result += `<div class="skeleton-line short skeleton" style="height: 18px; margin-bottom: 6px; width: ${typeWidth};"></div>`;
        }
        if (date) {
          result += `<div class="skeleton-line short skeleton" style="height: 14px; width: 40%;"></div>`;
        }
        result += `</div>`;
      }
      const amount = element.querySelector('.history-amount');
      if (amount) {
        const amountText = amount.textContent?.trim() || '';
        const amountWidth = amountText.length < 8 ? '90px' : amountText.length < 12 ? '100px' : '110px';
        result += `<div class="skeleton-line short skeleton" style="height: 23px; width: ${amountWidth};"></div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('guide-header')) {
      let result = `<div class="guide-header">`;
      const h2 = element.querySelector('h2');
      if (h2) {
        result += `<div class="skeleton-line short skeleton" style="width: 50%; height: 32px; margin-bottom: 12px;"></div>`;
      }
      const subtitle = element.querySelector('.guide-subtitle, p');
      if (subtitle) {
        result += `<div class="skeleton-line medium skeleton" style="height: 20px;"></div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('guide-platform-tabs')) {
      let result = `<div class="guide-platform-tabs">`;
      const tabs = element.querySelectorAll('.platform-tab, button');
      const tabCount = tabs.length || 4;
      for (let i = 0; i < tabCount; i++) {
        result += `<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px;">
          <div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>
          <div class="skeleton-line short skeleton" style="height: 14px; width: 60px;"></div>
        </div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('guide-step-card')) {
      let result = `<div class="guide-step-card">`;
      const stepNumber = element.querySelector('.step-number');
      if (stepNumber) {
        result += `<div class="skeleton-circle skeleton" style="width: 28px; height: 28px;"></div>`;
      }
      const stepContent = element.querySelector('.step-content');
      if (stepContent) {
        result += `<div style="flex: 1;">`;
        const h3 = stepContent.querySelector('h3');
        if (h3) {
          result += `<div class="skeleton-line short skeleton" style="height: 22px; margin-bottom: 12px; width: 60%;"></div>`;
        }
        const p = stepContent.querySelector('p');
        if (p) {
          result += `<div class="skeleton-line long skeleton" style="height: 18px; margin-bottom: 4px;"></div>`;
          result += `<div class="skeleton-line medium skeleton" style="height: 18px;"></div>`;
        }
        const ol = stepContent.querySelector('ol, ul');
        if (ol) {
          const items = ol.querySelectorAll('li');
          items.forEach(() => {
            result += `<div class="skeleton-line medium skeleton" style="height: 18px; margin-bottom: 6px;"></div>`;
          });
        }
        result += `</div>`;
      }
      result += `</div>`;
      return result;
    }
    
    if (classes.includes('guide-content')) {
      let childrenHTML = '';
      Array.from(element.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          childrenHTML += processElement(child);
        }
      });
      return `<div class="guide-content">${childrenHTML}</div>`;
    }
    
    if (classes.includes('guide-section')) {
      let childrenHTML = '';
      Array.from(element.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          childrenHTML += processElement(child);
        }
      });
      return `<${tagName}${classAttr}>${childrenHTML}</${tagName}>`;
    }
    
    // Process children for container elements (but not already processed ones)
    if (tagName === 'section' && !classes.includes('guide-section')) {
      let childrenHTML = '';
      Array.from(element.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          childrenHTML += processElement(child);
        }
      });
      return `<${tagName}${classAttr}>${childrenHTML}</${tagName}>`;
    }
    
    // For div elements that haven't been processed yet, process children
    if (tagName === 'div' && !classes.includes('profile-settings-list') && !classes.includes('profile-history-section') && !classes.includes('profile-header-card') && !classes.includes('profile-setting-item') && !classes.includes('history-item') && !classes.includes('guide-header') && !classes.includes('guide-platform-tabs') && !classes.includes('guide-step-card') && !classes.includes('guide-content')) {
      let childrenHTML = '';
      Array.from(element.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          childrenHTML += processElement(child);
        }
      });
      return childrenHTML || '';
    }
    
    // For other unprocessed elements, process children
    let childrenHTML = '';
    Array.from(element.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        childrenHTML += processElement(child);
      }
    });
    
    return childrenHTML || '';
  }
  
  const result = processElement(tempDiv);
  return result || '';
}

// Show skeleton loading
function showSkeleton(viewKey) {
  if (!content) return;
  
  // Try to generate skeleton dynamically from actual view structure
  if (views[viewKey]) {
    const dynamicSkeleton = generateSkeletonFromHTML(views[viewKey]);
    if (dynamicSkeleton && dynamicSkeleton.trim().length > 0) {
      content.innerHTML = dynamicSkeleton;
      return;
    }
  }
  
  // Fallback to predefined skeletons
  const skeleton = skeletonViews[viewKey] || skeletonViews.home;
  content.innerHTML = skeleton;
}

// Views
const views = {
  home: `
    <section class="card main-card">
      <div class="main-card-top">
        <div class="time-remaining">
          <div class="time-remaining-content">
            <span class="label">Осталось</span>
            <strong>12 дней · 6 часов</strong>
          </div>
          <div class="subscription-name">VIP-2024</div>
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
  guide: `
    <section class="guide-section">
      <div class="guide-header">
      <h2>Инструкция по подключению</h2>
        <p class="guide-subtitle">Выберите вашу платформу и следуйте простым шагам</p>
      </div>

      <div class="guide-platform-tabs">
        <button class="platform-tab active" data-platform="android">
            <span class="material-symbols-outlined">android</span>
            <span>Android</span>
        </button>
        <button class="platform-tab" data-platform="ios">
            <span class="material-symbols-outlined">phone_iphone</span>
          <span>iOS</span>
        </button>
        <button class="platform-tab" data-platform="windows">
            <span class="material-symbols-outlined">desktop_windows</span>
            <span>Windows</span>
        </button>
        <button class="platform-tab" data-platform="macos">
            <span class="material-symbols-outlined">desktop_mac</span>
            <span>macOS</span>
        </button>
      </div>

      <div class="guide-content">
        <div class="platform-content active" data-platform="android">
          <div class="guide-step-card">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Скачайте приложение</h3>
              <p>Установите OpenVPN Connect из <a href="https://play.google.com/store/apps/details?id=net.openvpn.openvpn" target="_blank" class="guide-link">Google Play Store</a>.</p>
        </div>
      </div>

          <div class="guide-step-card">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Получите файл конфигурации</h3>
              <p>После оплаты бот отправит вам файл <code>.ovpn</code>. Сохраните его на устройство.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Импортируйте файл</h3>
              <ol class="step-list">
                <li>Откройте OpenVPN Connect</li>
                <li>Нажмите <strong>"IMPORT"</strong> или <strong>"Импорт"</strong></li>
                <li>Выберите <strong>"FILE"</strong> или <strong>"Файл"</strong></li>
                <li>Найдите и выберите файл <code>.ovpn</code></li>
                <li>Нажмите <strong>"ADD"</strong> или <strong>"Добавить"</strong></li>
              </ol>
            </div>
        </div>

          <div class="guide-step-card">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Подключитесь</h3>
              <p>Нажмите на переключатель рядом с профилем и дождитесь подключения.</p>
            </div>
          </div>
        </div>

        <div class="platform-content" data-platform="ios">
          <div class="guide-step-card">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Скачайте приложение</h3>
              <p>Установите OpenVPN Connect из <a href="https://apps.apple.com/app/openvpn-connect/id590379981" target="_blank" class="guide-link">App Store</a>.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Получите файл конфигурации</h3>
              <p>После оплаты бот отправит вам файл <code>.ovpn</code>. Сохраните его в приложении "Файлы".</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Импортируйте файл</h3>
              <ol class="step-list">
                <li>Откройте OpenVPN Connect</li>
                <li>Нажмите <strong>"+"</strong> в правом верхнем углу</li>
                <li>Выберите <strong>"Import from Files"</strong></li>
              <li>Найдите файл <code>.ovpn</code> в приложении "Файлы"</li>
                <li>Нажмите <strong>"ADD"</strong> или <strong>"Добавить"</strong></li>
            </ol>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Подключитесь</h3>
              <p>Нажмите на переключатель рядом с профилем и дождитесь подключения.</p>
            </div>
          </div>
          </div>

        <div class="platform-content" data-platform="windows">
          <div class="guide-step-card">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Скачайте приложение</h3>
              <p>Установите OpenVPN Connect для Windows с <a href="https://openvpn.net/client-connect-vpn-for-windows/" target="_blank" class="guide-link">официального сайта</a>.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Получите файл конфигурации</h3>
              <p>После оплаты бот отправит вам файл <code>.ovpn</code>. Сохраните его на компьютер.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Импортируйте файл</h3>
              <ol class="step-list">
                <li>Откройте OpenVPN Connect</li>
                <li>Нажмите <strong>"Add Profile"</strong> или <strong>"Добавить профиль"</strong></li>
                <li>Выберите <strong>"File"</strong> или <strong>"Файл"</strong></li>
              <li>Найдите и выберите файл <code>.ovpn</code></li>
                <li>Нажмите <strong>"Add"</strong> или <strong>"Добавить"</strong></li>
            </ol>
          </div>
        </div>

          <div class="guide-step-card">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Подключитесь</h3>
              <p>Нажмите на переключатель рядом с профилем и дождитесь подключения.</p>
            </div>
          </div>
        </div>

        <div class="platform-content" data-platform="macos">
          <div class="guide-step-card">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Скачайте приложение</h3>
              <p>Установите OpenVPN Connect для macOS с <a href="https://openvpn.net/client-connect-vpn-for-mac-os/" target="_blank" class="guide-link">официального сайта</a>.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Получите файл конфигурации</h3>
              <p>После оплаты бот отправит вам файл <code>.ovpn</code>. Сохраните его на Mac.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Импортируйте файл</h3>
              <ol class="step-list">
                <li>Откройте OpenVPN Connect</li>
                <li>Нажмите <strong>"+"</strong> или <strong>"Add Profile"</strong></li>
                <li>Выберите <strong>"Import from file"</strong></li>
                <li>Найдите и выберите файл <code>.ovpn</code></li>
                <li>Нажмите <strong>"Add"</strong> или <strong>"Добавить"</strong></li>
          </ol>
            </div>
        </div>

          <div class="guide-step-card">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Подключитесь</h3>
              <p>Нажмите на переключатель рядом с профилем и дождитесь подключения.</p>
            </div>
          </div>
        </div>
        </div>

        <div class="guide-note">
        <span class="material-symbols-outlined">info</span>
        <div>
          <strong>Нужна помощь?</strong>
          <p>Если возникли проблемы, убедитесь, что файл конфигурации не поврежден. Обратитесь в поддержку при необходимости.</p>
        </div>
      </div>
    </section>
  `,
  profile: `
    <section class="guide-section">
      <div class="profile-header-card">
        <div class="profile-avatar">
          <span class="material-symbols-outlined">account_circle</span>
        </div>
        <div class="profile-info">
          <h2>Incognito</h2>
          <div class="profile-balance">
              <span class="material-symbols-outlined">wallet</span>
            <span>0 ₽</span>
            </div>
        </div>
          </div>
          
      <div class="profile-settings-list">
        <button class="profile-setting-item clickable" data-setting="language">
            <div class="setting-icon">
              <span class="material-symbols-outlined">language</span>
            </div>
          <div class="setting-content">
            <div class="setting-label">Язык</div>
            <div class="setting-value" id="languageValue">Русский</div>
          </div>
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
          
        <button class="profile-setting-item clickable" data-setting="currency">
            <div class="setting-icon">
              <span class="material-symbols-outlined">attach_money</span>
            </div>
          <div class="setting-content">
            <div class="setting-label">Валюта</div>
            <div class="setting-value" id="currencyValue">₽ (RUB)</div>
          </div>
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
        </div>

      <div class="profile-history-section">
        <h2 class="section-title">История операций</h2>
        
          <div class="history-item">
          <div class="history-icon">
            <span class="material-symbols-outlined">add_circle</span>
          </div>
          <div class="history-content">
              <div class="history-type">Пополнение</div>
              <div class="history-date">12.12.2024</div>
            </div>
            <div class="history-amount positive">+500 ₽</div>
          </div>
          
          <div class="history-item">
          <div class="history-icon">
            <span class="material-symbols-outlined">add_circle</span>
          </div>
          <div class="history-content">
              <div class="history-type">Пополнение</div>
              <div class="history-date">05.12.2024</div>
            </div>
            <div class="history-amount positive">+1000 ₽</div>
          </div>
          
          <div class="history-item">
          <div class="history-icon">
            <span class="material-symbols-outlined">add_circle</span>
          </div>
          <div class="history-content">
              <div class="history-type">Пополнение</div>
              <div class="history-date">28.11.2024</div>
            </div>
            <div class="history-amount positive">+799 ₽</div>
          </div>
        </div>
      </section>
  `,
};

// Tab navigation
const tabButtons = document.querySelectorAll(".tab-button");

const swapView = (viewKey) => {
  if (!content || !views[viewKey]) return;
  
  // Show skeleton immediately
  showSkeleton(viewKey);
  
  // Load actual content after delay
  setTimeout(() => {
    content.classList.add("fade");
    window.requestAnimationFrame(() => {
      content.innerHTML = views[viewKey];
      content.classList.remove("fade");
      
      initDynamicView(viewKey);
    });
  }, DELAYS.VIEW_TRANSITION);
};

// Initial render
swapView("home");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active")) return;

    // Animate icon on click - from bottom to top
    const icon = button.querySelector(".icon.material-symbols-outlined");
    if (icon) {
      icon.style.transform = "translateY(8px) scale(0.8)";
      icon.style.opacity = "0";
      setTimeout(() => {
        icon.style.transform = "translateY(0) scale(1)";
        icon.style.opacity = "1";
      }, 50);
    }

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    swapView(button.dataset.view);
  });
});

// Modal management
const topupModal = document.querySelector(SELECTORS.TOPUP_MODAL);
const openTopupModal = document.querySelector(SELECTORS.OPEN_TOPUP);
const closeTopupModal = document.querySelector(SELECTORS.CLOSE_TOPUP);

function closeTopupModalHandler() {
  if (topupModal) {
    topupModal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function openTopupModalHandler() {
  if (!topupModal) return;
  
  topupModal.classList.add("active");
  document.body.style.overflow = "hidden";
  
  // Select first payment method by default
  requestAnimationFrame(() => {
    const paymentMethodButtons = topupModal.querySelectorAll(".payment-method-btn");
    if (paymentMethodButtons.length > 0 && !topupModal.querySelector(".payment-method-btn.selected")) {
      paymentMethodButtons[0].classList.add("selected");
    }
  });
}

// Delegated event handlers for modals
if (topupModal) {
  topupModal.addEventListener("click", (e) => {
    if (e.target === topupModal) {
      closeTopupModalHandler();
    } else if (e.target.closest(".payment-method-btn")) {
      const btn = e.target.closest(".payment-method-btn");
      topupModal.querySelectorAll(".payment-method-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    }
  });
}

if (openTopupModal) {
  openTopupModal.addEventListener("click", openTopupModalHandler);
}

if (closeTopupModal) {
  closeTopupModal.addEventListener("click", closeTopupModalHandler);
}

// Delegated event handlers for amount selection and payment
document.addEventListener("click", (e) => {
  const target = e.target;
  
  if (target.classList.contains("amount-btn")) {
    const container = target.closest(".modal-content") || document;
    const amountButtons = container.querySelectorAll(".amount-btn");
    const amountInput = container.querySelector(".amount-input");
    
    amountButtons.forEach((b) => b.classList.remove("selected"));
    target.classList.add("selected");
    
    if (amountInput) {
      amountInput.value = "";
    }
    return;
  }
  
  if (target.classList.contains("modal-primary-btn")) {
    const container = target.closest(".modal-content") || document;
    const selectedAmount = container.querySelector(".amount-btn.selected");
    const amountInput = container.querySelector(".amount-input");
    const customAmount = amountInput?.value || "";
    const amount = selectedAmount?.dataset.amount || customAmount || "0";
    const selectedPaymentMethod = container.querySelector(".payment-method-btn.selected");
    const paymentMethod = selectedPaymentMethod?.dataset.method || "telegram-stars";
    
    console.log("Пополнение на:", amount, "₽", "Способ оплаты:", paymentMethod);
    closeTopupModalHandler();
    return;
  }
});

// Custom amount input
document.addEventListener("input", (e) => {
  if (e.target.classList.contains("amount-input")) {
    const container = e.target.closest(".modal-content") || document;
    container.querySelectorAll(".amount-btn").forEach((b) => b.classList.remove("selected"));
  }
});

// Optimized font loading using Font Loading API
(function initFontLoading() {
  const logo = document.querySelector(".app-header .logo");
  const logoSkeleton = document.querySelector(".logo-skeleton");
  const iconSkeletons = document.querySelectorAll(".icon-skeleton");
  const iconElements = document.querySelectorAll(".tab-button .icon.material-symbols-outlined");

  function showLogo() {
    if (logo && logoSkeleton) {
      logoSkeleton.classList.add("hidden");
      requestAnimationFrame(() => {
        logo.classList.add("loaded");
      });
    }
  }

  function showIcons() {
    if (iconSkeletons.length && iconElements.length) {
      iconSkeletons.forEach((skeleton) => skeleton.classList.add("hidden"));
      iconElements.forEach((icon) => {
        icon.style.display = "inline-flex";
        icon.classList.add("loaded");
        // Set data-icon attribute for ::after pseudo-element
        const iconWrapper = icon.closest(".icon-wrapper");
        if (iconWrapper) {
          iconWrapper.setAttribute("data-icon", icon.textContent.trim());
        }
      });
    }
  }

  // Use Font Loading API if available
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      // Check if fonts are actually loaded
      if (document.fonts.check('1em "Mr Dafoe"')) {
        showLogo();
      } else {
        // Fallback timeout
        setTimeout(showLogo, DELAYS.FONT_FALLBACK);
      }
      
      if (document.fonts.check('1em "Material Symbols Outlined"')) {
        showIcons();
      } else {
        setTimeout(showIcons, DELAYS.ICON_FALLBACK);
      }
    }).catch(() => {
      // Fallback on error
      setTimeout(showLogo, DELAYS.FONT_FALLBACK);
      setTimeout(showIcons, DELAYS.ICON_FALLBACK);
    });
  } else {
    // Fallback for browsers without Font Loading API
    setTimeout(showLogo, DELAYS.FONT_FALLBACK);
    setTimeout(showIcons, DELAYS.ICON_FALLBACK);
  }
})();

// Dynamic view initialization
function initDynamicView(viewKey) {
  if (viewKey === "plans") {
    initPlanBuilder();
  } else if (viewKey === "profile") {
    initProfileSettings();
  } else if (viewKey === "guide") {
    initGuideTabs();
  }
}

// Guide platform tabs
function initGuideTabs() {
  const platformTabs = document.querySelectorAll(".platform-tab");
  const platformContents = document.querySelectorAll(".platform-content");
  
  platformTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const platform = tab.dataset.platform;
      
      // Remove active class from all tabs and contents
      platformTabs.forEach((t) => t.classList.remove("active"));
      platformContents.forEach((c) => c.classList.remove("active"));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const content = document.querySelector(`.platform-content[data-platform="${platform}"]`);
      if (content) {
        content.classList.add("active");
      }
    });
  });
}

// Plan builder
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

// Profile settings
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
};

function initProfileSettings() {
  const settingItems = document.querySelectorAll(".profile-setting-item.clickable");
  
  settingItems.forEach((item) => {
    item.addEventListener("click", () => {
      const setting = item.dataset.setting;
      openSettingsModal(setting);
    });
  });
  
  loadSavedSettings();
}

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
  
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function selectSetting(settingType, value) {
  const setting = settingsData[settingType];
  if (!setting) return;
  
  setting.currentValue = value;
  const valueElement = document.getElementById(setting.valueElementId);
  if (valueElement) {
    valueElement.textContent = value;
  }
  
  if (settingType === "currency") {
    applyCurrency(value);
  } else if (settingType === "language") {
    applyLanguage(value);
  }
  
  localStorage.setItem(`setting_${settingType}`, value);
}

function applyCurrency(currency) {
  const currencySymbol = currency.split(" ")[0];
  
  const historyAmounts = document.querySelectorAll(".history-amount");
  historyAmounts.forEach((el) => {
    const text = el.textContent;
    const amountMatch = text.match(/([+-]?)(\d+[\s\d]*)/);
    if (amountMatch) {
      const sign = amountMatch[1] || "";
      const amount = amountMatch[2].replace(/\s/g, "");
      const formattedAmount = parseInt(amount).toLocaleString("ru-RU");
      el.textContent = `${sign}${formattedAmount} ${currencySymbol}`;
    }
  });
  
  const submitBtn = document.querySelector(".plan-submit");
  if (submitBtn) {
    const currentText = submitBtn.textContent;
    const priceMatch = currentText.match(/(\d+[\s\d]*)/);
    if (priceMatch) {
      const price = priceMatch[1].replace(/\s/g, "");
      const formattedPrice = parseInt(price).toLocaleString("ru-RU");
      submitBtn.textContent = `Подключить • ${formattedPrice} ${currencySymbol}`;
    }
  }
  
  const builder = document.querySelector(".plan-builder");
  if (builder) {
    setTimeout(() => {
      initPlanBuilder();
    }, 100);
  }
}

function applyLanguage(language) {
  console.log(`Язык изменен на: ${language}`);
}

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
      if (key === "currency") {
        applyCurrency(saved);
      }
    }
  });
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Settings modal initialization
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

// Load settings on page load
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", loadSavedSettings);
} else {
  loadSavedSettings();
}
