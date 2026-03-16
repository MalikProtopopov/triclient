# Доработки бэкенда: публичные API

Результат аудита Swagger (`/docs`) vs требований фронтенда.
Фронт ожидает эти поля/эндпоинты — без них функционал либо сломан, либо заглушен хардкодом.

---

## 1. Отсутствующие эндпоинты

### 1.1 `GET /api/v1/auth/me` (auth required)

Нужен для ролей и динамического сайдбара кабинета.
Фронт уже написан под этот контракт.

**Ожидаемый ответ:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "doctor",          // "doctor" | "user"
  "is_staff": false,
  "sidebar_sections": ["cabinet", "personal", "public", "payments", "events", "certificate", "telegram", "settings", "voting"]
}
```

`sidebar_sections` — массив ключей разделов ЛК, доступных пользователю.
Для doctor — все разделы, для user — минимальный набор (`cabinet`, `events`, `settings`).

---

### 
Я думаю для страницы правление надо сделать отдельное поле с параметром - Правление True False - чтобы только с админки устанавливалась она. в админке у врачей надо сделать значит логику "правление" да нет и чтобы в круд запросах отправлялось, чтобы список врачей или пользователей платформы - фильтровались по этому параметру а также чтобы я мог в рамках функционала проекта указать на клиентском апи списка врачей- фильтрацию по квери параметру да нет - правление ключ чтобы на этой странице именно сделать функционал вывода списка врачей с фильтров кто именно в правление входит чтобы именно их вывести на странице "правление"
 
### 1.3 `GET /api/v1/subscriptions/plans` (без авторизации)

Сейчас планы подписки доступны только через `GET /api/v1/admin/plans` (admin).
Для страницы оплаты в ЛК нужен публичный/авторизованный эндпоинт.

**Ожидаемый ответ:**

```json
{
  "data": [
    {
      "id": "uuid",
      "code": "annual",
      "name": "Годовой членский взнос",
      "description": "...",
      "price": 5000,
      "duration_months": 12,
      "is_available": true
    }
  ]
}
```

---

### 1.4 `GET /api/v1/subscriptions/payments/{payment_id}/status` (auth required) 
Фронт использует этот эндпоинт на странице `/payment/success` и `/payment/fail`
для проверки статуса оплаты после редиректа из YooKassa.

Сейчас в Swagger есть только `receipt`, но **нет `status`**.

**Ожидаемый ответ:**

```json
{
  "id": "uuid",
  "status": "completed",
  "payment_url": null
}
```

`status`: `"pending"` | `"completed"` | `"failed"` | `"refunded"` | `"partially_refunded"`

---

## 2. Недостающие поля в существующих публичных эндпоинтах

### 2.1 `content_blocks` — добавить к врачам, мероприятиям, статьям

Сейчас `content_blocks` возвращается **только** в `GET /organization-documents/{slug}`.
Фронт рассчитан на content_blocks во всех детальных страницах.

| Эндпоинт | Текущее состояние | Что нужно |
|---|---|---|
| `GET /api/v1/doctors/{slug}` (`DoctorPublicDetailResponse`) | нет `content_blocks` | Добавить `content_blocks: ContentBlockPublicNested[]` |
| `GET /api/v1/events/{slug}` (`EventPublicDetailResponse`) | нет `content_blocks` | Добавить `content_blocks: ContentBlockPublicNested[]` |
| `GET /api/v1/articles/{slug}` (`ArticleDetailResponse`) | нет `content_blocks` | Добавить `content_blocks: ContentBlockPublicNested[]` |

Формат `ContentBlockPublicNested` уже есть в Swagger — тот же что для документов:

```json
{
  "id": "uuid",
  "block_type": "text",
  "sort_order": 0,
  "title": null,
  "content": "<p>...</p>",
  "media_url": null,
  "thumbnail_url": null,
  "link_url": null,
  "link_label": null,
  "device_type": "all"
}
```

---

### 2.2 `EventPublicDetailResponse` — добавить `status`

Сейчас `status` (`"upcoming"` / `"past"`) есть **только** в `EventPublicListItem` (список),
но **отсутствует** в `EventPublicDetailResponse` (детальная страница).

Фронт использует `status` на детальной странице для условного рендера:
- `upcoming` — показать кнопку регистрации и тарифы
- `past` — показать записи и галерею

**Нужно добавить:** `status: string` в `EventPublicDetailResponse`.

---

### 2.3 `EventPublicDetailResponse` — добавить `user_registration`

Когда авторизованный пользователь открывает мероприятие, фронту нужно знать,
зарегистрирован ли он уже (чтобы не показывать повторную форму регистрации).

**Нужно добавить** (nullable, null если не авторизован или не зарегистрирован):

```json
"user_registration": {
  "registration_id": "uuid",
  "status": "confirmed",
  "tariff_name": "Стандарт"
}
```

Или как минимум boolean `is_registered: true/false`.

---

### 2.4 `EventRecording` — поле `duration`

Сейчас: `duration_seconds: integer | null`.
На фронте нужна либо строка `duration: "01:30:00"` (чтобы красиво отобразить),
либо фронт сконвертирует `duration_seconds` сам.

**Решение:** оставить `duration_seconds`, фронт адаптирует. Ничего менять не нужно.

---

### 2.5 `ArticleDetailResponse` — недостающие SEO-поля

Сейчас SEO для статей приходит через вложенный объект `seo: SeoNested | null`.
На фронте есть legacy-поля `seo_title`, `seo_description` — их удалим с фронта, будем использовать `seo`.

**Ничего менять не нужно**, фронт адаптируется.

---

## 3. Несоответствия в путях эндпоинтов

### 3.1 Платежи: `/payments/` vs `/subscriptions/payments/`

| Что ожидает фронт | Что есть в Swagger |
|---|---|
| `GET /api/v1/payments` | `GET /api/v1/subscriptions/payments` |
| `GET /api/v1/payments/{id}/receipt` | `GET /api/v1/subscriptions/payments/{id}/receipt` |
| `GET /api/v1/payments/{id}/status` | **не существует** |

**Варианты:**
1. Бэкенд добавляет alias `/api/v1/payments/...` → `/api/v1/subscriptions/payments/...`
2. Фронт меняет пути на `/subscriptions/payments/...`

**Рекомендация:** фронт поправит пути. Но `status` эндпоинт нужно добавить (см. п. 1.4).

---

## 4. Пагинация документов

`GET /api/v1/organization-documents` возвращает `{ data: [...] }` **без** `total`, `limit`, `offset`.
Все остальные списковые эндпоинты возвращают пагинацию.

**Нужно:**
- Либо добавить пагинацию: `{ data: [...], total: N, limit: 20, offset: 0 }`
- Либо фронт убирает ожидание пагинации (документов обычно мало, ок без пагинации)

**Рекомендация:** если документов немного (<50), оставить как есть — фронт адаптируется.
Если будет много — добавить `limit`/`offset` параметры.

---

## 5. Города: неявный формат ответа

`GET /api/v1/cities` в Swagger имеет response type `object` (не типизирован).
Фронт ожидает `{ data: CityResponse[] }` где:

```json
{
  "data": [
    { "id": "uuid", "name": "Москва", "slug": "moscow", "doctors_count": 42 }
  ]
}
```

**Нужно:** явно типизировать ответ в Swagger (возможно уже работает, но схема не прописана).

---

## Сводная таблица

| # | Что | Приоритет | Статус |
|---|---|---|---|
| 1.1 | `GET /auth/me` | **Критично** — без него не работают роли/сайдбар | Нет в Swagger |
| 1.2 | `GET /settings/public` | Средний — пока контент захардкожен | Нет в Swagger |
| 1.3 | `GET /subscriptions/plans` (публичный) | Средний — нужен для страницы оплаты | Только admin |
| 1.4 | `GET /subscriptions/payments/{id}/status` | **Критично** — страницы payment/success и fail не работают | Нет в Swagger |
| 2.1 | `content_blocks` в doctors/events/articles | **Высокий** — без них нельзя рендерить доп. контент | Только в documents |
| 2.2 | `status` в EventPublicDetailResponse | **Высокий** — без него фронт не знает upcoming/past | Только в списке |
| 2.3 | `user_registration` в EventPublicDetailResponse | Средний — чтобы не показывать повторную регистрацию | Нет |
| 4 | Пагинация documents | Низкий | Фронт адаптируется |
| 5 | Типизация cities response | Низкий | Вероятно работает |



- нужен запрос который будет возвразать текущий статус подписки пользователя. Годовой взнос который был оплачен и если есть подписка то у меня как юзера должны выодится данные по моей активной подписке я думаю также. Если такой есть запрос то окей  
