# Журнал работ

Стек: Node.js, Fastify, PostgreSQL, Docker, React, TypeScript

Цель: Fullstack практика с REST api, PostgreSQL и docker.

В качестве ассистента при написании кода использовался OpenAI Codex в VS Code.

## Запуск
Установить docker, если не установлен, и выполнить в корне проекта:

```bash
make up
```
Открыть http://localhost:8081

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
