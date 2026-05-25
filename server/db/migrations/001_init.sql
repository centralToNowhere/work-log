CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  patronymic TEXT NOT NULL DEFAULT ''
);

WITH initial_workers(first_name, last_name, patronymic) AS (
  VALUES
    ('Алексей', 'Иванов', 'Сергеевич'),
    ('Мария', 'Петрова', 'Андреевна'),
    ('Дмитрий', 'Смирнов', 'Олегович'),
    ('Анна', 'Кузнецова', ''),
    ('Сергей', 'Волков', 'Николаевич')
)
INSERT INTO workers (first_name, last_name, patronymic)
SELECT first_name, last_name, patronymic
FROM initial_workers
WHERE NOT EXISTS (SELECT 1 FROM workers);

CREATE TABLE IF NOT EXISTS measure_units (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE
);

INSERT INTO measure_units (code)
VALUES
  ('m2'),
  ('m3'),
  ('hour'),
  ('minute'),
  ('piece')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS works (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  measure_unit INTEGER NOT NULL REFERENCES measure_units(id),
  worker INTEGER NOT NULL REFERENCES workers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

WITH initial_works(title, description, amount, measure_unit_code, worker_last_name, worker_first_name, worker_patronymic, created_at) AS (
  VALUES
    ('Кладка перегородок', NULL, 8, 'hour', 'Иванов', 'Алексей', 'Сергеевич', '2026-05-24T12:13:15.294Z'),
    ('Штукатурка стен', NULL, 12, 'm2', 'Петрова', 'Мария', 'Андреевна', '2026-05-22T15:13:15.294Z'),
    ('Монтаж электрики', 'Черновой этап', 16, 'm2', 'Смирнов', 'Дмитрий', 'Олегович', '2026-05-25T15:13:15.294Z'),
    ('Монтаж опалубки', 'Чистовой этап', 40, 'm3', 'Волков', 'Сергей', 'Николаевич', '2026-05-21T11:34:15.294Z')
)
INSERT INTO works (title, description, amount, measure_unit, worker, created_at)
SELECT
  iw.title,
  iw.description,
  iw.amount,
  mu.id,
  wr.id,
  iw.created_at::TIMESTAMPTZ
FROM initial_works iw
JOIN measure_units mu ON mu.code = iw.measure_unit_code
JOIN workers wr
  ON wr.last_name = iw.worker_last_name
 AND wr.first_name = iw.worker_first_name
 AND wr.patronymic IS NOT DISTINCT FROM iw.worker_patronymic
WHERE NOT EXISTS (SELECT 1 FROM works);
