# 🧠 BỘ NHỚ TRẠNG THÁI DỰ ÁN (PROJECT PERSISTENT MEMORY)
*(Valkyrie Protocol: Zero • Antigravity Ecosystem • Lưu trữ tri thức dài hạn chống mất Context)*

---

## 📌 1. NGỮ CẢNH DỰ ÁN CỐT LÕI (CORE PROJECT CONTEXT)
- **Tên dự án:** VALKYRIE PROTOCOL: ZERO (Anime 18+ Cyberpunk Tactical Auto-Battler).
- **Mô hình quy trình:** Thác nước nghiêm ngặt (Strict Sequential Waterfall, 7 Pha liên hoàn).
- **Trạng thái hiện tại:** Hoàn thành Pha 1 (Architecture), Pha 2 (Art & 27 Valkyries), và Pha 3 (243 Buffs & Vector DB Engine); Sẵn sàng chuyển giao Pha 4 (Backend Implementation).
- **Cơ cấu 6 Tác Tử Độc Lập:**
  1. `system-architect` (Chủ trì Pha 1 & Pha 7; Reviewer Pha 4, Pha 5, Pha 6)
  2. `art-designer` (Chủ trì Pha 2; Reviewer Pha 5)
  3. `buff-systems-designer` (Chủ trì Pha 3; Reviewer Pha 4, Pha 6)
  4. `backend-engineer` (Chủ trì Pha 4; Reviewer Pha 1, Pha 3, Pha 7)
  5. `frontend-engineer` (Chủ trì Pha 5; Reviewer Pha 2)
  6. `qa-balance-tester` (Chủ trì Pha 6; Reviewer Pha 1, Pha 2, Pha 3, Pha 4, Pha 7)

---

## 🚫 2. SỔ TAY BÀI HỌC KINH NGHIỆM & CHỐNG LẶP LẠI SAI SÓT (ANTI-MISTAKE TRAJECTORY)

Mọi tác tử **bắt buộc phải đọc kỹ mục này trước khi thực hiện bất kỳ hành động nào** để tránh lặp lại các lỗi trong quá khứ:

| Mã Bài Học | Sai Sót Từng Gặp Trong Quá Khứ | Quy Tắc Bắt Buộc Phải Tuân Thủ Tuyệt Đối |
| :--- | :--- | :--- |
| **ERR-01** | Nhầm lẫn cấu trúc thư mục hoặc tạo file nằm ngoài cấu trúc dự án. | **TUÂN THỦ CẤU TRÚC MONOREPO TẠI GỐC (`./`)**: Mọi code và deliverables phải nằm đúng cấu trúc (`apps/`, `packages/`, `deliverables/`, `.agents/`). Tuyệt đối không nhắc đến thư mục tạm `prompt/`. |
| **ERR-02** | Dùng đường dẫn tuyệt đối dạng `file:///c:/Users/...` hoặc `c:\...`. | **CẤM TUYỆT ĐỐI đường dẫn tuyệt đối.** 100% tài liệu và liên kết Markdown phải dùng **đường dẫn tương đối (Relative Paths)**. |
| **ERR-03** | Tự ý chuyển sang Pha tiếp theo mà chưa có tác tử độc lập thẩm định. | **BẮT BUỘC VÒNG LẶP REVIEW / FIX:** Phải có tác tử Reviewer chỉ định kiểm tra và ký duyệt `STAGE_GATE_PASS` trong [`DEBATES_AND_REVIEWS.md`](DEBATES_AND_REVIEWS.md) mới được mở Cổng. |
| **ERR-04** | Tự ý quyết định ngầm mà không lưu vết thảo luận/bất đồng. | **BẮT BUỘC LƯU VẾT PHẢN BIỆN:** Các tranh luận kỹ thuật hoặc điều chỉnh spec phải được ghi rõ trong [`DEBATES_AND_REVIEWS.md`](DEBATES_AND_REVIEWS.md). |
| **ERR-05** | Dùng kiểu dữ liệu lỏng lẻo `any`, `object`, `Function`. | **100% TYPESCRIPT TƯỜNG MINH:** Cấm hoàn toàn dynamic types; mọi hàm, tham số, return type phải có type cụ thể. |
| **ERR-06** | Dùng toán tử khẳng định non-null `!` gây rủi ro crash runtime NPE. | **100% PHỦ NPE GUARD:** Luôn dùng `?.`, `??` và Guard Clauses (`if (!entity) return;`). Tuyệt đối cấm toán tử `!`. |
| **ERR-07** | Client tự tính toán kết quả giao tranh hoặc sát thương. | **DUMB TERMINAL:** Client chỉ gửi thao tác và nhận snapshot qua WebSocket; toàn bộ combat loop tính tại Server (NestJS 20Hz). |
| **ERR-08** | Comment code sơ sài hoặc chỉ bằng 1 thứ tiếng. | **GOOGLE CODE DOC SONG NGỮ:** 100% symbols xuất bản phải có docblock song ngữ **Anh - Việt** rõ ràng. |
| **ERR-09** | Nghiệm thu Cổng 6 khi vẫn còn bug chưa test lại thực tế. | **ZERO UNRESOLVED TICKETS:** Cổng 6 chỉ duyệt khi 100% tickets tại [`TICKETS.md`](TICKETS.md) đạt trạng thái `CLOSED_PASS` sau khi retest bằng `browser_subagent`. |
| **ERR-10** | Phân chia cứng Buff theo số round gây mất tính thích ứng. | **KHÔNG PHÂN CHIA BUFF THEO ROUND:** Cơ chế hiển thị 9 Buffs phải tuân thủ 100% nguyên tắc lựa chọn từ các buff trước đó và điều biến theo thể thức BO3/BO5 qua Vector DB. |

---

## 🏛️ 3. QUYẾT ĐỊNH KIẾN TRÚC & CÔNG NGHỆ ĐÃ ĐÓNG BĂNG (FROZEN ARCHITECTURAL DECISIONS)

1. **Cấu Trúc Monorepo Chuẩn Xác Tại Gốc Dự Án (`./`):**
   - `apps/server` (NestJS Framework, NoSQL Mongoose MongoDB + Redis / In-Memory, Vector DB Service).
   - `apps/client` (Expo SDK 52+ Universal Web/Mobile, Skia Canvas 60 FPS).
   - `packages/shared-domain` (Pure TypeScript, 0 dependency, 12D Vector Math).
   - `deliverables/phase-1-architecture/` (Specs kiến trúc, NoSQL & Vector DB Schema đã ký duyệt).
   - `deliverables/phase-2-art-design/` (Specs 27 Valkyries, 3 cấp Cloth Damage 18+, Tokens đã ký duyệt).
   - `deliverables/phase-3-buff-system/` (Kho tối thiểu 243 Buffs, Vector DB Engine cho BO3/BO5 đã ký duyệt).
2. **Quy Chuẩn Hệ Sinh Thái Buffs Tối Thiểu 243 (N ≥ 243) & Vector DB:**
   - Tối thiểu 243 Buffs ($N \ge 243$), mở rộng linh hoạt theo mùa/DLC, chia 5 Cấp Độ Sâu Tiến Hóa ($\mathcal{D}_1 \to \mathcal{D}_5$).
   - Nhóm Depth 5 là các Buff Game-Deciding (phá vỡ luật chơi, lật kèo cực đoan).
   - Tuyển chọn 9 Buff hoàn toàn thông qua Vector DB k-Nearest Neighbors kết hợp hệ số khẩn cấp $\mathcal{U}(\text{Format}, \text{Wins})$ cho BO3 và BO5.
   - Dual-Driver: `InMemoryVectorDatabaseService` (Local 0-dependency) và `QdrantVectorDatabaseService` (Production).
3. **Cơ Chế Phản Biện & Review Đa Tác Tử:**
   - Biên bản lưu trữ tập trung tại [`DEBATES_AND_REVIEWS.md`](DEBATES_AND_REVIEWS.md).
4. **Quản Lý Trạng Thái Waterfall:**
   - Cập nhật tiến độ nghiệm thu chính thức tại [`WATERFALL_STATUS.md`](WATERFALL_STATUS.md).
   - Quản lý danh sách tickets lỗi tại [`TICKETS.md`](TICKETS.md).
   - Bảng điểm chơi thử game feel tại [`PLAYTEST_SCORECARD.md`](PLAYTEST_SCORECARD.md).
