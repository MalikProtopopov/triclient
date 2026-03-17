# === Test ===
test-up:
	docker compose -f docker-compose.test.yml --env-file frontend/.env.test up -d --build

test-down:
	docker compose -f docker-compose.test.yml down

test-logs:
	docker compose -f docker-compose.test.yml logs -f frontend

test-deploy:
	git pull
	docker compose -f docker-compose.test.yml --env-file frontend/.env.test build frontend
	docker compose -f docker-compose.test.yml --env-file frontend/.env.test up -d frontend

test-rebuild:
	git pull
	docker compose -f docker-compose.test.yml --env-file frontend/.env.test build --no-cache frontend
	docker compose -f docker-compose.test.yml --env-file frontend/.env.test up -d frontend

# === Prod ===
prod-up:
	docker compose -f docker-compose.prod.yml --env-file frontend/.env.production up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-deploy:
	git pull
	docker compose -f docker-compose.prod.yml --env-file frontend/.env.production build frontend
	docker compose -f docker-compose.prod.yml up -d frontend

# === SSL ===
ssl-init:
	./scripts/init-ssl.sh

ssl-renew:
	docker compose -f docker-compose.prod.yml run --rm certbot renew
	docker compose -f docker-compose.prod.yml restart nginx

# === Status ===
ps:
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

disk:
	docker system df

# === Cleanup ===
clean:
	docker image prune -f
	docker builder prune -f

clean-all:
	docker image prune -af
	docker builder prune -af
	docker volume prune -f
