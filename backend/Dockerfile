# For Test 
FROM node:22.14-alpine3.20 AS test
RUN apk update && apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "test"]

# For Build to compile TypeScript to JavaScript (Before Production)
FROM node:22.14-alpine3.20 AS builder
RUN apk update && apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -R dist/server.js

# For Production 
FROM node:22.14-alpine3.20
RUN apk update && apk upgrade --no-cache
WORKDIR /app

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter

COPY package*.json ./
RUN npm ci --omit=dev --silent

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "dist/server.js"]