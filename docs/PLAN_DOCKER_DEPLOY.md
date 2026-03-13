# План: Docker-деплой фронтенда (test + prod)

## Контекст

Репозиторий содержит **только клиентский фронтенд** (Next.js 16). Бекенд размещён отдельно и уже задеплоен.

| Среда | Клиент (этот репо) | Бекенд (внешний) |
|-------|-------------------|-------------------|
| **Test** | https://trichologia.mediann.dev | https://trihoback.mediann.dev |
| **Prod** | https://trichologia.ru | https://api.trihologia.ru |

### Текущее состояние

- Docker-файлов **нет**
- Env-файлов **нет** (`.env*` в `.gitignore`)
- Единственная env-переменная в коде: `NEXT_PUBLIC_API_URL` (фоллбэк `http://localhost:8000`)
- Хардкодов доменов в src/ — нет (кроме контактного email `info@trichologia.ru` в Footer — это ок)
- `SITE_NAME` захардкожен как строка `"Ассоциация трихологов"` в `seo.ts` — нужно вынести

---

## Этап 0: Новые env-переменные в коде

Прежде чем делать Docker, нужно вынести все потенциальные хардкоды в переменные окружения.

### 0.1 — Добавить `NEXT_PUBLIC_SITE_URL`

**Файл:** `frontend/src/shared/config/env.ts` (новый)

```ts
export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? "Ассоциация трихологов",
} as const;
```

### 0.2 — Обновить импорты

- `apiEndpoints.ts` → использовать `ENV.API_URL` вместо прямого `process.env`
- `next.config.ts` → использовать `process.env.NEXT_PUBLIC_API_URL` (оставить, он в серверном контексте)
- `seo.ts` → заменить захардкоженный `SITE_NAME` на `ENV.SITE_NAME`

### 0.3 — Barrel export

`shared/config/index.ts` → добавить `export { ENV } from "./env";`

---

## Этап 1: Env-файлы

### 1.1 — Создать `.env.example` (коммитится в git)

**Файл:** `frontend/.env.example`

```env
# === API ===
# URL бекенда (без trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:8000

# === Сайт ===
# Публичный URL самого фронтенда
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Название сайта (SEO, Open Graph)
NEXT_PUBLIC_SITE_NAME=Ассоциация трихологов
```

### 1.2 — Создать `.env.test` (НЕ коммитится, копируется на сервер)

**Файл:** `frontend/.env.test`

```env
NEXT_PUBLIC_API_URL=https://trihoback.mediann.dev
NEXT_PUBLIC_SITE_URL=https://trichologia.mediann.dev
NEXT_PUBLIC_SITE_NAME=Ассоциация трихологов (тест)
```

### 1.3 — Создать `.env.production` (НЕ коммитится, копируется на сервер)

**Файл:** `frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://api.trihologia.ru
NEXT_PUBLIC_SITE_URL=https://trichologia.ru
NEXT_PUBLIC_SITE_NAME=Ассоциация трихологов
```

### 1.4 — Обновить `.gitignore`

Убедиться что `.env*` игнорируется (уже есть), но **добавить исключение** для `.env.example`:

```gitignore
.env*
!.env.example
```

---

## Этап 2: Dockerfile фронтенда

### 2.1 — Создать `frontend/Dockerfile`

Multi-stage build для минимального размера образа:

```dockerfile
# ---- Stage 1: Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ---- Stage 2: Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* нужны на этапе build (вшиваются в бандл)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SITE_NAME

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME

RUN npm run build

# ---- Stage 3: Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Важно:** `NEXT_PUBLIC_*` переменные инлайнятся в JS-бандл на этапе `next build`. Поэтому они передаются как `ARG` при сборке, а не как `ENV` при запуске.

### 2.2 — Включить standalone output в Next.js

**Файл:** `frontend/next.config.ts` — добавить:

```ts
const nextConfig: NextConfig = {
  output: "standalone",   // ← для Docker-оптимизации
  // ...остальное
};
```

### 2.3 — Создать `frontend/.dockerignore`

```
node_modules
.next
.git
.env*
!.env.example
*.md
.cursor
```

---

## Этап 3: Docker Compose

### 3.1 — `docker-compose.test.yml` (тестовая среда)

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
        NEXT_PUBLIC_SITE_NAME: ${NEXT_PUBLIC_SITE_NAME}
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.test
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Запуск:**
```bash
docker compose -f docker-compose.test.yml --env-file frontend/.env.test up -d --build
```

### 3.2 — `docker-compose.prod.yml` (прод среда)

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
        NEXT_PUBLIC_SITE_NAME: ${NEXT_PUBLIC_SITE_NAME}
    expose:
      - "3000"
    env_file:
      - ./frontend/.env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - frontend
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
```

**Запуск:**
```bash
docker compose -f docker-compose.prod.yml --env-file frontend/.env.production up -d --build
```

---

## Этап 4: Nginx конфиг (только прод)

### 4.1 — `nginx/conf.d/trichologia.conf`

```nginx
upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name trichologia.ru www.trichologia.ru;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name trichologia.ru www.trichologia.ru;

    ssl_certificate /etc/letsencrypt/live/trichologia.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/trichologia.ru/privkey.pem;

    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Кэш статики Next.js
    location /_next/static/ {
        proxy_pass http://frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Этап 5: Makefile и скрипты

### 5.1 — `Makefile` в корне проекта

```makefile
# === Test ===
test-up:
	docker compose -f docker-compose.test.yml --env-file frontend/.env.test up -d --build

test-down:
	docker compose -f docker-compose.test.yml down

test-logs:
	docker compose -f docker-compose.test.yml logs -f frontend

# === Prod ===
prod-up:
	docker compose -f docker-compose.prod.yml --env-file frontend/.env.production up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

# === SSL ===
ssl-init:
	./scripts/init-ssl.sh

ssl-renew:
	docker compose -f docker-compose.prod.yml run --rm certbot renew
	docker compose -f docker-compose.prod.yml restart nginx

# === Cleanup ===
clean:
	docker image prune -f
```

### 5.2 — `scripts/deploy.sh`

```bash
#!/bin/bash
set -e

ENV_FILE=${1:-.env.production}
COMPOSE_FILE=${2:-docker-compose.prod.yml}

echo "=== Deploy: $COMPOSE_FILE with $ENV_FILE ==="

git pull origin main

docker compose -f $COMPOSE_FILE --env-file frontend/$ENV_FILE build frontend
docker compose -f $COMPOSE_FILE --env-file frontend/$ENV_FILE up -d --no-deps frontend

docker image prune -f

sleep 5
echo "=== Health check ==="
docker compose -f $COMPOSE_FILE ps

echo "=== Deploy complete ==="
```

---

## Порядок выполнения (чеклист)

| # | Задача | Файлы |
|---|--------|-------|
| 0.1 | Создать `env.ts` с централизованными переменными | `shared/config/env.ts` |
| 0.2 | Обновить `apiEndpoints.ts`, `seo.ts` — убрать хардкоды | `apiEndpoints.ts`, `seo.ts` |
| 0.3 | Экспорт ENV через barrel | `shared/config/index.ts` |
| 1.1 | Создать `.env.example` | `frontend/.env.example` |
| 1.2 | Создать `.env.test` | `frontend/.env.test` |
| 1.3 | Создать `.env.production` | `frontend/.env.production` |
| 1.4 | Обновить `.gitignore` — исключение для `.env.example` | `frontend/.gitignore` |
| 2.1 | Создать `Dockerfile` (multi-stage) | `frontend/Dockerfile` |
| 2.2 | Включить `output: "standalone"` в Next.js | `frontend/next.config.ts` |
| 2.3 | Создать `.dockerignore` | `frontend/.dockerignore` |
| 3.1 | Создать `docker-compose.test.yml` | корень проекта |
| 3.2 | Создать `docker-compose.prod.yml` | корень проекта |
| 4.1 | Создать nginx конфиг | `nginx/conf.d/trichologia.conf` |
| 5.1 | Создать `Makefile` | корень проекта |
| 5.2 | Создать `scripts/deploy.sh` | `scripts/deploy.sh` |
| 6 | Проверить build: `docker compose -f docker-compose.test.yml --env-file frontend/.env.test up --build` | — |

---

## Схема: как env попадает в контейнер

```
.env.test / .env.production
        │
        ▼
  docker compose --env-file
        │
        ├── build.args (NEXT_PUBLIC_*)    →  Dockerfile ARG → ENV → next build
        │                                     (вшивается в JS-бандл)
        │
        └── env_file (для runtime)        →  server.js process.env
                                              (rewrites, SSR)
```

**Ключевой момент:** `NEXT_PUBLIC_*` переменные «вшиваются» в клиентский бандл при `next build`. Поэтому они прокидываются через `ARG` на этапе сборки Docker-образа. Серверные переменные (без `NEXT_PUBLIC_` префикса) доступны через `env_file` в рантайме.
