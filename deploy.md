# Деплой клиентского фронта (triclient)

## Сервер

- **SSH:** `root@147.45.146.38`
- **Путь:** `/opt/triclient`
- **RAM:** ~2 GB. Не собирать одновременно с другими проектами.

## Параметры

| Параметр | Значение |
|----------|----------|
| Compose-файл | `docker-compose.test.yml` |
| Env-файл | `frontend/.env.test` |
| Сервис | `frontend` |
| Контейнер | `triclient-frontend-1` |
| Порт | 3000 |

## Команды деплоя

### Через Make (рекомендуется)

```bash
cd /opt/triclient
make test-deploy
```

С полной пересборкой без кеша:

```bash
cd /opt/triclient
make clean
make test-rebuild
```

### Вручную

```bash
cd /opt/triclient
git pull

# Освободить порт 3000, если занят
fuser -k 3000/tcp 2>/dev/null || true

docker stop triclient-frontend-1 2>/dev/null; docker rm triclient-frontend-1 2>/dev/null
docker compose -f docker-compose.test.yml --env-file frontend/.env.test build frontend
docker compose -f docker-compose.test.yml --env-file frontend/.env.test up -d frontend
```

## Диагностика

```bash
# Кто слушает 3000?
ss -tlnp | grep 3000

# Контейнеры
docker ps | grep triclient

# Логи
docker logs triclient-frontend-1 --tail 50

# Проверка
curl -sI http://127.0.0.1:3000/ | head -5
```

## Правила

1. Перед билдом — `git pull`.
2. Не выполнять `docker system prune -af` при обычном деплое.
3. Для чистой пересборки — `make test-rebuild` или `build --no-cache`.
