/* =========================================================
   مكتبة الرسوم التوضيحية (خط ذهبي رفيع) لكل تحفة
   استخدام: ICONS.vase ، ICONS.chandelier ... إلخ
   لاستبدال أي منتج بصورة حقيقية بدلاً من الرسم: في main.js
   استبدل `ICONS[p.icon]` بـ `<img src="assets/products/xxx.jpg">`
   ========================================================= */

const ICONS = {
  vase: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 12h20l3 10-6 8c-3 3-4 6-4 10 0 8 10 10 10 24 0 14-9 22-13 22s-13-8-13-22c0-14 10-16 10-24 0-4-1-7-4-10l-6-8 3-10Z"/>
    <path d="M38 14h24"/>
    <ellipse cx="50" cy="84" rx="16" ry="4"/>
    <path d="M44 40c3 2 9 2 12 0" stroke-width="1"/>
  </svg>`,

  chandelier: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 6v10"/>
    <path d="M30 16h40"/>
    <path d="M50 16v10"/>
    <path d="M30 26c0 10 8 12 20 12s20-2 20-12" />
    <path d="M50 38v8"/>
    <path d="M26 46c8 4 16 6 24 6s16-2 24-6"/>
    <circle cx="26" cy="50" r="4"/><circle cx="40" cy="56" r="4"/><circle cx="50" cy="58" r="4"/><circle cx="60" cy="56" r="4"/><circle cx="74" cy="50" r="4"/>
    <path d="M26 46v0"/><path d="M40 52v0"/><path d="M60 52v0"/><path d="M74 46v0"/>
  </svg>`,

  mirror: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="50" cy="42" rx="26" ry="32"/>
    <ellipse cx="50" cy="42" rx="19" ry="25"/>
    <path d="M50 74v16"/>
    <path d="M38 92h24"/>
    <path d="M28 20c4-6 10-10 16-11" stroke-width="1"/>
  </svg>`,

  clock: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="46" r="26"/>
    <circle cx="50" cy="46" r="19"/>
    <path d="M50 34v12l9 6"/>
    <path d="M30 82h40"/>
    <path d="M38 72l-8 10M62 72l8 10"/>
  </svg>`,

  statue: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="20" r="8"/>
    <path d="M50 28v20"/>
    <path d="M38 34c-4 6-4 14 0 20"/>
    <path d="M62 34c4 6 4 14 0 20"/>
    <path d="M42 48c-2 10-2 22 2 30"/>
    <path d="M58 48c2 10 2 22-2 30"/>
    <path d="M32 88h36"/>
    <path d="M28 92h44" stroke-width="2"/>
  </svg>`,

  chest: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 42c8-10 20-16 32-16s24 6 32 16"/>
    <rect x="18" y="42" width="64" height="34" rx="2"/>
    <path d="M18 56h64"/>
    <rect x="44" y="50" width="12" height="10" rx="1"/>
  </svg>`,

  painting: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="16" y="16" width="68" height="54" rx="1"/>
    <rect x="24" y="24" width="52" height="38" rx="1" stroke-width="1"/>
    <path d="M28 58l14-16 10 10 12-14 12 20" stroke-width="1.4"/>
    <circle cx="38" cy="34" r="4" stroke-width="1.2"/>
    <path d="M40 82h20M50 70v12" stroke-width="1.4"/>
  </svg>`,

  chess: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="22" r="7"/>
    <path d="M43 29h14l4 10H39l4-10Z"/>
    <path d="M36 39h28l-4 34H40l-4-34Z"/>
    <path d="M30 78h40"/>
    <path d="M26 84h48" stroke-width="2"/>
  </svg>`,

  dagger: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 6v52"/>
    <path d="M44 6h12l-6-4-6 4Z"/>
    <path d="M30 58h40"/>
    <path d="M40 58v8h20v-8"/>
    <path d="M46 66v26M54 66v26"/>
    <circle cx="50" cy="16" r="3" stroke-width="1"/>
  </svg>`,

  carpet: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="20" width="72" height="60" rx="1"/>
    <rect x="22" y="28" width="56" height="44" rx="1" stroke-width="1"/>
    <rect x="32" y="38" width="36" height="24" rx="1" stroke-width="1"/>
    <path d="M40 46h20M40 54h20" stroke-width="1"/>
    <path d="M14 20l8 8M86 20l-8 8M14 80l8-8M86 80l-8-8" stroke-width="1"/>
  </svg>`,

  necklace: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 24c0 24 12 38 28 38s28-14 28-38"/>
    <circle cx="50" cy="64" r="9"/>
    <circle cx="22" cy="24" r="3" stroke-width="1"/>
    <circle cx="78" cy="24" r="3" stroke-width="1"/>
    <path d="M50 55v0" stroke-width="1"/>
  </svg>`,

  piano: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 30c10-8 24-12 36-12s26 4 36 12v20H14V30Z"/>
    <path d="M14 50v22h30l6 8 6-8h30V50"/>
    <path d="M30 50v14M40 50v14M50 50v14M60 50v14M70 50v14" stroke-width="1"/>
  </svg>`,

  ring: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="60" r="22"/>
    <path d="M38 38l12-16 12 16-12 10-12-10Z"/>
  </svg>`,

  frame: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="20" y="14" width="60" height="72" rx="1"/>
    <rect x="28" y="22" width="44" height="56" rx="1" stroke-width="1"/>
  </svg>`
};
