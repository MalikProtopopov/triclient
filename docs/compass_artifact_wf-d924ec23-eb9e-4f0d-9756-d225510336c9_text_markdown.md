# Три дизайн-системы для редизайна сайта Ассоциации трихологов

**Каждая из трёх систем ниже — это самостоятельный UI-кит**, готовый к реализации на Next.js + Tailwind. Все три кардинально отличаются по визуальному языку, но объединены общим требованием: розово-серый логотип, медицинская достоверность и современная эстетика 2025–2026.

---

## СТИЛЬ 1 — «CLINICAL AURA»

### 1. Философия

Светлый, воздушный интерфейс, вдохновлённый пересечением Sensora и Melbourne Biology. Чистота белого фона транслирует клиническую точность, а мягкие glassmorphism-панели добавляют глубину без визуального шума. **Этот стиль подходит трихологии, потому что медицинские специалисты привыкли к «клинически чистым» интерфейсам** — они подсознательно ассоциируют обилие белого пространства с лабораторной стерильностью и доверием. Розовый акцент логотипа здесь становится единственным тёплым элементом на холодном фоне, что делает бренд мгновенно узнаваемым.

### 2. Цветовая палитра

| Токен | HEX | Назначение |
|---|---|---|
| **Primary** | `#E8638B` | Основной розовый — CTA, ссылки, активные элементы |
| **Primary Hover** | `#D4507A` | Hover-состояние primary |
| **Primary Light** | `#FCE4EC` | Фон бейджей, лёгкие акценты |
| **Secondary** | `#5BB5A2` | Тeal — вторичные кнопки, иконки успеха, научные акценты |
| **Secondary Light** | `#E0F2F1` | Фон info-панелей |
| **Tertiary** | `#7E8A9A` | Серо-голубой — метаданные, теги, вспомогательные иконки |
| **Background** | `#FFFFFF` | Основной фон страницы |
| **Surface** | `#F8F9FB` | Карточки, панели, альтернативные секции |
| **Surface Alt** | `#F0F2F5` | Вложенные карточки, инпуты |
| **Text Primary** | `#1A1D23` | Заголовки, основной текст |
| **Text Secondary** | `#5F6B7A` | Подписи, мета-информация |
| **Border** | `#E2E6EB` | Границы карточек, разделители |
| **Border Focus** | `#E8638B` | Фокус-кольца интерактивных элементов |

### 3. Типографика

**Пара шрифтов:** Plus Jakarta Sans (заголовки) + Inter (тело)

Обе — variable fonts с Google Fonts. Plus Jakarta Sans — геометричный, современный, набирает популярность в health-tech. Inter — эталон экранной читаемости, используется в ведущих дизайн-системах.

| Уровень | Размер (desktop) | Вес | Line-height | Letter-spacing |
|---|---|---|---|---|
| H1 | 48px | 700 | 56px | -0.02em |
| H2 | 36px | 700 | 44px | -0.01em |
| H3 | 24px | 600 | 32px | 0em |
| Body | 17px | 400 | 28px | 0em |
| Caption | 13px | 500 | 20px | 0.02em |
| Overline | 12px | 600 | 16px | 0.08em, uppercase |

**Mobile-адаптация:** H1 → 32px/40px, H2 → 26px/32px, Body → 16px/26px.

### 4. Сетка и отступы

- **Колонки:** 12
- **Container max-width:** 1280px (контент), 720px (статьи/проза)
- **Gutter:** 24px (desktop), 16px (mobile)
- **Section padding:** 96px top/bottom (desktop), 48px (mobile)
- **Spacing-токены:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px

### 5. Компоненты

**Кнопки:**
- Primary: `background: #E8638B`, `color: #FFF`, `border-radius: 10px`, `padding: 14px 28px`, тень `0 2px 8px rgba(232,99,139,0.25)`. Hover: translateY(-2px), тень усиливается, цвет → `#D4507A`.
- Secondary: `background: transparent`, `border: 1.5px solid #E8638B`, `color: #E8638B`, radius 10px. Hover: фон `#FCE4EC`.
- Ghost: `background: transparent`, `color: #5F6B7A`, без границ. Hover: `color: #1A1D23`, подчёркивание.

**Карточки:**
- Тип: **elevated + glass hybrid**. Белый фон `#FFFFFF` на секциях с `#F8F9FB`. `border-radius: 16px`. Тень `0 4px 6px -1px rgba(0,0,0,0.07)`. Для акцентных карточек — glassmorphism: `backdrop-filter: blur(16px); background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.4)`.

**Навигация:**
- Sticky, высота 80px (desktop) / 64px (mobile). `backdrop-filter: blur(12px); background: rgba(255,255,255,0.85)`. Тонкая граница `border-bottom: 1px solid #E2E6EB`. Логотип слева, ссылки по центру, CTA справа.

**Hero-секция:**
- Лейаут: split — текст слева (6 колонок), справа абстрактная 3D-композиция из полупрозрачных органических сфер в розово-тeal тонах. Фон чисто белый. Крупный H1 + подзаголовок + две кнопки. Внизу hero — полоска с цифрами-статистикой («500+ специалистов · 15 лет · 30+ мероприятий в год»).

**Теги/бейджи:**
- `border-radius: 6px`, `padding: 4px 12px`, `background: #FCE4EC` или `#E0F2F1`, `font-size: 12px`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.06em`.

**Иконки:** Line-стиль, stroke-width 1.5px. Библиотека: Lucide или Phosphor Icons (light). Моноцвет `#7E8A9A`, на hover → `#E8638B`.

### 6. Micro-animations

1. **Scroll reveal секций** — элементы появляются с `opacity: 0 → 1` и `translateY(24px → 0)` при входе в viewport. **Framer Motion** `whileInView`, `duration: 0.6s`, `ease: [0.25, 0.46, 0.45, 0.94]`. Stagger между элементами: 0.1s.
2. **Hover на карточках** — CSS transition `transform: translateY(-4px)` + усиление тени. `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
3. **Стата-счётчики** — цифры в hero анимируются от 0 до значения при первом появлении. **Framer Motion** `useMotionValue` + `animate`, `duration: 1.2s`, `ease: easeOut`.

### 7. CSS-переменные

```css
:root {
  /* --- Colors --- */
  --color-primary: #E8638B;
  --color-primary-hover: #D4507A;
  --color-primary-light: #FCE4EC;
  --color-secondary: #5BB5A2;
  --color-secondary-light: #E0F2F1;
  --color-tertiary: #7E8A9A;
  --color-bg: #FFFFFF;
  --color-surface: #F8F9FB;
  --color-surface-alt: #F0F2F5;
  --color-text-primary: #1A1D23;
  --color-text-secondary: #5F6B7A;
  --color-text-on-primary: #FFFFFF;
  --color-border: #E2E6EB;
  --color-border-focus: #E8638B;
  --color-success: #2E9E6E;
  --color-warning: #E6A817;
  --color-error: #D93025;

  /* --- Typography --- */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --text-h1: 700 clamp(2rem, 1.2rem + 3vw, 3rem) / 1.17 var(--font-heading);
  --text-h2: 700 clamp(1.5rem, 1rem + 2vw, 2.25rem) / 1.22 var(--font-heading);
  --text-h3: 600 clamp(1.25rem, 1rem + 1vw, 1.5rem) / 1.33 var(--font-heading);
  --text-body: 400 clamp(1rem, 0.95rem + 0.25vw, 1.0625rem) / 1.65 var(--font-body);
  --text-caption: 500 0.8125rem / 1.54 var(--font-body);
  --ls-h1: -0.02em;
  --ls-h2: -0.01em;
  --ls-h3: 0em;

  /* --- Spacing --- */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  /* --- Layout --- */
  --container-xl: 1280px;
  --container-prose: 720px;
  --grid-columns: 12;
  --grid-gutter: 24px;
  --header-height: 80px;
  --section-padding: 96px;

  /* --- Surfaces --- */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04);
  --shadow-primary: 0 4px 14px rgba(232,99,139,0.25);

  /* --- Glass --- */
  --glass-bg: rgba(255,255,255,0.7);
  --glass-border: rgba(255,255,255,0.4);
  --glass-blur: blur(16px);

  /* --- Motion --- */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 8. Промпт для AI-генерации фоновых изображений

```
Prompt (Midjourney v6.1 / DALL-E):
"Abstract organic translucent spheres floating in clean white space, 
soft pink (#E8638B) and teal (#5BB5A2) tinted glass orbs, subtle 
caustic light refractions, microscopic biology aesthetic, hair follicle 
cell inspired shapes, clinical laboratory lighting, depth of field bokeh, 
soft shadows on white surface, hyper-clean medical aesthetic, 8K render, 
no text, no people --ar 16:9 --style raw --s 200"

Вариация для текстуры секций:
"Subtle topographic contour lines pattern, very light grey (#F0F2F5) on 
white (#FFFFFF), thin 0.5px lines, organic flowing curves reminiscent of 
scalp surface micro-topology, seamless tileable pattern, minimalist 
scientific illustration style --ar 1:1 --tile --s 50"
```

### 9. Антипаттерны — чего НЕ делать

- **Не делать все карточки одинаковыми.** Варьировать размеры в bento-сетке: большая карточка для главной услуги, мелкие — для второстепенных. Одинаковая сетка 3×3 — признак шаблона.
- **Не использовать стоковые фото улыбающихся людей в белых халатах.** Лучше: реальные фото команды, макро-съёмка трихоскопии, абстрактные 3D-визуализации.
- **Не ставить glassmorphism на каждый элемент.** Максимум 2–3 glass-панели на страницу — навигация, одна акцентная карточка, возможно плавающий виджет. Иначе — «ваш сайт с Dribbble 2021 года».
- **Не использовать механически ровные отступы между всеми секциями.** Варьировать section padding: hero → 120px, контент → 96px, CTA → 64px. Человеческий дизайн имеет ритм.
- **Не делать розовый доминирующим на 80% площади.** Розовый — хирургический акцент: кнопки, ссылки, одна линия-декор. Иначе — салон красоты вместо медицинской ассоциации.

---

## СТИЛЬ 2 — «EDITORIAL LUXE»

### 1. Философия

Глубокий, премиальный, журнально-эдиториальный стиль, вдохновлённый пересечением Mental Harmony и Invest Firm. Серифные заголовки на тёмном фоне создают ощущение авторитетного медицинского издания, а контраст между тёмными hero-секциями и светлыми контентными блоками формирует кинематографическую драматургию скролла. **Для трихологии это работает как визуальная метафора «глубины исследования»** — ассоциация не просто перечисляет услуги, а транслирует экспертизу уровня Nature или The Lancet. Champagne-gold акцент — знак premium-позиционирования, что критично для ассоциации, объединяющей ведущих специалистов.

### 2. Цветовая палитра

| Токен | HEX | Назначение |
|---|---|---|
| **Primary** | `#A31555` | Глубокий rose — CTA, ключевые акценты |
| **Primary Hover** | `#8C1248` | Hover-состояние |
| **Primary Light** | `#F8D7E3` | Акцентный фон на светлых секциях |
| **Secondary** | `#C9A96E` | Champagne gold — иконки, разделители, premium-элементы |
| **Secondary Light** | `#F5ECD7` | Фон для gold-бейджей |
| **Tertiary** | `#6B5B73` | Plum-grey — мета-текст, подписи |
| **Background Dark** | `#0F0B13` | Тёмные hero/CTA секции |
| **Background Light** | `#FFFAF5` | Светлые контентные секции (тёплый off-white) |
| **Surface Dark** | `#1A1520` | Карточки на тёмном фоне |
| **Surface Light** | `#FFFFFF` | Карточки на светлом фоне |
| **Text on Dark** | `#F5F0F2` | Текст на тёмных секциях |
| **Text on Light** | `#1A1520` | Текст на светлых секциях |
| **Text Secondary Dark** | `#9E8FA6` | Вторичный текст на тёмном |
| **Text Secondary Light** | `#6B5B73` | Вторичный текст на светлом |
| **Border Dark** | `#2A2433` | Границы на тёмном фоне |
| **Border Light** | `#E5DDE0` | Границы на светлом фоне |

### 3. Типографика

**Пара шрифтов:** Instrument Serif (заголовки) + DM Sans (тело)

Instrument Serif — свежая альтернатива Playfair Display (добавлен в Google Fonts в 2023). Высококонтрастная editorial-антиква с современной пластикой. DM Sans — геометричный гротеск от Colophon Foundry, идеальный контрапункт к серифным заголовкам.

| Уровень | Размер (desktop) | Вес | Line-height | Letter-spacing |
|---|---|---|---|---|
| H1 | 56px | 400 (Regular) | 64px | -0.02em |
| H2 | 40px | 400 | 48px | -0.01em |
| H3 | 28px | 400 | 36px | 0em |
| Body | 17px (DM Sans) | 400 | 28px | 0em |
| Caption | 14px | 400 | 20px | 0.01em |
| Overline | 11px (DM Sans) | 500 | 16px | 0.12em, uppercase |
| Pull quote | 32px (Instrument Serif Italic) | 400 | 44px | 0em |

**Mobile:** H1 → 36px/44px, H2 → 28px/36px. Serif-заголовки на мобайле остаются достаточно крупными для сохранения editorial-характера.

### 4. Сетка и отступы

- **Колонки:** 12 (с варьируемым layout: 8+4, 5+7, full-width для hero)
- **Container max-width:** 1280px (основной), 860px (для editorial-контента с широкими полями)
- **Gutter:** 32px (desktop), 16px (mobile) — шире, чем в стиле 1, для воздушности editorial layout
- **Section padding:** 120px top/bottom (desktop тёмные секции), 96px (светлые), 48px (mobile)
- **Spacing-токены:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px

### 5. Компоненты

**Кнопки:**
- Primary: `background: #A31555`, `color: #FFF`, `border-radius: 8px`, `padding: 16px 32px`, `font-family: DM Sans`, `font-weight: 500`, `font-size: 15px`, `letter-spacing: 0.02em`. Hover: `background: #8C1248`, subtle scale `transform: scale(1.02)`.
- Secondary: `background: transparent`, `border: 1px solid #C9A96E`, `color: #C9A96E` (на тёмном) / `color: #A31555` с `border-color: #A31555` (на светлом). Radius 8px. Hover: заливка соответствующим цветом на 10% opacity.
- Ghost: Текстовая ссылка + стрелка `→`. `color: #C9A96E` на тёмном, `#A31555` на светлом. Hover: подчёркивание анимируется слева направо.

**Карточки:**
- На тёмном фоне: `background: #1A1520`, `border: 1px solid #2A2433`, `border-radius: 12px`. При hover — тонкое свечение: `box-shadow: 0 0 0 1px #C9A96E`.
- На светлом фоне: `background: #FFFFFF`, `border: 1px solid #E5DDE0`, `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`.
- **Bento-grid layout:** Секция услуг — 2 крупные карточки (grid-column: span 2) + 4 мелкие. Каждая карточка с gold-иконкой вверху.

**Навигация:**
- Sticky, высота 72px. На тёмных секциях: прозрачная, белый текст. На светлых: белый фон с тонкой границей. Анимация смены фона при скролле `transition: background 0.3s ease`. Минимум пунктов: Наука · Образование · Члены · Мероприятия · О нас. CTA «Вступить» — кнопка primary.

**Hero-секция:**
- Full-viewport, тёмный фон `#0F0B13`. По центру — крупный серифный H1 в 2–3 строки, под ним overline-тег «Ассоциация трихологов России». Фон: тонкий mesh-градиент от `#A31555` (10% opacity) к `#0F0B13`, с анимированным noise-паттерном. Внизу hero — горизонтальная полоска-статистика с gold-цифрами: «500+» «15 лет» «30 городов».

**Теги/бейджи:**
- На тёмном: `border: 1px solid #2A2433`, `background: transparent`, `color: #9E8FA6`, `border-radius: 4px`.
- На светлом: `background: #F8D7E3`, `color: #A31555`, `border-radius: 4px`.
- Gold-бейдж (для premium): `background: #F5ECD7`, `color: #8A7340`, `border-radius: 4px`.

**Иконки:** Duotone-стиль. Основной тон `#C9A96E` (gold), вторичный слой с 30% opacity. Библиотека: Phosphor Icons (duotone). Размер: 24px стандарт, 32px для feature-карточек.

### 6. Micro-animations

1. **Параллакс заголовков** — при скролле серифный H1 в hero сдвигается с замедлением (`translateY` в 0.3× от скорости скролла). **GSAP ScrollTrigger**, `scrub: 1`, без jank.
2. **Линия-подчёркивание ссылок** — на hover ghost-кнопок и навигации подчёркивание анимируется от 0 до 100% ширины слева направо. `CSS transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
3. **Секция-переключатель тёмный↔светлый** — при скролле в зону светлой секции, навигация плавно меняет фон с прозрачного на белый. `transition: background-color 0.4s ease, color 0.4s ease`.

### 7. CSS-переменные

```css
:root {
  /* --- Colors (Light context) --- */
  --color-primary: #A31555;
  --color-primary-hover: #8C1248;
  --color-primary-light: #F8D7E3;
  --color-secondary: #C9A96E;
  --color-secondary-light: #F5ECD7;
  --color-tertiary: #6B5B73;
  --color-bg: #FFFAF5;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1520;
  --color-text-secondary: #6B5B73;
  --color-border: #E5DDE0;

  /* --- Dark context --- */
  --color-bg-dark: #0F0B13;
  --color-surface-dark: #1A1520;
  --color-text-on-dark: #F5F0F2;
  --color-text-secondary-dark: #9E8FA6;
  --color-border-dark: #2A2433;

  /* --- State colors --- */
  --color-success: #34A872;
  --color-warning: #E6A817;
  --color-error: #E5484D;

  /* --- Typography --- */
  --font-heading: 'Instrument Serif', serif;
  --font-body: 'DM Sans', sans-serif;
  --text-h1: 400 clamp(2.25rem, 1.5rem + 3vw, 3.5rem) / 1.14 var(--font-heading);
  --text-h2: 400 clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem) / 1.2 var(--font-heading);
  --text-h3: 400 clamp(1.375rem, 1.1rem + 1.1vw, 1.75rem) / 1.29 var(--font-heading);
  --text-body: 400 clamp(1rem, 0.95rem + 0.25vw, 1.0625rem) / 1.65 var(--font-body);
  --text-caption: 400 0.875rem / 1.43 var(--font-body);
  --text-overline: 500 0.6875rem / 1.45 var(--font-body);
  --text-pullquote: italic 400 clamp(1.5rem, 1.2rem + 1.5vw, 2rem) / 1.375 var(--font-heading);
  --ls-h1: -0.02em;
  --ls-h2: -0.01em;
  --ls-overline: 0.12em;

  /* --- Spacing --- */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;

  /* --- Layout --- */
  --container-xl: 1280px;
  --container-editorial: 860px;
  --grid-columns: 12;
  --grid-gutter: 32px;
  --header-height: 72px;
  --section-padding-dark: 120px;
  --section-padding-light: 96px;

  /* --- Surfaces --- */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.04);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.06);
  --shadow-glow-gold: 0 0 0 1px #C9A96E;

  /* --- Motion --- */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 400ms ease;
  --ease-editorial: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 8. Промпт для AI-генерации фоновых изображений

```
Prompt (Midjourney v6.1):
"Dark moody abstract background, deep burgundy (#A31555) to black 
(#0F0B13) gradient, subtle film grain texture, single thin golden 
(#C9A96E) curved line flowing across frame, macro photography of 
hair strand cross-section reinterpreted as abstract art, deep depth 
of field, volumetric dark lighting, editorial fashion photography 
mood, no text, no people, cinematic aspect ratio --ar 16:9 --style raw --s 350"

Вариация для светлых секций:
"Minimal abstract illustration, warm ivory (#FFFAF5) background, 
single delicate rose-gold line drawing of organic cell-like form, 
inspired by scientific illustration of hair follicle bulb, thin precise 
linework, museum catalogue aesthetic, generous negative space, 
no text --ar 3:2 --style raw --s 100"
```

### 9. Антипаттерны — чего НЕ делать

- **Не превращать в «тёмный шаблон SaaS».** Тёмные секции должны чередоваться со светлыми в пропорции 40/60. Полностью тёмный сайт → потеря медицинской достоверности.
- **Не злоупотреблять gold-акцентом.** Gold — хирургическая деталь: иконка, разделитель, номер в статистике. Золотые градиентные кнопки = казино, не медицинская ассоциация.
- **Не ставить Instrument Serif на мелкий текст.** Этот шрифт работает только от 24px+. Весь body, caption, UI-текст — строго DM Sans. Иначе — нечитаемая каша.
- **Не использовать mesh-градиенты как на Dribbble-шотах.** Фоновый градиент должен быть едва заметным (opacity 5–15%), а не ярким неоновым сиянием. Subtlety is everything.
- **Не имитировать «ассиметричный editorial» бездумно.** Каждый ассиметричный блок должен иметь чёткую иерархию: большой элемент = главное, малый = поддержка. Хаотичная раскладка без логики — не editorial, а беспорядок.

---

## СТИЛЬ 3 — «SWISS PRECISION»

### 1. Философия

Нейтральный, структурированный, data-driven дизайн в традициях швейцарской типографики и скандинавского минимализма. Здесь нет декоративных эффектов — каждый пиксель обоснован функцией. Сетка жёсткая, типографика техничная, розовый логотип используется как единственный цветовой акцент на монохромном поле. **Этот стиль подходит трихологии, потому что он транслирует научную строгость и системность** — как рецензируемый журнал или справочник специалиста. Аудитория трихологов — практикующие врачи, которые ценят структурированную информацию, а не маркетинговые украшения. Моноширинный акцентный шрифт для данных создаёт ассоциацию с лабораторными протоколами и исследовательскими таблицами.

### 2. Цветовая палитра

| Токен | HEX | Назначение |
|---|---|---|
| **Primary** | `#D4637A` | Dusty rose — единственный тёплый акцент, только CTA и ключевые ссылки |
| **Primary Hover** | `#C05068` | Hover-состояние |
| **Primary Light** | `#F2E0E4` | Hover-фон, едва заметный акцент |
| **Secondary** | `#2C3340` | Dark slate — вторичные кнопки, заголовки секций |
| **Secondary Light** | `#4A5568` | Средний slate для иконок |
| **Tertiary** | `#8B9BB0` | Cool blue-grey — метаданные, timestamps, dividers |
| **Background** | `#FAFAFA` | Тёплый near-white (не чисто белый — мягче для глаз) |
| **Surface** | `#FFFFFF` | Карточки и возвышенные поверхности |
| **Surface Alt** | `#F0F1F3` | Альтернативные секции, группированные области |
| **Text Primary** | `#141414` | Максимальный контраст — заголовки, body |
| **Text Secondary** | `#5C6370` | Поддерживающий текст |
| **Text Accent** | `#D4637A` | Розовый для pull-quotes и активных ссылок |
| **Border** | `#DCDFE4` | Структурные границы |
| **Border Strong** | `#B8BEC8` | Акцентированные разделители, линии таблиц |

### 3. Типографика

**Пара шрифтов:** Space Grotesk (заголовки) + IBM Plex Sans (тело) + IBM Plex Mono (данные/акценты)

Space Grotesk — технический гротеск с архитектурным характером и негативным letter-spacing на крупных кеглях, создающий сжатый «плакатный» эффект в традициях Swiss Style. IBM Plex Sans — рабочая лошадка для плотного информационного контента, с отличной поддержкой кириллицы. IBM Plex Mono — для табличных данных, номеров и цифровых акцентов.

| Уровень | Размер (desktop) | Вес | Line-height | Letter-spacing |
|---|---|---|---|---|
| H1 | 48px | 700 | 56px | -0.025em |
| H2 | 34px | 600 | 40px | -0.015em |
| H3 | 24px | 600 | 32px | -0.01em |
| Body | 16px (IBM Plex Sans) | 400 | 28px | 0em |
| Caption | 13px | 500 | 20px | 0.01em |
| Overline | 11px | 500 | 16px | 0.1em, uppercase |
| Mono/Data | 14px (IBM Plex Mono) | 400 | 24px | 0em |
| Stat Number | 64px (Space Grotesk) | 700 | 1 | -0.03em |

**Mobile:** H1 → 32px/40px, H2 → 24px/32px, Body → 16px/26px.

### 4. Сетка и отступы

- **Колонки:** 12 (с жёсткой привязкой к сетке — никаких элементов «между линиями»)
- **Container max-width:** 1200px (уже, чем в других стилях — для усиления ощущения контроля)
- **Container prose:** 680px (для длинного текста, ~65 символов)
- **Gutter:** 24px
- **Section padding:** 80px top/bottom (desktop), 48px (mobile) — компактнее, чем в стилях 1 и 2
- **Spacing-токены:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px
- **Визуальная сетка:** опционально отображается на фоне (очень тонкие вертикальные линии `#F0F1F3`) для усиления «печатного» характера

### 5. Компоненты

**Кнопки:**
- Primary: `background: #D4637A`, `color: #FFF`, `border-radius: 6px` (подчёркнуто геометричный, не pill), `padding: 12px 24px`, `font-family: IBM Plex Sans`, `font-weight: 500`, `font-size: 14px`, `letter-spacing: 0.02em`. Hover: `background: #C05068`, без transform, без тени — чистая смена цвета.
- Secondary: `background: #2C3340`, `color: #FFF`, `border-radius: 6px`. Hover: `background: #4A5568`.
- Ghost: `background: transparent`, `border: 1.5px solid #DCDFE4`, `color: #2C3340`. Hover: `border-color: #B8BEC8`, `color: #141414`.

**Карточки:**
- Тип: **flat** — без тени, с чёткими границами. `background: #FFFFFF`, `border: 1px solid #DCDFE4`, `border-radius: 8px`, `box-shadow: none`. Hover: `border-color: #D4637A`, `transition: border-color 0.2s ease`. Эстетика — «карточка из каталога».
- Для feature-карточек: верхняя граница 3px `border-top: 3px solid #D4637A` как акцент.

**Навигация:**
- Static (не sticky) на homepage, sticky на внутренних страницах. Высота 64px. Белый фон `#FFFFFF`, нижняя граница `1px solid #DCDFE4`. Минимализм: логотип слева, пункты меню по центру (моноширинным мелким кеглем в overline-стиле: `НАУКА · ОБРАЗОВАНИЕ · УЧАСТНИКИ · СОБЫТИЯ`), CTA справа. **Нет backdrop-blur** — принципиальная позиция: это не glassmorphism-стиль.

**Hero-секция:**
- Split layout: слева — крупный H1 набранный Space Grotesk 700, занимающий 7 из 12 колонок, с тонким подзаголовком IBM Plex Sans 400. Справа (5 колонок) — структурированный блок с ключевыми цифрами в mono-шрифте, каждая цифра с подписью-caption под ней. Фон `#FAFAFA`, никаких изображений, никаких градиентов. Между текстом и цифрами — вертикальная линия-разделитель `#DCDFE4`. Внизу hero — горизонтальная тонкая линия на всю ширину.

**Теги/бейджи:**
- `border: 1px solid #DCDFE4`, `background: transparent`, `color: #5C6370`, `border-radius: 4px`, `padding: 2px 8px`, `font-family: IBM Plex Mono`, `font-size: 12px`, `letter-spacing: 0.02em`. Акцентный бейдж: `border-color: #D4637A`, `color: #D4637A`.

**Иконки:** Line-стиль, stroke-width 1.25px (тоньше стандартного 1.5). Библиотека: Tabler Icons или Feather Icons. Цвет: `#4A5568` по умолчанию. Размер: 20px (компактнее обычного 24px — швейцарская экономия пространства).

### 6. Micro-animations

1. **Появление элементов по сетке** — карточки появляются строго по grid-порядку (не все сразу). Каждый ряд — с задержкой 0.15s. `CSS @keyframes fadeInUp`, `opacity: 0→1`, `translateY(12px→0)`, `duration: 0.4s`, `ease: cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Минимальная амплитуда — 12px, не 24px. Лаконичность.
2. **Мерцание акцента при hover на карточке** — граница плавно меняет цвет с `#DCDFE4` на `#D4637A`. `CSS transition: border-color 0.25s ease`. Единственный hover-эффект — никаких трансформов, никаких теней.
3. **Печатный курсор** — на странице «О нас» подзаголовок набирается «как на печатной машинке»: побуквенное появление текста mono-шрифтом. **Framer Motion** `animate` + `staggerChildren: 0.03`. Одноразово, при первом просмотре.

### 7. CSS-переменные

```css
:root {
  /* --- Colors --- */
  --color-primary: #D4637A;
  --color-primary-hover: #C05068;
  --color-primary-light: #F2E0E4;
  --color-secondary: #2C3340;
  --color-secondary-light: #4A5568;
  --color-tertiary: #8B9BB0;
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F0F1F3;
  --color-text-primary: #141414;
  --color-text-secondary: #5C6370;
  --color-text-accent: #D4637A;
  --color-border: #DCDFE4;
  --color-border-strong: #B8BEC8;
  --color-success: #3D9A6E;
  --color-warning: #D4A024;
  --color-error: #C53030;
  --color-info: #3182CE;

  /* --- Typography --- */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --text-h1: 700 clamp(2rem, 1.3rem + 2.8vw, 3rem) / 1.17 var(--font-heading);
  --text-h2: 600 clamp(1.5rem, 1.1rem + 1.6vw, 2.125rem) / 1.18 var(--font-heading);
  --text-h3: 600 clamp(1.25rem, 1.05rem + 0.8vw, 1.5rem) / 1.33 var(--font-heading);
  --text-body: 400 1rem / 1.75 var(--font-body);
  --text-caption: 500 0.8125rem / 1.54 var(--font-body);
  --text-overline: 500 0.6875rem / 1.45 var(--font-body);
  --text-mono: 400 0.875rem / 1.71 var(--font-mono);
  --text-stat: 700 clamp(2.5rem, 2rem + 2vw, 4rem) / 1 var(--font-heading);
  --ls-h1: -0.025em;
  --ls-h2: -0.015em;
  --ls-h3: -0.01em;
  --ls-overline: 0.1em;
  --ls-stat: -0.03em;

  /* --- Spacing --- */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  /* --- Layout --- */
  --container-xl: 1200px;
  --container-prose: 680px;
  --grid-columns: 12;
  --grid-gutter: 24px;
  --header-height: 64px;
  --section-padding: 80px;

  /* --- Surfaces --- */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  /* Этот стиль принципиально минимизирует тени */

  /* --- Motion --- */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
  --ease-swiss: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 8. Промпт для AI-генерации фоновых изображений

```
Prompt (Midjourney v6.1):
"Minimal Swiss style poster composition, pure white (#FAFAFA) background, 
precise geometric grid lines in very light grey (#F0F1F3), single dusty 
rose (#D4637A) circle placed according to golden ratio, inspired by 
Josef Müller-Brockmann grid systems, clean vector aesthetic, no texture 
no noise, mathematical precision, Bauhaus influence --ar 16:9 --style raw --s 50"

Вариация для текстурного элемента:
"Scientific diagram of hair follicle anatomy, technical illustration style, 
thin precise black lines on white background, labeled cross-section, 
medical textbook aesthetic, clean linework, no color except single dusty 
rose (#D4637A) highlight on one element, patent drawing style 
--ar 4:3 --style raw --s 25"
```

### 9. Антипаттерны — чего НЕ делать

- **Не добавлять градиенты, glow-эффекты или glassmorphism.** Этот стиль — осознанный аскетизм. Любой декоративный эффект разрушает философию. Если хочется «оживить» — добавьте ещё одну информационную деталь, а не визуальную.
- **Не использовать больше одного цветового акцента.** Dusty rose (#D4637A) — единственный тёплый цвет на всём сайте. Если появляется второй яркий цвет — пропадает «швейцарская» чистота.
- **Не делать карточки с rounded corners > 8px.** Скруглённые углы 16–24px — это friendly SaaS. Здесь нужна геометрическая точность. 6–8px максимум.
- **Не ставить hero-изображение.** Hero этого стиля — типографика + данные. Фотография в hero разрушит концепцию. Изображения появляются ниже, в контентных секциях, и строго внутри grid-ячеек.
- **Не анимировать агрессивно.** Максимальная амплитуда любого translateY — 12px. Максимальная длительность — 0.4s. Никаких spring-анимаций, никаких bouncing-эффектов. Движение должно быть едва заметным — как секундная стрелка швейцарских часов.

---

## СРАВНИТЕЛЬНАЯ ТАБЛИЦА

| Параметр | Clinical Aura | Editorial Luxe | Swiss Precision |
|---|---|---|---|
| **Тональность** | Дружелюбно-клинический | Премиальный-авторитетный | Строго-академический |
| **Фон** | Белый | Тёмный ↔ тёплый off-white | Near-white #FAFAFA |
| **Шрифт заголовков** | Plus Jakarta Sans (sans) | Instrument Serif (serif) | Space Grotesk (sans) |
| **Главный приём** | Glassmorphism + 3D | Контраст тёмного/светлого | Типографическая сетка |
| **Карточки** | Elevated + glass | Flat с hover-glow | Flat с border |
| **Иконки** | Line 1.5px | Duotone | Line 1.25px |
| **Анимации** | Scroll reveal + счётчики | Параллакс + линия | Grid-порядок + hover |
| **Max-width** | 1280px | 1280px | 1200px |
| **Атмосфера** | SaaS для врачей | Медицинский Vogue | Nature Scientific Reports |
| **Риск** | «Как все health-tech» | «Слишком пафосно» | «Слишком сухо» |

---

## РЕКОМЕНДАЦИЯ

### Какой стиль понравится заказчику

Судя по четырём референсам, заказчик тяготеет к **современным визуальным эффектам**: glassmorphism, 3D-элементы, градиенты, крупная типографика с воздухом. Три из четырёх референсов содержат glassmorphism и 3D-объекты, а два — тёмные фоны или насыщенные градиенты. Это указывает на желание видеть **яркий, визуально впечатляющий результат**.

**С наибольшей вероятностью заказчик выберет Clinical Aura (Стиль 1)**. Он напрямую отвечает на референсы Melbourne Biology (glassmorphism + 3D + белый) и Sensora (медицинская чистота), сохраняя достаточный wow-фактор через стеклянные карточки и анимированные сферы. При этом стиль не уходит в рискованную территорию тёмных фонов, которые могут вызвать сомнения у медицинской аудитории.

**Как сильный альтернативный вариант — Editorial Luxe (Стиль 2)**. Он закрывает оставшиеся два референса (Mental Harmony + Invest Firm) и выглядит наиболее запоминающимся. Тёмные hero-блоки с серифным шрифтом создают ощущение «мы не как все медицинские сайты», что может сработать на заказчика, который хочет выделиться.

### Какой стиль покажет Mediann как сильное студио

**Editorial Luxe (Стиль 2)** — однозначно. Этот стиль требует тончайшего вкуса в работе с типографикой, ритмом секций и цветовыми нюансами. Его невозможно «случайно сделать хорошо» — это дизайн, который показывает класс руки. Серифно-гротескная пара Instrument Serif + DM Sans, кинематографическая смена тёмных и светлых секций, хирургическое использование champagne-gold и deep rose — всё это сигнализирует потенциальным клиентам Mediann: «эта студия умеет делать премиальный продукт, а не натягивать шаблон».

**Оптимальная стратегия презентации:** показать все три как «лестницу эскалации» — от безопасного (Стиль 1) через показательный (Стиль 2) до провокационного (Стиль 3). Представить Стиль 2 как основную рекомендацию с аргументацией «это выделит Ассоциацию на фоне всех медицинских сайтов в рунете», а Стиль 1 — как надёжный fallback, если заказчик выберет безопасность. Стиль 3 работает как proof-of-range: он показывает, что студия может мыслить в принципиально разных визуальных языках, а не генерировать вариации одного тренда.

**Финальная рекомендация: строить на базе Стиля 2 с элементами Стиля 1** — серифные заголовки + glassmorphism навигация + тёмный hero, но основные контентные секции на тёплом светлом фоне. Это даёт максимальную узнаваемость бренда и максимальный портфолийный потенциал для студии.