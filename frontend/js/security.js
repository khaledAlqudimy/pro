/* =========================================================
   أدوات الأمان في الواجهة الأمامية
   =========================================================
   - escapeHTML: يمنع حقن XSS عند إدراج أي نص قادم من بيانات (منتج، اسم
     مستخدم...) داخل HTML عبر innerHTML. يجب استخدامها حول أي قيمة نصية
     ديناميكية قبل إدراجها — راجع main.js لأمثلة الاستخدام الفعلي.
   - Security.csrfToken(): يقرأ رمز CSRF من الكوكي غير httpOnly الذي
     يضعه الخادم، ليُرسَل كـ Header مع كل طلب معدِّل للبيانات (انظر api.js)
   ========================================================= */
const Security = {
  escapeHTML(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  },

  csrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  },
};
