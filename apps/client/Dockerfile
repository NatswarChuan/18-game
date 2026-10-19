# Multi-stage Dockerfile for @valkyrie/client
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo config
COPY package.json pnpm-workspace.yaml tsconfig.base.json .npmrc ./
COPY packages/shared-domain ./packages/shared-domain
COPY apps/client ./apps/client

# Install dependencies and approve builds
RUN pnpm install --frozen-lockfile=false
RUN pnpm approve-builds --all

# Build shared-domain and client
RUN pnpm --filter @valkyrie/shared-domain build
RUN pnpm --filter @valkyrie/client build

# Production static server stage
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
