# 🎲 KẾT QUẢ GIAI ĐOẠN 3: THIẾT KẾ HỆ THỐNG BUFF & GIẢI THUẬT CÂN BẰNG ĐỘNG (PHASE 3 DELIVERABLES)
*(Tác tử chủ trì: `buff-systems-designer` • Căn cứ triển khai cho `backend-engineer`, `frontend-engineer` & `qa-balance-tester`)*

---

## 📌 1. TỔNG QUAN THƯ MỤC LƯU TRỮ (DELIVERABLES REPOSITORY)

Thư mục này chứa toàn bộ các bản đặc tả hệ thống Buff, ma trận hiệu ứng chiến thuật, giải thuật sinh Buff thích ứng thời gian thực phụ thuộc 100% vào chuỗi buff đã chọn trước đó, và kiến trúc Vector DB cho 2 thể thức BO3/BO5 (*History-Driven Vector DB Buff Engine*).

Mọi quyết định thiết kế ở đây nhằm giải quyết triệt để 4 bài toán lớn:
1. **Tối đa hóa đa dạng chiến thuật với tối thiểu 243 Buffs ($N \ge 243$):** Đảm bảo không có chiến thuật thống trị (No Dominant Strategy, Winrate $48\% - 52\%$), hàng triệu nhánh kết hợp buff không trùng lặp, mở rộng không giới hạn trần.
2. **Cơ chế hiển thị 9 Buff dựa 100% vào các buff đã chọn trước:** Bất kỳ buff nào xuất hiện ở các lượt chọn sau đều là hàm phản ứng toán học dựa trên **toàn bộ các buff mà cả 2 người chơi đã tích lũy từ trước, TUYỆT ĐỐI KHÔNG phân chia hay phụ thuộc vào việc round hiện tại là round bao nhiêu**.
3. **Điều biến tối ưu cho 2 thể thức BO3 và BO5:** Sử dụng Vector DB với hệ số áp lực khẩn cấp $\mathcal{U}(\text{Format}, \text{Wins})$ để tự động bẻ cong vector truy vấn, giúp BO3 đạt điểm bùng nổ Game-Deciding ngay ván 2 (Match Point), còn BO5 tích lũy chiều sâu mượt mà qua các ván đấu.
4. **Kiến trúc Vector DB kép (Dual-Driver):** Hỗ trợ `InMemoryVectorDatabaseService` (chạy local 0 dependency, độ trễ $<0.2\text{ms}$) và `QdrantVectorDatabaseService` (sẵn sàng cho production cloud).

| Tên Tài Liệu Deliverable | Mô Tả Trọng Tâm | Tác Tử Tiêu Thụ Chính |
| :--- | :--- | :--- |
| [`dynamic-buff-matrix-spec.md`](dynamic-buff-matrix-spec.md) | Kho $\ge 243$ Buffs tiến hóa đa tầng (Depth 1 $\to$ 5), cơ chế Game-Deciding & Hiệu ứng 18+ (Erotic Combat Triggers). | `backend-engineer`, `frontend-engineer` |
| [`history-dependent-algorithm.md`](history-dependent-algorithm.md) | Giải thuật Vector Markov sinh 9 Buffs phụ thuộc 100% vào các buff đã chọn trước đó, không phụ thuộc Round. | `backend-engineer`, `qa-balance-tester` |
| [`vector-db-buff-selection-spec.md`](vector-db-buff-selection-spec.md) | Kiến trúc Vector DB (12D Embeddings, Dual In-Memory/Qdrant), tối ưu hóa kNN & Điều biến nhịp độ BO3 vs BO5. | `backend-engineer`, `system-architect` |

---

## 🔗 2. QUY CHUẨN KẾ THỪA CHO CÁC PHA TIẾP THEO

1. **Dành cho `backend-engineer` (Pha 4):**
   - Triển khai module `VectorBuffSelectionService` trong `apps/server` theo đúng đặc tả tại [`vector-db-buff-selection-spec.md`](vector-db-buff-selection-spec.md).
   - Thiết lập cờ `USE_IN_MEMORY_VECTOR_DB=true` mặc định để test local không cần cài đặt thêm server vector ngoài.
   - Đảm bảo thời gian tính toán 3 truy vấn kNN sinh 9 Buffs $< 1\text{ms}$ trên WebSocket Gateway.
2. **Dành cho `frontend-engineer` (Pha 5):**
   - Render 9 thẻ bài Buff trong màn hình Draft với đầy đủ Icon, mô tả chỉ số và nhãn chỉ báo chiến thuật (Synergy / Counter / Pivot / Decisive).
3. **Dành cho `qa-balance-tester` (Pha 6):**
   - Giả lập 1,000,000 trận đấu trên cả 2 thể thức BO3 và BO5, kiểm tra phân phối tỷ lệ thắng (Winrate $48\% - 52\%$) và xác nhận tính bùng nổ Game-Deciding đúng thời điểm Match Point.
