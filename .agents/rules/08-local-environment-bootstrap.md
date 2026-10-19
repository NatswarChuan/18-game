---
trigger: always_on
description: "Quy tắc bắt buộc: Các Agent phải chủ động tự cài đặt thư viện/môi trường và khởi chạy Local Dev Servers qua run_command mà không cần yêu cầu deploy hay làm phiền người dùng."
---

# QUY TẮC TỰ ĐỘNG THIẾT LẬP MÔI TRƯỜNG & CHẠY LOCAL (ALWAYS-ON)

Mọi Subagent (`system-architect`, `backend-engineer`, `frontend-engineer`, `qa-balance-tester`) phải tuân thủ nghiêm ngặt các điều khoản sau:

## 1. Quyền Năng & Trách Nhiệm Thực Thi Lệnh Chủ Động
- **Không Hỏi Quyền Tầm Thường:** Khi cần cài đặt dependencies, biên dịch mã nguồn, hay chạy server, Agent **bắt buộc phải chủ động chạy lệnh** qua công cụ `run_command` (PowerShell trên Windows). Tuyệt đối không yêu cầu người dùng phải tự mở terminal hay hỏi xin phép chạy các lệnh thông thường như `npm install`, `pnpm install`, `pnpm build`.
- **Tự Động Phát Hiện & Khắc Phục Lỗi Môi Trường:**
  - Nếu thiếu `pnpm`, tự chạy `npm install -g pnpm`.
  - Nếu gặp lỗi xung đột node_modules, tự động xóa và cài đặt lại (`pnpm install --force`).

## 2. Khởi Chạy Local Dev Server Ở Chế Độ Daemon
- Khi khởi động Server (`apps/server`) hoặc Client (`apps/client`), Agent **bắt buộc đặt tham số `IsDaemon: true`** trong công cụ `run_command` để server chạy nền ổn định:
  - Backend Local: `pnpm --filter @valkyrie/server dev` (Cổng mặc định: `http://localhost:4000`).
  - Frontend Local: `pnpm --filter @valkyrie/client dev` (Cổng mặc định: `http://localhost:5173` hoặc `http://localhost:8081`).
- Sau khi khởi động, Agent chủ động gửi request kiểm tra endpoint `/health` để xác nhận server đã sẵn sàng.

## 3. Kiến Trúc Không Phụ Thuộc Hạ Tầng Ngoài Khi Chạy Local (Zero-Dependency)
- **In-Memory Store Fallback:** Khi chạy trên máy cá nhân của người dùng, Server không được phép bắt buộc phải có Docker hay Redis đang chạy. Nếu không kết nối được Redis, Server phải tự động kích hoạt `USE_IN_MEMORY_STORE = true` để lưu phòng đấu trực tiếp trên RAM.
- Mục tiêu tối thượng: Người dùng chỉ cần máy tính có Node.js là Agent có thể tự động dựng và chạy toàn bộ game từ con số 0!
