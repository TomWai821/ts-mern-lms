# For Test
FROM node:22-alpine AS test
RUN apk update && apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "test"]

# For development
FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon ts-node
COPY . .
CMD ["npm", "run", "dev"]

# For Build to compile TypeScript to JavaScript
FROM node:22-alpine AS builder
RUN apk update && apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# For Production 
FROM node:22-alpine AS production
RUN apk update && apk upgrade --no-cache
WORKDIR /app

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter

COPY package*.json ./

RUN npm ci --omit=dev --silent

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "dist/server.js"]