# Деплой и эксплуатация (handoff)

Краткий справочник по тому, **как устроен** фронтенд в этом репозитории и **что перенести** в следующий проект. Оперативные команды на конкретном сервере — в [`deploy.md`](../deploy.md).

## Оглавление

1. [Стек и рантайм](#1-стек-и-рантайм)
2. [Сборка и скрипты](#2-сборка-и-скрипты)
3. [Переменные окружения](#3-переменные-окружения)
4. [Docker и Make](#4-docker-и-make)
5. [Next.js: прокси, картинки, редиректы](#5-nextjs-прокси-картинки-редиректы)
6. [API и авторизация](#6-api-и-авторизация)
7. [CI и качество](#7-ci-и-качество)
8. [Чек-лист релиза](#8-чек-лист-релиза)
9. [Диагностика сети на проде](#9-диагностика-сети-на-проде-рекомендация)
10. [Проанализированные файлы](#10-проанализированные-файлы)

---

## 1. Стек и рантайм

**Как в проекте**

| Компонент | Версия / детали | Источник |
|-----------|-----------------|----------|
| Node (образ) | 20 (`node:20-alpine`) | `frontend/Dockerfile` |
| Менеджер пакетов | npm (`npm ci`, `npm run build`) | `frontend/Dockerfile`, `frontend/package.json` |
| Фреймворк | Next.js 16.x (App Router) | `frontend/package.json` |
| UI | React 19, Tailwind CSS 4 (`@tailwindcss/postcss`) | `frontend/package.json` |
| Данные | TanStack Query v5 | `frontend/package.json` |
| HTTP | axios | `frontend/src/shared/api/api.ts` |

Выход прод-сборки: **`output: "standalone"`** — в образ копируются `.next/standalone`, `.next/static`, `public` (`frontend/Dockerfile`).

---

## 2. Сборка и скрипты

**Как в проекте**

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Локальная разработка (Next dev) |
| `npm run build` | Production build |
| `npm run start` | Запуск после build (`next start`; в Docker — `node server.js` из standalone) |
| `npm run lint` | ESLint |

**Рекомендация:** полный `npm run lint` может выдавать ошибки в отдельных файлах (строгие правила React Compiler / hooks); для релиза ориентируйтесь на успешный `npm run build` и договорённости команды.

**Не зафиксировано в репозитории:** YAML CI (`.github/workflows` отсутствует) — автоматическая сборка в PR не описана кодом.

---

## 3. Переменные окружения

**Как в проекте**

Переменные с префиксом **`NEXT_PUBLIC_*`** встраиваются в клиентский бандл на этапе **сборки** (см. build-args в `frontend/Dockerfile`).

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_API_URL` | Базовый URL для axios и логики media (см. ниже) |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL фронтенда (SEO, ссылки) |
| `NEXT_PUBLIC_SITE_NAME` | Название сайта (SEO, Docker build) |

Шаблон без секретов: `frontend/.env.example`. Рабочие окружения: `frontend/.env.test`, `frontend/.env.production` (не коммитить секреты).

### Важно: формат `NEXT_PUBLIC_API_URL`

**Как в коде:** `ApiClient` создаётся с `API_BASE_URL` из `ENV.API_URL` (`frontend/src/shared/config/env.ts`). Пути в `API_ENDPOINTS` заданы **уже с префиксом** `/api/v1/...` (например `/api/v1/auth/login`).

Значит **база для axios должна быть origin бэкенда без суффикса `/api/v1`**, например:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Если указать `http://localhost:8000/api/v1`, итоговый URL станет `.../api/v1/api/v1/...` — неверно.

**Замечание:** в `frontend/.env.example` в комментарии указано «должен заканчиваться на /api/v1» — это **несогласовано** с `apiEndpoints.ts`. Имеет смысл поправить `.env.example` отдельным коммитом.

**Рекомендация для следующего проекта:** единый источник правды для base URL + автотест или assert в dev, если base и пути дублируют префикс.

---

## 4. Docker и Make

**Как в проекте**

- **Тест / staging:** `docker-compose.test.yml` — сервис `frontend`, порт **3000**, `env_file: frontend/.env.test`, healthcheck `wget` на `http://localhost:3000`.
- **Prod:** `docker-compose.prod.yml` — `frontend` (expose 3000) + **nginx** (80/443) + certbot; env: `frontend/.env.production`.

Build-args при сборке образа (обе compose-конфигурации): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`.

**Make-цели** (корень репозитория, [`Makefile`](../Makefile)):

| Цель | Назначение |
|------|------------|
| `make test-deploy` | `git pull`, prune образов, build + up frontend (test compose) |
| `make test-rebuild` | То же с `--no-cache` |
| `make prod-deploy` | Prod compose + `.env.production` |
| `make clean` / `clean-all` | Очистка образов/кэша (осторожно с `clean-all`) |

Подробные шаги на сервере (SSH, путь `/opt/triclient`, освобождение порта) — в [`deploy.md`](../deploy.md).

---

## 5. Next.js: прокси, картинки, редиректы

**Как в проекте** — `frontend/next.config.ts`

- **`rewrites`:**  
  - `/api/v1/:path*` → бэкенд (`NEXT_PUBLIC_API_URL` с подстановкой; см. код).  
  - `/sitemap.xml`, `/robots.txt` — прокси на API origin.  
  В браузере клиент может ходить на **тот же origin**, что и фронт, а Next перенаправит на бэкенд.
- **`images.remotePatterns`:** хост берётся из разбора `NEXT_PUBLIC_API_URL` (fallback hostname в коде при ошибке парсинга).
- **`redirects`:** легаси-пути (`/auth/reset-password` → `/reset-password`, `/cities` → `/doctors/cities` и т.д.).

---

## 6. API и авторизация

**Как в проекте** — `frontend/src/shared/api/api.ts`

- Axios: `withCredentials: true`, JSON по умолчанию, для `FormData` заголовок `Content-Type` снимается.
- Токен: из `sessionStorage` / `localStorage` (`access_token`) → заголовок `Authorization: Bearer ...`.
- **401:** попытка `POST /api/v1/auth/refresh` с cookies; при успехе — повтор запроса; при провале — очистка сессии и редирект на `/login?redirect=...`.
- **403** без токена в sessionStorage — тоже очистка и редирект.

Эндпоинты перечислены в `frontend/src/shared/config/apiEndpoints.ts`.

---

## 7. CI и качество

| Тема | Статус |
|------|--------|
| GitHub Actions / GitLab CI | Не зафиксировано в репозитории |
| Локальная проверка | `npm run build`, при необходимости `npm run lint` |

---

## 8. Чек-лист релиза

**Как в проекте / рекомендация**

- [ ] Изменились `NEXT_PUBLIC_*` — нужна **пересборка образа** (значения зашиваются в build).
- [ ] Не коммитить файлы с секретами продакшена; `.env*` с реальными значениями — по политике команды.
- [ ] После деплоя: healthcheck compose + `curl` к фронту (см. [`deploy.md`](../deploy.md)).
- [ ] Каталог `.next` — артефакт сборки, обычно в `.gitignore`.

---

## 9. Диагностика сети на проде (рекомендация)

Симптомы вроде **`net::ERR_TIMED_OUT`** при запросе RSC (`?_rsc=...`), **`_next/image`**, или API обычно указывают на **инфраструктуру**, а не на ошибку в одном React-компоненте:

- недоступность хоста фронта или бэкенда с клиента;
- таймауты nginx / firewall / DNS;
- смешение origin (фронт на одном домене, API на другом без CORS/прокси).

Имеет смысл проверить с сервера: `curl` к `127.0.0.1:3000`, логи контейнера, доступность бэкенда по тому URL, который задан в env.

---

## 10. Проанализированные файлы

- `deploy.md`
- `Makefile`
- `docker-compose.test.yml`
- `docker-compose.prod.yml`
- `frontend/Dockerfile`
- `frontend/package.json`
- `frontend/next.config.ts`
- `frontend/.env.example`
- `frontend/src/shared/api/api.ts`
- `frontend/src/shared/config/env.ts`
- `frontend/src/shared/config/apiEndpoints.ts`

**Пробелы / риски:** нет CI в репо; возможная путаница в комментарии к `NEXT_PUBLIC_API_URL` в `.env.example` — см. [раздел 3](#3-переменные-окружения).
