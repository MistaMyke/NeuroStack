# Use official Node.js LTS
FROM node:22-bullseye

# Set working directory
WORKDIR /app

# Copy package.json + package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Start the dev server using npx and bind to all interfaces
CMD ["npx", "vite", "dev", "--host"]

