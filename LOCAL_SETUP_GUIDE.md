# 💻 LOCAL DEVELOPMENT & AUTONOMOUS BOOTSTRAP GUIDE
*(Valkyrie Protocol: Zero • Zero-Deployment Local Run • Autonomous Multi-Agent Setup)*

---

## 📌 1. NGUYÊN TẮC "LOCAL-FIRST & ZERO-DEPENDENCY INFRASTRUCTURE"

Để hỗ trợ phát triển, kiểm thử và trải nghiệm tức thì trên máy tính cá nhân của người dùng mà **không bắt buộc phải deploy lên máy chủ hay cài đặt Docker/Redis phức tạp**:

1. **Tự Động Hóa 100% Bởi AI Agents (Autonomous Agent Execution):**
   - Các AI Subagents (`system-architect`, `backend-engineer`, `frontend-engineer`, `qa-balance-tester`) có toàn quyền và **bắt buộc phải chủ động sử dụng công cụ `run_command`** để:
     - Kiểm tra môi trường Node.js / pnpm / Python trên máy local.
     - Tự động chạy `pnpm install` (hoặc `npm install`) cho toàn bộ monorepo.
     - Tự động biên dịch `packages/shared-domain`.
     - Tự động khởi chạy Server và Client ở chế độ chạy ngầm (`IsDaemon: true`).
   - **Tuyệt đối không yêu cầu người dùng phải tự tay mở terminal gõ lệnh cài đặt** nếu Agent có thể tự thực thi!
2. **Cơ Chế Thay Thế Không Cần Hạ Tầng Ngoài (In-Memory Fallback):**
   - Khi chạy Local, Server tự động kích hoạt chế độ **`IN_MEMORY_MODE = true`** nếu không tìm thấy Redis:
     - Dùng `Map<string, MatchRoom>` lưu trữ trạng thái phòng đấu trực tiếp trên RAM của tiến trình Node.js.
     - Dùng bộ đệm in-memory cho Rate Limiter và Matchmaking Queue.
     - Đảm bảo người chơi có thể tải mã nguồn về và chạy ngay lập tức mà chỉ cần Node.js!

---

## 🚀 2. QUY TRÌNH BOOTSTRAP MÔI TRƯỜNG LOCAL TỰ ĐỘNG

Khi khởi tạo hoặc chạy dự án từ con số 0 trên máy tính Windows/macOS/Linux:

```
┌─────────────────────────────────────────────────────────────────────────┐
│              AUTONOMOUS LOCAL BOOTSTRAP PIPELINE (Agents)               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
     ┌───────────────────────────────┼───────────────────────────────┐
     ▼                               ▼                               ▼
[1. Kiểm Tra Runtime]     [2. Cài Đặt Dependencies]    [3. Build Shared Domain]
- node -v (>= 20)         - pnpm install (hoặc npm)    - pnpm --filter         
- pnpm -v                 - Cài đặt toàn bộ workspaces   @valkyrie/shared-domain
                                                         build                 
     │                                                               │
     └───────────────────────────────┬───────────────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
       [4. Khởi Chạy NestJS Server]    [5. Khởi Chạy Expo Client]
       - apps/server (Port 4000)       - apps/client (Web & Mobile)
       - In-Memory NoSQL Fallback      - Expo SDK 52+ Skia 60fps
       - pnpm start:dev (Nest Watch)   - npx expo start --web
       - Background Daemon Task        - Background Daemon Task        
```

### Script Khởi Động Nhanh (Windows PowerShell & Bash):
Tạo file `scripts/bootstrap-local.ps1` tại thư mục gốc:

```powershell
Write-Host "🌸 [Valkyrie Protocol: Zero] Đang khởi tạo môi trường Local..." -ForegroundColor Cyan

# 1. Kiểm tra Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Chưa cài đặt Node.js! Vui lòng cài Node.js >= 20.x."
    exit 1
}

# 2. Cài đặt pnpm nếu chưa có
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Đang cài đặt pnpm toàn cục..." -ForegroundColor Yellow
    npm install -g pnpm
}

# 3. Cài đặt toàn bộ dependencies trong Monorepo
Write-Host "📥 Đang tải và cài đặt thư viện..." -ForegroundColor Yellow
pnpm install

# 4. Biên dịch gói dùng chung packages/shared-domain
Write-Host "⚙️ Đang biên dịch packages/shared-domain..." -ForegroundColor Yellow
pnpm --filter @valkyrie/shared-domain build

Write-Host "✅ Môi trường Local đã sẵn sàng 100%!" -ForegroundColor Green
```

---

## ⚙️ 3. LỆNH ĐIỀU KHIỂN CHẠY LOCAL (LOCAL DEV COMMANDS)

Cấu hình sẵn trong `package.json` ở thư mục gốc:

```json
{
  "name": "valkyrie-protocol-zero",
  "private": true,
  "scripts": {
    "setup:local": "pnpm install && pnpm --filter @valkyrie/shared-domain build",
    "dev": "concurrently -n \"NESTJS,EXPO\" -c \"cyan,magenta\" \"pnpm run dev:server\" \"pnpm run dev:client\"",
    "dev:server": "pnpm --filter @valkyrie/server start:dev",
    "dev:client": "pnpm --filter @valkyrie/client start --web",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

---

## 🌐 4. CẤU HÌNH BIẾN MÔI TRƯỜNG LOCAL (`.env.local`)

Tạo tự động file `.env.local` cho Server và Client mà không cần thông tin domain:

### Cho `apps/server/.env.local`:
```bash
NODE_ENV=development
PORT=4000
USE_IN_MEMORY_STORE=true
MONGO_URI=mongodb://localhost:27017/valkyrie # Tự động bỏ qua nếu USE_IN_MEMORY_STORE=true
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
CORS_ORIGIN=http://localhost:8081
JWT_SECRET=local_dev_secret_valkyrie_2026
```

### Cho `apps/client/.env.local`:
```bash
EXPO_PUBLIC_SERVER_HTTP_URL=http://localhost:4000
EXPO_PUBLIC_SERVER_WS_URL=ws://localhost:4000/ws
```

---

## 🤖 5. HƯỚNG DẪN DÀNH RIÊNG CHO CÁC AGENT KHI LÀM VIỆC LOCAL

1. **`system-architect`:**
   - Tạo sẵn các script bootstrap local (`scripts/bootstrap-local.ps1` và script npm).
   - Thiết kế cờ `USE_IN_MEMORY_STORE` trong Server để không phụ thuộc Redis khi chạy local.
2. **`backend-engineer`:**
   - Chủ động dùng `run_command` chạy `pnpm --filter @valkyrie/server start:dev` với `IsDaemon: true`.
   - Xác nhận cổng `http://localhost:4000/api/health` trả về 200 OK trước khi bàn giao.
3. **`frontend-engineer`:**
   - Chủ động dùng `run_command` chạy `pnpm --filter @valkyrie/client start --web` với `IsDaemon: true`.
   - Xác nhận cổng Expo Web (mặc định `http://localhost:8081` hoặc `http://localhost:5173`) render mượt mà 60 FPS.
4. **`qa-balance-tester`:**
   - Trước khi gọi `browser_subagent`, kiểm tra xem 2 server local đã chạy chưa. Nếu chưa chạy, tự gõ lệnh khởi động mà không cần hỏi người dùng!
   - Điều hướng `browser_subagent` đến `http://localhost:5173` để tự động playtest.
