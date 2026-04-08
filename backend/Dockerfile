# For Test 
FROM node:22-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "test"]

# For Build to compile TypeScript to JavaScript (Before Production)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# For Production
FROM node:22-alpine
WORKDIR /app
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter
COPY package*.json ./
RUN npm ci --omit=dev --silent
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
CMD ["npm", "dist/entry/lambda.js"]