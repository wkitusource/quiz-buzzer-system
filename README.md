# Quiz Buzzer System

Монорепозиторий для системы викторины с мгновенным «баззером», построенной на Express + Socket.IO (API) и Next.js (клиент). Проект позволяет ведущему создавать игровые комнаты, участникам — подключаться и соревноваться за право ответить первым.

## Ключевые возможности

- Создание и подключение к комнатам по короткому коду
- Управление игроками: список участников, назначение ведущего
- Блокировка «баззера» при первом нажатии, отображение победителя
- Управление очками ведущим, синхронизация результатов между клиентами
- Интуитивный веб-интерфейс с анимациями и звуковыми эффектами
- API на Socket.IO с валидацией данных через Zod

## Структура монорепозитория

- `apps/api` — сервер Express + Socket.IO, хранит игровое состояние в памяти, предоставляет события для клиентов
- `apps/web` — Next.js 16 App Router (React 19), UI для ведущего и игроков
- `packages` — зарезервировано под общие библиотеки (пока пусто)
- `turbo.json` — настройки задач Turborepo
- `pnpm-workspace.yaml` — конфигурация рабочих пространств pnpm

```text
quiz-buzzer-system
├─ apps/
│  ├─ api/           # Сервер Socket.IO, доменные сервисы и типы
│  └─ web/           # Клиент Next.js, компоненты и хуки
├─ packages/         # Будущие общие модули
├─ turbo.json        # Конвейеры build/dev/lint/check-types
├─ pnpm-workspace.yaml
└─ README.md
```

## Требования

- Node.js 18 или новее
- pnpm 9.x (указано в `packageManager`)

## Установка

```sh
pnpm install
```

После установки зависимостей настройте переменные окружения.

## Настройка окружения

- `apps/api/.env` (создайте при необходимости):
  - `PORT=3001` — порт API
  - `CLIENT_URL=http://localhost:3000` — адрес фронтенда для CORS
- `apps/web/.env.local` (опционально):
  - `NEXT_PUBLIC_API_URL=http://localhost:3001` — базовый URL API/Socket.IO (используется в клиенте через `socket.io-client`)

## Команды разработки

- `pnpm dev` — запустить одновременно API (`tsx watch`) и веб-интерфейс (Next.js dev)
- `pnpm --filter api dev` — только API на `http://localhost:3001`
- `pnpm --filter web dev` — только веб-приложение на `http://localhost:3000`

Во время разработки Turborepo отключает кэш и держит процессы активными (`persistent: true`).

## Сборка и запуск

- `pnpm build` — собрать все рабочие пространства
- `pnpm --filter api build` — скомпилировать TypeScript API в `apps/api/dist`
- `pnpm --filter web build` — собрать Next.js в `apps/web/.next`
- `pnpm --filter api start` — запустить готовый API из `dist`
- `pnpm --filter web start` — production-сервер Next.js

## Проверка качества

- `pnpm lint` — запустить ESLint для всех пакетов
- `pnpm format` — применить Prettier (`**/*.{ts,tsx,md}`)
- `pnpm check-types` — прогнать `tsc --noEmit` для зависимых пакетов (API поддерживается из коробки)
- Тесты пока не реализованы. При добавлении рекомендуется использовать Vitest + supertest для API и React Testing Library / Playwright для веба (см. `CLAUDE.md`).

## API и события Socket.IO

HTTP:

- `GET /health` — проверка состояния сервера
- `GET /` — метаданные API (`name`, `version`, `status`)

Основное взаимодействие происходит через события Socket.IO (`apps/api/src/handlers/socket-handlers.ts`):

- `create-room` — создать комнату (возвращает `roomId`, `roomCode`, `playerId`)
- `join-room` — присоединиться по коду комнаты
- `buzz` — зафиксировать нажатие игрока; блокирует «баззер» для остальных
- `reset-buzzer` — доступно только ведущему, снимает блокировку
- `update-score` — ведущий изменяет очки игрока
- `leave-room` — выйти из комнаты; также вызывается при отключении

Сервер отправляет обновления: `player-list-updated`, `player-joined`, `player-left`, `player-buzzed`, `buzzer-reset`, `score-updated`, а также ошибки (`error`).

## Клиентское приложение

- UI построен на React 19 и App Router Next.js 16
- Состояние игры инкапсулировано в `GameProvider` (`apps/web/src/contexts/game-context.tsx`)
- Подключение к серверу через `socket.io-client` (см. `apps/web/src/lib/socket.ts` и хук `useSocket`)
- Звуки и анимации (Framer Motion, `use-sound`) повышают вовлеченность
- Поддерживаются сценарии ведущего и игрока: создание/вход, отображение списка, управление очками, оповещения о событиях

## Как внести вклад

1. Форкните репозиторий или создайте ветку.
2. Выполните `pnpm install` и настройте переменные окружения.
3. Разрабатывайте через `pnpm dev`. Перед пушем проверьте `pnpm lint`, `pnpm check-types`, `pnpm format`.
4. Придерживайтесь Conventional Commits (`feat(api): ...`, `fix(web): ...`).
5. Добавляйте тесты рядом с кодом (`apps/api/src/services/__tests__/`, `apps/web/src/app/__tests__/`). Обновите `turbo.json` и скрипты `test` при необходимости.

## Полезные ссылки

- Turborepo — https://turbo.build
- Next.js — https://nextjs.org
- Socket.IO — https://socket.io

Если возникнут вопросы или потребуется уточнить архитектуру, изучите `CLAUDE.md`, где собраны дополнительные рекомендации по развитию проекта.
