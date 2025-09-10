# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json
COPY package.json ./

# Устанавливаем зависимости PRODUCTION
RUN npm install --only=production

# Копируем исходный код
COPY . .

# Создаем пользователя
RUN adduser -D myuser
USER myuser

EXPOSE 3000

# ЗАПУСКАЕМ СЕРВЕР - используйте index.js!
CMD ["node", "index.js"]