# План актуализации клиентского фронтенда

## Проект: «Ассоциация трихологов» — связка frontend ↔ backend API

**Дата:** 2026-03-03  
**Цель:** Поэтапно заменить все моки на реальные API-вызовы и дополнить недостающие страницы/поля.  
**Входные данные:** `04_Backend_API.md`, `07_Фронтенд_клиент.md`, анализ `frontend/src/`

---

## Текущее состояние

| Категория | Файлов | На моках | Статичных (без API) |
|-----------|--------|----------|---------------------|
| Публичные страницы | 10 | 8 | 2 |
| Авторизация | 5 | 1 | 4 |
| Онбординг | 3 | 1 | 2 |
| Кабинет | 10 | 4 | 6 |
| **Итого** | **28** | **14** | **14** |

**Инфраструктура (готово):** `apiClient` (axios + interceptors + refresh), `API_ENDPOINTS`, `ROUTES`, FSD-архитектура entities, React Query.

---

## Этапы и промпты

---

### ЭТАП 0: Инфраструктура и типы

---

#### Промпт 0.1 — Обновить API_ENDPOINTS и типы

```
Обнови файл frontend/src/shared/config/apiEndpoints.ts — 
добавь недостающие endpoints из ТЗ (04_Backend_API.md):

1. EVENTS — добавить:
   - GALLERIES: (eventId: string) => `/api/v1/events/${eventId}/galleries`
   - RECORDINGS: (eventId: string) => `/api/v1/events/${eventId}/recordings`
   - CONFIRM_GUEST: (eventId: string) => `/api/v1/events/${eventId}/confirm-guest-registration`
2. DOCUMENTS — добавить:
   - BY_SLUG: (slug: string) => `/api/v1/organization-documents/${slug}`
3. AUTH — добавить:
   - LOGOUT: "/api/v1/auth/logout"
   - CONFIRM_EMAIL_CHANGE: "/api/v1/auth/confirm-email-change"
4. PROFILE — добавить:
   - EVENTS: "/api/v1/profile/events"
   - DIPLOMA_PHOTO: "/api/v1/profile/diploma-photo"
5. PAYMENTS — добавить:
   - STATUS: (id: string) => `/api/v1/payments/${id}/status`
6. VOTING — изменить на:
   - ACTIVE: "/api/v1/voting/active"
   - VOTE: (sessionId: string) => `/api/v1/voting/${sessionId}/vote`
7. SEO — изменить на:
   - BY_SLUG: (slug: string) => `/api/v1/seo/${slug}`
8. Добавить:
   - ARTICLE_THEMES: "/api/v1/article-themes"
   - SPECIALIZATIONS: "/api/v1/specializations" (если появится)

Также обнови типы во всех файлах entities/*/types.ts — привести 
в соответствие с Response-схемами из 04_Backend_API.md:
- Doctor: добавить поля slug, seo, content_blocks
- Event: обновить структуру tariffs (добавить description, benefits[]), 
  galleries, recordings (video_source, video_playback_url), content_blocks
- Article: добавить themes[], seo, content_blocks
- Subscription: обновить по GET /subscriptions/status (has_paid_entry_fee, 
  can_renew, next_action)
- Payment: добавить payment_provider, partially_refunded
- Certificate: добавить certificate_type (member/event), event

Не меняй API-слой (xxxApi.ts) — на этом этапе только типы и endpoints.
```

---

#### Промпт 0.2 — Создать недостающие entity-модули

```
Создай недостающие entity-модули в frontend/src/entities/ по FSD:

1. entities/document/
   - types.ts: OrganizationDocument (id, title, slug, content, file_url, 
     content_blocks[], is_active, sort_order)
   - api/documentApi.ts: getList() → GET /organization-documents, 
     getBySlug(slug) → GET /organization-documents/{slug}
   - model/useDocument.ts: useDocuments(), useDocument(slug)
   - index.ts: реэкспорт

2. entities/certificate/
   - types.ts: Certificate (id, certificate_type, year, event, 
     certificate_number, is_active, generated_at, download_url)
   - api/certificateApi.ts: getList() → GET /certificates, 
     download(id) → GET /certificates/{id}/download
   - model/useCertificate.ts: useCertificates()
   - index.ts

3. entities/payment/
   - types.ts: Payment (id, amount, product_type, payment_provider, 
     status, description, created_at, receipt_url)
   - api/paymentApi.ts: getList() → GET /payments, 
     getReceipt(id) → GET /payments/{id}/receipt,
     getStatus(id) → GET /payments/{id}/status
   - model/usePayment.ts: usePayments(), usePaymentStatus(id)
   - index.ts

4. entities/voting/
   - types.ts: VotingSession, VotingCandidate
   - api/votingApi.ts: getActive() → GET /voting/active, 
     vote(sessionId, candidateId) → POST /voting/{sessionId}/vote
   - model/useVoting.ts: useActiveVoting(), useVoteMutation()
   - index.ts

5. entities/telegram/
   - types.ts: TelegramBinding, GenerateCodeResponse
   - api/telegramApi.ts: getBinding() → GET /telegram/binding, 
     generateCode() → POST /telegram/generate-code
   - model/useTelegram.ts: useTelegramBinding(), useGenerateCode()
   - index.ts

6. entities/subscription/
   - api/subscriptionApi.ts (сейчас его нет): 
     getStatus() → GET /subscriptions/status,
     getPlans() → GET /subscriptions/plans,
     pay(planId, idempotencyKey) → POST /subscriptions/pay
   - Обновить useSubscription.ts: заменить моки на subscriptionApi

Все API-модули используют apiClient из @/shared/api. 
Хуки используют React Query (@tanstack/react-query).
Пока что оставить fallback на моки через env-переменную 
NEXT_PUBLIC_USE_MOCKS=true — если true, возвращать моки, иначе реальный API.
```

---

### ЭТАП 1: Авторизация и онбординг

---

#### Промпт 1.1 — Авторизация (auth)

```
Подключи реальные API-вызовы на страницах авторизации:

1. src/app/(auth)/register/page.tsx:
   - POST /api/v1/auth/register { email, password }
   - Обработка ошибок: EMAIL_ALREADY_EXISTS (409)
   - После успеха: показать "Проверьте почту"

2. src/app/(auth)/login/page.tsx:
   - POST /api/v1/auth/login { email, password }
   - Сохранить access_token в sessionStorage
   - Сохранить user в AuthProvider
   - Редирект: если onboarding не завершён → /onboarding/role, иначе /cabinet
   - Обработка ошибок: INVALID_CREDENTIALS (401)

3. src/app/(auth)/confirm-email/page.tsx:
   - POST /api/v1/auth/verify-email { token } (из query params)
   - Показать loading → success → redirect /login, или error state

4. src/app/(auth)/forgot-password/page.tsx:
   - POST /api/v1/auth/forgot-password { email }
   - Всегда показывать "Если аккаунт существует, письмо отправлено"

5. src/app/(auth)/reset-password/page.tsx:
   - POST /api/v1/auth/reset-password { token, new_password }
   - token из query params
   - После успеха: toast + redirect /login

6. Обновить AuthProvider:
   - login(token, user): сохранить, обновить состояние
   - logout(): POST /api/v1/auth/logout, очистить sessionStorage, redirect /login
   - При монтировании: если есть token — проверить валидность 
     (GET /onboarding/status или profile), если 401 — очистить

7. Обновить middleware.ts:
   - Для защищённых маршрутов (/cabinet/*, /onboarding/*): 
     проверить наличие токена (cookie или header), 
     если нет → redirect /login?redirect={current_path}
```

---

#### Промпт 1.2 — Онбординг

```
Подключи API на страницах онбординга:

1. src/app/onboarding/role/page.tsx:
   - При загрузке: GET /api/v1/onboarding/status → определить next_step
   - Если next_step != 'choose_role' → redirect на нужный шаг
   - При выборе роли: POST /api/v1/onboarding/choose-role { role: "doctor" | "user" }
   - Если "user" → redirect /cabinet
   - Если "doctor" → redirect /onboarding/profile

2. src/app/onboarding/profile/page.tsx:
   - При загрузке: GET /api/v1/onboarding/status → проверить next_step
   - Города: GET /api/v1/cities (заменить мок useCities на реальный)
   - Сохранение профиля: PATCH /api/v1/onboarding/doctor-profile { данные формы }
   - Загрузка документов: POST /api/v1/onboarding/documents (multipart/form-data)
   - Отправка заявки: POST /api/v1/onboarding/submit
   - Redirect → /onboarding/pending

3. src/app/onboarding/pending/page.tsx:
   - При загрузке: GET /api/v1/onboarding/status
   - Если status = approved → redirect /cabinet (или /cabinet/payments если не оплачен взнос)
   - Если status = rejected → показать причину и кнопку "Исправить" → /onboarding/profile
   - Показать дату подачи из submitted_at
```

---

### ЭТАП 2: Публичные страницы

---

#### Промпт 2.1 — Каталог и профиль врача

```
Подключи реальные API в каталоге врачей:

1. src/entities/doctor/api/doctorApi.ts:
   - getList(filters): заменить мок на apiClient.get(API_ENDPOINTS.DOCTORS.LIST, { params })
     Параметры: limit (вместо per_page), offset, city_id, city_slug, specialization, search
   - getById(id): заменить на apiClient.get(API_ENDPOINTS.DOCTORS.BY_ID(id))
   - getCities(): заменить на apiClient.get(API_ENDPOINTS.CITIES, { params: { with_doctors: true } })

2. src/entities/doctor/types.ts — обновить:
   - DoctorResponseSchema: добавить slug, position, content_blocks[], seo {}
   - DoctorListResponseSchema: { data: [], total, limit, offset } вместо { items, total, page, per_page }
   - Добавить CityResponseSchema: { id, name, slug, doctors_count? }

3. src/app/doctors/page.tsx:
   - Использовать offset-based пагинацию (limit + offset) вместо page-based
   - Города в фильтре: показывать только с doctors_count > 0
   - URL фильтров через searchParams (город, поиск)

4. src/app/doctors/[id]/page.tsx:
   - Поддержать slug в URL: если параметр — slug, использовать 
     getBySlug; если UUID — getById
   - Добавить SEO metadata из seo объекта (Next.js generateMetadata)
   - Добавить рендер content_blocks[] после основного контента

5. src/entities/doctor/DoctorCard.tsx:
   - Использовать slug для URL: ROUTES.DOCTOR(doctor.slug || doctor.id)
   - Добавить поле specializations (множ. число) если оно вернётся из API
```

---

#### Промпт 2.2 — Мероприятия

```
Подключи реальные API для мероприятий:

1. src/entities/event/api/eventApi.ts:
   - getList(filters): apiClient.get(API_ENDPOINTS.EVENTS.LIST, { params: { period, limit, offset } })
   - getBySlug(slug): apiClient.get(API_ENDPOINTS.EVENTS.BY_SLUG(slug))
   - checkPrice(eventId, tariffId): apiClient.get(API_ENDPOINTS.EVENTS.CHECK_PRICE(eventId), { params: { tariff_id: tariffId } })
   - register(eventId, data): apiClient.post(API_ENDPOINTS.EVENTS.REGISTER(eventId), data)
   - getGalleries(eventId): apiClient.get(API_ENDPOINTS.EVENTS.GALLERIES(eventId))
   - getRecordings(eventId): apiClient.get(API_ENDPOINTS.EVENTS.RECORDINGS(eventId))

2. src/entities/event/types.ts — обновить по ТЗ:
   - EventTariff: добавить description, benefits: string[]
   - EventRecording: добавить video_source ('uploaded'|'external'), 
     video_playback_url, video_file_key
   - EventResponseSchema: добавить content_blocks[], user_registration, seo
   - EventListResponseSchema: { data, total, limit, offset }

3. src/app/events/page.tsx:
   - Offset-based пагинация
   - Использовать slug в ссылках (event.slug)

4. src/app/events/[slug]/page.tsx:
   - SEO через generateMetadata (из seo объекта)
   - Блок тарифов: показать description и benefits[]
   - Регистрация: POST /events/{id}/register с idempotency_key
   - Проверка цены: GET /events/{id}/check-price?tariff_id=...
   - Для гостя: модалка регистрации (email, full_name, workplace, specialization)
   - Галереи: GET /events/{id}/galleries
   - Записи: GET /events/{id}/recordings — video_playback_url (presigned или external)
   - Рендер content_blocks[]
   - user_registration: если уже зарегистрирован — показать статус вместо кнопки
```

---

#### Промпт 2.3 — Статьи и документы

```
Подключи реальные API для статей и документов:

1. src/entities/article/api/articleApi.ts:
   - getList(params): apiClient.get(API_ENDPOINTS.ARTICLES.LIST, { params: { limit, offset, theme_id } })
   - getBySlug(slug): apiClient.get(API_ENDPOINTS.ARTICLES.BY_SLUG(slug))
   - getThemes(): apiClient.get(API_ENDPOINTS.ARTICLE_THEMES)

2. src/entities/article/types.ts:
   - Добавить themes: { id, slug, title }[], seo {}, content_blocks[]
   - ArticleListResponseSchema: { data, total, limit, offset }

3. src/app/articles/page.tsx:
   - Добавить фильтр по темам (GET /article-themes для списка)
   - Offset-based пагинация

4. src/app/articles/[slug]/page.tsx:
   - SEO generateMetadata
   - Рендер content_blocks[] после основного content
   - Показать теги/темы статьи

5. src/entities/document/ (новый модуль из промпта 0.2):
   - Подключить на странице documents/page.tsx
   - Заменить mockDocuments на useDocuments()

6. Добавить src/app/documents/[slug]/page.tsx:
   - GET /organization-documents/{slug}
   - Рендер content + file_url + content_blocks[]

7. Обновить ROUTES: добавить DOCUMENT: (slug: string) => `/documents/${slug}`
```

---

#### Промпт 2.4 — Главная страница и SEO

```
Обнови главную страницу и SEO:

1. src/app/page.tsx:
   - Заменить моки useEvents → реальный API (limit=3, period=upcoming)
   - Заменить моки useArticles → реальный API (limit=3)
   - Hero-блок и миссия: пока захардкодить (endpoints NOT IMPLEMENTED по ТЗ)
   - Блок "Стать членом ассоциации": логика видимости по auth-состоянию

2. Создать shared/lib/seo.ts:
   - Функция buildMetadata(seoData, defaults): Metadata — 
     из SEO-объекта API в Next.js Metadata
   - Использовать во всех generateMetadata

3. Обновить layout.tsx:
   - Дефолтная metadata из site_settings (пока захардкодить)
   - Open Graph defaults

4. Для каждой публичной страницы, где есть SSR:
   - generateMetadata с вызовом GET /seo/{slug} (doctors, events, articles, documents)
   - Если endpoint вернул 404 — использовать defaults
```

---

### ЭТАП 3: Личный кабинет

---

#### Промпт 3.1 — Кабинет: главная, личная информация, публичный профиль

```
Подключи API на страницах кабинета (часть 1):

1. src/app/cabinet/page.tsx (дашборд):
   - GET /subscriptions/status → useSubscriptionStatus()
   - GET /profile/events → useProfileEvents() (новый хук)
   - Показать: статус подписки, ближайшие мероприятия с регистрациями
   - Если has_paid_entry_fee = false → баннер "Оплатите вступительный взнос"
   - Если next_action = 'renew' → баннер "Продлите подписку"

2. src/app/cabinet/personal/page.tsx:
   - Загрузка: GET /profile/personal → заполнить форму
   - Сохранение: PATCH /profile/personal { измененные поля }
   - Загрузка фото диплома: POST /profile/diploma-photo (multipart)
   - Показать documents[] из ответа (загруженные документы)
   - Поля из ТЗ: first_name, last_name, middle_name, phone, passport_data,
     registration_address, city, clinic_name, position, specialization, 
     academic_degree, diploma_photo_url, colleague_contacts

3. src/app/cabinet/public/page.tsx:
   - Загрузка: GET /profile/public
   - Показать pending_draft если есть (жёлтая плашка "На модерации")
   - Сохранение: PATCH /profile/public { измененные поля }
   - Обработка 409 DRAFT_ALREADY_PENDING
   - Загрузка фото: POST /profile/photo (multipart)
   - Города: GET /cities (реальный API)
```

---

#### Промпт 3.2 — Кабинет: подписки и платежи

```
Подключи API для подписок и платежей:

1. src/app/cabinet/payments/page.tsx:
   - Блок подписки: GET /subscriptions/status
     Показать plan.name, status, starts_at, ends_at, days_remaining, 
     прогресс-бар (days_remaining / total_days)
   - Если has_paid_entry_fee = false: кнопка "Оплатить вступительный взнос"
   - Если can_renew = true: кнопка "Продлить подписку"
   - Тарифы: GET /subscriptions/plans — показать доступные (is_available = true)
   - Оплата: POST /subscriptions/pay { plan_id, idempotency_key }
     → redirect на payment_url
   - Таблица платежей: GET /payments
     Колонки: дата, описание (product_type), сумма, статус, чек
   - Чек: GET /payments/{id}/receipt → открыть receipt_url в новой вкладке
   - Обработка ошибок: MEDICAL_DIPLOMA_REQUIRED (422)

2. src/app/payment/success/page.tsx:
   - Если есть payment_id в query: GET /payments/{id}/status → показать 
     реальные данные (сумму, описание)
   - Polling: каждые 3 сек до status = succeeded, максимум 10 попыток
   - Если polling не дал succeeded → "Платёж обрабатывается"

3. src/app/payment/fail/page.tsx:
   - Если есть payment_id: GET /payments/{id}/status → показать причину
   - Кнопка "Попробовать снова" → repeat POST /subscriptions/pay
```

---

#### Промпт 3.3 — Кабинет: мероприятия и сертификаты

```
Подключи API для мероприятий и сертификатов в ЛК:

1. src/app/cabinet/events/page.tsx:
   - Мои регистрации: GET /profile/events → useProfileEvents()
   - Показать: название мероприятия, дата, тариф, статус регистрации
   - Ссылка на мероприятие: /events/{slug}
   - Upcoming-события: GET /events?period=upcoming&limit=3
   - Empty state: "Вы ещё не записались ни на одно мероприятие"

2. src/app/cabinet/certificate/page.tsx:
   - GET /certificates → useCertificates()
   - Показать список: certificate_type (member/event), номер, год, 
     дата выдачи, статус
   - Для event-сертификатов: показать event.title
   - Кнопка "Скачать PDF": GET /certificates/{id}/download → 
     window.open(redirect_url)
   - Если нет сертификатов (или нет подписки): 
     "Сертификат будет доступен после оплаты членского взноса"
```

---

#### Промпт 3.4 — Кабинет: Telegram и голосование

```
Подключи API для Telegram и голосования:

1. src/app/cabinet/telegram/page.tsx:
   - При загрузке: GET /telegram/binding → useTelegramBinding()
   - Если is_linked = true: показать tg_username, статус канала
   - Если не привязан: кнопка "Получить код"
   - По клику: POST /telegram/generate-code
     Показать auth_code, bot_link, expires_at (таймер обратного отсчёта)
   - Кнопка "Скопировать код" → clipboard
   - Ссылка "Открыть Telegram-бота" → bot_link

2. src/app/cabinet/voting/page.tsx:
   - GET /voting/active → useActiveVoting()
   - Если 404 → "Активных голосований нет"
   - Если has_voted = true → "Вы уже проголосовали" + (опционально) результаты
   - Если есть активное голосование:
     Показать title, description, candidates[]
     Радио-кнопки для выбора кандидата (фото, имя, программа)
     Кнопка "Проголосовать" → модалка подтверждения "Вы уверены?"
     POST /voting/{sessionId}/vote { candidate_id }
     Обработка 409 ALREADY_VOTED
     После успеха: "Ваш голос учтён" ✓
```

---

#### Промпт 3.5 — Кабинет: настройки аккаунта

```
Подключи API для настроек:

1. src/app/cabinet/settings/page.tsx:
   - Секция "Смена email":
     POST /auth/change-email { new_email, current_password }
     → "Письмо с подтверждением отправлено на новый email"
   - Секция "Смена пароля":
     POST /auth/change-password { current_password, new_password }
     → toast "Пароль изменён"
   - Текущий email: из useAuth() → user.email
   - Валидация: пароль min 8, 1 цифра + 1 буква
```

---

### ЭТАП 4: Общие компоненты

---

#### Промпт 4.1 — Content Blocks рендерер

```
Создай компонент для рендеринга content_blocks:

1. src/components/content-blocks/ContentBlockRenderer.tsx:
   - Принимает: blocks: ContentBlock[]
   - Рендерит по block_type:
     - text: <h2>{title}</h2> + <div className="prose" dangerouslySetInnerHTML={content} />
     - image: <figure><img src={media_url} alt={block_metadata.alt} /><figcaption>{block_metadata.caption}</figcaption></figure>
     - video: <VideoEmbed url={media_url} provider={block_metadata.provider} thumbnail={thumbnail_url} />
     - gallery: сетка изображений из block_metadata.images[]
     - link: <a href={link_url}>{link_label || title}</a> (стилизация как кнопка)
   - Фильтрация по device_type: useMediaQuery для mobile/desktop
   - Порядок: блоки уже отсортированы

2. src/components/content-blocks/VideoEmbed.tsx:
   - YouTube: iframe https://youtube.com/embed/{id}
   - VK Video: iframe
   - Rutube: iframe
   - Fallback: <video src={url} />

3. Типы:
   - ContentBlock { id, block_type, sort_order, title, content, 
     media_url, thumbnail_url, link_url, link_label, device_type, 
     block_metadata }

4. Использовать на страницах:
   - doctors/[id] — после контактов
   - events/[slug] — после основных блоков
   - articles/[slug] — после content
   - documents/[slug] — после content
```

---

#### Промпт 4.2 — Header/Footer и навигация

```
Обнови Header и Footer:

1. src/widgets/header/Header.tsx:
   - Использовать useAuth() для условного рендера:
     Гость: [Войти] [Стать членом]
     Авторизован: [Личный кабинет] [Выход]
   - Навигация: Врачи, Мероприятия, Статьи, Документы
   - Мобильное меню (бургер)

2. src/widgets/footer/Footer.tsx:
   - Контакты: пока из env (NEXT_PUBLIC_CONTACT_*) 
     или захардкодить (settings/public NOT IMPLEMENTED)
   - Ссылки на соцсети, бота

3. src/widgets/cabinet-sidebar/CabinetSidebar.tsx:
   - Активный пункт по текущему маршруту
   - Пункты: Главная, Личная информация, Публичный профиль, 
     Подписки и платежи, Мероприятия, Сертификат, Telegram, 
     Голосование, Настройки
   - Badge на "Голосование" если есть активное голосование (опционально)

4. src/middleware.ts:
   - Реализовать защиту маршрутов:
     /cabinet/* → если нет токена, redirect /login?redirect=...
     /onboarding/* → если нет токена, redirect /login
     /login, /register → если есть токен, redirect /cabinet
```

---

### ЭТАП 5: Финализация

---

#### Промпт 5.1 — Страницы ошибок, loading, SEO

```
Добавь страницы ошибок и loading:

1. src/app/not-found.tsx — кастомная 404 страница
2. src/app/error.tsx — кастомная страница ошибки
3. src/app/loading.tsx — глобальный loading (skeleton)

4. Для каждой динамической страницы добавить loading.tsx:
   - doctors/[id]/loading.tsx
   - events/[slug]/loading.tsx
   - articles/[slug]/loading.tsx
   - documents/[slug]/loading.tsx

5. sitemap.ts (Next.js):
   - generateSitemaps() для статичных и динамических страниц
   - Или проксировать /sitemap.xml на backend GET /sitemap.xml

6. robots.ts:
   - Или проксировать на backend GET /robots.txt
```

---

#### Промпт 5.2 — Убрать моки и финальная проверка

```
Финальная чистка:

1. Удалить или перенести все файлы из src/shared/mocks/ в тестовую папку
2. Убрать NEXT_PUBLIC_USE_MOCKS из .env (или оставить для тестов)
3. Проверить что все API-вызовы используют apiClient + API_ENDPOINTS
4. Проверить что все формы имеют:
   - loading state (кнопка disabled + spinner)
   - error handling (toast с сообщением из API)
   - success feedback (toast или redirect)
5. Проверить адаптивность (mobile/tablet/desktop)
6. Проверить что токен обновляется при 401 (refresh flow)
7. Проверить что middleware корректно защищает маршруты
```

---

## Порядок реализации

| # | Этап | Промпты | Зависит от |
|---|------|---------|------------|
| 0 | Инфраструктура | 0.1, 0.2 | — |
| 1 | Авторизация + онбординг | 1.1, 1.2 | 0 |
| 2 | Публичные страницы | 2.1, 2.2, 2.3, 2.4 | 0 |
| 3 | Личный кабинет | 3.1, 3.2, 3.3, 3.4, 3.5 | 0, 1 |
| 4 | Общие компоненты | 4.1, 4.2 | 0 |
| 5 | Финализация | 5.1, 5.2 | 1–4 |

Этапы 1 и 2 можно делать параллельно. Этап 3 требует готовой авторизации.

---

## Карта соответствия: страница → API

| Страница | API endpoints | Статус |
|----------|---------------|--------|
| `/` (главная) | `GET /events`, `GET /articles` | На моках |
| `/doctors` | `GET /doctors`, `GET /cities?with_doctors=true` | На моках |
| `/doctors/{id}` | `GET /doctors/{id}` | На моках |
| `/events` | `GET /events` | На моках |
| `/events/{slug}` | `GET /events/{slug}`, `GET /events/{id}/check-price`, `POST /events/{id}/register`, `GET /events/{id}/galleries`, `GET /events/{id}/recordings` | На моках |
| `/articles` | `GET /articles`, `GET /article-themes` | На моках |
| `/articles/{slug}` | `GET /articles/{slug}` | На моках |
| `/documents` | `GET /organization-documents` | На моках |
| `/documents/{slug}` | `GET /organization-documents/{slug}` | **Не реализовано** |
| `/login` | `POST /auth/login` | Мок |
| `/register` | `POST /auth/register` | setTimeout |
| `/confirm-email` | `POST /auth/verify-email` | setTimeout |
| `/forgot-password` | `POST /auth/forgot-password` | setTimeout |
| `/reset-password` | `POST /auth/reset-password` | setTimeout |
| `/onboarding/role` | `GET /onboarding/status`, `POST /onboarding/choose-role` | Статичное |
| `/onboarding/profile` | `PATCH /onboarding/doctor-profile`, `POST /onboarding/documents`, `POST /onboarding/submit`, `GET /cities` | Частично мок |
| `/onboarding/pending` | `GET /onboarding/status` | Статичное |
| `/cabinet` | `GET /subscriptions/status`, `GET /profile/events` | На моках |
| `/cabinet/personal` | `GET /profile/personal`, `PATCH /profile/personal`, `POST /profile/diploma-photo` | Мок inline |
| `/cabinet/public` | `GET /profile/public`, `PATCH /profile/public`, `POST /profile/photo`, `GET /cities` | Мок inline |
| `/cabinet/payments` | `GET /subscriptions/status`, `GET /subscriptions/plans`, `POST /subscriptions/pay`, `GET /payments`, `GET /payments/{id}/receipt` | На моках |
| `/cabinet/events` | `GET /profile/events`, `GET /events?period=upcoming` | Мок inline |
| `/cabinet/certificate` | `GET /certificates`, `GET /certificates/{id}/download` | Мок |
| `/cabinet/telegram` | `GET /telegram/binding`, `POST /telegram/generate-code` | Статичное |
| `/cabinet/settings` | `POST /auth/change-email`, `POST /auth/change-password` | Мок inline |
| `/cabinet/voting` | `GET /voting/active`, `POST /voting/{sessionId}/vote` | Мок inline |
| `/payment/success` | `GET /payments/{id}/status` | Статичное |
| `/payment/fail` | `GET /payments/{id}/status` | Статичное |
