document.addEventListener('DOMContentLoaded', async () => {
  await Api.loadCatalogData();

  const params = new URLSearchParams(location.search);
  const slugOrId = params.get('slug') || params.get('id') || (PRODUCTS[0] && (PRODUCTS[0].slug || PRODUCTS[0].id));
  let p = getProduct(slugOrId) || PRODUCTS[0];
  let qty = 1;

  if (!p) {
    document.getElementById('productDetail').innerHTML = '<p>عذرًا، هذه القطعة غير متوفرة.</p>';
    return;
  }

  const esc = Security.escapeHTML;

  function render() {
    const title = esc(I18n.t(p, 'title'));
    const category = esc(I18n.t(p, 'category'));
    const origin = esc(I18n.t(p, 'origin') || '');
    const era = esc(I18n.t(p, 'era') || '');
    const material = esc(I18n.t(p, 'material') || '');
    const condition = esc(I18n.t(p, 'condition') || '');
    const description = esc(I18n.t(p, 'description') || '');
    const badge = p.badge ? esc(I18n.t(p, 'badge') || p.badge) : '';

    document.getElementById('pageTitle').textContent = `${title} | Piece & Story`;
    document.getElementById('breadcrumb').innerHTML =
      `<a href="index.html" data-i18n="nav_home">الرئيسية</a> ← <a href="shop.html" data-i18n="nav_shop">المتجر</a> ← <a href="shop.html?cat=${encodeURIComponent(p.categorySlug || p.category)}">${category}</a> ← ${title}`;

    document.getElementById('productDetail').innerHTML = `
      <div>
        <div class="pd-gallery-main frame-corners"><span></span>
          ${badge ? `<span class="badge">${badge}</span>` : ''}
          ${mediaHTML(p)}
        </div>
        <div class="pd-thumbs">
          <div class="pd-thumb active">${mediaHTML(p)}</div>
          <div class="pd-thumb">${mediaHTML(p)}</div>
          <div class="pd-thumb">${mediaHTML(p)}</div>
        </div>
      </div>
      <div>
        <span class="pd-sub">${category} · ${origin}</span>
        <h1 class="pd-title">${title}</h1>
        <div class="pd-price-row">
          <span class="pd-price">${fmtPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${fmtPrice(p.oldPrice)}</span>` : ''}
        </div>
        <div class="pd-avail">
          <span class="dot"></span>
          ${p.stock > 0 ? `<span data-i18n="available_now">متوفرة الآن</span> — ${p.stock} <span data-i18n="pieces_only">قطعة فقط</span>` : '<span data-i18n="out_of_stock">نفدت الكمية</span>'}
        </div>
        <div class="pd-desc"><p>${description}</p></div>
        <table class="pd-specs">
          <tr><td data-i18n="spec_era">الحقبة الزمنية</td><td>${era}</td></tr>
          <tr><td data-i18n="spec_origin">بلد المنشأ</td><td>${origin}</td></tr>
          <tr><td data-i18n="spec_material">الخامة</td><td>${material}</td></tr>
          <tr><td data-i18n="spec_condition">الحالة</td><td>${condition}</td></tr>
        </table>
        <div class="pd-actions">
          <div class="qty-box">
            <button id="qtyMinus">−</button>
            <span id="qtyVal">${qty}</span>
            <button id="qtyPlus">+</button>
          </div>
          <button class="btn btn-primary" style="flex:1;" id="addToCartBtn" data-i18n="add_to_cart">أضف إلى السلة</button>
        </div>
        <a class="btn btn-outline btn-block" data-i18n="ask_whatsapp" href="https://wa.me/${STORE.whatsapp}?text=أرغب%20بالاستفسار%20عن%20قطعة:%20${encodeURIComponent(p.title)}" target="_blank">استفسر عن هذه القطعة عبر واتساب</a>
        <div class="trust-row">
          <div class="trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z"/></svg> <span data-i18n="trust_certificate">شهادة أصالة موثّقة</span></div>
          <div class="trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="7" width="15" height="10" rx="1"/><path d="M16 10h4l3 3v4h-7"/><circle cx="5.5" cy="19" r="1.6"/><circle cx="18.5" cy="19" r="1.6"/></svg> <span data-i18n="trust_shipping">شحن وتغليف مؤمَّن</span></div>
          <div class="trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 3v6h6"/></svg> <span data-i18n="trust_returns">استرجاع خلال 14 يومًا</span></div>
        </div>
      </div>
    `;

    document.getElementById('qtyMinus').addEventListener('click', () => { qty = Math.max(1, qty - 1); document.getElementById('qtyVal').textContent = qty; });
    document.getElementById('qtyPlus').addEventListener('click', () => { qty = Math.min(p.stock || 99, qty + 1); document.getElementById('qtyVal').textContent = qty; });
    document.getElementById('addToCartBtn').addEventListener('click', () => addToCart(p.id, qty));

    I18n.apply();

    const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id);
    const fallback = PRODUCTS.filter(x => x.id !== p.id).slice(0, 4 - related.length);
    renderProductGrid('relatedGrid', [...related, ...fallback].slice(0, 4));

    injectProductSchema(p);
  }

  /** بيانات منظَّمة (JSON-LD) — لا تُنفَّذ كسكربت أبدًا فتبقى متوافقة مع سياسة CSP الصارمة، وتساعد جوجل على عرض السعر والتوفر مباشرة في نتائج البحث */
  function injectProductSchema(product) {
    document.getElementById('productSchema')?.remove();
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'productSchema';
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: I18n.t(product, 'title'),
      description: I18n.t(product, 'description'),
      image: product.image ? [location.origin + '/' + product.image] : undefined,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'SAR',
        price: product.price,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    });
    document.head.appendChild(el);
  }

  render();
  document.addEventListener('langchange', render);
});
