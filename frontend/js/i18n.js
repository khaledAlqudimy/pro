/* =========================================================
   دعم ثنائي اللغة (عربي RTL / إنجليزي LTR)
   =========================================================
   الاستخدام: أضف السمة data-i18n="key" على أي عنصر نصه من القاموس
   أدناه، وستُستبدل تلقائيًا عند تبديل اللغة. للحقول القادمة من بيانات
   المنتجات/المزادات (لها حقل عربي أساسي و"Field+En" اختياري)، استخدم
   الدالة I18n.t(item, 'title') بدل قراءة item.title مباشرة.
   ملاحظة تصميم: بقيت أغلب إحداثيات الواجهة (شارات، أزرار الزوايا...)
   في style.css مكتوبة بخصائص CSS المنطقية (inset-inline-start/end) بدل
   left/right الفعلية، فتنعكس تلقائيًا وبشكل صحيح بصريًا عند التبديل
   لـ LTR دون أي كود إضافي هنا.
   ========================================================= */
const I18N_DICT = {
  ar: {
    nav_home: 'الرئيسية', nav_shop: 'المتجر', nav_auctions: 'المزادات', nav_collections: 'المجموعات', nav_contact: 'تواصل معنا',
    search: 'بحث', cart: 'السلة',
    hero_eyebrow: 'قطع أصلية موثّقة · شحن آمن مؤمَّن',
    hero_cta_shop: 'تصفّح المجموعة', hero_cta_auctions: 'دخول المزادات المباشرة',
    stat_pieces: 'قطعة أثرية موثّقة', stat_countries: 'دولة مصدر', stat_years: 'عامًا من الخبرة',
    categories_eyebrow: 'تصفّح حسب الفئة', categories_title: 'عالم من التحف الكلاسيكية',
    story_eyebrow: 'قصتنا', story_cta: 'اكتشف المجموعة كاملة',
    featured_eyebrow: 'مختارات الدار', featured_title: 'قطع مميزة هذا الأسبوع', view_all_shop: 'عرض المتجر بالكامل',
    stat_rating: 'تقييم العملاء', stat_authentic: 'قطع موثّقة أصلية', stat_customers: 'عميل حول العالم', stat_shipping: 'شحن مؤمَّن',
    auctions_eyebrow: 'مزادات مباشرة', auctions_title: 'لا تفوّت اللوت التالي', view_all_auctions: 'جميع المزادات',
    testimonials_eyebrow: 'آراء هواة الاقتناء', testimonials_title: 'ثقة يبنيها التوثيق',
    newsletter_title: 'كن أول من يعلم بالقطع الجديدة والمزادات القادمة',
    newsletter_sub: 'اشترك في نشرتنا واحصل على دعوات حصرية لمعاينة القطع النادرة قبل عرضها للعامة.',
    email_placeholder: 'بريدك الإلكتروني', subscribe: 'اشتراك',
    footer_shop: 'تسوّق', footer_all_products: 'جميع المنتجات', footer_house: 'الدار', footer_story: 'قصتنا',
    footer_authenticity: 'التوثيق والأصالة', footer_shipping: 'الشحن والتغليف', footer_returns: 'سياسة الاسترجاع',
    footer_contact: 'تواصل معنا', footer_phone: 'هاتف', footer_email: 'البريد',
    cart_title: 'سلة المشتريات', cart_total: 'الإجمالي', checkout_whatsapp: 'إتمام الطلب عبر واتساب',
    checkout_now: 'إتمام الشراء', cart_empty: 'سلتك فارغة حاليًا', cart_empty_sub: 'تصفّح المجموعة وأضف قطعتك المفضلة',
    remove: 'إزالة', add_to_cart: 'أضف إلى السلة', add_wishlist: 'أضف للمفضلة',
    shop_hero_eyebrow: 'كل ما تحتاجه لمنزل فاخر', shop_hero_title: 'المتجر الكامل',
    filter_category: 'الفئة', filter_price_range: 'النطاق السعري', up_to: 'حتى',
    filter_availability: 'التوفر', filter_available_only: 'قطع متوفرة فقط', reset_filters: 'إعادة تعيين الفلاتر',
    sort_default: 'الترتيب الافتراضي', sort_price_asc: 'السعر: من الأقل للأعلى', sort_price_desc: 'السعر: من الأعلى للأقل', sort_name: 'الاسم أبجديًا',
    available_now: 'متوفرة الآن', out_of_stock: 'نفدت الكمية',
    spec_era: 'الحقبة الزمنية', spec_origin: 'بلد المنشأ', spec_material: 'الخامة', spec_condition: 'الحالة',
    ask_whatsapp: 'استفسر عن هذه القطعة عبر واتساب',
    trust_certificate: 'شهادة أصالة موثّقة', trust_shipping: 'شحن وتغليف مؤمَّن', trust_returns: 'استرجاع خلال 14 يومًا',
    related_products: 'قد يعجبك أيضًا',
    auction_house: 'دار المزادات', auction_hero_title: 'مزايدة حيّة على أندر القطع الأثرية',
    tab_all: 'الكل', tab_live: 'مباشر الآن', tab_upcoming: 'قادمة قريبًا', tab_closed: 'مغلقة',
    how_it_works: 'كيف تعمل المزادات لدينا', how_it_works_sub: 'ثلاث خطوات نحو اقتنائك التالي',
    step_watch: 'تابع اللوت', step_bid: 'أدخل مزايدتك', step_receive: 'استلم قطعتك',
    start_price: 'سعر البدء', current_bid: 'أعلى مزايدة', bids: 'مزايدة', bid_now: 'زايِد الآن',
    notify_me: 'فعّل تنبيهًا لبدء المزاد', auction_closed: 'تم إغلاق هذا المزاد', enter_bid_amount: 'أدخل مبلغ مزايدتك',
    checkout_page_title: 'إتمام الطلب', checkout_contact: 'بيانات التواصل', checkout_shipping: 'عنوان الشحن',
    checkout_payment: 'طريقة الدفع', checkout_summary: 'ملخص الطلب', full_name: 'الاسم الكامل', phone: 'رقم الجوال',
    city: 'المدينة', district: 'الحي', street: 'الشارع', building_no: 'رقم المبنى', additional_info: 'تفاصيل إضافية',
    place_order: 'إتمام الطلب والدفع', login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'تسجيل الخروج',
    password: 'كلمة المرور', no_account: 'ليس لديك حساب؟', have_account: 'لديك حساب بالفعل؟',
    guest_checkout: 'أو أكمل الشراء كضيف دون إنشاء حساب',
  },
  en: {
    nav_home: 'Home', nav_shop: 'Shop', nav_auctions: 'Auctions', nav_collections: 'Collections', nav_contact: 'Contact',
    search: 'Search', cart: 'Cart',
    hero_eyebrow: 'Authenticated pieces · Fully insured shipping',
    hero_cta_shop: 'Browse the Collection', hero_cta_auctions: 'Enter Live Auctions',
    stat_pieces: 'documented antique pieces', stat_countries: 'countries of origin', stat_years: 'years of experience',
    categories_eyebrow: 'Browse by Category', categories_title: 'A World of Classic Antiques',
    story_eyebrow: 'Our Story', story_cta: 'Discover the Full Collection',
    featured_eyebrow: "The House's Picks", featured_title: 'Featured This Week', view_all_shop: 'View Full Shop',
    stat_rating: 'customer rating', stat_authentic: 'authenticated pieces', stat_customers: 'customers worldwide', stat_shipping: 'insured shipping',
    auctions_eyebrow: 'Live Auctions', auctions_title: "Don't Miss the Next Lot", view_all_auctions: 'All Auctions',
    testimonials_eyebrow: 'Collectors Speak', testimonials_title: 'Trust Built on Authentication',
    newsletter_title: 'Be first to know about new pieces and upcoming auctions',
    newsletter_sub: 'Subscribe for exclusive previews of rare pieces before they go public.',
    email_placeholder: 'Your email address', subscribe: 'Subscribe',
    footer_shop: 'Shop', footer_all_products: 'All Products', footer_house: 'The House', footer_story: 'Our Story',
    footer_authenticity: 'Authentication', footer_shipping: 'Shipping & Packaging', footer_returns: 'Return Policy',
    footer_contact: 'Contact', footer_phone: 'Phone', footer_email: 'Email',
    cart_title: 'Shopping Cart', cart_total: 'Total', checkout_whatsapp: 'Checkout via WhatsApp',
    checkout_now: 'Proceed to Checkout', cart_empty: 'Your cart is empty', cart_empty_sub: 'Browse the collection and add your favorite piece',
    remove: 'Remove', add_to_cart: 'Add to Cart', add_wishlist: 'Add to Wishlist',
    shop_hero_eyebrow: 'Everything for a Luxury Home', shop_hero_title: 'The Full Shop',
    filter_category: 'Category', filter_price_range: 'Price Range', up_to: 'Up to',
    filter_availability: 'Availability', filter_available_only: 'In-stock only', reset_filters: 'Reset Filters',
    sort_default: 'Default order', sort_price_asc: 'Price: Low to High', sort_price_desc: 'Price: High to Low', sort_name: 'Name (A–Z)',
    available_now: 'Available now', out_of_stock: 'Out of stock',
    spec_era: 'Era', spec_origin: 'Origin', spec_material: 'Material', spec_condition: 'Condition',
    ask_whatsapp: 'Ask about this piece via WhatsApp',
    trust_certificate: 'Certified authenticity', trust_shipping: 'Insured shipping & packaging', trust_returns: '14-day returns',
    related_products: 'You may also like',
    auction_house: 'Auction House', auction_hero_title: 'Live Bidding on the Rarest Antique Pieces',
    tab_all: 'All', tab_live: 'Live Now', tab_upcoming: 'Upcoming', tab_closed: 'Closed',
    how_it_works: 'How Our Auctions Work', how_it_works_sub: 'Three steps to your next acquisition',
    step_watch: 'Watch the Lot', step_bid: 'Place Your Bid', step_receive: 'Receive Your Piece',
    start_price: 'Starting price', current_bid: 'Current bid', bids: 'bids', bid_now: 'Bid Now',
    notify_me: 'Get notified when it starts', auction_closed: 'This auction has closed', enter_bid_amount: 'Enter your bid amount',
    checkout_page_title: 'Checkout', checkout_contact: 'Contact Details', checkout_shipping: 'Shipping Address',
    checkout_payment: 'Payment Method', checkout_summary: 'Order Summary', full_name: 'Full Name', phone: 'Mobile Number',
    city: 'City', district: 'District', street: 'Street', building_no: 'Building No.', additional_info: 'Additional Info',
    place_order: 'Place Order & Pay', login: 'Log In', register: 'Create Account', logout: 'Log Out',
    password: 'Password', no_account: "Don't have an account?", have_account: 'Already have an account?',
    guest_checkout: 'Or continue as guest without an account',
  },
};

const I18n = {
  current: (document.documentElement.getAttribute('lang') === 'en') ? 'en' : 'ar',

  init() {
    const saved = localStorage.getItem('ps_lang');
    if (saved && I18N_DICT[saved]) this.current = saved;
    this.apply();
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  toggle() {
    this.set(this.current === 'ar' ? 'en' : 'ar');
  },

  set(lang) {
    if (!I18N_DICT[lang]) return;
    this.current = lang;
    localStorage.setItem('ps_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    this.apply();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  },

  text(key) {
    return I18N_DICT[this.current][key] || I18N_DICT.ar[key] || key;
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = this.text(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', this.text(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.textContent = this.current === 'ar' ? 'EN' : 'AR';
    });
  },

  /** يقرأ حقلًا ثنائي اللغة من عنصر بيانات (منتج/مزاد): title -> titleEn عند الإنجليزية، بترجع رجوعًا للعربي دومًا إن لم توجد ترجمة */
  t(item, fieldAr) {
    if (this.current === 'en') {
      const enField = fieldAr + 'En';
      if (item[enField]) return item[enField];
    }
    return item[fieldAr];
  },
};

document.addEventListener('DOMContentLoaded', () => I18n.init());
