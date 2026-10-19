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
1. **Tuyệt Đối Không Pay-to-Win, Không Gacha Nhân Phẩm:** Tất cả người chơi đều có quyền tiếp cận 100% dàn **27 Nữ Chiến Binh Valkyrie** đối xứng. Không có tướng bậc sao, không có thẻ bài SSR/UR vượt trội chỉ số, thắng bại 100% dựa vào kỹ năng bài binh bố trận.
2. **Vai Trò Sinh Ra Từ Vị Trí 3x3 & 12D Buff:** Nhân vật đảm nhận vai trò Khiên Chắn, Sát Thủ Nhảy Ô, hay Xạ Thủ Bắn Tỉa hoàn toàn phụ thuộc vào **tọa độ đứng trên lưới 3x3** và **sự lựa chọn Buff tích lũy trong không gian Vector 12 chiều**.
3. **Bể 9 Buff Thích Ứng Cá Nhân Hóa (12D Vector DB Individual Adaptive Pools):** Mỗi đấu thủ sở hữu vector trạng thái tích lũy lịch sử riêng ($\mathcal{H}_A$ và $\mathcal{H}_B$). Từ đó, Vector DB Engine sinh ra **9 Buff cá nhân hóa riêng biệt cho từng người chơi**, loại bỏ hoàn toàn sự may rủi.
4. **Nghệ Thuật 18+ Quyến Rũ & Cơ Chế Rách Giáp (Sensual Battle Damage):** Từng trận chiến là một bữa tiệc thị giác với các nữ chiến binh Valkyrie, cơ chế trang phục bị phá hủy theo máu (*Cloth Damage Tiers*), và những pha kết liễu *Climax Ultimate* bùng nổ cảm xúc.

---

## 👩‍🦰 2. BẢNG DANH SÁCH 27 VALKYRIE & CƠ CHẾ RÁCH GIÁP 18+ (27-VALKYRIE ROSTER)

Dự án sở hữu **27 Nữ Chiến Binh Valkyrie** chia đều cho 3 Đại Phe Phái (*Solaris Empire*, *Abyssal Dominion*, *Celestial Order*) và 3 Class Chiến Đấu (*Assault, Aegis, Tactician*), chi tiết đặc tả tại [character-roster-18plus.md](deliverables/phase-2-art-design/character-roster-18plus.md):

| Phe Phái | Class | Valkyrie ID & Tên | Danh Xưng / Vũ Khí | Điểm Nhấn Quyến Rũ & Biểu Hiện 18+ |
| :--- | :--- | :--- | :--- | :--- |
| **Solaris** | **Assault** | `VALK_SOL_01` **Kagura** | Thánh Nữ Kiếm Quang • Song Kiếm Plasma | Kimono xẻ hông cao vút, tất lưới ren, đùi thon nuột nà. |
| **Solaris** | **Assault** | `VALK_SOL_02` **Aurelia** | Kỵ Sĩ Mặt Trời • Trọng Kiếm Quang Huy | Giáp ngực vàng kim xẻ sâu, eo thon quyến rũ. |
| **Solaris** | **Assault** | `VALK_SOL_03` **Ignis** | Hỏa Phụng Cuồng Bạo • Song Trảm Đao | Bodysuit da đỏ lửa khoét eo, vệt mồ hôi bóng nhẫy. |
| **Solaris** | **Aegis** | `VALK_SOL_04` **Freya** | Đại Tướng Thái Dương • Khiên Thần & Giáo | Áo giáp hiệp sĩ bạc ôm khít eo, ngực căng tràn khi thở dốc. |
| **Solaris** | **Aegis** | `VALK_SOL_05` **Solaria** | Thành Trì Rực Lửa • Đại Thuẫn Titan | Giáp vai hộ thể, váy xẻ tà lộ vòng hông nở nang. |
| **Solaris** | **Aegis** | `VALK_SOL_06` **Vesta** | Hộ Vệ Ngọn Lửa Thiêng • Chiến Chùy | Váy hộ vệ viền ren, tất trắng đùi cao, ánh mắt kiêu sa. |
| **Solaris** | **Tactician** | `VALK_SOL_07` **Helios** | Quân Sư Quang Học • Pháp Trượng Thái Dương | Áo choàng mỏng tang, gọng kính tri thức, tiếng rên khẽ. |
| **Solaris** | **Tactician** | `VALK_SOL_08` **Dawn** | Sứ Giả Bình Minh • Cung Quang Tử | Cung thủ váy ngắn bồng bềnh, dây nịt tất gợi cảm. |
| **Solaris** | **Tactician** | `VALK_SOL_09` **Corona** | Nữ Bá Tước Nhật Hoa • Quạt Lửa Năng Lượng | Trang phục dạ hội xẻ ngực chữ V táo bạo, nụ cười mê hoặc. |
| **Abyssal** | **Assault** | `VALK_ABY_01` **Lilith** | Ác Nữ Hư Không • Roi Lôi Điện | Bodysuit da bóng bó sát ôm trọn đường cong, cánh dơi. |
| **Abyssal** | **Assault** | `VALK_ABY_02` **Nyx** | Bóng Ma Sát Thủ • Song Đoản Đao | Khăn lụa che nửa mặt, trang phục hở lưng sâu tận đáy. |
| **Abyssal** | **Assault** | `VALK_ABY_03` **Morrigan**| Quạ Đen Tử Thần • Lưỡi Hái Ma Quái | Váy lông vũ đen huyền ảo, cổ áo khoét sâu khoe ngực. |
| **Abyssal** | **Aegis** | `VALK_ABY_04` **Hecate** | Mẫu Hậu Vực Thẳm • Khiên Xương Hắc Ám | Trang phục nữ chúa Gothic, vòng ngực nghẹt thở, gai nhọn. |
| **Abyssal** | **Aegis** | `VALK_ABY_05` **Scylla** | Quái Nữ Biển Đêm • Xích Huyết Khiên | Xích trói shibari phát sáng quanh đùi, ánh nhìn khao khát. |
| **Abyssal** | **Aegis** | `VALK_ABY_06` **Gorgon** | Xà Nữ Hóa Đá • Thuẫn Rắn Độc | Vảy rắn óng ánh ôm sát eo thon, vòng 3 gợi cảm uyển chuyển. |
| **Abyssal** | **Tactician** | `VALK_ABY_07` **Carmilla**| Nữ Bá Tước Huyết Tộc • Huyết Trượng | Áo choàng quý tộc nhung đỏ, cổ áo corset siết chặt eo. |
| **Abyssal** | **Tactician** | `VALK_ABY_08` **Raven** | Nữ Phù Thủy Hư Vô • Cầu Ma Lực | Váy ren đen xuyên thấu, môi đỏ mọng thì thầm tà thuật. |
| **Abyssal** | **Tactician** | `VALK_ABY_09` **Vesper** | Tiếng Vọng Hoàng Hôn • Dao Găm Hắc Ám | Nhẫn giả bí ẩn, tất lưới rách, ánh mắt liếc gợi tình. |
| **Celestial**| **Assault** | `VALK_CEL_01` **Astra** | Xạ Thủ Siêu Không Gian • Súng Thần Photon | Kính ngắm quang học, váy ngắn lộ dây nịt tất quyến rũ. |
| **Celestial**| **Assault** | `VALK_CEL_02` **Seraphina**| Thiên Sứ Trừng Phạt • Gươm Ánh Sáng | Đôi cánh thiên thần thuần khiết, váy trắng xẻ cao táo bạo. |
| **Celestial**| **Assault** | `VALK_CEL_03` **Valkyria** | Nữ Thần Phán Quyết • Kích Tinh Tú | Áo giáp bạch kim siêu nhẹ, đường cong cơ thể hoàn mỹ. |
| **Celestial**| **Aegis** | `VALK_CEL_04` **Athena** | Nữ Thần Chiến Lũy • Thiên Thuẫn | Mũ giáp chiến binh thần thánh, áo nịt ngực ôm sát cơ thể. |
| **Celestial**| **Aegis** | `VALK_CEL_05` **Minerva** | Hộ Pháp Tinh Vân • Trọng Khiên Pha Lê | Váy thánh nữ viền vàng, bờ vai trần nuột nà, nhịp thở sâu. |
| **Celestial**| **Aegis** | `VALK_CEL_06` **Justitia** | Công Lý Bất Diệt • Song Thuẫn Tinh Thể | Áo choàng thánh chức, vòng một căng tròn khẽ nảy theo nhịp. |
| **Celestial**| **Tactician** | `VALK_CEL_07` **Rhea** | Pháp Sư Trọng Lực • Trượng Không Thời Gian | Áo choàng hoàng gia xẻ ngực sâu táo bạo, vương miện pha lê. |
| **Celestial**| **Tactician** | `VALK_CEL_08` **Selene** | Nguyệt Nữ Tinh Tú • Nguyệt Luân | Váy dạ hội bạc mỏng như lụa, đôi chân trần thon dài kiêu kỳ. |
| **Celestial**| **Tactician** | `VALK_CEL_09` **Aurora** | Vũ Nữ Bắc Cực Quang • Dải Lụa Năng Lượng | Dải lụa phát quang che hờ hững thân thể, điệu múa mê hoặc. |

### 💥 Cơ Chế 3 Cấp Độ Rách Giáp (Battle Damage Tiers):
Trong quá trình Auto-Combat thời gian thực, mô hình nhân vật sẽ tự động chuyển đổi trạng thái hình thể dựa trên lượng HP còn lại:
1. **Tier 1 — Trạng Thái Hoàn Hảo (HP 100% - 70%):** Trang phục giáp trụ nguyên vẹn, dáng đứng tự tin, thần thái kiêu hãnh.
2. **Tier 2 — Tổn Hại Chiến Tranh (HP 69% - 30%):** Giáp vai và giáp ngực bị nứt vỡ, vải áo rách toạc lộ ra làn da trắng ngần và đường cong quyến rũ, hai má ửng hồng (Blush effect), nhịp thở dồn dập.
3. **Tier 3 — Climax Cực Hạn (HP < 30% hoặc khi tung Ultimate):** Quần áo rách tả tơi đầy khiêu gợi, linh lực bùng cháy bao quanh cơ thể, ánh mắt rực lửa đam mê, kích hoạt giọng lồng tiếng quyến rũ đặc trưng.

---

## ⚔️ 3. CHỈ SỐ CƠ BẢN PHÂN HÓA THEO CLASS (BALANCED CLASS ROLES)

Để gia tăng chiều sâu chiến thuật trong khi vẫn giữ vững **tính đối xứng 100% giữa hai người chơi**, 27 Valkyries được phân bổ vào 3 Class chuẩn mực với chỉ số cơ bản phân hóa:

| Class Chiến Đấu | Máu (HP) | Công (ATK) | Tốc Đánh | Giáp (Armor) | Kháng Phép (MR) | Năng Lượng Khởi Điểm | Vai Trò Chiến Thuật |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Assault (Tiền Công)** | `900` | `65` | `1.1 đòn/s` | `15` (~13% giảm) | `15` (~13% giảm) | `0 / 100` | Sát thương chủ lực, bộc phá hàng sau. |
| **Aegis (Hộ Vệ)** | `1,300`| `35` | `0.9 đòn/s` | `35` (~26% giảm) | `25` (~20% giảm) | `0 / 100` | Chống chịu tiền tuyến, thu hút hỏa lực. |
| **Tactician (Chiến Thuật)** | `850` | `45` | `1.0 đòn/s` | `15` (~13% giảm) | `30` (~23% giảm) | `20 / 100` | Khống chế, hồi năng lượng, Climax Cut-in. |

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

## 🧬 5. HỆ THỐNG DRAFT 9 BUFF THÍCH ỨNG CÁ NHÂN HÓA (12D VECTOR DB • 3-3-3 ALLOCATION)

Hệ thống buff sở hữu quy mô tối thiểu **$N \ge 243$ Buffs** (chi tiết tại [dynamic-buff-matrix-spec.md](deliverables/phase-3-buff-system/dynamic-buff-matrix-spec.md)). Không phân chia cứng theo Round, Vector DB Server tính toán dựa trên lịch sử $\mathcal{H}_A$ và $\mathcal{H}_B$ để sinh **9 Buff cá nhân hóa độc lập** cho mỗi người chơi theo cơ cấu **3-3-3 History Allocation**:

1. **3 Buff Cường Hóa Nhánh Lịch Sử (Deep Synergy):**
   - Truy vấn kNN gần nhất với vector tích lũy của chính người chơi $\vec{S}_A$:
   - Đẩy sâu trường phái chiến thuật đang định hình (Physical, Magic, Shield, Crit, Climax).
2. **3 Buff Phản Ứng Khắc Chế (Direct Counter):**
   - Truy vấn kNN theo vector mục tiêu $\vec{T}_{counter} = M_{counter} \times \vec{S}_B$:
   - Khắc chế trực tiếp những buff mà đối thủ đã chọn trong các ván trước, mở ra cơ hội lật kèo công bằng.
3. **3 Buff Định Đoạt Thắng Thua / Đột Biến (Apex Decisive & Pivots):**
   - Tự động mở khóa và khuếch đại theo mức độ khẩn cấp $\mathcal{U}$ của thể thức BO3/BO5.
   - Ở các ván cuối hoặc Match Point, các Buff Depth 5 sở hữu quyền năng xoay chuyển cờ thế bùng nổ, tạo nên sự kịch tính nghẹt thở.
   - *Cross-Depth Resurfacing:* Cho phép các Buff chưa được chọn ở các Depth trước tái xuất hiện nếu các lựa chọn sau này tạo ra sự cộng hưởng cao.

---

## ⚡ 6. VÒNG LẶP TRẬN ĐẤU & KẾ THỪA CHUỖI BO3/BO5 (SERIES PROGRESSION)

- **Thể thức thi đấu:** Đấu chạm 2 (BO3) hoặc đấu chạm 3 (BO5).
- **Mỗi Game gồm các Round (Vòng Đấu):**
  - **Pha 1 — Draft Buff (20 giây):** Cùng chọn 1 trong 9 Buff.
  - **Pha 2 — Xếp Đội Hình 3x3 (20 giây):** Sắp xếp 6 Valkyrie vào 9 ô dưới lớp sương mù che giấu (*Fog of Placement*).
  - **Pha 3 — Tự Động Giao Tranh (Real-Time Combat):** Server chạy mô phỏng 20 ticks/s và truyền gói tin về Client.
  - **Pha 4 — Tổng Kết & Rách Giáp:** Trao thưởng điểm số, hiển thị màn hình chiến thắng/thất bại và hoạt cảnh của Waifu.
- **Tính Kế Thừa Bất Biến (Persistent Series):** Toàn bộ các Buff đã chọn được tích lũy xuyên suốt các Round của Game 1, truyền sang Game 2 và Game 3 trong chuỗi BO3/BO5, tạo nên sự tiến hóa chiến thuật sâu sắc theo thời gian.
