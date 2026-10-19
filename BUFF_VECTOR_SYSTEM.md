# 🧬 ĐẶC TẢ HỆ THỐNG VECTOR DB & THUẬT TOÁN ĐIỀU BIẾN BUFFS (N ≥ 243, BO3 & BO5)
*(Mathematical Framework • 12D Tactical Embeddings • Vector DB kNN Selection • BO3 vs BO5 Pacing)*

---

## 📌 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Tuyệt Đối Không Phân Chia Theo Round:** Thuật toán lựa chọn 9 Buff xuất hiện trong mỗi lượt Draft tuân thủ 100% nguyên tắc kế thừa từ các buff đã chọn trước đó của hai người chơi. Không phụ thuộc vào biến `currentRound`.
2. **Quy Mô Tối Thiểu 243 Buffs (N ≥ 243):** Con số 243 Buffs ($3^5 = 243$) là ngưỡng sàn tối thiểu, chia 5 Cấp Độ Sâu Tiến Hóa ($\mathcal{D}_1 \to \mathcal{D}_5$), cho phép mở rộng không giới hạn trần. Nhóm Depth 5 sở hữu quyền năng Game-Deciding phá vỡ luật chơi.
3. **Ứng Dụng Vector Database (Vector DB Engine):**
   - Biểu diễn kho dữ liệu ($N \ge 243$) thành các vector nhúng 12 chiều ($[-1, 1]^{12}$).
   - Lựa chọn 9 Buff bằng 3 truy vấn kNN độc lập: 3 Synergy (tiến hóa từ lịch sử bản thân), 3 Counter-Play (khắc chế lịch sử đối thủ), 3 Apex Decisive (quyết định thắng thua / lật kèo).
4. **Điều Biến Tối Ưu Cho Cả 2 Thể Thức BO3 & BO5:**
   - Sử dụng Hệ số Áp lực Khẩn cấp $\mathcal{U}(\text{Format}, \text{Wins})$ để tự động bẻ cong vector (Vector Warping).
   - Ở **BO3**: Điểm quyết định (Match Point) đạt ngay Ván 2 ($\mathcal{U} = 1.0$), lập tức mở khóa và ưu tiên cụm Buff Game-Deciding.
   - Ở **BO5**: Nhịp độ tích lũy chiến thuật mượt mà và sâu sắc qua các ván đấu, bùng nổ ở ván chung kết.

---

## 📐 2. KHÔNG GIAN VECTOR CHIẾN THUẬT 12 CHIỀU (12D EMBEDDING SPACE)

| Chiều Vector | Tên Thuộc Tính | Ý Nghĩa Chiến Thuật | Tác Động Thẩm Mỹ 18+ / Visual Cues |
| :--- | :--- | :--- | :--- |
| `dim[0]` | **PHYSICAL** | Sát thương vật lý, tốc độ đánh cơ bản | Lưỡi kiếm rực sáng, vệt chém sắc lẹm |
| `dim[1]` | **MAGIC** | Sát thương phép thuật, hồi phục năng lượng | Hào quang ma thuật rực rỡ, tích tụ mana |
| `dim[2]` | **ARMOR** | Giáp vật lý, độ bền bỉ khiên chắn | Khiên năng lượng dày đặc, giảm tốc độ rách giáp |
| `dim[3]` | **SHIELD** | Lá chắn thần thánh, phòng thủ tuyệt đối | Hộ thể phát quang, hấp thụ sát thương |
| `dim[4]` | **CRIT** | Tỷ lệ và sát thương bạo kích bộc phát | Bộc phá cực đại, xé toạc phòng tuyến |
| `dim[5]` | **ENERGY** | Tần suất xuất chiêu Ultimate Climax | Dòng năng lượng cuộn trào, kích hoạt Cut-in |
| `dim[6]` | **CC_CONTROL** | Khống chế (choáng, đóng băng, trói shibari)| Xích phát sáng trói buộc, phong tỏa cử động |
| `dim[7]` | **SPATIAL_3X3** | Tương tác hình học lưới cờ 3x3 | Đổi vị trí ô cờ, bọc sườn, pincer strike |
| `dim[8]` | **EROTIC_CLIMAX** | Tương tác rách giáp Tier 2/3 & cực khoái | Rách giáp kích nổ sức mạnh, tiếng thở gấp mê đắm |
| `dim[9]` | **SYNERGY_DEPTH**| Chiều sâu yêu cầu trong cây tiến hóa | Càng nhiều buff cùng hệ, hiệu quả càng nhân bội |
| `dim[10]`| **COUNTER_INTENSITY**| Cường độ phản chấn, bẻ gãy chiến lược địch | Xuyên thủng giáp/khiên, phản đòn sát thương |
| `dim[11]`| **DECISIVE_IMPACT** | MỨC ĐỘ ĐỊNH ĐOẠT THẮNG THUA (0.1 -> 1.0)| Rule-Bending, Sudden Death, Total Nullification |

---

## 🔗 3. BẢN ĐẶC TẢ CHI TIẾT & KẾ THỪA
Để xem chi tiết công thức toán học, mã nguồn TypeScript và danh mục 243 Buffs, tham khảo các tài liệu tại:
1. [`deliverables/phase-3-buff-system/vector-db-buff-selection-spec.md`](deliverables/phase-3-buff-system/vector-db-buff-selection-spec.md) — Đặc tả Vector DB và điều biến BO3/BO5.
2. [`deliverables/phase-3-buff-system/history-dependent-algorithm.md`](deliverables/phase-3-buff-system/history-dependent-algorithm.md) — Giải thuật sinh 9 Buffs kế thừa 100% từ lịch sử.
3. [`deliverables/phase-3-buff-system/dynamic-buff-matrix-spec.md`](deliverables/phase-3-buff-system/dynamic-buff-matrix-spec.md) — Danh mục 243 Buffs đa tầng.
