---
name: local-dev-bootstrap
description: "Tự động phát hiện môi trường, cài đặt toàn bộ thư viện dependencies, biên dịch packages/shared-domain, và khởi động cả Client lẫn Server ở chế độ nền (IsDaemon: true) để chạy thử nghiệm local ngay lập tức."
---

# QUY TRÌNH TỰ ĐỘNG THIẾT LẬP & CHẠY LOCAL (/local-dev-bootstrap)

Khi kỹ năng này được kích hoạt, Agent sẽ thực thi tự động chuỗi **5 bước** sau qua công cụ `run_command` trên terminal:

## Bước 1: Kiểm Tra Công Cụ Runtimes
Agent tự động chạy kiểm tra phiên bản trên Windows PowerShell:
```powershell
node -v
pnpm -v
```
- Nếu `pnpm` chưa được cài đặt, Agent tự động chạy:
  ```powershell
  npm install -g pnpm
  ```

## Bước 2: Cài Đặt Toàn Bộ Thư Viện (Monorepo Dependencies)
Agent chạy lệnh cài đặt cho toàn bộ workspaces:
```powershell
pnpm install
```

## Bước 3: Biên Dịch Gói Chia Sẻ (Shared Domain Build)
Trước khi chạy Server hay Client, gói thư viện toán học và kiểu dữ liệu bắt buộc phải được biên dịch:
```powershell
pnpm --filter @valkyrie/shared-domain build
```

## Bước 4: Khởi Động Server Local Trong Nền (Background Daemon)
Agent gọi `run_command` với tham số `IsDaemon: true`:
- **Lệnh thực thi:**
  ```powershell
  pnpm --filter @valkyrie/server dev
  ```
- **Kiểm tra trạng thái:** Đợi 2-3 giây và gửi request kiểm tra `http://localhost:4000/health`.

## Bước 5: Khởi Động Client Web Local Trong Nền (Background Daemon)
Agent gọi `run_command` với tham số `IsDaemon: true`:
- **Lệnh thực thi:**
  ```powershell
  pnpm --filter @valkyrie/client dev
  ```
- **Kiểm tra trạng thái:** Đợi sẵn sàng trên `http://localhost:5173` (hoặc `http://localhost:8081`).

## Bước 6: Sẵn Sàng Trải Nghiệm & Playtest
Báo cáo cho người dùng biết cả Client và Server đã chạy thành công trên máy local, sẵn sàng mở trình duyệt tự động bằng `/autonomous-browser-playtest` để bắt đầu chơi thử!
