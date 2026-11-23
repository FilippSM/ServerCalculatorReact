FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN adduser -D myuser
USER myuser

EXPOSE 3000

CMD ["node", "dist/server.js"]
