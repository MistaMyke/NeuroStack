
# Use Node.js
FROM node:20-alpine

# Set working dir
WORKDIR /app

# Copy package.json and lock file first
COPY package*.json ./

# Install deps
RUN npm install

# Copy rest of project
COPY . .

# Expose Vite’s port
EXPOSE 5173

# Run dev server
CMD ["npm", "run", "dev"]

