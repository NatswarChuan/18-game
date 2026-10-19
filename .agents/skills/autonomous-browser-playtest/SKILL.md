---
name: autonomous-browser-playtest
description: "Sử dụng browser_subagent của Antigravity tự động mở Web-App, trực tiếp chơi thử một ván đấu hoàn chỉnh, ghi lại video WebP/screenshots và thẩm định khắt khe cảm giác chơi, đồ họa 18+ và tốc độ khung hình."
---

# QUY TRÌNH CHƠI THỬ TỰ ĐỘNG BẰNG TRÌNH DUYỆT (/autonomous-browser-playtest)

Khi kích hoạt kỹ năng này, `qa-balance-tester` sẽ thực hiện quy trình playtest tự động 4 bước:

## Bước 1: Khởi Động Trình Duyệt (`browser_subagent`)
Khởi chạy subagent `browser_subagent` với địa chỉ Client Web-App (mặc định `http://localhost:5173` hoặc `http://localhost:8081`).

## Bước 2: Thao Tác Trọn Vẹn Vòng Đời Trận Đấu
1. **Pha 1 — Draft 9 Buff (20 giây):**
   - Đọc danh sách 9 Buff hiển thị trên màn hình.
   - Bấm chọn 1 Buff phù hợp với trường phái chiến thuật.
2. **Pha 2 — Sắp Đặt Bàn Cờ 3x3 (20 giây):**
   - Kéo thả chính xác 6 Valkyrie vào 6 ô trên lưới 3x3 (đảm bảo để lại đúng 3 ô trống).
   - Thử nghiệm đặt quân vào Ô 2 Đột phá, Ô 4/6 Bọc sườn, hoặc Hàng 3 Xạ thủ.
   - Bấm nút Khóa Đội Hình (Lock-In).
3. **Pha 3 — Quan Sát Giao Tranh Tự Động (Auto-Combat):**
   - Chứng kiến giao tranh thời gian thực 20 ticks/s từ Server.
   - Kiểm tra hiệu ứng biến đổi trang phục rách giáp 18+ (Cloth Damage) khi HP giảm.
   - Kiểm tra hoạt cảnh Climax Ultimate cut-in khi đầy 100 Mana.
   - Đo đạc tốc độ khung hình (FPS) và theo dõi log mạng WebSocket.

## Bước 3: Thu Thập Dữ Liệu Thực Tế
- Chụp ảnh màn hình ở cả 3 pha: Draft, Xếp cờ, Giao tranh Climax.
- Ghi lại bản ghi video WebP lưu vào thư mục Artifacts của Antigravity.
- Thu thập toàn bộ Console errors và Network latency logs.

## Bước 4: Chấm Điểm & Báo Cáo
- Ghi nhận điểm số chi tiết vào [`PLAYTEST_SCORECARD.md`](../../memory/PLAYTEST_SCORECARD.md).
- Nếu có bất kỳ tiêu chí nào dưới **8.5/10** hoặc tồn tại lỗi **Blocker**, ngay lập tức yêu cầu đội ngũ Refactor.

## Bước 5: Mở Ticket Sự Cố & Vòng Lặp Phối Hợp Sửa Lỗi ([`TICKETS.md`](../../memory/TICKETS.md))
1. **Ghi nhận Ticket**: Khi phát hiện lỗi hoặc độ trễ/giật hình, `qa-balance-tester` lập tức mở ticket `[TK-XXX]` tại [`TICKETS.md`](../../memory/TICKETS.md).
2. **BE / FE Tiếp Nhận & Sửa Lỗi**: `backend-engineer` và `frontend-engineer` phối hợp sửa lỗi ở đúng tầng phụ trách, đảm bảo kiểu dữ liệu tường minh (0 `any`/`object`), cover 100% NPE guard, và comment song ngữ Anh/Việt.
3. **Retest Bắt Buộc**: Sau khi BE/FE chuyển ticket sang `RESOLVED`, `qa-balance-tester` chạy lại `browser_subagent` để test lại đúng kịch bản đó.
4. **Đóng Ticket**: Chỉ khi test lại thực tế pass 100% và đạt 60 FPS, ticket mới được chuyển sang `CLOSED_PASS`.

