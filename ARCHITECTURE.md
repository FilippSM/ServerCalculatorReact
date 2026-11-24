# Архитектура бэкенда (one-backend)

Документ-эталон: по нему можно переписать другой проект в том же стиле.

## 1. Стек

| Что | Значение |
|-----|----------|
| Runtime | Node.js, ESM (`"type": "module"`) |
| Язык | TypeScript (`module: nodenext`, `strict: true`) |
| Framework | Express 5 |
| Валидация | express-validator |
| Пакетный менеджер | pnpm |
| Сборка | `tsc` → `src/` → `dist/` |
| Dev | `tsc -w` + `nodemon dist/index.js` |
| Тесты | Jest + ts-jest (ESM) + Supertest |
| Деплой | Vercel (`api/index.ts` + `vercel.json`) |

**Скрипты:**

- `watch` — `tsc -w`
- `dev` — `nodemon dist/index.js`
- `build` — `tsc`
- `start` — `node dist/index.js`
- `test` — Jest через `--experimental-vm-modules`

## 2. Структура папок

```
src/
  index.ts              # только listen (порт 5000)
  app.ts                # сборка Express-приложения (без listen)
  types.ts              # типизированные Request-обёртки
  utils.ts              # HTTP_STATUSES
  db/
    db.ts               # in-memory БД + типы сущностей
  middleware/
    input-validation-middleware.ts
  models/               # DTO (только типы)
    CreateCourseModel.ts
    CourseUpdateModel.ts
    CourseViewModel.ts
    QueryCoursesModel.ts
    URIParamsCourseModel.ts
  repositories/
    courses-repository.ts
  routes/
    courses.ts          # фабрика роутера getCoursesRouter(db)
__test__/
  e2e/
    course.api.test.ts
api/
  index.ts              # Vercel entry
```

## 3. Слои (главный паттерн)

```
HTTP
 → express.json()
 → Router (routes/)
 → validators (express-validator) + inputValidationMiddleware
 → handler (typed Request/Response)
 → Repository (repositories/)
 → DB (db/)
 → ViewModel mapper
 → JSON / status
```

**Нет:** service-слоя, DI, ORM, классов. Тонкий учебный стек.

**Правило:** 1 ресурс = 1 router factory + 1 repository + набор `*Model` + 1 e2e-файл.

## 4. Bootstrap

**Разделение обязательно:**

- `src/index.ts` — только `app.listen(5000)`
- `src/app.ts` — создаёт `app`, middleware, монтирует роутеры; экспортируется для тестов

```ts
// app.ts
export const app: Express = express();
app.use(express.json());
app.use("/courses", getCoursesRouter(db));
```

**ESM:** импорты с суффиксом `.js` даже из `.ts` файлов (`from "./app.js"`).

## 5. Роуты

Фабрика:

```ts
export const getCoursesRouter = (db: DBType) => {
  const router = express.Router();
  // validators + handlers
  return router;
};
```

Монтирование: `app.use("/courses", getCoursesRouter(db))`.

В роуте:

1. объявить validators (`body` / `param` / `query`)
2. цепочка: validators → `inputValidationMiddleware` → handler
3. типизировать handler через `RequestWith*`
4. вызвать repository
5. смаппить в ViewModel
6. статусы через `HTTP_STATUSES`

## 6. Repository

Плоский объект (не класс):

```ts
export const coursesRepository = {
  findCourses(title?) { ... },
  findCourseByid(id) { ... },
  createCourses(title) { ... },
  updateCourse(id, title) { return true | false },
  deleteCourse(id) { return true | false },
};
```

- update/delete → `boolean`
- create → сущность
- id часто: `+new Date()` или `+req.params.id`

**Важно при копировании:** в этом проекте `db` может дублироваться в `db.ts` и внутри repository — так делать **не надо**. Нужен **один общий `db`**, который передаётся в repository (или импортируется из одного места).

## 7. DTO / models

| Файл | Назначение |
|------|------------|
| `CourseCreateModel` | POST body |
| `CourseUpdateModel` | PUT body |
| `QueryCoursesModel` | query |
| `URIParamsCourseModel` | `:id` |
| `CourseViewModel` | ответ клиенту |

**Domain vs API:**

- `CourseType` (БД): `id`, `title`, `studentsCount`
- `CourseViewModel` (API): только `id`, `title` — внутренние поля скрыты

Mapper:

```ts
export const getCourseViewModel = (c: CourseType): CourseViewModel => ({
  id: c.id,
  title: c.title,
});
```

Лучше держать mapper рядом с models, а не импортировать из routes в repository.

## 8. Типы Request

```ts
RequestWithBody<T>
RequestWithQuery<T>
RequestWithParams<T>
RequestWithParamsAndBody<T, B>
```

## 9. Валидация

```ts
const titleValidation = body("title")
  .isLength({ min: 3, max: 10 })
  .withMessage("...");

router.post("/", titleValidation, inputValidationMiddleware, handler);
```

Общий middleware: если `validationResult` не пустой → `400` + `{ errors: [...] }`.

## 10. HTTP статусы

```ts
HTTP_STATUSES = {
  OK_200, CREATED_201, NO_CONTENT_204,
  BADE_REQUEST_400,  // опечатка в исходнике — можно исправить при переносе
  NOT_FOUND_404
}
```

## 11. API (courses)

| Method | Path | Успех | Ошибки |
|--------|------|-------|--------|
| GET | `/courses?title=` | 200 `CourseViewModel[]` | 400 |
| GET | `/courses/:id` | 200 | 400 / 404 |
| POST | `/courses` | 201 | 400 |
| PUT | `/courses/:id` | 204 | 400 / 404 |
| DELETE | `/courses/:id` | 204 | 400 / 404 |

## 12. Тесты

- Импортировать `app` из `app.ts` (без listen)
- `beforeAll` — очистить `db`
- Supertest: статус + тело
- Покрыть CRUD + валидацию + 404

## 13. Naming

| Что | Как |
|-----|-----|
| Router | `getXxxRouter` |
| Repository | `xxxRepository` |
| DTO | `*Model` |
| Domain | `XxxType` |
| Mapper | `getXxxViewModel` |
| Файлы repos/middleware | kebab-case |
| Model-файлы | PascalCase |
| Роуты | plural (`courses.ts`) |

## 14. Чеклист переноса в другой проект

1. ESM + TypeScript nodenext + Express 5 + express-validator + pnpm
2. `index.ts` (listen) / `app.ts` (wiring)
3. `db/`, `routes/`, `repositories/`, `models/`, `middleware/`, `types.ts`, `utils.ts`
4. Один shared `db`
5. Router factory + repository object + ViewModel
6. Validators → middleware → handler
7. E2E на Supertest против `app`
8. Опционально: `/__test__/data` для сброса БД в тестах

## 15. Шаблон нового ресурса

```
src/db/db.ts                    # добавить сущность в DBType
src/models/*Model.ts            # Create/Update/Query/Params/View
src/repositories/xxx-repository.ts
src/routes/xxx.ts               # getXxxRouter
src/app.ts                      # app.use("/xxx", getXxxRouter(db))
__test__/e2e/xxx.api.test.ts
```

## Итог

Копируй слоистую схему (app → routes → repository → db + models + validation), а не конкретную сущность `courses`. Один ресурс — один набор файлов по шаблону выше.
