FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=development
EXPOSE 8990 8991 8992 8993 8994 8995 8996 8997 8998

CMD ["npm", "run", "dev:all"]
