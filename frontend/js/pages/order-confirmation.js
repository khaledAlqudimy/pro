document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref');
  const box = document.getElementById('confirmationBox');

  if (!ref) {
    box.innerHTML = `<p>لا يوجد رقم طلب لعرضه.</p><a class="btn btn-gold" href="index.html">${I18n.text('nav_home')}</a>`;
    return;
  }

  try {
    const providerPaymentId = params.get('id') || params.get('payment_id');
    const query = providerPaymentId ? `?id=${encodeURIComponent(providerPaymentId)}` : '';
    const result = await Api.get(`/payments/confirm/${encodeURIComponent(ref)}${query}`);

    const statusMap = {
      PAID: { icon: '✓', title: 'تم تأكيد طلبك بنجاح', cls: 'success' },
      AUTHORIZED: { icon: '⏳', title: 'طلبك قيد المعالجة', cls: 'pending' },
      INITIATED: { icon: '⏳', title: 'بانتظار تأكيد الدفع', cls: 'pending' },
      FAILED: { icon: '✕', title: 'تعذّرت عملية الدفع', cls: 'failed' },
      VOIDED: { icon: '✕', title: 'تم إلغاء عملية الدفع', cls: 'failed' },
    };
    const info = statusMap[result.status] || statusMap.INITIATED;

    box.innerHTML = `
      <div class="confirm-icon ${info.cls}">${info.icon}</div>
      <h1>${info.title}</h1>
      ${result.orderNumber ? `<p class="order-number">رقم الطلب: <b>${Security.escapeHTML(result.orderNumber)}</b></p>` : ''}
      <p class="confirm-note">${info.cls === 'success' ? 'أرسلنا تفاصيل الطلب إلى بريدك الإلكتروني. سيتواصل معك فريقنا لتنسيق الشحن.' : info.cls === 'pending' ? 'قد تستغرق المعالجة بضع لحظات — سنُحدّث الحالة تلقائيًا عبر البريد الإلكتروني.' : 'لم تكتمل عملية الدفع. يمكنك المحاولة مجددًا أو التواصل معنا عبر واتساب.'}</p>
      <a class="btn btn-gold" href="shop.html">متابعة التسوّق</a>
    `;
  } catch (e) {
    box.innerHTML = `<p>تعذّر جلب حالة الطلب: ${Security.escapeHTML(e.message)}</p><a class="btn btn-outline" href="index.html">${I18n.text('nav_home')}</a>`;
  }
});
