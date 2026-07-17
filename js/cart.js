(() => {
  const PRODUCTS = [
    { id: 100, amount: 100, price: 99, tone: 'violet', desc: 'На небольшую обновку' },
    { id: 200, amount: 200, price: 179, tone: 'blue', desc: 'Для пары приятных покупок' },
    { id: 400, amount: 400, price: 329, tone: 'pink', desc: 'Уверенный игровой запас', badge: 'Популярный', popular: true },
    { id: 500, amount: 500, price: 399, tone: 'cyan', desc: 'На образ и аксессуары' },
    { id: 800, amount: 800, price: 599, tone: 'orange', desc: 'Больше идей для инвентаря' },
    { id: 1000, amount: 1000, price: 729, tone: 'purple', desc: 'Крупный запас на планы' },
    { id: 3000, amount: 3000, price: 1999, tone: 'gold', desc: 'Самая низкая цена за 100 Robux', badge: 'Выгодный', best: true }
  ];
  const STORAGE_KEY = 'rbxup-cart-v1';
  let cart = loadCart();

  function loadCart() {
    try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY)); return value && typeof value === 'object' ? value : {}; }
    catch { return {}; }
  }
  function saveCart() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {} }
  function product(id) { return PRODUCTS.find((item) => item.id === Number(id)); }
  function quantityTotal() { return Object.values(cart).reduce((sum, qty) => sum + qty, 0); }
  function money(value) { return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'; }

  function renderProducts() {
    const grid = document.querySelector('[data-product-grid]');
    if (!grid) return;
    const arts = ['guide-items.png', 'guide-budget.png', 'guide-safety.png'];
    grid.innerHTML = PRODUCTS.map((item, index) => `<article class="product-card tone-${item.tone} ${item.popular ? 'is-popular' : ''} ${item.best ? 'is-best' : ''}">
      ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}
      <div class="product-art"><img src="assets/${arts[index % arts.length]}" alt="Яркая игровая сцена для набора ${item.amount} Robux"><span class="product-art-shade" aria-hidden="true"></span><span class="product-coin" aria-hidden="true">R</span><i class="spark s1" aria-hidden="true">✦</i><i class="spark s2" aria-hidden="true">✦</i><span class="cube-small" aria-hidden="true"></span></div>
      <div class="product-info"><p class="product-amount"><strong>${item.amount.toLocaleString('ru-RU')}</strong> Robux</p><p class="product-desc">${item.desc}</p><div class="product-buy"><span class="product-price">${money(item.price)}</span><button class="add-button" type="button" data-add="${item.id}" aria-label="Добавить ${item.amount} Robux в корзину"><span>В корзину</span><b aria-hidden="true">+</b></button></div></div>
    </article>`).join('');
  }

  function cartMarkup() {
    return `<div class="cart-overlay" data-cart-close></div><aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1"><div class="cart-head"><div><span class="kicker">Твой выбор</span><h2 id="cart-title">Корзина</h2></div><button class="icon-button" type="button" data-cart-close aria-label="Закрыть корзину">×</button></div><div class="cart-content" data-cart-items></div><div class="cart-footer" data-cart-footer></div></aside><div class="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title" hidden><div class="demo-card"><div class="demo-icon">✨</div><h2 id="demo-title">Заказ собран!</h2><p>Демо-режим: подключение оплаты будет добавлено позже.</p><p class="demo-safe">Мы не запрашиваем пароль, карту или другие личные данные.</p><button class="button button-primary" type="button" data-demo-close>Понятно</button></div></div><div class="toast" role="status" aria-live="polite"></div>`;
  }

  function renderCart() {
    const root = document.querySelector('[data-cart-root]');
    if (!root) return;
    const items = root.querySelector('[data-cart-items]');
    const footer = root.querySelector('[data-cart-footer]');
    const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
    if (!entries.length) {
      items.innerHTML = `<div class="empty-cart"><div>🛒</div><h3>Корзина пока пуста</h3><p>Добавь набор из каталога — он появится здесь.</p><a class="button button-primary" href="catalog.html">Выбрать Robux</a></div>`;
      footer.innerHTML = '';
    } else {
      items.innerHTML = entries.map(([id, qty]) => { const item = product(id); return `<div class="cart-item"><div class="cart-item-coin tone-${item.tone}">R</div><div class="cart-item-main"><div class="cart-item-top"><div><strong>${item.amount.toLocaleString('ru-RU')} Robux</strong><small>${money(item.price)} за набор</small></div><button type="button" data-remove="${id}" aria-label="Удалить ${item.amount} Robux">×</button></div><div class="cart-item-bottom"><div class="quantity"><button type="button" data-change="${id}" data-delta="-1" aria-label="Уменьшить количество">−</button><span aria-label="Количество: ${qty}">${qty}</span><button type="button" data-change="${id}" data-delta="1" aria-label="Увеличить количество">+</button></div><b>${money(item.price * qty)}</b></div></div></div>`; }).join('');
      const total = entries.reduce((sum, [id, qty]) => sum + product(id).price * qty, 0);
      footer.innerHTML = `<button class="clear-cart" type="button" data-clear>Очистить корзину</button><div class="cart-total"><span>Итого <small>${quantityTotal()} ${plural(quantityTotal())}</small></span><strong>${money(total)}</strong></div><button class="button button-primary checkout" type="button" data-checkout>Оформить заказ</button><p>Это демо: настоящая оплата не проводится.</p>`;
    }
    updateCount();
  }
  function plural(n) { const m10=n%10,m100=n%100; return m10===1&&m100!==11?'товар':m10>=2&&m10<=4&&(m100<12||m100>14)?'товара':'товаров'; }
  function updateCount() {
    const total = quantityTotal();
    document.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = total; node.classList.toggle('has-items', total > 0); });
    document.querySelectorAll('[data-cart-open]').forEach((node) => node.setAttribute('aria-label', `Открыть корзину, товаров: ${total}`));
  }
  function showToast(text) { const toast=document.querySelector('.toast'); if (!toast) return; toast.textContent=text; toast.classList.add('is-visible'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove('is-visible'),2200); }
  function add(id, button) { cart[id]=(cart[id]||0)+1; saveCart(); renderCart(); button?.classList.add('is-added'); if(button){button.querySelector('span').textContent='Добавлено'; setTimeout(()=>{button.classList.remove('is-added');button.querySelector('span').textContent='В корзину';},1000);} showToast(`${product(id).amount} Robux добавлено в корзину`); }
  function openCart() { document.body.classList.add('cart-open'); const panel=document.querySelector('.cart-panel'); panel?.focus(); }
  function closeCart() { document.body.classList.remove('cart-open'); }

  document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    const root=document.querySelector('[data-cart-root]');
    if (root) root.innerHTML=cartMarkup();
    renderCart();
    document.addEventListener('click', (event) => {
      const addButton=event.target.closest('[data-add]'); if(addButton){add(addButton.dataset.add, addButton);return;}
      if(event.target.closest('[data-cart-open]')){openCart();return;}
      if(event.target.closest('[data-cart-close]')){closeCart();return;}
      const change=event.target.closest('[data-change]'); if(change){const id=change.dataset.change;cart[id]=(cart[id]||0)+Number(change.dataset.delta);if(cart[id]<=0)delete cart[id];saveCart();renderCart();return;}
      const remove=event.target.closest('[data-remove]'); if(remove){delete cart[remove.dataset.remove];saveCart();renderCart();return;}
      if(event.target.closest('[data-clear]')){cart={};saveCart();renderCart();return;}
      if(event.target.closest('[data-checkout]')){document.querySelector('.demo-modal').hidden=false;document.querySelector('[data-demo-close]').focus();return;}
      if(event.target.closest('[data-demo-close]')){document.querySelector('.demo-modal').hidden=true;return;}
    });
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){if(!document.querySelector('.demo-modal')?.hidden)document.querySelector('.demo-modal').hidden=true;else closeCart();}});
  });
})();
