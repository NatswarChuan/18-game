# 🚀 PRODUCTION DEPLOYMENT & DEVOPS GUIDE
*(Valkyrie Protocol: Zero • Zero-to-Production • Client/Server Monorepo Deployment)*

---

## 📌 1. TỔNG QUAN HẠ TẦNG & CẤU TRÚC TRIỂN KHAI

Tài liệu này cung cấp hướng dẫn đầy đủ từ con số 0 để xây dựng, đóng gói và triển khai tựa game **VALKYRIE PROTOCOL: ZERO** lên môi trường Production (VPS / Cloud Server như AWS, DigitalOcean, Hetzner, GCP hoặc Bare-metal Server).

### 🏗️ Sơ Đồ Kiến Trúc Hệ Thống (Production Deployment Architecture):

```
                                  INTERNET (Users / Players)
                                              │
                                       [HTTPS :443] / [WSS :443]
                                              ▼
                        ┌───────────────────────────────────────────┐
                        │      NGINX REVERSE PROXY (SSL / TLS)      │
                        │    - Let's Encrypt Auto-Renewal           │
                        │    - Rate Limiting (DDoS Shield)          │
                        │    - Gzip / Brotli Static Compression     │
                        └─────────────┬─────────────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
       [HTTP Proxy :80]                              [WSS / WebSocket Proxy]
              ▼                                               ▼
┌───────────────────────────┐                   ┌───────────────────────────┐
│       CLIENT CONTAINER    │                   │      SERVER CONTAINER     │
│   (Vite/React Static Web) │                   │  (Node.js Combat Engine)  │
│    - Internal Nginx Alpine│                   │   - Fastify / Express     │
│    - 60 FPS Skia/Canvas   │                   │   - 20 Ticks/s Simulation │
│    - Waifu 18+ Assets     │                   │   - 8D Vector Equilibrium │
└───────────────────────────┘                   └─────────────┬─────────────┘
                                                              │
                                                              ▼
                                                ┌───────────────────────────┐
                                                │       REDIS CONTAINER     │
                                                │   - Room Registry State   │
                                                │   - Matchmaking Queue     │
                                                │   - Anti-Cheat Rate Cache │
                                                └───────────────────────────┘
```

---

## 💻 2. CẤU TRÚC THƯ MỤC PROJECT MONOREPO (CLIENT / SERVER SEPARATION)

Dự án được khởi tạo từ con số 0 theo mô hình Monorepo sạch sẽ:

```
valkyrie-protocol-zero/
├── apps/
│   ├── client/                  # Ứng dụng Client (Web & Mobile Expo/Vite)
│   │   ├── src/                 # Giao diện người dùng, Bàn cờ 3x3, Canvas 60fps
│   │   ├── public/              # Hình ảnh Waifu 18+, Audio, Shaders
│   │   ├── Dockerfile           # Multi-stage build Nginx Alpine
│   │   └── package.json
│   └── server/                  # Ứng dụng Server (Combat Engine, WebSocket)
│       ├── src/
│       │   ├── engine/          # 20 Ticks/s Deterministic Simulation Loop
│       │   ├── draft/           # Thuật toán 8D Vector Equilibrium (2-2-2-3)
│       │   ├── rooms/           # State Machine phòng đấu BO3/BO5
│       │   └── transport/       # WebSocket Gateway & MessagePack Encoder
│       ├── Dockerfile           # Multi-stage build Node.js Alpine
│       └── package.json
├── packages/
│   └── shared-domain/           # Thư viện dùng chung (Pure TypeScript)
│       ├── src/
│       │   ├── constants/       # Chỉ số cờ gốc (HP: 1000, ATK: 50, Armor: 20)
│       │   ├── types/           # WebSocket Packets, Board 3x3, Buff Vector 8D
│       │   └── formulas/        # Hàm tính sát thương, giảm giáp thuần túy
│       └── package.json
├── docker/
│   └── nginx/
│       ├── nginx.conf           # Cấu hình Reverse Proxy chính
│       └── conf.d/
│           └── default.conf     # Định tuyến Web + WebSocket
├── .env.example                 # Mẫu biến môi trường
├── docker-compose.yml           # Điều phối toàn bộ cụm Container
├── package.json                 # Quản lý Workspaces Monorepo
└── README.md
```

---

## ⚙️ 3. YÊU CẦU TIỀN ĐỀ TRÊN SERVER (PREREQUISITES)

Trước khi tiến hành triển khai trên máy chủ Linux (Ubuntu 22.04 LTS / 24.04 LTS):

1. **Cấu hình phần cứng khuyến nghị:**
   - **CPU:** Tối thiểu 2 Cores (Khuyến nghị 4 Cores cho 1,000 phòng đấu đồng thời).
   - **RAM:** Tối thiểu 2GB (Khuyến nghị 4GB - 8GB).
   - **Ổ cứng:** 20GB SSD trở lên.
2. **Cài đặt phần mềm cần thiết:**
   ```bash
   # Cập nhật hệ thống
   sudo apt update && sudo apt upgrade -y

   # Cài đặt Docker & Docker Compose Plugin
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER

   # Kiểm tra phiên bản
   docker --version
   docker compose version
   ```

---

## 🐳 4. CẤU HÌNH DOCKER & DOCKER-COMPOSE TỐI ƯU HÓA PRODUCTION

### 4.1. `apps/server/Dockerfile` (Tối ưu hóa đa tầng, Kích thước < 120MB)
```dockerfile
# Stage 1: Build Image
FROM node:20-alpine AS builder
WORKDIR /app

# Cài đặt pnpm
RUN npm install -g pnpm

# Copy toàn bộ cấu trúc workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared-domain ./packages/shared-domain
COPY apps/server ./apps/server

# Cài đặt dependencies và build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @valkyrie/shared-domain build
RUN pnpm --filter @valkyrie/server build

# Prune devDependencies
RUN pnpm prune --prod

# Stage 2: Production Minimal Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Tạo user không đặc quyền vì lý do bảo mật
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 valkyrie

COPY --from=builder --chown=valkyrie:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=valkyrie:nodejs /app/packages/shared-domain/dist ./packages/shared-domain/dist
COPY --from=builder --chown=valkyrie:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=valkyrie:nodejs /app/apps/server/package.json ./apps/server/package.json

USER valkyrie
EXPOSE 4000

CMD ["node", "apps/server/dist/main.js"]
```

# Stage 1: Build Expo Client Web Bundle
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared-domain ./packages/shared-domain
COPY apps/client ./apps/client

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @valkyrie/shared-domain build
# Export Expo Web Bundle
RUN pnpm --filter @valkyrie/client export:web

# Stage 2: Nginx Serve
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html
COPY docker/nginx/client-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.3. `docker-compose.yml` (Điều phối hoàn chỉnh)
```yaml
version: '3.8'

services:
  # 1. MongoDB NoSQL Database
  mongodb:
    image: mongo:7-jammy
    container_name: valkyrie-mongo
    restart: always
    environment:
      - MONGO_INITDB_DATABASE=valkyrie
    volumes:
      - mongo_data:/data/db
    networks:
      - valkyrie-net
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # 2. Redis Cache & Ephemeral Room State
  redis:
    image: redis:7-alpine
    container_name: valkyrie-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - valkyrie-net
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # 3. NestJS Server Combat Engine
  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    container_name: valkyrie-server
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=4000
      - MONGO_URI=mongodb://mongodb:27017/valkyrie
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=https://${DOMAIN_NAME}
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - valkyrie-net
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4000/api/health"]
      interval: 15s
      timeout: 5s
      retries: 3

  # 4. Expo Client Frontend Web
  client:
    build:
      context: .
      dockerfile: apps/client/Dockerfile
    container_name: valkyrie-client
    restart: always
    networks:
      - valkyrie-net

  # 5. Gateway Nginx Reverse Proxy & SSL
  nginx:
    image: nginx:alpine
    container_name: valkyrie-gateway
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - client
      - server
    networks:
      - valkyrie-net

volumes:
  mongo_data:
  redis_data:

networks:
  valkyrie-net:
    driver: bridge
```

---

## 🌐 5. CẤU HÌNH NGINX REVERSE PROXY & WEBSOCKET

File `docker/nginx/conf.d/default.conf` đảm bảo chuyển tiếp mượt mà gói tin WebSocket và hỗ trợ giao thức bảo mật:

```nginx
# Map connection upgrade headers for WebSocket
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

# Redirect all HTTP to HTTPS
server {
    listen 80;
    server_name game.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Main Server
server {
    listen 443 ssl http2;
    server_name game.example.com;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/game.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/game.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Client Web App Static Files
    location / {
        proxy_pass http://client:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Server WebSocket Stream (/ws)
    location /ws {
        proxy_pass http://server:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Long timeout for real-time gaming sessions
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    # REST API & Healthchecks (/api)
    location /api {
        proxy_pass http://server:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔒 6. BẢN MẪU BIẾN MÔI TRƯỜNG (`.env.production`)

Tạo file `.env` tại thư mục gốc của dự án:

```bash
# Domain & Network
DOMAIN_NAME=game.example.com

# Server Environment
NODE_ENV=production
PORT=4000

# Redis Secrets
REDIS_PASSWORD=Valkyrie_Super_Secret_Redis_Pass_2026!

# JWT & Security
JWT_SECRET=super_secure_jwt_secret_valkyrie_protocol_zero_key_3x3

# Combat Simulation Invariants
TICK_RATE_HZ=20
MATCH_TIMEOUT_SECONDS=180
```

---

## 🚀 7. QUY TRÌNH DEPLOY TỪ CON SỐ 0 TRÊN SERVER THỰC TẾ

### Bước 1: Clone Mã Nguồn Về Server
```bash
git clone https://github.com/your-org/valkyrie-protocol-zero.git
cd valkyrie-protocol-zero
```

### Bước 2: Thiết Lập Biến Môi Trường
```bash
cp .env.example .env
nano .env  # Điền domain name và các mật khẩu an toàn
```

### Bước 3: Đăng Ký Chứng Chỉ SSL Miễn Phí (Certbot)
```bash
# Khởi động Nginx tạm thời để xác thực Certbot qua cổng 80
docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email admin@example.com \
    -d game.example.com \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot
```

### Bước 4: Khởi Động Toàn Bộ Hệ Thống Bằng 1 Câu Lệnh
```bash
docker compose up -d --build
```

### Bước 5: Kiểm Tra Trạng Thái Vận Hành
```bash
# Kiểm tra danh sách container đang chạy
docker compose ps

# Xem logs thời gian thực của Server Combat Engine
docker compose logs -f server

# Kiểm tra endpoint sức khỏe
curl -I https://game.example.com/api/health
```

---

## 🔄 8. QUY TRÌNH NÂNG CẤP KHÔNG GIÁN ĐOẠN (ZERO-DOWNTIME ROLLING UPDATE)

Khi có bản cập nhật code mới từ Git:

```bash
# 1. Kéo code mới nhất
git pull origin main

# 2. Build trước image mới trong background
docker compose build --pull

# 3. Khởi động lại dịch vụ không gián đoạn
docker compose up -d --no-deps --build server
docker compose up -d --no-deps --build client

# 4. Dọn dẹp images cũ
docker image prune -f
```

---

## 🆘 9. KHẮC PHỤC SỰ CỐ PHỔ BIẾN (TROUBLESHOOTING)

1. **Lỗi WebSocket Connection Failed (`Error during WebSocket handshake: 400/502`):**
   - Kiểm tra khối `map $http_upgrade $connection_upgrade` trong file cấu hình Nginx.
   - Đảm bảo biến `proxy_set_header Upgrade` và `Connection` đã được bật.
2. **Container Server Bị Crash Liên Tục (`OOMKilled`):**
   - Kiểm tra rò rỉ RAM trong Game Loop. Mọi `MatchRoom` khi kết thúc loạt trận phải gọi `room.dispose()` để hủy toàn bộ intervals và giải phóng tham chiếu.
3. **Client Bị Trắng Màn Hình (MIME type mismatch):**
   - Đảm bảo Nginx client cấu hình đúng `try_files $uri $uri/ /index.html;` để hỗ trợ Single Page Application (SPA).
