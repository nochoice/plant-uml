# Use Node.js LTS as base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for react-router-serve)
RUN npm ci

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/react-router.config.ts ./react-router.config.ts

# Set default port for local development
# Cloud Run will override this with its own PORT at runtime
ENV PORT=3000
EXPOSE 3000

# Start the application
# react-router-serve automatically respects the PORT environment variable
CMD ["npm", "run", "start"]
