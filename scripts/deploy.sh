#!/bin/bash
set -e

ENV_FILE=${1:-.env.production}
COMPOSE_FILE=${2:-docker-compose.prod.yml}

echo "=== Deploy: $COMPOSE_FILE with $ENV_FILE ==="

git pull origin main

docker compose -f "$COMPOSE_FILE" --env-file "frontend/$ENV_FILE" build frontend
docker compose -f "$COMPOSE_FILE" --env-file "frontend/$ENV_FILE" up -d --no-deps frontend

docker image prune -f

sleep 5
echo "=== Health check ==="
docker compose -f "$COMPOSE_FILE" ps

echo "=== Deploy complete ==="
