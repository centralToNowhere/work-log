.PHONY: env up reset restart down logs

env:
	@test -f .env || cp .env.example .env

up:
	docker compose up -d --build --force-recreate

reset:
	docker compose down -v --remove-orphans
	docker compose up -d --build --force-recreate

restart:
	docker compose down --remove-orphans
	docker compose up -d --build --force-recreate

down:
	docker compose down --remove-orphans

remove:
	docker compose down -v --remove-orphans

logs:
	docker compose logs -f work-log-server
