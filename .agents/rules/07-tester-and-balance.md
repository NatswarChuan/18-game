---
trigger: model_decision
description: "Quy tắc kiểm thử độc lập, playtest tự động bằng browser_subagent, kiểm toán cân bằng Vector 12D và thẩm định Game Feel khắt khe."
---

# QUY TẮC KIỂM THỬ ĐỘC LẬP, CÂN BẰNG GAME & QUẢN TRỊ TICKETS SỰ CỐ

Khi thực hiện kiểm thử, đánh giá chất lượng hoặc nghiệm thu Cổng 6:

1. **Bắt Buộc Sử Dụng `browser_subagent` Cho Playtest Thực Tế:**
   - Không được đánh giá chủ quan bằng cách đọc code. Bắt buộc phải khởi chạy `browser_subagent` để mở trình duyệt Chromium truy cập Web-App tại `http://localhost:5173` (hoặc `http://localhost:8081`).
   - Thao tác đầy đủ một vòng đời ván đấu: Chọn Buff $\rightarrow$ Sắp xếp 6 quân cờ $\rightarrow$ Khóa đội hình $\rightarrow$ Chứng kiến Auto-Combat $\rightarrow$ Ghi lại video WebP và log vào Artifacts.
2. **Kiểm Toán Cân Bằng Toán Học Nghiêm Ngặt:**
   - Chạy script kiểm toán cân bằng và giả lập trận đấu:
     ```bash
     python3 .agents/skills/game-balance-verifier/scripts/verify_12d_equilibrium.py
     ```
   - Tỷ lệ thắng (Winrate) của mọi nhánh Buff phải nằm trong khoảng $48\% - 52\%$, không nhánh nào vượt quá $53\%$.
   - Sai số bất đối xứng của thuật toán Vector 12D $\epsilon \le 0.05$.
3. **Quy Trình Ghi Nhận Ticket Sự Cố Vào `TICKETS.md` (Mandatory Bug Ticketing):**
   - Khi phát hiện bất kỳ lỗi nào (Logic engine, Desync, Khựng khung hình, Rách giáp lệch layer, Lỗi mạng, Vi phạm NPE, hoặc Thiếu TSDoc song ngữ), `qa-balance-tester` **bắt buộc phải ghi nhận ticket** vào file [`TICKETS.md`](../memory/TICKETS.md).
   - Cấu trúc Ticket bắt buộc bao gồm:
     - **Ticket ID**: `TK-XXX` tăng dần.
     - **Phân loại tầng (Layer)**: `Shared Domain` | `Backend NestJS` | `Frontend Expo` | `Network WebSocket` | `Database NoSQL`.
     - **Mức độ (Severity)**: `Blocker` | `Critical` | `Major` | `Minor`.
     - **Tác tử chỉ định (Assignee)**: `backend-engineer`, `frontend-engineer`, hoặc cả hai.
     - **Mô tả & Bước tái hiện (Reproduction Steps)**: Rõ ràng, kèm log lỗi hoặc ảnh chụp màn hình.
4. **Vòng Lặp Phối Hợp Sửa Lỗi & Retest Đến Khi Đạt Chuẩn (Collaborative Fix & Retest Loop):**
   - **Giai đoạn Fix**: `backend-engineer` và `frontend-engineer` phối hợp sửa lỗi theo đúng phân công:
     - Áp dụng kiểu dữ liệu tường minh 100% (cấm `any`/`object`).
     - Phủ 100% NPE guard (`?.`, `??`, type guards, cấm `!`).
     - Tuân thủ phân tầng sạch (Clean Architecture) và chú thích chuẩn Google Code Doc song ngữ Anh/Việt.
     - Cập nhật nhật ký xử lý trong Ticket và chuyển trạng thái sang `RESOLVED_BE` hoặc `RESOLVED_FE`.
   - **Giai đoạn Retest**: Sau khi nhận thông báo `RESOLVED`:
     - `qa-balance-tester` **bắt buộc phải khởi chạy lại** `browser_subagent` hoặc test suite để kiểm thử lại chính xác kịch bản gây lỗi đó.
     - Nếu còn lỗi $\rightarrow$ Chuyển trạng thái sang `REOPENED_FAIL` và yêu cầu fix lại.
     - Chỉ khi chức năng hoạt động hoàn hảo, không còn lỗi và đạt chuẩn 60 FPS $\rightarrow$ Chuyển sang `CLOSED_PASS`.
5. **Tiêu Chí Ký Duyệt Nghiêm Ngặt (Zero Unresolved Tickets):**
   - Điều kiện tiên quyết để nghiệm thu Cổng 6: **100% tickets trong [`TICKETS.md`](../memory/TICKETS.md) phải đạt trạng thái `CLOSED_PASS`**.
   - Nếu còn dù chỉ 1 ticket ở trạng thái `OPEN`, `IN_PROGRESS`, hoặc `REOPENED_FAIL`, Cổng 6 **tuyệt đối bị khóa**, từ chối chuyển sang Pha 7!
   - Đánh giá trung thực cảm giác va đập (Impact Feel), độ trễ phản hồi, độ thỏa mãn khi lật kèo với điểm số $\ge 8.5/10$.

