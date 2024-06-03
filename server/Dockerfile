# server service

FROM node:21-alpine

# Expose the port the app runs on
EXPOSE 3000

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Build the TypeScript code
RUN npm run build

# Start the application
CMD ["node", "dist/app.js"]