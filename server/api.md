# REST API

Base URL: `http://localhost:3000`

## Works

### GET `/works`

Получить список работ.

Query params:

| Param      | Type           | Required | Description                                |
| ---------- | -------------- | -------- | ------------------------------------------ |
| `date`     | `string`       | no       | Дата в формате `YYYY-MM-DD`                |
| `dateSort` | `asc` / `desc` | no       | Сортировка по `created_at`, default `desc` |
| `page`     | `number`       | no       | Номер страницы, default `1`                |
| `pageSize` | `number`       | no       | Размер страницы, default `10`              |

Example:

```http
GET /works?date=2026-05-25&dateSort=desc&page=1&pageSize=10
```

Response `200`:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Кладка перегородок",
      "description": null,
      "amount": 8,
      "measureUnit": "hour",
      "measureUnitValueSingularRu": "час",
      "workerId": 1,
      "workerFullName": "Иванов Алексей Сергеевич",
      "created_at": "2026-05-25T15:13:15.294Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1
  }
}
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
  "measureUnitValueSingularRu": "м²",
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
  "measureUnitValueSingularRu": "м²",
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

`/workers` is also available as an alias for worker-related endpoints:

- `GET /workers`
- `POST /workers`

## Measure Units

### GET `/measureUnits`

Получить список единиц измерения.

Response `200`:

```json
[
  {
    "id": 1,
    "code": "m2",
    "valueSingularRu": "м²"
  }
]
```

### POST `/measureUnits`

Создать единицу измерения.

Request body:

```json
{
  "code": "kg",
  "valueSingularRu": "килограмм"
}
```

Response `201`:

```json
{
  "id": 6,
  "code": "kg",
  "valueSingularRu": "килограмм"
}
```

## Errors

Server errors are returned as:

```json
{
  "message": "Ошибка сервера. Попробуйте позже."
}
```
