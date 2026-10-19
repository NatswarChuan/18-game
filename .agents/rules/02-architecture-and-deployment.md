---
trigger: glob
globs:
  - "apps/**"
  - "packages/**"
  - "docker/**"
  - "*docker*"
  - "*deployment*"
  - "package.json"
description: "Quy tắc kiến trúc Monorepo, phân tách rạch ròi Client/Server từ con số 0, và tiêu chuẩn đóng gói Docker/Nginx chuẩn Production."
---

# QUY TẮC KIẾN TRÚC & TRIỂN KHAI PRODUCTION (ARCHITECTURE & DEPLOYMENT)

Khi chỉnh sửa hoặc tạo mới các file liên quan đến cấu trúc Monorepo, cấu hình hệ thống hoặc Docker:

1. **Phân Tách Rạch Ròi Client / Server & Công Nghệ Chuẩn Hóa:**
   - **`packages/shared-domain/`:** Viết 100% bằng Pure TypeScript, 0 runtime dependency. Tuyệt đối không import Expo/React Native, NestJS, Node `fs`, hay database driver vào đây.
   - **`apps/server/`:** Xây dựng trên nền tảng **NestJS** với 100% Strict TypeScript, quản lý State Machine qua `@WebSocketGateway()`, và lưu trữ qua **NoSQL (MongoDB & Redis)**.
   - **`apps/client/`:** Xây dựng bằng **Expo SDK (React Native)** render đồng nhất cả Mobile và Web, đóng vai trò Dumb Terminal 60 FPS.
2. **Tiêu Chuẩn Đóng Gói Docker (Production-Ready):**
   - Mọi Dockerfile phải áp dụng kỹ thuật **Multi-stage build**: Tầng 1 build code, Tầng 2 chạy runtime tối thiểu (Alpine Linux).
   - Kích thước image Server không vượt quá 150MB; Image Client phục vụ qua Nginx Alpine không quá 50MB.
   - Không chạy container bằng quyền `root`, phải tạo user hệ thống không đặc quyền.
3. **Cấu Hình Nginx Reverse Proxy & WebSocket:**
   - Phải có khối `map $http_upgrade $connection_upgrade` cho kết nối WebSocket.
   - Bắt buộc kích hoạt nén Gzip/Brotli cho tài nguyên tĩnh của Client.
   - Cung cấp file `.env.example` đầy đủ mọi tham số, không hardcode mật khẩu hay secret keys vào mã nguồn.
