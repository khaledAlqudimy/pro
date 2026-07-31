/* =========================================================
   منطق الموقع المشترك — Piece & Story
   تحديثات هذه النسخة:
   - كل نص ديناميكي يمر عبر Security.escapeHTML قبل إدراجه في الصفحة (حماية XSS)
   - السلة تُحفظ في localStorage فتبقى بعد إغلاق المتصفح (كانت بالذاكرة فقط سابقًا)
   - المزايدة تُرسَل فعليًا للخادم عند توفره (تتطلب تسجيل دخول)، وتبقى محاكاة
     محلية فقط في وضع المعاينة الثابتة بلا خادم
   - getProduct/getAuction تدعم البحث بالمعرّف أو بالرابط المختصر (slug)،
     لتعمل سواء مع بيانات data.js المحلية (أرقام) أو بيانات الخادم (UUID)
   ========================================================= */

let CART = loadCart(); // [{id, qty}]

/* ---------- أدوات مساعدة ---------- */
function fmtPrice(n){
  return Number(n).toLocaleString('ar-SA') + ' ' + STORE.currency;
}
function getProduct(idOrSlug){
  return PRODUCTS.find(p => String(p.id) === String(idOrSlug) || p.slug === idOrSlug);
}
function getAuction(idOrSlug){
  return AUCTIONS.find(a => String(a.id) === String(idOrSlug));
}

/* صورة حقيقية إن وُجدت، وإلا رسم بديل تلقائيًا — العنوان يُعقَّم دومًا قبل إدراجه */
function mediaHTML(item, cls=''){
  const fallback = ICONS[item.icon] || '';
  const safeTitle = Security.escapeHTML(I18n.t(item, 'title'));
  if(item.image){
    return `<img src="${item.image}" alt="${safeTitle}" class="${cls}" loading="lazy"
      onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'icon-fallback ${cls}',innerHTML:\`${fallback.replace(/`/g,'\\`')}\`}))">`;
  }
  return fallback;
}

function showToast(msg){
  let t = document.querySelector('.toast');
  if(!t){
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> <span></span>`;
  t.querySelector('span').textContent = msg; // نص عبر textContent لا innerHTML — حماية إضافية من XSS
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=> t.classList.remove('show'), 2600);
}

/* ---------- السلة (محفوظة محليًا) ---------- */
function loadCart(){
  try {
    const raw = localStorage.getItem('ps_cart');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function persistCart(){
  try { localStorage.setItem('ps_cart', JSON.stringify(CART)); } catch { /* تخزين معطّل من طرف المستخدم — نتجاهل بصمت */ }
}

function addToCart(id, qty=1){
  const existing = CART.find(c => String(c.id) === String(id));
  if(existing){ existing.qty += qty; }
  else{ CART.push({id, qty}); }
  persistCart();
  renderCart();
  updateCartCount();
  const p = getProduct(id);
  showToast(`تمت إضافة «${I18n.t(p, 'title')}» إلى السلة`);
  openCart();
}
function removeFromCart(id){
  CART = CART.filter(c => String(c.id) !== String(id));
  persistCart();
  renderCart();
  updateCartCount();
}
function cartTotal(){
  return CART.reduce((sum,c) => sum + (getProduct(c.id)?.price || 0) * c.qty, 0);
}
function updateCartCount(){
  const count = CART.reduce((s,c)=>s+c.qty,0);
  document.querySelectorAll('.cart-count').forEach(el=>{
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
function renderCart(){
  const wrap = document.getElementById('cartItems');
  const footWrap = document.getElementById('cartFoot');
  if(!wrap) return;
  if(CART.length === 0){
    wrap.innerHTML = `<div class="cart-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" style="margin:0 auto 14px;opacity:.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
      <span data-i18n="cart_empty">سلتك فارغة حاليًا</span><br><span style="font-size:12px" data-i18n="cart_empty_sub">تصفّح المجموعة وأضف قطعتك المفضلة</span>
    </div>`;
    if(footWrap) footWrap.style.display = 'none';
    I18n.apply();
    return;
  }
  if(footWrap) footWrap.style.display = 'block';
  wrap.innerHTML = CART.filter(c => getProduct(c.id)).map(c=>{
    const p = getProduct(c.id);
    const title = Security.escapeHTML(I18n.t(p, 'title'));
    return `<div class="cart-item">
      <div class="cart-item-media">${mediaHTML(p)}</div>
      <div class="cart-item-info">
        <h5>${title}</h5>
        <div class="p">${fmtPrice(p.price)} × ${c.qty}</div>
        <button class="remove-item" data-i18n="remove" onclick="removeFromCart('${p.id}')">إزالة</button>
      </div>
    </div>`;
  }).join('');
  const totalEl = document.getElementById('cartTotal');
  if(totalEl) totalEl.textContent = fmtPrice(cartTotal());
}
function openCart(){
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.querySelector('.cart-overlay')?.classList.add('open');
}
function closeCart(){
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.querySelector('.cart-overlay')?.classList.remove('open');
}
function checkoutWhatsapp(){
  if(CART.length === 0){ showToast('السلة فارغة'); return; }
  let msg = 'مرحبًا، أرغب بالاستفسار عن القطع التالية:%0A';
  CART.forEach(c=>{
    const p = getProduct(c.id);
    if(!p) return;
    msg += `- ${p.title} (الكمية: ${c.qty}) — ${fmtPrice(p.price)}%0A`;
  });
  msg += `الإجمالي التقريبي: ${fmtPrice(cartTotal())}`;
  window.open(`https://wa.me/${STORE.whatsapp}?text=${msg}`, '_blank');
}
/** الانتقال لصفحة الدفع الفعلية (مرتبطة بالخادم وبوابات الدفع) */
function goToCheckout(){
  if(CART.length === 0){ showToast('السلة فارغة'); return; }
  window.location.href = 'checkout.html';
}

/* ---------- بطاقة منتج ---------- */
function productCardHTML(p){
  const title = Security.escapeHTML(I18n.t(p, 'title'));
  const category = Security.escapeHTML(I18n.t(p, 'category'));
  const era = Security.escapeHTML(I18n.t(p, 'era') || '');
  const origin = Security.escapeHTML(I18n.t(p, 'origin') || '');
  const badge = p.badge ? Security.escapeHTML(I18n.t(p, 'badge') || p.badge) : '';
  return `
  <div class="product-card reveal">
    <a href="product.html?slug=${encodeURIComponent(p.slug || p.id)}" style="text-decoration:none;color:inherit;">
      <div class="product-media">
        ${badge ? `<span class="badge">${badge}</span>` : ''}
        ${mediaHTML(p)}
      </div>
    </a>
    <button class="wish-btn" title="أضف للمفضلة" data-i18n-title="add_wishlist" onclick="showToast('أُضيفت «'+${JSON.stringify(title)}+'» إلى المفضلة')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
    </button>
    <div class="product-info">
      <span class="product-cat">${category}</span>
      <a href="product.html?slug=${encodeURIComponent(p.slug || p.id)}" style="text-decoration:none;">
        <div class="product-title">${title}</div>
      </a>
      <div class="product-meta">${era} · ${origin}</div>
      <div class="product-price-row">
        <div>
          <span class="price">${fmtPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${fmtPrice(p.oldPrice)}</span>` : ''}
        </div>
        <button class="add-quick" title="إضافة سريعة للسلة" data-i18n-title="add_to_cart" onclick="addToCart('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}
function renderProductGrid(targetId, items){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = items.map(productCardHTML).join('');
  initReveal();
}

/* ---------- بطاقة مزاد ---------- */
function auctionCardHTML(a){
  const statusLabel = a.status === 'live' ? I18n.text('tab_live') : a.status === 'upcoming' ? I18n.text('tab_upcoming') : I18n.text('tab_closed');
  const title = Security.escapeHTML(I18n.t(a, 'title'));
  const category = Security.escapeHTML(I18n.t(a, 'category'));
  return `
  <div class="auction-card reveal" onclick="openAuctionModal('${a.id}')" style="cursor:pointer;">
    <div class="auction-media">
      <span class="lot-number">${Security.escapeHTML(a.lot)}</span>
      ${mediaHTML(a)}
      <div class="timer-chip" data-ends="${a.endsAt}" data-status="${a.status}">${statusLabel}</div>
    </div>
    <div class="auction-info">
      <span class="product-cat">${category}</span>
      <h4>${title}</h4>
      <div class="bid-row">
        <div>
          <span class="label">${a.status === 'upcoming' ? I18n.text('start_price') : I18n.text('current_bid')}</span>
          <span class="amount">${fmtPrice(a.status === 'upcoming' ? a.startPrice : a.currentBid)}</span>
        </div>
        <span class="bids-count">${a.bidsCount} ${I18n.text('bids')}</span>
      </div>
    </div>
  </div>`;
}
/* ---------- نافذة تفاصيل المزاد ---------- */
function openAuctionModal(id){
  const a = getAuction(id);
  if(!a) return;
  let modal = document.getElementById('auctionModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'auctionModal';
    modal.className = 'cart-overlay';
    modal.style.zIndex = 300;
    document.body.appendChild(modal);
  }
  const statusLabel = a.status === 'live' ? I18n.text('tab_live') : a.status === 'upcoming' ? I18n.text('tab_upcoming') : I18n.text('auction_closed');
  const title = Security.escapeHTML(I18n.t(a, 'title'));
  const category = Security.escapeHTML(I18n.t(a, 'category'));
  const description = Security.escapeHTML(I18n.t(a, 'description') || '');
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--parchment);max-width:920px;width:92%;margin:5vh auto;max-height:90vh;overflow-y:auto;position:relative;">
      <button onclick="closeAuctionModal()" style="position:absolute;top:16px;inset-inline-start:16px;z-index:2;width:36px;height:36px;border-radius:50%;background:var(--emerald-deep);color:var(--parchment);border:none;font-size:20px;">×</button>
      <div class="auction-detail" style="padding:44px 40px;">
        <div>
          <div class="pd-gallery-main frame-corners"><span></span>${mediaHTML(a)}</div>
        </div>
        <div>
          <span class="live-strip" style="width:fit-content;"><span class="live-dot"></span>${statusLabel} · ${Security.escapeHTML(a.lot)}</span>
          <h2 style="margin:20px 0 6px;font-size:26px;">${title}</h2>
          <span class="pd-sub">${category}</span>
          <p style="margin:18px 0;">${description}</p>
          <div class="big-timer" data-ends="${a.endsAt}"></div>
          <div class="bid-panel">
            <div class="current">
              <div><span class="label" style="color:var(--brass);font-size:11px;">${a.status==='upcoming'?I18n.text('start_price'):I18n.text('current_bid')}</span><br><b>${fmtPrice(a.status==='upcoming'?a.startPrice:a.currentBid)}</b></div>
              <div style="text-align:start;"><span class="label" style="color:var(--brass);font-size:11px;">${I18n.text('bids')}</span><br><b style="font-family:var(--font-body);font-size:16px;">${a.bidsCount}</b></div>
            </div>
            ${a.status === 'live' ? `
            <div class="bid-input-row">
              <input type="number" id="bidInput" placeholder="${I18n.text('enter_bid_amount')}" min="${a.currentBid + 500}">
              <button class="btn btn-burgundy" onclick="placeBid('${a.id}')">${I18n.text('bid_now')}</button>
            </div>` : a.status === 'upcoming' ? `<a class="btn btn-gold btn-block" href="https://wa.me/${STORE.whatsapp}?text=أرغب%20بتفعيل%20تنبيه%20لمزاد:%20${encodeURIComponent(a.title)}" target="_blank">${I18n.text('notify_me')}</a>` :
            `<div style="text-align:center;color:var(--ink-soft);font-size:13.5px;">${I18n.text('auction_closed')}</div>`}
          </div>
          <div class="bid-history" id="bidHistory"></div>
        </div>
      </div>
    </div>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  tickTimers();
  renderBidHistory(a);
}
function closeAuctionModal(){
  document.getElementById('auctionModal')?.classList.remove('open');
  document.body.style.overflow = '';
}
async function renderBidHistory(a){
  const el = document.getElementById('bidHistory');
  if(!el) return;
  // إن كانت البيانات من الخادم، استخدم سجل المزايدات الحقيقي المرفق بالمزاد نفسه (recentBids)
  if(Api.backendAvailable && a.recentBids){
    el.innerHTML = a.recentBids.length
      ? a.recentBids.map(h=>`<div class="bid-history-item"><span>${Security.escapeHTML(h.name)}</span><b>${fmtPrice(h.amount)}</b></div>`).join('')
      : `<div class="bid-history-item"><span>كن أول من يزايد على هذه القطعة</span></div>`;
    return;
  }
  // محاكاة عرضية فقط في وضع المعاينة المحلية بلا خادم — لا صلة لها ببيانات حقيقية
  const names = ['خ. الحربي','ف. آل سعود','ر. المطيري','ع. الغامدي','ت. الشهري'];
  let history = [];
  let bid = a.currentBid;
  for(let i=0;i<Math.min(a.bidsCount,4);i++){
    history.push({name:names[i%names.length], amount: bid});
    bid -= Math.round((300+Math.random()*900)/100)*100;
  }
  el.innerHTML = history.map(h=>`<div class="bid-history-item"><span>${h.name}</span><b>${fmtPrice(h.amount)}</b></div>`).join('') || '<div class="bid-history-item"><span>كن أول من يزايد على هذه القطعة</span></div>';
}
async function placeBid(id){
  const input = document.getElementById('bidInput');
  const val = Number(input.value);
  const a = getAuction(id);
  const minBid = a.currentBid + 500;
  if(!val || val < minBid){
    showToast(`الحد الأدنى للمزايدة ${fmtPrice(minBid)}`);
    return;
  }

  if(Api.backendAvailable){
    // مزايدة حقيقية عبر الخادم — تتطلب تسجيل دخول، والخادم هو من يتحقق من صحة المبلغ نهائيًا
    try {
      const updated = await Api.post(`/auctions/${id}/bids`, { amount: val });
      Object.assign(a, updated);
      showToast('تم تسجيل مزايدتك بنجاح!');
      openAuctionModal(id);
    } catch(e){
      if(e.status === 401){
        showToast('يلزم تسجيل الدخول أولًا للمزايدة');
        setTimeout(()=> window.location.href = 'login.html?next=' + encodeURIComponent(location.href), 1200);
      } else {
        showToast(e.message || 'تعذّر تسجيل المزايدة');
      }
    }
    return;
  }

  // وضع المعاينة المحلية بلا خادم: محاكاة فقط لغرض العرض
  a.currentBid = val;
  a.bidsCount += 1;
  showToast('تم تسجيل مزايدتك بنجاح! (وضع معاينة محلي — بلا خادم متصل)');
  openAuctionModal(id);
}
function renderAuctionGrid(targetId, items){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = items.map(auctionCardHTML).join('');
  initReveal();
  tickTimers();
}

/* ---------- عدّادات الوقت ---------- */
function formatRemaining(ms){
  if(ms <= 0) return null;
  const s = Math.floor(ms/1000);
  const d = Math.floor(s/86400);
  const h = Math.floor((s%86400)/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return {d,h,m,sec};
}
function tickTimers(){
  document.querySelectorAll('.timer-chip[data-ends]').forEach(chip=>{
    const status = chip.dataset.status;
    if(status !== 'live'){ return; }
    const ends = Number(chip.dataset.ends);
    const rem = formatRemaining(ends - Date.now());
    if(!rem){ chip.textContent = 'انتهى المزاد'; return; }
    const label = rem.d > 0 ? `ينتهي خلال ${rem.d} يوم ${rem.h} س` : `ينتهي خلال ${String(rem.h).padStart(2,'0')}:${String(rem.m).padStart(2,'0')}:${String(rem.sec).padStart(2,'0')}`;
    chip.textContent = label;
    if(rem.d === 0 && rem.h < 2) chip.classList.add('ending');
  });
  document.querySelectorAll('.big-timer[data-ends]').forEach(box=>{
    const ends = Number(box.dataset.ends);
    const rem = formatRemaining(ends - Date.now());
    if(!rem){ box.innerHTML = '<div class="timer-unit"><b>—</b><span>انتهى المزاد</span></div>'; return; }
    box.innerHTML = `
      <div class="timer-unit"><b>${rem.d}</b><span>يوم</span></div>
      <div class="timer-unit"><b>${String(rem.h).padStart(2,'0')}</b><span>ساعة</span></div>
      <div class="timer-unit"><b>${String(rem.m).padStart(2,'0')}</b><span>دقيقة</span></div>
      <div class="timer-unit"><b>${String(rem.sec).padStart(2,'0')}</b><span>ثانية</span></div>`;
  });
}
setInterval(tickTimers, 1000);

/* ---------- كشف عند التمرير ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal:not(.in)');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.12});
  els.forEach(el=>io.observe(el));
}

/* ---------- تهيئة عامة لكل صفحة ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  renderCart();
  initReveal();

  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', checkoutWhatsapp);
  document.getElementById('checkoutOnlineBtn')?.addEventListener('click', goToCheckout);

  const navToggle = document.getElementById('navToggle');
  navToggle?.addEventListener('click', ()=>{
    document.querySelector('.main-nav')?.classList.toggle('open-mobile');
  });

  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    showToast('تم تسجيل اشتراكك في نشرتنا البريدية بنجاح');
    newsletterForm.reset();
  });

  document.addEventListener('langchange', ()=>{ renderCart(); });
});
