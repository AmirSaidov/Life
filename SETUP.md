# LifeFlow — Setup Guide

## Быстрый старт

### 1. Установка зависимостей

```bash
npm run install:all
```

### 2. База данных

Создайте файл `backend/.env` на основе `backend/.env.example`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/lifeflow"
JWT_SECRET="your-very-long-secret-key-here-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=3001
CLIENT_URL="http://localhost:5173"
```

Запустите миграции:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Frontend .env

Создайте `frontend/.env`:

```
VITE_API_URL=http://localhost:3001/api
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Откроет:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## Деплой

### Frontend → Vercel / Netlify

```bash
cd frontend
npm run build
```

Для Netlify: файл `public/_redirects` уже настроен.
Переменная окружения: `VITE_API_URL=https://your-backend.railway.app/api`

### Backend → Railway / Render

1. Создайте PostgreSQL базу (Railway даёт бесплатно)
2. Установите переменные окружения в панели платформы
3. Добавьте build-команду: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Start-команда: `npm start`

---

## Структура проекта

```
project/
├── frontend/         # React + Vite + Tailwind
├── backend/          # Node.js + Express + Prisma
└── package.json      # Root scripts (dev, build, install:all)
```
