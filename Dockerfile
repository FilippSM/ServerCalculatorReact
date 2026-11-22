FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

RUN adduser -D myuser
USER myuser

EXPOSE 3000

CMD ["node", "dist/server.js"]
