# ⚔️ GAME MECHANICS & COMBAT SIMULATION SPEC
*(Deterministic Engine • Slot 3x3 Behavior Matrix • 18+ Sensual Status Effects)*

---

## 📐 1. CÔNG THỨC TOÁN HỌC TRONG GIAO TRANH (COMBAT FORMULAS)

### 1.1. Công Thức Giảm Sát Thương Theo Giáp & Kháng Phép
Sát thương thực nhận được chuẩn hóa bằng hàm Hyperbolic:
$$\text{Damage Multiplier} = \frac{100}{100 + \text{Defense Value}}$$

- **Với Giáp cơ bản = 20:**
  $$\text{Multiplier} = \frac{100}{100 + 20} = \frac{100}{120} \approx 83.33\% \implies \text{Giảm } 16.67\% \text{ sát thương vật lý.}$$
- **Khi bị kích hoạt hiệu ứng Rách Giáp (Armor Shred):**
  Nếu một Buff giảm 10 Giáp của mục tiêu: $\frac{100}{110} \approx 90.91\% \implies$ Mục tiêu chỉ còn giảm $9.09\%$ sát thương.
- **Bảo Vệ Chia Cho 0 & Tràn Số Âm:**
  Nếu `Defense Value < -80`, Server tự động kẹp giá trị (clamp) ở mức tối thiểu `-80` để phòng tránh mẫu số tiến về `0` hoặc sinh ra giá trị `NaN` làm sập Engine.

### 1.2. Công Thức Tích Lũy Năng Lượng (Mana Generation Mechanics)
Mỗi Valkyrie cần **100 Mana** để kích hoạt chiêu thức **Climax Ultimate**:
1. **Đòn Đánh Thường Trúng Đích:** Cộng cố định `+10 Mana / đòn`.
2. **Gánh Chịu Sát Thương:** Nhận `+5 Mana / 100 HP tổn thất`.
3. **Nội Tại Hàng 1 (Frontline Tenacity):** Toàn bộ các Valkyrie đặt tại **Ô 1, Ô 2, Ô 3** được hưởng nội tại gia tăng **+15% Năng lượng nhận vào khi chịu đòn**:
   $$\text{Frontline Mana Gain} = \text{Base Mana Gain} \times 1.15$$

---

## 🎯 2. MA TRẬN HÀNH VI 9 Ô TRÊN LƯỚI 3x3 (SLOT BEHAVIOR MATRIX)

Server xử lý hành vi của từng ô cờ theo một Lookup Table bất biến (`Readonly<Record<SlotIndex, SlotBehavior>>`):

| Tọa Độ Ô | Phân Loại Tuyến | Tầm Đánh | Logic Định Tuyến Mục Tiêu (Targeting) | Hành Vi Đặc Biệt & Nội Tại |
| :--- | :--- | :--- | :--- | :--- |
| **Ô 1, Ô 3** | Hàng 1 — Cánh | 1 ô | Khóa mục tiêu đối diện cùng cột; nếu trống thì đổi sang cột gần nhất. | **Khiên Chắn Tiền Tuyến:** Thu hút toàn bộ đòn đánh thẳng nhắm vào cột đó; +15% Mana khi bị tấn công. |
| **Ô 2** | Hàng 1 — Giữa | 1 ô | Ưu tiên mục tiêu tại Ô 2 của đối phương. | **Mũi Khoan Đột Phá:** Nếu Ô 2 địch trống, lập tức lướt tới tấn công trực diện Hàng 2 của đối thủ. |
| **Ô 4, Ô 6** | Hàng 2 — Cánh | 2 ô | Hỗ trợ dồn hỏa lực vào mục tiêu đang bị Ô 1/Ô 3 cùng cột giao tranh. | **Bọc Sườn Gợi Cảm (Flanking):** Nếu cánh bên ngoài không có đối thủ, tăng thêm **+25% Sát thương**. Tự động bước lên lấp Hàng 1 khi Hàng 1 trống. |
| **Ô 5** | Hàng 2 — Tâm | 2 ô | Tấn công mục tiêu trung tâm; hỗ trợ Ô 2. | **Trung Quân Điều Phối:** Cung cấp hào quang giảm 5% sát thương nhận vào cho các đồng minh lân cận trong dấu thập (+). |
| **Ô 7, Ô 9** | Hàng 3 — Cánh | 3 ô | Bắn tỉa mục tiêu xa nhất trên cùng đường thẳng, hoặc kẻ địch thấp máu nhất. | **Xạ Thủ Bất Khả Xâm Phạm:** Miễn nhiễm với đòn đánh thường chừng nào còn đồng minh Hàng 1/2 sống sót che chắn trước mặt. |
| **Ô 8** | Hàng 3 — Tâm | 3 ô | Khẩu pháo tầm xa; phóng đạn năng lượng xuyên thấu toàn bộ mục tiêu trên cột 2. | **Trọng Pháo Climax:** Tốc độ đánh chậm hơn 15% nhưng mỗi phát bắn gây sát thương lan (AoE) ra 2 ô lân cận. |

---

## 💋 3. HIỆU ỨNG TRẠNG THÁI ANIME 18+ ĐẶC BIỆT (STATUS EFFECTS)

Ngoài các hiệu ứng làm chậm và làm choáng thông thường, các nữ chiến binh Valkyrie sở hữu các hiệu ứng trạng thái quyến rũ mang đậm màu sắc Anime 18+:

1. **Rách Giáp Kích Dục (Armor Shred & Exposed):**
   - Khi bị trúng đòn chí mạng hoặc kỹ năng xuyên phá, giáp của nạn nhân bị phá hủy, chuyển mô hình sang trạng thái **Stage 2/3 Cloth Damage**.
   - Nạn nhân chịu thêm $20\%$ sát thương trong 3 giây và phát ra tiếng rên rỉ quyến rũ.
2. **Mê Hoặc Tinh Thần (Succubus Charm):**
   - Kỹ năng của Valkyrie phong cách Succubus (như Lilith) khiến mục tiêu đối diện bị mê hoặc trong 1.5 giây.
   - Nạn nhân tạm dừng tấn công, quay đầu bước đi vô định về phía nàng Waifu với ánh mắt si tình hình trái tim.
3. **Quá Tải Cực Khoái (Climax Overload):**
   - Kích hoạt khi thanh Mana đạt 100/100.
   - Toàn bộ cơ thể Valkyrie bừng sáng hào quang Neon, tốc độ đánh tăng vọt $50\%$ trong 4 giây, giải phóng hoạt cảnh chiêu thức tối thượng kèm màn hình rung chấn mạnh mẽ.
4. **Vết Thương Sâu Hở Bạo (Deep Laceration):**
   - Sát thương chuẩn (True Damage) gây chảy máu theo thời gian, bỏ qua hoàn toàn 100% Giáp và Kháng phép.

---

## ⏱️ 4. VÒNG LẶP MÔ PHỎNG CHUẨN XÁC ĐỊNH (20 TICKS/GIÂY)

- **Chu kỳ Tick:** Đúng **50 mili-giây** cho mỗi Tick tính toán (`50ms * 20 = 1000ms = 1 giây`).
- **Thứ tự thực thi trong 1 Tick (Deterministic Order):**
  1. *Tick 0: Đọc Input Queue từ cả 2 người chơi (nếu có).*
  2. *Tick 1: Cập nhật Buff thời gian & Giải trừ khống chế hết hạn.*
  3. *Tick 2: Tính toán vị trí di chuyển & Lấp ô trống trên lưới 3x3.*
  4. *Tick 3: Xác định mục tiêu (Target Acquisition) theo bảng Slot Behavior.*
  5. *Tick 4: Xử lý đòn đánh, tính sát thương Hyperbolic, cộng Mana.*
  6. *Tick 5: Kích hoạt Climax Ultimate nếu Mana >= 100.*
  7. *Tick 6: Kiểm tra điều kiện tử trận, cập nhật trạng thái Cloth Damage Tier.*
  8. *Tick 7: Đóng gói sự kiện (CombatEventSnapshot) và gửi broadcast cho Client qua WebSocket.*
