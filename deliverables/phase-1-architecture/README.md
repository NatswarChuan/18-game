# 🏛️ KẾT QUẢ GIAI ĐOẠN 1: KIẾN TRÚC HỆ THỐNG & KỸ THUẬT (PHASE 1 DELIVERABLES)
*(Tác tử chủ trì: `system-architect` • Căn cứ triển khai cho `backend-engineer` & `frontend-engineer`)*

---

## 📌 1. TỔNG QUAN THƯ MỤC LƯU TRỮ (DELIVERABLES REPOSITORY)

Thư mục này chứa toàn bộ các bản thiết kế, quy chuẩn kỹ thuật và hợp đồng giao tiếp (Contracts) do tác tử **`system-architect`** ban hành sau khi nghiệm thu **Cổng 1 (Gate 1)**. 

Tất cả các tác tử ở các giai đoạn sau (`backend-engineer` ở Pha 3, `frontend-engineer` ở Pha 4, `qa-balance-tester` ở Pha 5) **bắt buộc phải đọc và căn cứ (base on)** các tài liệu trong thư mục này để triển khai code, đảm bảo tính đồng nhất 100%:

| Tên Tài Liệu Deliverable | Mô Tả Trọng Tâm | Tác Tử Tiêu Thụ Chính |
| :--- | :--- | :--- |
| [`system-architecture-spec.md`](system-architecture-spec.md) | Kiến trúc Monorepo, Clean Onion/Hexagonal Layers, phân chia Client/Server/Shared Domain. | `backend-engineer`, `frontend-engineer` |
| [`websocket-protocol-contract.md`](websocket-protocol-contract.md) | Danh mục Event WebSocket nhị phân/JSON, Payloads, Header và mã lỗi. | `backend-engineer`, `frontend-engineer`, `qa-balance-tester` |
| [`database-schema-spec.md`](database-schema-spec.md) | Thiết kế NoSQL (MongoDB Mongoose, Redis Cache) và In-Memory Local Store fallback. | `backend-engineer` |
| [`state-machines.md`](state-machines.md) | State Machine phòng đấu, chu trình Tick 20Hz (50ms) và kịch bản phục hồi khi mất mạng. | `backend-engineer`, `frontend-engineer` |

---

## 🔗 2. QUY CHUẨN KẾ THỪA CHO CÁC PHA TIẾP THEO

1. **Dành cho `backend-engineer` (Pha 3):**
   - Không tự ý thêm bớt các sự kiện WebSocket ngoài các sự kiện đã định nghĩa tại [`websocket-protocol-contract.md`](websocket-protocol-contract.md).
   - Triển khai Mongoose Schemas và Repository tuân theo [`database-schema-spec.md`](database-schema-spec.md).
   - Lập trình vòng lặp 50ms State Machine chuẩn xác định theo [`state-machines.md`](state-machines.md).

2. **Dành cho `frontend-engineer` (Pha 4):**
   - Đóng vai trò **Dumb Terminal**: Chỉ gửi input người dùng và lắng nghe snapshot từ WebSocket theo hợp đồng [`websocket-protocol-contract.md`](websocket-protocol-contract.md).
   - Không tự ý sinh logic tính toán kết quả sát thương tại máy khách.

3. **Dành cho `qa-balance-tester` (Pha 5):**
   - Kiểm tra xem gói tin thực tế truyền qua mạng có khớp 100% với Schema hợp đồng hay không.
   - Nếu phát hiện sai lệch, mở ticket `[TK-XXX]` tại [../../.agents/memory/TICKETS.md](../../.agents/memory/TICKETS.md).
