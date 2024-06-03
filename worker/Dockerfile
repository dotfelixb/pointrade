# worker service

FROM node:21-alpine

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 4000

# Start the application
CMD ["node", "dist/app.js"]