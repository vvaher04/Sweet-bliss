/* =========================================
   CRUMBLE & CO — APP.JS
   ========================================= */

(function () {
  'use strict';

  // ---- STATE ----
  let cart = [];
  let products = [];

  // ---- DOM REFS ----
  const productsGrid   = document.getElementById('productsGrid');
  const cartBtn        = document.getElementById('cartBtn');
  const cartCount      = document.getElementById('cartCount');
  const cartSidebar    = document.getElementById('cartSidebar');
  const cartOverlay    = document.getElementById('cartOverlay');
  const closeCart      = document.getElementById('closeCart');
  const cartItems      = document.getElementById('cartItems');
  const cartFooter     = document.getElementById('cartFooter');
  const cartTotal      = document.getElementById('cartTotal');
  const checkoutBtn    = document.getElementById('checkoutBtn');
  const modalOverlay   = document.getElementById('modalOverlay');
  const closeModal     = document.getElementById('closeModal');
  const orderForm      = document.getElementById('orderForm');
  const modalStep1     = document.getElementById('modalStep1');
  const modalStep2     = document.getElementById('modalStep2');
  const successName    = document.getElementById('successName');
  const successDate    = document.getElementById('successDate');
  const successRef     = document.getElementById('successRef');
  const continueShop   = document.getElementById('continueShop');
  const orderSummaryItems = document.getElementById('orderSummaryItems');
  const modalTotal     = document.getElementById('modalTotal');

  // ---- SET MIN DATE FOR DELIVERY ----
  const deliveryDateInput = document.getElementById('deliveryDate');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  deliveryDateInput.min = tomorrow.toISOString().split('T')[0];

  // ---- FETCH PRODUCTS ----
  async function loadProducts() {
    try {
      const res = await fetch('products.json');
      if (!res.ok) throw new Error('Network error');
      products = await res.json();
      renderProducts();
    } catch (err) {
      console.error('Could not load products:', err);
      productsGrid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;">Could not load products. Please refresh.</p>';
    }
  }

  // ---- RENDER PRODUCTS ----
  function renderProducts() {
    productsGrid.innerHTML = '';
    products.forEach((product, idx) => {
      const card = document.createElement('div');
      card.className = 'cake-card';
      card.style.animationDelay = `${idx * 0.07}s`;
      card.innerHTML = `
        <div class="cake-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          ${product.tag ? `<span class="cake-tag">${product.tag}</span>` : ''}
        </div>
        <div class="cake-info">
          <h3 class="cake-name">${product.name}</h3>
          <p class="cake-desc">${product.description}</p>
          <div class="cake-footer">
            <span class="cake-price">$${product.price.toFixed(2)}</span>
            <button class="add-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">
              Add to Cart
            </button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });

    // Attach add-to-cart listeners
    document.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        addToCart(id, btn);
      });
    });
  }

  // ---- CART OPERATIONS ----
  function addToCart(id, btn) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    // Button feedback
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('added');
    }, 1500);

    updateCartUI();
    // Bump count badge
    cartCount.classList.add('bump');
    setTimeout(() => cartCount.classList.remove('bump'), 300);
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    updateCartUI();
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getTotalQty() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  // ---- UPDATE CART UI ----
  function updateCartUI() {
    const total = getCartTotal();
    const qty   = getTotalQty();

    // Count badge
    cartCount.textContent = qty;
    cartCount.style.display = qty > 0 ? 'flex' : 'none';

    // Cart items
    cartItems.innerHTML = '';

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.<br>Add some cakes! 🎂</p>';
      cartFooter.style.display = 'none';
      return;
    }

    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div style="font-weight:600;font-size:0.9rem;color:var(--brown);flex-shrink:0;">
          $${(item.price * item.qty).toFixed(2)}
        </div>
      `;
      cartItems.appendChild(div);
    });

    // Qty button listeners
    cartItems.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const delta = btn.dataset.action === 'inc' ? 1 : -1;
        changeQty(id, delta);
      });
    });

    cartFooter.style.display = 'block';
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  // ---- CART SIDEBAR OPEN/CLOSE ----
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCartFn() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  cartBtn.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartFn);
  cartOverlay.addEventListener('click', closeCartFn);

  // ---- CHECKOUT MODAL ----
  function openModal() {
    // Populate summary
    orderSummaryItems.innerHTML = cart.map(item => `
      <div class="order-summary-item">
        <span>${item.name} × ${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `).join('');
    modalTotal.textContent = `$${getCartTotal().toFixed(2)}`;

    // Reset form
    orderForm.reset();
    modalStep1.style.display = 'block';
    modalStep2.style.display = 'none';

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeCartFn();
  }
  function closeModalFn() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  checkoutBtn.addEventListener('click', openModal);
  closeModal.addEventListener('click', closeModalFn);
  continueShop.addEventListener('click', () => {
    closeModalFn();
    cart = [];
    updateCartUI();
  });
  // Close modal on overlay click (outside modal box)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModalFn();
  });

  // ---- FORM SUBMISSION ----
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = ['fullName', 'phone', 'email', 'address', 'deliveryDate'];
    let valid = true;

    fields.forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('error');
      if (!el.value.trim()) {
        el.classList.add('error');
        valid = false;
      }
    });

    // Basic email check
    const emailEl = document.getElementById('email');
    if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('error');
      valid = false;
    }

    if (!valid) {
      // Scroll to first error
      const firstError = orderForm.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Format date nicely
    const rawDate = document.getElementById('deliveryDate').value;
    const formattedDate = new Date(rawDate + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Generate order ref
    const ref = 'CC-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    successName.textContent = document.getElementById('fullName').value;
    successDate.textContent = formattedDate;
    successRef.textContent = ref;

    modalStep1.style.display = 'none';
    modalStep2.style.display = 'block';
  });

  // ---- INIT ----
  updateCartUI();
  loadProducts();

})();
