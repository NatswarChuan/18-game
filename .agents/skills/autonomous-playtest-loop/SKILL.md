---
name: autonomous-playtest-loop
description: "Vòng lặp tự động hóa khép kín chuẩn Production V2: Kiểm toán Code (SonarQube/Coverity/BlackDuck) -> Mở Web-App tự chơi thử qua browser_subagent -> Triệu hồi đánh giá khắt khe từ QA Balance Tester & Art Designer -> Refactor & Phát triển -> Lặp lại cho đến khi đạt chuẩn."
---

# QUY TRÌNH VÒNG LẶP PLAYTEST & PRODUCTION QUALITY GATE (/autonomous-playtest-loop)

Khi kỹ năng này được kích hoạt, hãy thực thi nghiêm ngặt vòng lặp **5 bước** sau đây và KHÔNG DỪNG LẠI cho đến khi đạt toàn bộ điều kiện thoát (Exit Criteria):

## Bước 1: Chốt chặn Chất lượng Code & Khởi động Môi trường (Static Gate & Boot)
1. Chạy trình quét tĩnh **SonarQube / Coverity / Black Duck**:
   ```bash
   python3 .agents/skills/production-quality-gate/scripts/audit_sonar_coverity_blackduck.py .
   ```
   Đồng thời chạy `npx tsc --noEmit` và script kiểm tra cân bằng toán học:
   ```bash
   python3 .agents/skills/game-balance-verifier/scripts/verify_12d_equilibrium.py
   ```
2. Kiểm tra xem Server và Expo Web-App đã chạy chưa (mặc định tại `http://localhost:8081` hoặc `http://localhost:5173`). Nếu chưa, khởi chạy ở chế độ background và đợi sẵn sàng.

## Bước 2: Mở Web-App & Tự Trải Nghiệm Gameplay (Interactive Browser Playtest)
1. Sử dụng công cụ `browser_subagent` khởi chạy phiên duyệt trực tiếp URL của Web-App.
2. Thực hiện một lượt chơi thật sự:
   - Quan sát màn hình **Draft 9 Buff** (kiểm tra đồng hồ đếm ngược 20s, thông tin 9 Buff cá nhân hóa từ Vector DB). Chọn 1 Buff.
   - Trong pha **Xếp đội hình 3x3**, kéo thả đủ **6 quân cờ vào 9 ô** (thử nghiệm đặt quân vào Ô 2 Đột phá, Ô 4/6 Bọc lót, và Hàng 3 Xạ thủ).
   - Bấm bắt đầu giao tranh, quan sát toàn bộ diễn biến Real-time Auto-Battle cho tới khi kết thúc Round và chuyển sang Round 2.
   - Thu thập ảnh chụp màn hình (Screenshots) ở cả 3 pha và toàn bộ Console/Network logs.

## Bước 3: Hội Đồng Thẩm Định Độc Lập 3 Chiều (Parallel Quality Review)
Thực hiện đánh giá toàn diện 3 góc độ:
1. **`secops-quality-gate`**: Kiểm toán mã nguồn theo tiêu chuẩn **SonarQube** (Clean Code, Complexity $\le 15$, 0 `any`), **Coverity SAST** (0 Resource/Memory Leaks, Null safety, Race condition guard) và **Black Duck SCA** (License & CVE compliance).
2. **`qa-balance-tester` (Senior Gameplay & Hardcore Balance Critic)**: Truyền ảnh chụp màn hình, log giao tranh và trạng thái trải nghiệm để nhận bản đánh giá chuyên sâu về meta game, tính khắc chế, cảm giác ra đòn và cân bằng 12D Vector.
3. **`art-designer` (Lead Visual & Erotic Art Director)**: Đánh giá chất lượng thị giác qua ảnh chụp màn hình các pha và mã nguồn UI/Model/VFX, bao gồm: bố cục UI 3x3, Model nhân vật 18+, hiệu ứng rách giáp (Cloth Damage) và hoạt cảnh Climax Ultimate.

## Bước 4: Tổng Hợp, Mở Ticket & Refactor Chuẩn Production (Ticket Tracking & Clean Refactor)
1. Ghi kết quả của các kiểm tra vào [PLAYTEST_SCORECARD.md](../../memory/PLAYTEST_SCORECARD.md).
2. Nếu **`secops-quality-gate` trả về `FAIL`**, HOẶC **điểm trung bình của `qa-balance-tester` / `art-designer` `< 8.5/10`**, HOẶC còn bất kỳ lỗi **Blocker/Critical/NPE/Thiếu TSDoc song ngữ** nào:
   - Mở Ticket tương ứng trong [TICKETS.md](../../memory/TICKETS.md) với định danh `TK-XXX`.
   - Phân công cho `backend-engineer` và `frontend-engineer` cùng nhau fix.
   - Trực tiếp refactor tuân thủ tuyệt đối [CODING_STANDARDS_PRODUCTION.md](../../../CODING_STANDARDS_PRODUCTION.md) (Kiểu tường minh 100%, Phủ 100% NPE guard, TSDoc song ngữ Anh/Việt, Clean Architecture).
   - Ghi nhận giải pháp vào [SOLUTION.md](../../memory/SOLUTION.md) và cập nhật Fix Log trong `TICKETS.md` sang trạng thái `RESOLVED`.

## Bước 5: Lặp Lại Vòng Lặp & Retest Bắt Buộc (Retest Loop Condition)
- Ngay sau khi BE/FE hoàn tất fix, **QUAY LẠI BƯỚC 1 & BƯỚC 2** để chạy lại test suite và mở lại Web-App chơi thử đúng kịch bản bị lỗi.
- Chỉ chuyển trạng thái Ticket sang `CLOSED_PASS` khi bài test lại thành công 100%.
- Chỉ kết thúc vòng lặp khi:
  1. `secops-quality-gate` đạt **`PASS` (0 vi phạm SonarQube / Coverity / Black Duck)**.
  2. `qa-balance-tester` đạt **`PASS` ($\ge 8.5/10$, 0 Blocker)**.
  3. `art-designer` đạt **`PASS` ($\ge 8.5/10$, 0 Blocker)**.
  4. **100% Tickets trong [TICKETS.md](../../memory/TICKETS.md) đạt trạng thái `CLOSED_PASS`**.

