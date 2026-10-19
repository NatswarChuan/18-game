# 📜 GAME DESIGN DOCUMENT (GDD): VALKYRIE PROTOCOL: ZERO
*(Pure-Skill 3x3 Symmetric Auto-Battler • Anime 18+ Sensual Theme • Production Version)*

---

## 🌸 1. TỔNG QUAN DỰ ÁN & TRIẾT LÝ THIẾT KẾ (GAME PHILOSOPHY)

- **Tên trò chơi:** *VALKYRIE PROTOCOL: ZERO*
- **Thể loại:** Symmetric Competitive Auto-Battler / Micro-Strategy 3x3 Grid / Sensual 18+ Anime Tactical Game.
- **Nền tảng:** PC (Web HTML5 60fps) & Mobile (iOS / Android qua Expo/React Native).
- **Hình thức thi đấu:** 1v1 PvP, thể thức chuỗi **BO3 (Best of 3)** hoặc **BO5 (Best of 5)**.
- **Đối tượng người chơi mục tiêu:** Những game thủ đam mê chiến thuật đỉnh cao, yêu thích sự công bằng tuyệt đối (Pure-Skill, No P2W), đồng thời là những tín đồ của văn hóa **Anime 18+ (Eroge / Cyber-Waifu / Ecchi Fanservice)**.

### 4 Nguyên Tắc Thiết Kế Bất Biến:
1. **Tuyệt Đối Không Pay-to-Win, Không Gacha Nhân Phẩm:** Tất cả quân cờ khi xuất phát đều có bộ chỉ số cơ bản **đồng nhất 100%**. Không có tướng bậc sao, không có thẻ bài SSR/UR vượt trội chỉ số.
2. **Vai Trò Sinh Ra Từ Vị Trí 3x3 & 8D Buff:** Nhân vật đảm nhận vai trò Khiên Chắn, Sát Thủ Nhảy Ô, hay Xạ Thủ Bắn Tỉa hoàn toàn phụ thuộc vào **tọa độ đứng trên lưới 3x3** và **sự lựa chọn Buff tích lũy**.
3. **Bể 9 Buff Cân Bằng Đối Xứng Tuyệt Đối (Strict Symmetric Equilibrium):** Cả hai đối thủ cùng quan sát và cùng chọn từ **chung một danh sách 9 Buff**. Không bên nào được hưởng lợi từ sự may rủi.
4. **Nghệ Thuật 18+ Quyến Rũ & Cơ Chế Rách Giáp (Sensual Battle Damage):** Từng trận chiến là một bữa tiệc thị giác với các nữ chiến binh Valkyrie, cơ chế trang phục bị phá hủy theo máu (*Cloth Damage Tiers*), và những pha kết liễu *Climax Ultimate* bùng nổ cảm xúc.

---

## 👩‍🦰 2. BẢNG DANH SÁCH VALKYRIE & CƠ CHẾ RÁCH GIÁP 18+ (VALKYRIE ROSTER)

Mặc dù các Valkyrie có cùng chỉ số cơ bản, người chơi có thể tùy chọn ngoại hình đại diện (Skin/Model) cho 6 vị trí cờ của mình từ dàn Waifu quyến rũ:

| Valkyrie ID | Tên Nữ Chiến Binh | Danh Xưng / Phong Cách Thẩm Mỹ | Đặc Trưng Gợi Cảm & Vũ Khí |
| :--- | :--- | :--- | :--- |
| **`VALK_01`** | **Kagura** | *Thánh Nữ Cơ Khí (Mecha Shrine Maiden)* | Kimono viễn tưởng cách tân xẻ tà cao, đùi thon tất lưới, song kiếm Plasma. |
| **`VALK_02`** | **Lilith** | *Ác Nữ Không Gian (Cyber Succubus)* | Bodysuit da bóng bó sát ôm trọn đường cong, cánh dơi năng lượng, roi lôi điện. |
| **`VALK_03`** | **Freya** | *Đại Tướng Tiền Tuyến (Valkyrie Commander)* | Áo giáp hiệp sĩ bạc ôm khít vòng eo, khiên năng lượng bọc ngực căng tràn, trường thương. |
| **`VALK_04`** | **Nyx** | *Bóng Ma Sát Thủ (Phantom Shinobi)* | Khăn lụa mỏng tang che nửa khuôn mặt, trang phục nhẫn giả hở lưng quyến rũ, song đoản đao. |
| **`VALK_05`** | **Astra** | *Xạ Thủ Siêu Không Gian (Nova Sniper)* | Kính ngắm quang học, váy ngắn bồng bềnh lộ dây nịt tất quyến rũ, súng trường photon cỡ lớn. |
| **`VALK_06`** | **Rhea** | *Pháp Sư Trọng Lực (Graviton Empress)* | Áo choàng hoàng gia xẻ ngực sâu táo bạo, vương miện pha lê, trượng không thời gian. |

### 💥 Cơ Chế 3 Cấp Độ Rách Giáp (Battle Damage Tiers):
Trong quá trình Auto-Combat thời gian thực, mô hình nhân vật sẽ tự động chuyển đổi trạng thái hình thể dựa trên lượng HP còn lại:
1. **Tier 1 — Trạng Thái Hoàn Hảo (HP 100% - 70%):** Trang phục giáp trụ nguyên vẹn, dáng đứng tự tin, thần thái kiêu hãnh.
2. **Tier 2 — Tổn Hại Chiến Tranh (HP 69% - 30%):** Giáp vai và giáp ngực bị nứt vỡ, vải áo rách toạc lộ ra làn da trắng ngần và đường cong quyến rũ, hai má ửng hồng (Blush effect), nhịp thở dồn dập.
3. **Tier 3 — Climax Cực Hạn (HP < 30% hoặc khi tung Ultimate):** Quần áo rách tả tơi đầy khiêu gợi, linh lực bùng cháy bao quanh cơ thể, ánh mắt rực lửa đam mê, kích hoạt giọng lồng tiếng quyến rũ đặc trưng.

---

## ⚔️ 3. CHỈ SỐ CƠ BẢN ĐỒNG NHẤT (BASE STATS EQUILIBRIUM)

Toàn bộ 6 quân cờ trên bàn đấu sở hữu chỉ số khởi điểm **đồng nhất 100%**:

| Chỉ Số Cốt Lõi | Giá Trị Khởi Điểm | Ý Nghĩa Trong Giao Tranh |
| :--- | :--- | :--- |
| **Máu Tối Đa (Max HP)** | `1,000` | Cột máu sinh mệnh chuẩn của Valkyrie |
| **Sát Thương Đánh Thường (ATK)** | `50` | Sát thương vật lý cơ bản cho mỗi đòn đánh |
| **Tốc Độ Đánh (Attack Speed)** | `1.0 đòn/giây` | Nhịp tấn công chuẩn hóa |
| **Tầm Đánh (Range)** | *Quyết định bởi Hàng* | Hàng 1: 1 ô (Cận chiến) \| Hàng 2: 2 ô (Tầm trung) \| Hàng 3: 3 ô (Tầm xa) |
| **Giáp Vật Lý (Armor)** | `20` | Giảm chính xác **16.67%** sát thương vật lý |
| **Kháng Phép (Magic Resist)** | `20` | Giảm chính xác **16.67%** sát thương phép thuật |
| **Thanh Năng Lượng (Mana)** | `0 / 100` | Nạp đầy để giải phóng kỹ năng Climax Ultimate |

---

## 🎲 4. BÀN CỜ 3x3 & ĐỘNG CƠ CƠ CHẾ VỊ TRÍ (POSITION-BASED COMBAT)

Mỗi người chơi chỉ huy **6 Valkyrie** trên một nửa sàn đấu gồm **3 hàng x 3 cột = 9 ô**, luôn để lại **3 ô trống chiến thuật**:

```
                 [ĐỘI HÌNH ĐỐI PHƯƠNG - PHÍA TRÊN]
===================================================================
                       CHIẾN TRƯỜNG TRUNG TÂM
===================================================================
                  [NỬA SÀN ĐẤU CỦA BẠN - 3x3 = 9 Ô]

            Cột 1 (Trái)         Cột 2 (Giữa)         Cột 3 (Phải)
Hàng 1:    [ Ô 1: Tiền phong ]  [ Ô 2: Đột phá ]    [ Ô 3: Tiền phong ]  (Frontline)
Hàng 2:    [ Ô 4: Bọc lót ]     [ Ô 5: Chỉ huy ]    [ Ô 6: Bọc lót ]     (Midline)
Hàng 3:    [ Ô 7: Xạ thủ ]      [ Ô 8: Pháo đài ]   [ Ô 9: Xạ thủ ]      (Backline)
```

### 4.1. Quy Luật Vận Hành Độc Lập Theo Hàng:
1. **Hàng 1 — Tiền Tuyến (Ô 1, 2, 3 - Frontline):**
   - **Tầm đánh:** 1 ô. Hút toàn bộ hỏa lực nhắm vào cùng cột.
   - **Nội tại vị trí:** Hồi thêm **+15% Năng lượng** khi chịu đòn.
   - **Cơ chế Đột Phá (Ô 2):** Nếu ô đối diện ở Hàng 1 của địch trống, Valkyrie Ô 2 sẽ lập tức lướt thẳng vào Hàng 2 của địch để truy sát mục tiêu chủ lực.
2. **Hàng 2 — Trung Quân (Ô 4, 5, 6 - Midline):**
   - **Tầm đánh:** 2 ô. Hỗ trợ tấn công mục tiêu của Hàng 1 cùng cột.
   - **Cơ chế Lấp Vị Trí:** Nếu Valkyrie Hàng 1 phía trước ngã xuống, Valkyrie Hàng 2 lập tức tiến lên thay thế lá chắn.
   - **Cơ chế Bọc Sườn (Flanking - Ô 4 & Ô 6):** Nếu cánh bên hông trống, Valkyrie kích hoạt góc đánh hiểm, gia tăng **+25% Sát thương**.
3. **Hàng 3 — Hậu Tuyến (Ô 7, 8, 9 - Backline):**
   - **Tầm đánh:** 3 ô. Xạ thủ tầm xa, ưu tiên bắn mục tiêu có % máu thấp nhất trong tầm ngắm.
   - **Nội tại vị trí (Untargetable Guard):** Không thể bị chọn làm mục tiêu đánh thường chừng nào còn ít nhất 1 đồng minh Hàng 1 hoặc Hàng 2 che chắn trước mặt.

---

## 🧬 5. HỆ THỐNG DRAFT 9 BUFF THÍCH ỨNG (8D VECTOR EQUILIBRIUM)

### 5.1. Khởi Đầu Round 1:
- Cả hai bên cùng được mở chung danh sách **9 Buff ngẫu nhiên** (thời gian chọn 20 giây):
  - **3 Buff Cá Nhân (Single Waifu Focus):** Kích hoạt nội tại đột biến cho 1 vị trí ô (VD: *Sát Thủ Bước Nhảy Không Gian, Khiên Gai Phản Kích, Đòn Đánh Chí Mạng Tàn Phế*).
  - **3 Buff Khu Vực (Row/Column Zone):** Cường hóa toàn bộ 1 hàng hoặc 1 cột (VD: *Hàng 1 nhận 300 Giáp Ảo, Hàng 3 tăng 40% Tốc Đánh*).
  - **3 Buff Toàn Đội (Team-Wide Synergy):** Tác động lên cả 6 quân (VD: *Hút Máu Toàn Đội 15%, Phát Nổ Khi Tử Trận 12% HP, Kháng Khống Chế*).

### 5.2. Từ Round 2+: Thuật Toán Phân Bổ Cân Bằng Đối Xứng 2-2-2-3:
Thuật toán AI đọc vector lịch sử buff của Người chơi 1 ($\vec{P}_1$) và Người chơi 2 ($\vec{P}_2$) để sinh ra 9 Buff:
1. **2 Buff Đồng Điều (Synergy 1:1):** 1 Buff phát triển trường phái cho P1, 1 Buff tương xứng cho P2 ($|\text{cos}(\vec{V}_{syn1}, \vec{P}_1) - \text{cos}(\vec{V}_{syn2}, \vec{P}_2)| < 0.05$).
2. **2 Buff Khắc Chế (Counter-Play 1:1):** 1 Buff giúp P2 khắc chế P1, 1 Buff giúp P1 khắc chế P2 thông qua ma trận nghịch đảo $M_{counter}$.
3. **2 Buff Chuyển Trục (Orthogonal Pivot):** 2 Buff trực giao vuông góc ($\text{cos} \approx 0$) mở ra hướng đi chiến thuật mới lạ.
4. **3 Buff Không Gian 3x3 (Spatial 3x3 Neutral):** Tác động trực tiếp vào 3 ô trống trên bàn cờ.

---

## ⚡ 6. VÒNG LẶP TRẬN ĐẤU & KẾ THỪA CHUỖI BO3/BO5 (SERIES PROGRESSION)

- **Thể thức thi đấu:** Đấu chạm 2 (BO3) hoặc đấu chạm 3 (BO5).
- **Mỗi Game gồm các Round (Vòng Đấu):**
  - **Pha 1 — Draft Buff (20 giây):** Cùng chọn 1 trong 9 Buff.
  - **Pha 2 — Xếp Đội Hình 3x3 (20 giây):** Sắp xếp 6 Valkyrie vào 9 ô dưới lớp sương mù che giấu (*Fog of Placement*).
  - **Pha 3 — Tự Động Giao Tranh (Real-Time Combat):** Server chạy mô phỏng 20 ticks/s và truyền gói tin về Client.
  - **Pha 4 — Tổng Kết & Rách Giáp:** Trao thưởng điểm số, hiển thị màn hình chiến thắng/thất bại và hoạt cảnh của Waifu.
- **Tính Kế Thừa Bất Biến (Persistent Series):** Toàn bộ các Buff đã chọn được tích lũy xuyên suốt các Round của Game 1, truyền sang Game 2 và Game 3 trong chuỗi BO3/BO5, tạo nên sự tiến hóa chiến thuật sâu sắc theo thời gian.
