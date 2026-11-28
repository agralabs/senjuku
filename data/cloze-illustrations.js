// Cheerful, funny kawaii cartoon-sticker SVG illustrations for Kalimat Rumpang (Cloze)
// Covers all 41 distinct svgTypes across Bab 1–25 (both Quiz Mode & Learning Mode)

const INK = '#10131a';

function wrapScene(bgColor, accentColor, innerSvg) {
  return `
    <svg viewBox="0 0 120 120" class="cloze-svg cloze-sticker-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <circle cx="60" cy="62" r="48" fill="${bgColor}" stroke="${INK}" stroke-width="2.6"/>
      <circle cx="24" cy="24" r="5" fill="${accentColor}" opacity="0.75"/>
      <circle cx="98" cy="30" r="3.5" fill="${accentColor}" opacity="0.65"/>
      <path d="M96 16l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fbbf24" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>
      ${innerSvg}
    </svg>
  `;
}

const SCENES = {
  // 1. Bank: chubby smiling cartoon bank with golden yen coin & rosy cheeks
  bank: wrapScene('#d1fae5', '#34d399', `
    <ellipse cx="60" cy="96" rx="34" ry="5" fill="#10131a" opacity="0.12"/>
    <rect x="26" y="48" width="68" height="42" rx="8" fill="#fef3c7" stroke="${INK}" stroke-width="2.8"/>
    <polygon points="60,24 20,50 100,50" fill="#10b981" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <rect x="22" y="86" width="76" height="9" rx="4" fill="#34d399" stroke="${INK}" stroke-width="2.6"/>
    <rect x="33" y="54" width="9" height="32" rx="3" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <rect x="78" y="54" width="9" height="32" rx="3" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="51" cy="66" r="3.2" fill="${INK}"/>
    <circle cx="69" cy="66" r="3.2" fill="${INK}"/>
    <circle cx="52" cy="65" r="1.1" fill="#fff"/>
    <circle cx="70" cy="65" r="1.1" fill="#fff"/>
    <ellipse cx="45" cy="72" rx="4" ry="2.2" fill="#fda4af"/>
    <ellipse cx="75" cy="72" rx="4" ry="2.2" fill="#fda4af"/>
    <path d="M54 74 Q60 80 66 74" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="60" cy="39" r="10" fill="#fbbf24" stroke="${INK}" stroke-width="2.2"/>
    <text x="60" y="44" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="13" fill="${INK}">¥</text>
  `),

  // 2. Office Worker: cheerful salaryman with windswept red tie & coffee mug
  office_worker: wrapScene('#e0e7ff', '#818cf8', `
    <path d="M32 98 C32 76 44 68 60 68 C76 68 88 76 88 98 Z" fill="#1d3e8a" stroke="${INK}" stroke-width="2.8"/>
    <polygon points="50,68 60,82 70,68" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
    <path d="M60 72 L65 86 L60 95 L55 86 Z" fill="#ef4444" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="60" cy="46" r="22" fill="#fde68a" stroke="${INK}" stroke-width="2.8"/>
    <path d="M38 42 C38 24 82 22 82 42 C74 34 65 32 54 34 C46 36 41 38 38 42 Z" fill="#1e293b" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="51" cy="47" r="3.2" fill="${INK}"/>
    <circle cx="69" cy="47" r="3.2" fill="${INK}"/>
    <circle cx="52" cy="46" r="1.1" fill="#fff"/>
    <circle cx="70" cy="46" r="1.1" fill="#fff"/>
    <ellipse cx="44" cy="53" rx="4" ry="2.2" fill="#fda4af"/>
    <ellipse cx="76" cy="53" rx="4" ry="2.2" fill="#fda4af"/>
    <path d="M54 55 Q60 61 66 55" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="82" y="70" width="18" height="16" rx="4" fill="#f59e0b" stroke="${INK}" stroke-width="2.4"/>
    <path d="M100 74 h4 a3 3 0 0 1 0 8 h-4" fill="none" stroke="${INK}" stroke-width="2.2"/>
    <path d="M88 65 q2-4 0-7 M94 65 q2-4 0-7" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
  `),

  // 3. Doctor: goofy cheerful doctor with shiny head-mirror & stethoscope
  doctor: wrapScene('#d1fae5', '#10b981', `
    <path d="M30 98 C30 76 44 68 60 68 C76 68 90 76 90 98 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <path d="M48 70 v12 c0 8 24 8 24 0 v-12" fill="none" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="89" r="5" fill="#38bdf8" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="60" cy="46" r="21" fill="#fde68a" stroke="${INK}" stroke-width="2.8"/>
    <path d="M39 36 h42" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
    <circle cx="60" cy="31" r="8" fill="#e0f2fe" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="60" cy="31" r="3" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
    <path d="M47 47 q4-4 8 0 M65 47 q4-4 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="44" cy="53" rx="4" ry="2.2" fill="#fda4af"/>
    <ellipse cx="76" cy="53" rx="4" ry="2.2" fill="#fda4af"/>
    <path d="M53 54 Q60 62 67 54 Z" fill="#f43f5e" stroke="${INK}" stroke-width="2"/>
  `),

  // 4. Student: cheerful student in graduation cap with stars
  student: wrapScene('#fce7f3', '#f472b6', `
    <path d="M32 98 C32 76 44 70 60 70 C76 70 88 76 88 98 Z" fill="#ec4899" stroke="${INK}" stroke-width="2.8"/>
    <polygon points="52,70 60,82 68,70" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
    <circle cx="60" cy="50" r="21" fill="#fde68a" stroke="${INK}" stroke-width="2.8"/>
    <polygon points="60,18 28,31 60,42 92,31" fill="#1d3e8a" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M88 32 v14" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
    <circle cx="88" cy="48" r="3.5" fill="#fbbf24" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="51" cy="51" r="3.2" fill="${INK}"/>
    <circle cx="69" cy="51" r="3.2" fill="${INK}"/>
    <circle cx="52" cy="50" r="1.2" fill="#fff"/>
    <circle cx="70" cy="50" r="1.2" fill="#fff"/>
    <ellipse cx="44" cy="57" rx="4" ry="2.2" fill="#fda4af"/>
    <ellipse cx="76" cy="57" rx="4" ry="2.2" fill="#fda4af"/>
    <path d="M53 58 Q60 64 67 58" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  `),

  // 5. Magazine: bright cheerful comic magazine with smiling cover car
  magazine: wrapScene('#fef3c7', '#f59e0b', `
    <g transform="rotate(-5 60 60)">
      <rect x="30" y="24" width="60" height="72" rx="8" fill="#fb923c" stroke="${INK}" stroke-width="2.8"/>
      <rect x="36" y="30" width="48" height="14" rx="4" fill="#fef08a" stroke="${INK}" stroke-width="2"/>
      <text x="60" y="41" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="10" fill="${INK}">MAG!</text>
      <rect x="36" y="49" width="48" height="32" rx="6" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
      <circle cx="51" cy="62" r="3" fill="${INK}"/>
      <circle cx="69" cy="62" r="3" fill="${INK}"/>
      <ellipse cx="45" cy="68" rx="3.5" ry="2" fill="#fda4af"/>
      <ellipse cx="75" cy="68" rx="3.5" ry="2" fill="#fda4af"/>
      <path d="M54 69 Q60 75 66 69" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="38" y1="88" x2="72" y2="88" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </g>
  `),

  // 6. Umbrella: grinning cartoon umbrella bouncing in raindrops
  umbrella: wrapScene('#e0f2fe', '#38bdf8', `
    <path d="M60 56 v32 a8 8 0 0 1 -16 0" fill="none" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M60 56 v32 a8 8 0 0 1 -16 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <path d="M22 60 C22 32 98 32 98 60 Q85 53 73 60 Q60 53 47 60 Q35 53 22 60 Z" fill="#f43f5e" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <line x1="60" y1="24" x2="60" y2="33" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="49" cy="46" r="3.2" fill="${INK}"/>
    <circle cx="71" cy="46" r="3.2" fill="${INK}"/>
    <circle cx="50" cy="45" r="1.2" fill="#fff"/>
    <circle cx="72" cy="45" r="1.2" fill="#fff"/>
    <ellipse cx="42" cy="51" rx="4" ry="2.2" fill="#fecdd3"/>
    <ellipse cx="78" cy="51" rx="4" ry="2.2" fill="#fecdd3"/>
    <path d="M55 50 Q60 55 65 50" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M28 24 c-3 6 0 10 3 10 s6-4 3-10 l-3-5 z" fill="#38bdf8" stroke="${INK}" stroke-width="1.8"/>
    <path d="M90 28 c-2.5 5 0 8 2.5 8 s5-3 2.5-8 l-2.5-4 z" fill="#38bdf8" stroke="${INK}" stroke-width="1.8"/>
  `),

  // 7. Watch: winking golden wristwatch character
  watch: wrapScene('#fef3c7', '#fbbf24', `
    <rect x="46" y="16" width="28" height="88" rx="10" fill="#1d3e8a" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="60" cy="60" r="27" fill="#fbbf24" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="60" cy="60" r="21" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <line x1="60" y1="60" x2="60" y2="46" stroke="#b3202f" stroke-width="3.2" stroke-linecap="round"/>
    <line x1="60" y1="60" x2="72" y2="60" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="3.5" fill="${INK}"/>
    <circle cx="51" cy="55" r="2.2" fill="${INK}"/>
    <path d="M67 54 q3-3 6 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="47" cy="64" rx="3.2" ry="1.8" fill="#fda4af"/>
    <ellipse cx="73" cy="64" rx="3.2" ry="1.8" fill="#fda4af"/>
    <path d="M55 69 Q60 74 65 69" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
  `),

  // 8. Shopping: smiling pastel shopping bag bursting with goodies
  shopping: wrapScene('#fce7f3', '#ec4899', `
    <path d="M44 44 v-10 a16 16 0 0 1 32 0 v10" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <rect x="28" y="42" width="64" height="54" rx="12" fill="#f472b6" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="48" cy="64" r="3.5" fill="${INK}"/>
    <circle cx="72" cy="64" r="3.5" fill="${INK}"/>
    <circle cx="49" cy="63" r="1.3" fill="#fff"/>
    <circle cx="73" cy="63" r="1.3" fill="#fff"/>
    <ellipse cx="41" cy="71" rx="4.5" ry="2.4" fill="#fef08a"/>
    <ellipse cx="79" cy="71" rx="4.5" ry="2.4" fill="#fef08a"/>
    <path d="M52 72 Q60 80 68 72 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="82" cy="34" r="7" fill="#fbbf24" stroke="${INK}" stroke-width="2"/>
  `),

  // 9. Restroom: cheerful dual friendly blue & pink chibi restroom icons
  restroom: wrapScene('#e0f2fe', '#38bdf8', `
    <rect x="24" y="28" width="72" height="66" rx="14" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <line x1="60" y1="36" x2="60" y2="86" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="4 4"/>
    <circle cx="42" cy="46" r="8" fill="#38bdf8" stroke="${INK}" stroke-width="2.2"/>
    <rect x="33" y="57" width="18" height="24" rx="6" fill="#0ea5e9" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="39" cy="45" r="1.4" fill="${INK}"/><circle cx="45" cy="45" r="1.4" fill="${INK}"/>
    <path d="M39 49 q3 2.5 6 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="78" cy="46" r="8" fill="#f472b6" stroke="${INK}" stroke-width="2.2"/>
    <polygon points="78,56 67,81 89,81" fill="#ec4899" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="75" cy="45" r="1.4" fill="${INK}"/><circle cx="81" cy="45" r="1.4" fill="${INK}"/>
    <path d="M75 49 q3 2.5 6 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
  `),

  // 10. Wake Up: hilarious ringing alarm clock jumping with shocked wide eyes!
  wake_up: wrapScene('#fef3c7', '#f59e0b', `
    <path d="M22 34 q-6 8 0 16 M98 34 q6 8 0 16" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <circle cx="36" cy="34" r="11" fill="#fbbf24" stroke="${INK}" stroke-width="2.6"/>
    <circle cx="84" cy="34" r="11" fill="#fbbf24" stroke="${INK}" stroke-width="2.6"/>
    <line x1="42" y1="88" x2="34" y2="98" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <line x1="78" y1="88" x2="86" y2="98" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="60" cy="64" r="28" fill="#ef4444" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="60" cy="64" r="22" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="51" cy="59" r="5" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="69" cy="59" r="5" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="51" cy="59" r="2.2" fill="${INK}"/>
    <circle cx="69" cy="59" r="2.2" fill="${INK}"/>
    <ellipse cx="60" cy="72" rx="6" ry="5" fill="#f43f5e" stroke="${INK}" stroke-width="2"/>
  `),

  // 11. Sleep: cozy snoozing crescent moon with floating golden Zzz
  sleep: wrapScene('#ede9fe', '#a78bfa', `
    <path d="M74 30 C48 28 30 48 34 72 C38 94 64 102 84 88 C66 88 54 74 56 56 C58 43 64 35 74 30 Z" fill="#fde047" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M44 62 q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="44" cy="70" rx="4" ry="2.2" fill="#fda4af"/>
    <circle cx="54" cy="72" r="3" fill="#f43f5e" stroke="${INK}" stroke-width="1.6"/>
    <text x="72" y="54" font-family="sans-serif" font-weight="900" font-size="18" fill="#6366f1" stroke="${INK}" stroke-width="0.8">Z</text>
    <text x="86" y="40" font-family="sans-serif" font-weight="900" font-size="13" fill="#8b5cf6">z</text>
    <text x="95" y="29" font-family="sans-serif" font-weight="900" font-size="10" fill="#a78bfa">z</text>
  `),

  // 12. Subway: smiling cute metro train emerging from a tunnel arch
  subway: wrapScene('#dbeafe', '#3b82f6', `
    <path d="M22 92 V56 A38 38 0 0 1 98 56 V92 Z" fill="#94a3b8" stroke="${INK}" stroke-width="2.6"/>
    <rect x="34" y="34" width="52" height="56" rx="12" fill="#38bdf8" stroke="${INK}" stroke-width="2.8"/>
    <rect x="41" y="42" width="38" height="20" rx="5" fill="#e0f2fe" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="51" cy="52" r="2.8" fill="${INK}"/>
    <circle cx="69" cy="52" r="2.8" fill="${INK}"/>
    <path d="M56 56 q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="44" cy="76" r="5" fill="#fde047" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="76" cy="76" r="5" fill="#fde047" stroke="${INK}" stroke-width="2.2"/>
    <rect x="54" y="73" width="12" height="6" rx="3" fill="#ffffff" stroke="${INK}" stroke-width="1.8"/>
  `),

  // 13. Bullet Train: zooming grinning Shinkansen with speed lines
  bullet_train: wrapScene('#e0e7ff', '#6366f1', `
    <line x1="16" y1="42" x2="34" y2="42" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="12" y1="54" x2="28" y2="54" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M22 76 L74 76 Q102 76 102 60 Q102 42 72 42 L22 42 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M22 64 L98 64" stroke="#2563eb" stroke-width="6"/>
    <rect x="30" y="48" width="14" height="10" rx="3" fill="#bae6fd" stroke="${INK}" stroke-width="2"/>
    <rect x="50" y="48" width="14" height="10" rx="3" fill="#bae6fd" stroke="${INK}" stroke-width="2"/>
    <circle cx="76" cy="53" r="3" fill="${INK}"/>
    <ellipse cx="83" cy="58" rx="4" ry="2" fill="#fda4af"/>
    <path d="M84 53 Q90 56 85 60" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="18" y1="84" x2="102" y2="84" stroke="${INK}" stroke-width="3" stroke-dasharray="8 5" stroke-linecap="round"/>
  `),

  // 14. Home: cozy smiling cartoon Japanese house with chimney heart puff
  home: wrapScene('#ffe4e6', '#fb7185', `
    <rect x="74" y="28" width="12" height="20" rx="3" fill="#f97316" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="80" cy="20" r="4.5" fill="#ffffff" stroke="${INK}" stroke-width="1.8"/>
    <rect x="30" y="54" width="60" height="40" rx="8" fill="#fef3c7" stroke="${INK}" stroke-width="2.8"/>
    <polygon points="60,24 20,56 100,56" fill="#e11d48" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <rect x="51" y="72" width="18" height="22" rx="4" fill="#fb923c" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="42" cy="64" r="3.2" fill="${INK}"/>
    <circle cx="78" cy="64" r="3.2" fill="${INK}"/>
    <ellipse cx="38" cy="70" rx="3.5" ry="2" fill="#fda4af"/>
    <ellipse cx="82" cy="70" rx="3.5" ry="2" fill="#fda4af"/>
    <path d="M55 64 Q60 69 65 64" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
  `),

  // 15. Eat: steaming grinning kawaii ramen/rice bowl with chopsticks!
  eat: wrapScene('#ffedd5', '#fb923c', `
    <path d="M46 28 q3-6 0-12 M60 26 q3-6 0-12 M74 28 q3-6 0-12" fill="none" stroke="#f97316" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M30 56 C30 38 90 38 90 56 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.6"/>
    <line x1="64" y1="30" x2="96" y2="44" stroke="#b45309" stroke-width="4" stroke-linecap="round"/>
    <line x1="60" y1="36" x2="94" y2="52" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
    <path d="M24 54 H96 C96 82 78 92 60 92 C42 92 24 82 24 54 Z" fill="#ef4444" stroke="${INK}" stroke-width="2.8"/>
    <rect x="44" y="90" width="32" height="7" rx="3" fill="#b91c1c" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="48" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="72" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="49" cy="67" r="1.2" fill="#fff"/>
    <circle cx="73" cy="67" r="1.2" fill="#fff"/>
    <ellipse cx="41" cy="74" rx="4" ry="2.2" fill="#fecdd3"/>
    <ellipse cx="79" cy="74" rx="4" ry="2.2" fill="#fecdd3"/>
    <path d="M54 74 Q60 81 66 74 Z" fill="#fef08a" stroke="${INK}" stroke-width="2"/>
  `),

  // 16. Drink: happy smiling matcha/coffee mug with aroma hearts
  drink: wrapScene('#d1fae5', '#34d399', `
    <path d="M46 32 q3-6 0-11 M62 30 q3-6 0-11" fill="none" stroke="#10b981" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M80 50 h10 a10 10 0 0 1 0 22 h-10" fill="none" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <path d="M80 50 h10 a10 10 0 0 1 0 22 h-10" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="30" y="42" width="52" height="48" rx="12" fill="#34d399" stroke="${INK}" stroke-width="2.8"/>
    <ellipse cx="56" cy="44" rx="22" ry="6" fill="#fef3c7" stroke="${INK}" stroke-width="2.2"/>
    <path d="M44 64 q4-4 8 0 M60 64 q4-4 8 0" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>
    <ellipse cx="40" cy="71" rx="4" ry="2.2" fill="#fda4af"/>
    <ellipse cx="72" cy="71" rx="4" ry="2.2" fill="#fda4af"/>
    <path d="M51 72 Q56 78 61 72" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
  `),

  // 17. Shopping Cart: joyful zooming cartoon shopping cart full of colorful boxes
  shopping_cart: wrapScene('#e0e7ff', '#6366f1', `
    <rect x="42" y="34" width="16" height="16" rx="3" fill="#fbbf24" stroke="${INK}" stroke-width="2.2"/>
    <rect x="60" y="30" width="18" height="20" rx="3" fill="#f472b6" stroke="${INK}" stroke-width="2.2"/>
    <path d="M20 34 h12 l10 40 h44 l8-28 h-54" fill="#93c5fd" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="48" cy="86" r="7" fill="#1e293b" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="78" cy="86" r="7" fill="#1e293b" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="48" cy="86" r="2.5" fill="#fbbf24"/>
    <circle cx="78" cy="86" r="2.5" fill="#fbbf24"/>
    <circle cx="56" cy="58" r="2.8" fill="${INK}"/>
    <circle cx="70" cy="58" r="2.8" fill="${INK}"/>
    <path d="M59 64 q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
  `),

  // 18. Read: happy smiling open storybook with sparkles
  read: wrapScene('#e0f2fe', '#0ea5e9', `
    <path d="M60 40 C48 32 32 32 22 36 V82 C32 78 48 78 60 86 C72 78 88 78 98 82 V36 C88 32 72 32 60 40 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <line x1="60" y1="40" x2="60" y2="86" stroke="${INK}" stroke-width="2.6"/>
    <line x1="30" y1="48" x2="50" y2="48" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <line x1="30" y1="57" x2="48" y2="57" stroke="#93c5fd" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="48" x2="90" y2="48" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
    <circle cx="40" cy="68" r="2.6" fill="${INK}"/>
    <circle cx="80" cy="68" r="2.6" fill="${INK}"/>
    <ellipse cx="35" cy="73" rx="3.5" ry="1.8" fill="#fda4af"/>
    <ellipse cx="85" cy="73" rx="3.5" ry="1.8" fill="#fda4af"/>
    <path d="M55 72 Q60 77 65 72" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
  `),

  // 19. Chopsticks: joyful chopsticks pinching a giggling dumpling/riceball!
  chopsticks: wrapScene('#fef3c7', '#f59e0b', `
    <line x1="22" y1="30" x2="88" y2="62" stroke="#b45309" stroke-width="5.5" stroke-linecap="round"/>
    <line x1="26" y1="48" x2="86" y2="74" stroke="#d97706" stroke-width="5.5" stroke-linecap="round"/>
    <circle cx="76" cy="68" r="18" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="70" cy="66" r="2.8" fill="${INK}"/>
    <circle cx="82" cy="66" r="2.8" fill="${INK}"/>
    <ellipse cx="65" cy="72" rx="3.5" ry="2" fill="#fda4af"/>
    <ellipse cx="87" cy="72" rx="3.5" ry="2" fill="#fda4af"/>
    <path d="M72 73 Q76 78 80 73" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
  `),

  // 20. Write: energetic smiling yellow pencil drawing a squiggly rainbow line
  write: wrapScene('#ede9fe', '#8b5cf6', `
    <path d="M22 86 Q34 76 44 84 T66 84" fill="none" stroke="#ec4899" stroke-width="4" stroke-linecap="round"/>
    <g transform="rotate(-35 62 56)">
      <rect x="48" y="24" width="24" height="54" rx="4" fill="#fbbf24" stroke="${INK}" stroke-width="2.8"/>
      <rect x="48" y="20" width="24" height="12" rx="4" fill="#f472b6" stroke="${INK}" stroke-width="2.6"/>
      <polygon points="48,78 72,78 60,96" fill="#fde68a" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
      <polygon points="56,90 64,90 60,96" fill="${INK}"/>
      <circle cx="55" cy="52" r="2.5" fill="${INK}"/>
      <circle cx="65" cy="52" r="2.5" fill="${INK}"/>
      <path d="M56 58 Q60 63 64 58" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    </g>
  `),

  // 21. Gift: bouncing cute present box with giant ribbon bow & grinning face
  gift: wrapScene('#ffe4e6', '#f43f5e', `
    <path d="M60 36 C46 18 32 28 46 38 Z" fill="#fbbf24" stroke="${INK}" stroke-width="2.6"/>
    <path d="M60 36 C74 18 88 28 74 38 Z" fill="#fbbf24" stroke="${INK}" stroke-width="2.6"/>
    <rect x="28" y="46" width="64" height="46" rx="10" fill="#f43f5e" stroke="${INK}" stroke-width="2.8"/>
    <rect x="24" y="36" width="72" height="14" rx="6" fill="#fb7185" stroke="${INK}" stroke-width="2.8"/>
    <rect x="54" y="36" width="12" height="56" fill="#fbbf24" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="43" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="77" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="44" cy="67" r="1.2" fill="#fff"/>
    <circle cx="78" cy="67" r="1.2" fill="#fff"/>
    <path d="M54 74 Q60 80 66 74" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  `),

  // 22. Mountain: kawaii smiling Mt. Fuji with rosy cheeks & cheerful rising sun
  mountain: wrapScene('#e0f2fe', '#38bdf8', `
    <circle cx="84" cy="34" r="13" fill="#ef4444" stroke="${INK}" stroke-width="2.6"/>
    <polygon points="60,26 18,92 102,92" fill="#2563eb" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <polygon points="60,26 42,54 52,50 60,56 68,50 78,54" fill="#ffffff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="50" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="70" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="51" cy="67" r="1.1" fill="#fff"/>
    <circle cx="71" cy="67" r="1.1" fill="#fff"/>
    <ellipse cx="42" cy="74" rx="4.5" ry="2.4" fill="#fda4af"/>
    <ellipse cx="78" cy="74" rx="4.5" ry="2.4" fill="#fda4af"/>
    <path d="M55 75 Q60 81 65 75" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  `),

  // 23. Japanese Food: giggling onigiri rice ball with nori wrap & blushing cheeks!
  japanese_food: wrapScene('#dcfce7', '#22c55e', `
    <path d="M60 24 C74 24 94 64 92 80 C90 90 76 92 60 92 C44 92 30 90 28 80 C26 64 46 24 60 24 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <rect x="44" y="72" width="32" height="20" rx="4" fill="#1e293b" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="49" cy="54" r="3.4" fill="${INK}"/>
    <circle cx="71" cy="54" r="3.4" fill="${INK}"/>
    <circle cx="50" cy="53" r="1.2" fill="#fff"/>
    <circle cx="72" cy="53" r="1.2" fill="#fff"/>
    <ellipse cx="41" cy="60" rx="4.5" ry="2.4" fill="#fda4af"/>
    <ellipse cx="79" cy="60" rx="4.5" ry="2.4" fill="#fda4af"/>
    <path d="M55 60 Q60 66 65 60 Z" fill="#f43f5e" stroke="${INK}" stroke-width="2"/>
  `),

  // 24. Heart: bubbly smiling pink heart mascot floating with sparkles
  heart: wrapScene('#ffe4e6', '#fb7185', `
    <path d="M60 92 C24 68 20 42 36 30 C46 23 56 30 60 36 C64 30 74 23 84 30 C100 42 96 68 60 92 Z" fill="#f43f5e" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M36 40 q4-6 10-4" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <circle cx="49" cy="54" r="3.4" fill="${INK}"/>
    <circle cx="71" cy="54" r="3.4" fill="${INK}"/>
    <circle cx="50" cy="53" r="1.2" fill="#fff"/>
    <circle cx="72" cy="53" r="1.2" fill="#fff"/>
    <ellipse cx="42" cy="61" rx="4" ry="2.2" fill="#fecdd3"/>
    <ellipse cx="78" cy="61" rx="4" ry="2.2" fill="#fecdd3"/>
    <path d="M54 62 Q60 69 66 62" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
  `),

  // 25. Newspaper: funny folded newspaper wearing tiny reading glasses!
  newspaper: wrapScene('#f1f5f9', '#64748b', `
    <rect x="26" y="26" width="68" height="68" rx="8" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <rect x="34" y="34" width="52" height="12" rx="3" fill="#1e293b"/>
    <text x="60" y="43" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="9" fill="#ffffff">NEWS</text>
    <circle cx="48" cy="60" r="7" fill="#e0f2fe" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="72" cy="60" r="7" fill="#e0f2fe" stroke="${INK}" stroke-width="2.4"/>
    <line x1="55" y1="60" x2="65" y2="60" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="48" cy="60" r="2.2" fill="${INK}"/>
    <circle cx="72" cy="60" r="2.2" fill="${INK}"/>
    <path d="M54 74 Q60 79 66 74" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="34" y1="84" x2="86" y2="84" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
  `),

  // 26. Dog: super cute happy Shiba Inu with tongue sticking out!
  dog: wrapScene('#fef3c7', '#f59e0b', `
    <polygon points="32,48 26,24 48,36" fill="#f59e0b" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <polygon points="88,48 94,24 72,36" fill="#f59e0b" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <ellipse cx="60" cy="62" rx="32" ry="27" fill="#f59e0b" stroke="${INK}" stroke-width="2.8"/>
    <ellipse cx="60" cy="70" rx="22" ry="18" fill="#fef3c7"/>
    <circle cx="47" cy="56" r="3.6" fill="${INK}"/>
    <circle cx="73" cy="56" r="3.6" fill="${INK}"/>
    <circle cx="48" cy="55" r="1.3" fill="#fff"/>
    <circle cx="74" cy="55" r="1.3" fill="#fff"/>
    <ellipse cx="38" cy="64" rx="4.5" ry="2.4" fill="#fda4af"/>
    <ellipse cx="82" cy="64" rx="4.5" ry="2.4" fill="#fda4af"/>
    <ellipse cx="60" cy="64" rx="5" ry="3.5" fill="${INK}"/>
    <path d="M55 72 Q60 82 65 72 Z" fill="#fb7185" stroke="${INK}" stroke-width="2"/>
  `),

  // 27. Photo: cheerful cartoon camera flashing a happy sparkle!
  photo: wrapScene('#e0f2fe', '#0ea5e9', `
    <rect x="44" y="28" width="24" height="12" rx="4" fill="#38bdf8" stroke="${INK}" stroke-width="2.6"/>
    <rect x="22" y="38" width="76" height="52" rx="12" fill="#0ea5e9" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="60" cy="64" r="19" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="60" cy="64" r="12" fill="#1e293b" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="56" cy="60" r="3.5" fill="#ffffff"/>
    <circle cx="84" cy="48" r="4" fill="#fde047" stroke="${INK}" stroke-width="1.8"/>
    <path d="M84 22 l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fde047" stroke="${INK}" stroke-width="1.5"/>
  `),

  // 28. Stamp: cute pink postage stamp with smiling Mt. Fuji cherry blossom
  stamp: wrapScene('#fce7f3', '#ec4899', `
    <rect x="30" y="24" width="60" height="72" rx="6" fill="#ffffff" stroke="${INK}" stroke-width="2.8" stroke-dasharray="6 3"/>
    <rect x="38" y="32" width="44" height="56" rx="4" fill="#f472b6" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="60" cy="54" r="13" fill="#fef08a" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="55" cy="53" r="2.2" fill="${INK}"/>
    <circle cx="65" cy="53" r="2.2" fill="${INK}"/>
    <path d="M56 59 q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <text x="60" y="81" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="11" fill="#ffffff">84¥</text>
  `),

  // 29. Mail: joyful flying envelope with cute wings & heart seal
  mail: wrapScene('#dbeafe', '#3b82f6', `
    <path d="M22 50 C10 42 10 58 24 62 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <path d="M98 50 C110 42 110 58 96 62 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <rect x="24" y="38" width="72" height="48" rx="10" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <polyline points="26,40 60,64 94,40" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
    <circle cx="60" cy="63" r="9" fill="#f43f5e" stroke="${INK}" stroke-width="2.2"/>
    <path d="M57 61 l3 3 3-3" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  `),

  // 30. Rain: goofy puffy raincloud whistling while dropping cyan teardrops
  rain: wrapScene('#e0f2fe', '#38bdf8', `
    <path d="M34 62 C22 62 20 44 34 42 C38 26 62 22 72 34 C86 30 98 44 92 56 C90 61 84 62 78 62 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <circle cx="48" cy="48" r="3" fill="${INK}"/>
    <circle cx="68" cy="48" r="3" fill="${INK}"/>
    <ellipse cx="42" cy="54" rx="3.5" ry="2" fill="#fda4af"/>
    <ellipse cx="74" cy="54" rx="3.5" ry="2" fill="#fda4af"/>
    <circle cx="58" cy="54" r="3" fill="#38bdf8" stroke="${INK}" stroke-width="1.8"/>
    <path d="M38 72 l-4 12 M58 72 l-4 14 M78 72 l-4 12" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
  `),

  // 31. Water Glass: refreshing smiling water glass with striped straw!
  water_glass: wrapScene('#cffafe', '#06b6d4', `
    <line x1="70" y1="18" x2="62" y2="44" stroke="#f43f5e" stroke-width="5" stroke-linecap="round"/>
    <polygon points="34,34 86,34 78,92 42,92" fill="#e0f2fe" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <polygon points="38,50 82,50 77,89 43,89" fill="#38bdf8"/>
    <circle cx="51" cy="66" r="3" fill="${INK}"/>
    <circle cx="69" cy="66" r="3" fill="${INK}"/>
    <circle cx="52" cy="65" r="1.1" fill="#fff"/>
    <circle cx="70" cy="65" r="1.1" fill="#fff"/>
    <ellipse cx="45" cy="72" rx="3.5" ry="2" fill="#fda4af"/>
    <ellipse cx="75" cy="72" rx="3.5" ry="2" fill="#fda4af"/>
    <path d="M55 73 Q60 78 65 73" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
  `),

  // 32. Car: bouncy cheerful red cartoon hatchback with headlight eyes
  car: wrapScene('#fef3c7', '#fbbf24', `
    <path d="M22 72 L28 52 Q32 40 46 40 H74 Q88 40 92 52 L98 72 V80 H22 Z" fill="#ef4444" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <rect x="38" y="46" width="44" height="15" rx="5" fill="#bae6fd" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="34" cy="70" r="5" fill="#fde047" stroke="${INK}" stroke-width="2"/>
    <circle cx="86" cy="70" r="5" fill="#fde047" stroke="${INK}" stroke-width="2"/>
    <path d="M53 70 Q60 76 67 70" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="38" cy="82" r="9" fill="#1e293b" stroke="${INK}" stroke-width="2.6"/>
    <circle cx="82" cy="82" r="9" fill="#1e293b" stroke="${INK}" stroke-width="2.6"/>
    <circle cx="38" cy="82" r="3.5" fill="#cbd5e1"/>
    <circle cx="82" cy="82" r="3.5" fill="#cbd5e1"/>
  `),

  // 33. Stop Car: dramatic cartoon STOP sign mascot with shocked eyes & sweatdrop!
  stop_car: wrapScene('#fee2e2', '#ef4444', `
    <polygon points="44,24 76,24 96,44 96,76 76,96 44,96 24,76 24,44" fill="#dc2626" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <polygon points="47,30 73,30 90,47 90,73 73,90 47,90 30,73 30,47" fill="none" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="48" cy="54" r="5" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
    <circle cx="72" cy="54" r="5" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
    <circle cx="48" cy="54" r="2.2" fill="${INK}"/>
    <circle cx="72" cy="54" r="2.2" fill="${INK}"/>
    <rect x="44" y="68" width="32" height="10" rx="5" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
    <path d="M84 36 c-3 6 0 10 3 10 s6-4 3-10 l-3-5 z" fill="#38bdf8" stroke="${INK}" stroke-width="1.8"/>
  `),

  // 34. Luggage: cheerful rolling suitcase covered in colorful stickers!
  luggage: wrapScene('#e0e7ff', '#818cf8', `
    <path d="M48 36 v-12 h24 v12" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>
    <rect x="30" y="36" width="60" height="54" rx="12" fill="#6366f1" stroke="${INK}" stroke-width="2.8"/>
    <rect x="38" y="44" width="16" height="10" rx="3" fill="#fbbf24" stroke="${INK}" stroke-width="1.8" transform="rotate(-8 46 49)"/>
    <circle cx="76" cy="50" r="6" fill="#f472b6" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="48" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="72" cy="68" r="3.2" fill="${INK}"/>
    <circle cx="49" cy="67" r="1.2" fill="#fff"/>
    <circle cx="73" cy="67" r="1.2" fill="#fff"/>
    <path d="M54 75 Q60 81 66 75" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="40" cy="93" r="4.5" fill="#1e293b"/>
    <circle cx="80" cy="93" r="4.5" fill="#1e293b"/>
  `),

  // 35. Office (previously missing!): cheerful smiling office skyscraper with waving rooftop flag
  office: wrapScene('#dbeafe', '#3b82f6', `
    <line x1="60" y1="16" x2="60" y2="30" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>
    <polygon points="60,16 76,21 60,26" fill="#ef4444" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="32" y="30" width="56" height="64" rx="10" fill="#60a5fa" stroke="${INK}" stroke-width="2.8"/>
    <rect x="40" y="38" width="12" height="10" rx="2" fill="#fef08a" stroke="${INK}" stroke-width="2"/>
    <rect x="68" y="38" width="12" height="10" rx="2" fill="#fef08a" stroke="${INK}" stroke-width="2"/>
    <circle cx="48" cy="62" r="3.2" fill="${INK}"/>
    <circle cx="72" cy="62" r="3.2" fill="${INK}"/>
    <ellipse cx="42" cy="68" rx="4" ry="2.2" fill="#fda4af"/>
    <ellipse cx="78" cy="68" rx="4" ry="2.2" fill="#fda4af"/>
    <path d="M54 69 Q60 75 66 69" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="52" y="80" width="16" height="14" rx="3" fill="#1d3e8a" stroke="${INK}" stroke-width="2"/>
  `),

  // 36. Phone (previously missing!): vibrating happy smartphone ringing with musical notes
  phone: wrapScene('#ede9fe', '#a78bfa', `
    <path d="M22 46 q-5 10 0 20 M98 46 q5 10 0 20" fill="none" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
    <rect x="36" y="24" width="48" height="72" rx="12" fill="#1e293b" stroke="${INK}" stroke-width="2.8"/>
    <rect x="42" y="32" width="36" height="52" rx="6" fill="#e0f2fe" stroke="${INK}" stroke-width="2"/>
    <circle cx="52" cy="54" r="3" fill="${INK}"/>
    <circle cx="68" cy="54" r="3" fill="${INK}"/>
    <ellipse cx="47" cy="60" rx="3.5" ry="2" fill="#fda4af"/>
    <ellipse cx="73" cy="60" rx="3.5" ry="2" fill="#fda4af"/>
    <path d="M55 62 Q60 67 65 62" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="60" cy="90" r="3" fill="#94a3b8"/>
  `),

  // 37. Train (previously missing!): cheerful green Yamanote-style commuter train
  train: wrapScene('#dcfce7', '#22c55e', `
    <rect x="28" y="30" width="64" height="56" rx="14" fill="#22c55e" stroke="${INK}" stroke-width="2.8"/>
    <rect x="36" y="38" width="48" height="22" rx="6" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="49" cy="49" r="3.2" fill="${INK}"/>
    <circle cx="71" cy="49" r="3.2" fill="${INK}"/>
    <path d="M55 54 Q60 59 65 54" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="40" cy="72" r="5" fill="#fde047" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="80" cy="72" r="5" fill="#fde047" stroke="${INK}" stroke-width="2.2"/>
    <line x1="34" y1="92" x2="26" y2="98" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="86" y1="92" x2="94" y2="98" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  `),

  // 38. Health (previously missing!): cheerful smiling first-aid heart mascot
  health: wrapScene('#d1fae5', '#10b981', `
    <rect x="26" y="34" width="68" height="56" rx="14" fill="#ffffff" stroke="${INK}" stroke-width="2.8"/>
    <path d="M46 34 v-8 a6 6 0 0 1 6-6 h16 a6 6 0 0 1 6 6 v8" fill="none" stroke="${INK}" stroke-width="3"/>
    <rect x="54" y="42" width="12" height="28" rx="3" fill="#ef4444" stroke="${INK}" stroke-width="2"/>
    <rect x="46" y="50" width="28" height="12" rx="3" fill="#ef4444" stroke="${INK}" stroke-width="2"/>
    <circle cx="42" cy="76" r="2.8" fill="${INK}"/>
    <circle cx="78" cy="76" r="2.8" fill="${INK}"/>
    <path d="M54 78 Q60 84 66 78" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  `),

  // 39. Travel (previously missing!): cheerful zooming cartoon airplane over puffy cloud!
  travel: wrapScene('#e0f2fe', '#38bdf8', `
    <path d="M26 84 C18 84 18 72 28 72 C32 64 48 64 52 72 C60 72 60 84 52 84 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.2"/>
    <g transform="rotate(-14 62 52)">
      <path d="M24 54 L86 42 Q98 42 94 52 L34 64 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
      <polygon points="52,48 40,26 56,28 66,46" fill="#3b82f6" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <polygon points="56,58 48,78 62,76 68,56" fill="#3b82f6" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="80" cy="49" r="2.8" fill="${INK}"/>
      <ellipse cx="86" cy="52" rx="3.2" ry="1.8" fill="#fda4af"/>
    </g>
  `),

  // 40. Music (previously missing!): dancing smiling music note wearing headphones!
  music: wrapScene('#fce7f3', '#ec4899', `
    <path d="M52 74 V32 L86 24 V66" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="52" y1="42" x2="86" y2="34" stroke="#ec4899" stroke-width="6"/>
    <circle cx="44" cy="76" r="14" fill="#f472b6" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="78" cy="68" r="14" fill="#38bdf8" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="40" cy="74" r="2.2" fill="${INK}"/>
    <circle cx="48" cy="74" r="2.2" fill="${INK}"/>
    <path d="M41 79 q3 3 6 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="74" cy="66" r="2.2" fill="${INK}"/>
    <circle cx="82" cy="66" r="2.2" fill="${INK}"/>
    <path d="M75 71 q3 3 6 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  `),

  // 41. Study (previously missing!): cheerful shining lightbulb-idea + notebook mascot!
  study: wrapScene('#fef9c3', '#facc15', `
    <path d="M60 22 C42 22 32 36 36 52 C38 60 44 64 46 72 H74 C76 64 82 60 84 52 C88 36 78 22 60 22 Z" fill="#fde047" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <rect x="47" y="72" width="26" height="10" rx="4" fill="#94a3b8" stroke="${INK}" stroke-width="2.4"/>
    <rect x="52" y="82" width="16" height="7" rx="3" fill="#64748b" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="51" cy="48" r="3.4" fill="${INK}"/>
    <circle cx="69" cy="48" r="3.4" fill="${INK}"/>
    <circle cx="52" cy="47" r="1.2" fill="#fff"/>
    <circle cx="70" cy="47" r="1.2" fill="#fff"/>
    <ellipse cx="44" cy="54" rx="4" ry="2.2" fill="#fda4af"/>
    <ellipse cx="76" cy="54" rx="4" ry="2.2" fill="#fda4af"/>
    <path d="M54 55 Q60 62 66 55" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  `)
};

// Funny peeking ninja fallback for any unknown svgType
const FALLBACK_SCENE = wrapScene('#fbeff0', '#b3202f', `
  <circle cx="60" cy="62" r="28" fill="#10131a" stroke="${INK}" stroke-width="2.6"/>
  <rect x="33" y="48" width="54" height="10" fill="#b3202f"/>
  <rect x="40" y="54" width="40" height="16" rx="8" fill="#fde68a"/>
  <circle cx="51" cy="62" r="3.6" fill="${INK}"/>
  <circle cx="69" cy="61" r="4.4" fill="${INK}"/>
  <circle cx="52" cy="61" r="1.3" fill="#fff"/>
  <circle cx="70" cy="60" r="1.5" fill="#fff"/>
  <text x="86" y="44" font-family="sans-serif" font-weight="900" font-size="22" fill="#b3202f" stroke="${INK}" stroke-width="1">?</text>
`);

export function getClozeIllustrationSvg(svgType) {
  return SCENES[svgType] || FALLBACK_SCENE;
}
