# Dev Dockerfile for Infinite News Stream (frontend-only)
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies in image (cached by layer)
COPY package.json ./
# If you later add a lockfile, copy it too for better caching
# COPY package-lock.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Expose Vite dev port
EXPOSE 5000

# Default command: run Vite dev server on 0.0.0.0
CMD ["npm", "run", "dev"]
