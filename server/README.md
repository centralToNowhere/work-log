# server

Backend service for Work Log.

## Quick Start

From the repository root:

```bash
docker compose up -d --build
```

For a clean local database reset:

```bash
make reset
```

## Local Commands

From `server/`:

```bash
yarn install
yarn run dev
yarn run build
yarn run migrate
```

## API

See [api.md](./api.md).
