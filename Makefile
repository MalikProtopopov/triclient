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
