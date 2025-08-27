# Use Node 22 LTS base image
FROM node:22-bullseye

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml if using pnpm)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev"]

