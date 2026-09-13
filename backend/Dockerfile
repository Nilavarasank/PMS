FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src ./src

EXPOSE 5000

CMD ["sh", "-c", "node src/migrations/run.js && node src/server.js"]
