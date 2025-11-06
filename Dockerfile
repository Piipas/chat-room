FROM oven/bun:1.0 AS base
WORKDIR /app

# Install dependencies for the entire monorepo
FROM base AS deps
COPY package.json bun.lock ./
COPY turbo.json ./
COPY packages/prisma/package.json ./packages/prisma/
COPY apps/api/package.json ./apps/api/
RUN bun install --frozen-lockfile

# Build Prisma client
FROM base AS prisma
COPY --from=deps /app/node_modules ./node_modules
COPY packages/prisma ./packages/prisma
WORKDIR /app/packages/prisma
RUN bunx prisma migrate deploy && bunx prisma generate

# Build the API
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/packages/prisma ./packages/prisma
COPY . .
WORKDIR /app/apps/api
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app

# Copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/prisma ./packages/prisma
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/apps/api

# Expose port (adjust if your API uses a different port)
EXPOSE 4000

# Start the API
CMD ["bun", "run", "start"]