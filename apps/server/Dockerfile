# Multi-stage Dockerfile for @valkyrie/server
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo config
COPY package.json pnpm-workspace.yaml tsconfig.base.json .npmrc ./
COPY packages/shared-domain ./packages/shared-domain
COPY apps/server ./apps/server

# Install dependencies and approve builds
RUN pnpm install --frozen-lockfile=false
RUN pnpm approve-builds --all

# Build shared-domain and server
RUN pnpm --filter @valkyrie/shared-domain build
RUN pnpm --filter @valkyrie/server build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/packages/shared-domain/dist ./packages/shared-domain/dist
COPY --from=builder /app/packages/shared-domain/package.json ./packages/shared-domain/package.json
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules
COPY deliverables/phase-3-buff-system/buffs-catalog.json ./deliverables/phase-3-buff-system/buffs-catalog.json

EXPOSE 4000

CMD ["node", "apps/server/dist/main.js"]
