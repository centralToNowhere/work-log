# REST API

Base URL: `http://localhost:3000`

## Works

### GET `/works`

Получить список работ.

Query params:

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `date` | `string` | no | Дата в формате `YYYY-MM-DD` |
| `dateSort` | `asc` / `desc` | no | Сортировка по `created_at`, default `desc` |

Example:

```http
GET /works?date=2026-05-25&dateSort=desc
```

Response `200`:

```json
[
  {
    "id": 1,
    "title": "Кладка перегородок",
    "description": null,
    "amount": 8,
    "measureUnit": "hour",
    "workerId": 1,
    "workerFullName": "Иванов Алексей Сергеевич",
    "created_at": "2026-05-25T15:13:15.294Z"
  }
]
```

### POST `/works`

Создать работу.

Request body:

```json
{
  "title": "Кладка блоков",
  "description": "Второй этаж",
  "amount": 10,
  "measureUnit": "m2",
  "workerId": 1
}
```

Response `201`:

```json
{
  "id": 5,
  "title": "Кладка блоков",
  "description": "Второй этаж",
  "amount": 10,
  "measureUnit": "m2",
  "workerId": 1,
  "workerFullName": "Иванов Алексей Сергеевич",
  "created_at": "2026-05-25T15:13:15.294Z"
}
```

### DELETE `/works/:id`

Удалить работу.

Example:

```http
DELETE /works/5
```

Response `204`:

```http
No Content
```

Response `404`:

```json
{
  "message": "Работа не найдена"
}
```

## Users

### GET `/users`

Получить список пользователей/работников.

Response `200`:

```json
[
  {
    "id": 1,
    "firstName": "Алексей",
    "lastName": "Иванов",
    "patronymic": "Сергеевич",
    "fullName": "Иванов Алексей Сергеевич"
  }
]
```

### POST `/users`

Создать пользователя/работника.

Request body:

```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "patronymic": "Иванович"
}
```

Response `201`:

```json
{
  "id": 6,
  "firstName": "Иван",
  "lastName": "Иванов",
  "patronymic": "Иванович",
  "fullName": "Иванов Иван Иванович"
}
```

## Errors

Server errors are returned as:

```json
{
  "message": "Ошибка сервера. Попробуйте позже."
}
```
