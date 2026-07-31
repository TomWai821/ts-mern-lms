# For Test 
FROM node:24 as test
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "test"]

# For Production
FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
