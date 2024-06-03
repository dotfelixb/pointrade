# server service

FROM node:21-alpine as build

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]