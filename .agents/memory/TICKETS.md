# 🎫 PHIẾU THEO DÕI SỰ CỐ & LỖI KIỂM THỬ (QA BUG TICKETS TRACKER)
*(Dự án: Valkyrie Protocol: Zero • Quản trị bởi qa-balance-tester, backend-engineer & frontend-engineer)*

---

## 📊 BẢNG TỔNG QUAN TICKETS HIỆN TẠI

| Ticket ID | Tiêu Đề Sự Cố | Phân Loại Tầng (Layer) | Mức Độ Nghiêm Trọng | Người Xử Lý (Assignee) | Trạng Thái (Status) | Lượt Retest |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TK-001** | Khắc phục Type Check & Unused Imports theo chuẩn Strict | Monorepo / BE & FE | Major | `system-architect` | `CLOSED_PASS` | 1 |
| **TK-002** | Đồng bộ hóa kết nối WebSocket & Live Combat Telemetry 20Hz | Network / Protocol | Minor | `backend-engineer` | `CLOSED_PASS` | 1 |

*Trạng thái hợp lệ:* `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED_BE` / `RESOLVED_FE` $\rightarrow$ `RETESTING` $\rightarrow$ `CLOSED_PASS`.

---

## 📝 DANH SÁCH CHI TIẾT TỪNG TICKET

### [TK-001] Khắc phục Type Check & Unused Imports theo chuẩn Strict
- **Thời gian tạo:** 2026-10-19 23:02:00
- **Phân loại tầng:** Shared Domain & Backend & Client
- **Mức độ:** Major
- **Tác tử báo cáo:** `secops-quality-gate`
- **Tác tử chịu trách nhiệm sửa:** `system-architect`
- **Mô tả:** Trình biên dịch TypeScript Strict 100% cảnh báo `exactOptionalPropertyTypes` và các imports chưa sử dụng.
- **Nhật ký xử lý:** Đã refactor toàn bộ kiểu dữ liệu, loại bỏ imports rác, đảm bảo 0 lỗi biên dịch trên toàn bộ Monorepo.
- **Kết quả Retest:** PASS. Biên dịch và tests toàn bộ workspace đạt 100% `CLOSED_PASS`.

### [TK-002] Đồng bộ hóa kết nối WebSocket & Live Combat Telemetry 20Hz
- **Thời gian tạo:** 2026-10-19 23:08:00
- **Phân loại tầng:** Network WebSocket
- **Mức độ:** Minor
- **Tác tử báo cáo:** `qa-balance-tester`
- **Tác tử chịu trách nhiệm sửa:** `backend-engineer`
- **Mô tả:** Kiểm tra kết nối thời gian thực giữa Client và Server trên môi trường trình duyệt.
- **Nhật ký xử lý:** Thiết lập endpoint `/ws` và `/health`, hỗ trợ kết nối tự động và phát snapshot 50ms/tick.
- **Kết quả Retest:** PASS. Browser subagent mở web-app, nhận snapshot liên tục, các thanh máu và nhật ký sự kiện stream trơn tru -> Đóng ticket `CLOSED_PASS`.
