# Use Node.js to build the app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching speed)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Start the app with --host so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]