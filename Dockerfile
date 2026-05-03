# ── Stage 1: Build React frontend ────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency files first (better Docker layer caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for Vite build)
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build the React frontend into /app/dist
RUN npm run build

# ── Stage 2: Production server ────────────────────────────────────────────────
FROM node:20-slim AS production

WORKDIR /app

# Copy only package files for production install
COPY package*.json ./

# Install ONLY production dependencies (no devDependencies)
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy the Express server
COPY server ./server

# Copy the .env file for runtime configuration (GEMINI_API_KEY, etc.)
COPY .env ./

# Cloud Run sets PORT automatically (default 8080)
ENV PORT=8080
ENV NODE_ENV=production

# Expose the port
EXPOSE 8080

# Start the Express server
CMD ["node", "server/index.js"]
