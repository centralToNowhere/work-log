# Журнал работ

Стек: Node.js, Fastify, PostgreSQL, Docker, React, TypeScript

Цель: Fullstack практика с REST api, PostgreSQL и docker.

В качестве ассистента при написании кода использовался OpenAI Codex в VS Code.

## Локальный запуск контейнеров

Проверить, что Docker доступен:

```bash
docker ps
```

Создать `.env`:

```bash
make env
```
Запустить контейнеры

```bash
make up
```
Открыть http://localhost:5173

## Удалить контейнеры

```bash
make remove
```

## Пересоздать контейнеры вместе с базой

```bash
make reset
```

## Документация по API сервера

[api.md](./server/api.md).
