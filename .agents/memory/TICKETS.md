# 🎫 PHIẾU THEO DÕI SỰ CỐ & LỖI KIỂM THỬ (QA BUG TICKETS TRACKER)
*(Dự án: Valkyrie Protocol: Zero • Quản trị bởi qa-balance-tester, backend-engineer & frontend-engineer)*

---

## 📊 BẢNG TỔNG QUAN TICKETS HIỆN TẠI

| Ticket ID | Tiêu Đề Sự Cố | Phân Loại Tầng (Layer) | Mức Độ Nghiêm Trọng | Người Xử Lý (Assignee) | Trạng Thái (Status) | Lượt Retest |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *TK-000* | *[Mẫu] Lỗi khựng khung hình khi kích hoạt Climax* | *Frontend / Skia* | *Major* | `frontend-engineer` | `CLOSED_PASS` | 1 |

*Trạng thái hợp lệ:* `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED_BE` / `RESOLVED_FE` $\rightarrow$ `RETESTING` $\rightarrow$ `CLOSED_PASS` (hoặc `REOPENED_FAIL`).

---

## 📝 DANH SÁCH CHI TIẾT TỪNG TICKET

### 📋 MẪU TICKET TIÊU CHUẨN (TICKET TEMPLATE):
```markdown
### [TK-XXX] <Tiêu Đề Ngắn Gọn Về Lỗi>
- **Thời gian tạo:** YYYY-MM-DD HH:mm:ss
- **Phân loại tầng:** [Shared Domain | Backend NestJS | Frontend Expo | Network WebSocket | Database NoSQL]
- **Mức độ:** [Blocker / Critical / Major / Minor]
- **Tác tử báo cáo:** `qa-balance-tester`
- **Tác tử chịu trách nhiệm sửa:** [`backend-engineer` | `frontend-engineer` | Cả hai]
- **Mô tả chi tiết & Bước tái hiện (Steps to Reproduce):**
  1. Mở Web-App tại http://localhost:5173 hoặc 8081.
  2. Thực hiện thao tác X...
  3. Quan sát thấy lỗi Y...
- **Bằng chứng lỗi (Logs / Screenshots):**
  - Console error: `...`
  - Stack trace / Network dump: `...`
- **Giải pháp đề xuất (Proposed Fix):**
  - ...
- **Nhật ký xử lý (Fix Log):**
  - *[YYYY-MM-DD] [Assignee]*: Đã refactor tại file `abc.ts`, tuân thủ 100% NPE guard và TSDoc song ngữ. Chuyển trạng thái sang `RESOLVED`.
- **Kết quả Retest (`qa-balance-tester`):**
  - *Lần 1*: [PASS / FAIL]. Đã xác nhận không còn lỗi, 60 FPS ổn định -> Đóng ticket `CLOSED_PASS`.
```
