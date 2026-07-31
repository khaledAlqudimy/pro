document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('fallbackWhatsappBtn')?.addEventListener('click', checkoutWhatsapp);
  await Api.loadCatalogData();
  const esc = Security.escapeHTML;

  if (CART.length === 0) {
    document.getElementById('checkoutEmpty').style.display = 'block';
    document.getElementById('checkoutForm').style.display = 'none';
    return;
  }

  if (!Api.backendAvailable) {
    // لا يوجد خادم متصل — الدفع الحقيقي غير ممكن في وضع المعاينة الثابتة. نوجّه بلطف لواتساب بدل كسر الصفحة.
    document.getElementById('checkoutNoBackend').style.display = 'block';
    document.getElementById('checkoutForm').style.display = 'none';
    return;
  }

  renderSummary();
  await prefillIfLoggedIn();

  document.getElementById('checkoutForm').addEventListener('submit', onSubmit);
  document.querySelectorAll('input[name="paymentProvider"]').forEach((r) => {
    r.addEventListener('change', updatePaymentHint);
  });
  updatePaymentHint();

  function renderSummary() {
    const wrap = document.getElementById('summaryItems');
    wrap.innerHTML = CART.filter((c) => getProduct(c.id)).map((c) => {
      const p = getProduct(c.id);
      return `<div class="summary-item">
        <div class="summary-item-media">${mediaHTML(p)}</div>
        <div class="summary-item-info">
          <span>${esc(I18n.t(p, 'title'))}</span>
          <small>${fmtPrice(p.price)} × ${c.qty}</small>
        </div>
        <b>${fmtPrice(p.price * c.qty)}</b>
      </div>`;
    }).join('');
    document.getElementById('summarySubtotal').textContent = fmtPrice(cartTotal());
    document.getElementById('summaryTotal').textContent = fmtPrice(cartTotal());
  }

  async function prefillIfLoggedIn() {
    try {
      const { user } = await Api.get('/auth/me');
      document.getElementById('guestSection').style.display = 'none';
      document.getElementById('loggedInName').textContent = user.fullName;
      document.getElementById('loggedInBadge').style.display = 'flex';
      document.getElementById('fullName').value = user.fullName;
      document.getElementById('phone').value = user.phone || '';
    } catch {
      // ضيف — يبقى نموذج الضيف ظاهرًا كما هو
    }
  }

  function updatePaymentHint() {
    const selected = document.querySelector('input[name="paymentProvider"]:checked')?.value;
    document.querySelectorAll('.payment-option').forEach((el) => el.classList.toggle('active', el.dataset.provider === selected));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = '...جارٍ التنفيذ';

    try {
      const address = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        city: document.getElementById('city').value.trim(),
        district: document.getElementById('district').value.trim(),
        street: document.getElementById('street').value.trim(),
        buildingNo: document.getElementById('buildingNo').value.trim(),
        additionalInfo: document.getElementById('additionalInfo').value.trim(),
      };
      const provider = document.querySelector('input[name="paymentProvider"]:checked').value;
      const items = CART.map((c) => ({ productId: c.id, quantity: c.qty }));

      const order = await Api.post('/orders', {
        items,
        address,
        guestEmail: document.getElementById('guestEmail')?.value.trim() || undefined,
        guestPhone: address.phone,
        paymentProvider: provider,
      });

      const payment = await Api.post('/payments', { orderId: order.id, provider });

      if (payment.mode === 'redirect' && payment.redirectUrl) {
        // إفراغ السلة قبل المغادرة — الطلب أصبح مسجّلًا لدى الخادم بمعرّفه الخاص الآن
        CART = []; persistCart(); updateCartCount();
        window.location.href = payment.redirectUrl;
        return;
      }

      if (payment.mode === 'embedded') {
        CART = []; persistCart(); updateCartCount();
        renderMoyasarWidget(payment.widgetConfig);
        return;
      }

      throw new Error('تعذّر بدء عملية الدفع');
    } catch (err) {
      showToast(err.message || 'حدث خطأ أثناء إتمام الطلب');
      btn.disabled = false;
      btn.textContent = I18n.text('place_order');
    }
  }

  function renderMoyasarWidget(cfg) {
    document.getElementById('checkoutForm').style.display = 'none';
    const host = document.getElementById('paymentWidgetHost');
    host.style.display = 'block';
    host.innerHTML = '<div class="mysr-form"></div>';

    const script = document.createElement('script');
    script.src = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.js';
    script.onload = () => {
      // eslint-disable-next-line no-undef
      Moyasar.init({
        element: '.mysr-form',
        amount: cfg.amount,
        currency: cfg.currency,
        description: cfg.description,
        publishable_api_key: cfg.publishableApiKey,
        callback_url: cfg.callbackUrl,
        methods: cfg.methods,
      });
    };
    script.onerror = () => showToast('تعذّر تحميل نموذج الدفع — تحقّق من الاتصال وحاول مجددًا');
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.css';
    document.head.appendChild(link);
  }
});
