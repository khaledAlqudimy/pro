/* =========================================================
   طبقة الاتصال بالخادم الخلفي (API)
   =========================================================
   لماذا الرجوع التلقائي للبيانات المحلية (data.js)؟
   هذا الموقع يعمل في وضعين: (أ) معاينة ثابتة سريعة بفتح الملفات مباشرة
   أو استضافتها على GitHub Pages دون أي خادم خلفي، و(ب) نشر كامل متصل
   بالـ backend (قاعدة بيانات حقيقية، دفع فعلي، مزايدة حقيقية). بدل
   الحاجة لنسخة منفصلة لكل حالة، تحاول هذه الطبقة الاتصال بالـ API أولًا،
   وإن تعذّر (لا يوجد خادم، أو انقطاع شبكة) تتراجع بهدوء لاستخدام بيانات
   data.js المحلية — يبقى الموقع يعمل دومًا، بأعلى مستوى بيانات متاح.
   ========================================================= */
const Api = {
  // اتركها فارغة للنشر الموحّد (نفس الأصل)، أو اضبط window.API_BASE_URL
  // قبل تحميل هذا الملف عند نشر الواجهة والخادم على نطاقين منفصلين.
  base: (typeof window !== 'undefined' && window.API_BASE_URL) || '/api',
  backendAvailable: null, // null = لم يُختبر بعد، true/false بعد أول محاولة

  async request(method, path, body) {
    const opts = {
      method,
      credentials: 'include', // ضروري لإرسال واستقبال كوكيز الجلسة httpOnly
      headers: { 'Content-Type': 'application/json' },
    };
    if (!['GET', 'HEAD'].includes(method)) {
      opts.headers['X-CSRF-Token'] = Security.csrfToken();
    }
    if (body !== undefined) opts.body = JSON.stringify(body);

    const res = await fetch(this.base + path, opts);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = new Error(data?.error?.message || `خطأ في الاتصال (${res.status})`);
      err.code = data?.error?.code;
      err.status = res.status;
      err.details = data?.error?.details;
      throw err;
    }
    return data?.data;
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  patch(path, body) { return this.request('PATCH', path, body); },

  /** يحاول تحميل الكتالوج والمزادات من الخادم؛ عند الفشل يُبقي بيانات data.js المحلية كما هي */
  async loadCatalogData() {
    try {
      const [products, categories, auctions] = await Promise.all([
        this.get('/catalog/products'),
        this.get('/catalog/categories'),
        this.get('/auctions'),
      ]);
      PRODUCTS.length = 0;
      PRODUCTS.push(...products);
      CATEGORIES_REMOTE.length = 0;
      CATEGORIES_REMOTE.push(...categories);
      AUCTIONS.length = 0;
      AUCTIONS.push(...auctions.map((a) => ({ ...a, endsAt: a.endsAt })));
      this.backendAvailable = true;
    } catch (e) {
      // لا خادم متاح (معاينة ثابتة) أو انقطاع شبكة — نُبقي بيانات data.js المحلية ونستمر بصمت
      this.backendAvailable = false;
      console.info('تعذّر الاتصال بالخادم الخلفي — يعمل الموقع ببيانات العرض المحلية.', e.message);
    }
    return this.backendAvailable;
  },
};

// تُملأ من الخادم إن توفّر (لا تُستخدم في العرض المحلي البسيط الحالي، جاهزة لتوسعة لاحقة لصفحة فئات ديناميكية)
const CATEGORIES_REMOTE = [];
