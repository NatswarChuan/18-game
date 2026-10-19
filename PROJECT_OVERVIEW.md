# 🎯 PROJECT OVERVIEW: VALKYRIE PROTOCOL: ZERO
*(Anime 18+ Tactical Auto-Battler • Client/Server Monorepo • Zero-to-Production)*

---

## 🌟 1. TÓM TẮT DỰ ÁN (EXECUTIVE SUMMARY)

**VALKYRIE PROTOCOL: ZERO** là tựa game chiến thuật đối kháng 1v1 PvP thời gian thực trên bàn cờ **3x3**, thi đấu theo thể thức **BO3 / BO5**. Trò chơi kết hợp đỉnh cao giữa **tư duy chiến thuật thuần khiết (Pure-Skill)** và **thẩm mỹ Anime 18+ quyến rũ (Sensual Waifu Cyberpunk Art)**.

Dự án được xây dựng từ con số 0 với cấu trúc **Monorepo** phân chia rạch ròi giữa **Client** (giao diện, hoạt ảnh 60 FPS, âm thanh VFX) và **Server** (Combat Engine thời gian thực 20 ticks/s, chống gian lận tuyệt đối). Toàn bộ quy trình phát triển được điều phối qua mô hình **Waterfall đa tác tử khắt khe**.

---

## 🏛️ 2. PHÂN TÁCH RẠCH RÒI CLIENT / SERVER TRONG MONOREPO

Dự án tuyệt đối không trộn lẫn logic nghiệp vụ và mã giao diện:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       VALKYRIE PROTOCOL MONOREPO                        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│  `apps/client`          │ │  `apps/server`          │ │ `packages/shared-domain`│
│  - Expo SDK Universal   │ │  - NestJS Framework     │ │ - Pure TypeScript       │
│  - Render Web & Mobile  │ │  - Authoritative 20ticks│ │ - Zero Dependencies     │
│  - Skia / Reanimated    │ │  - NoSQL (Mongo + Redis)│ │ - Base Unit Constants   │
│  - Dumb Terminal 60fps  │ │  - 12D Vector Equilibrium│ │ - Board 3x3 Math & Types│
│  - Waifu 18+ Visuals    │ │  - Anti-Cheat & Fog     │ │ - Damage Formulas       │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

1. **`packages/shared-domain/` (Hạt Nhân Toán Học & Kiểu Dữ Liệu Dùng Chung):**
   - Viết bằng Pure TypeScript 100%, **0 runtime dependency**.
   - Định nghĩa chỉ số cơ bản của 27 Valkyries theo 3 Class, cấu trúc lưới 3x3, công thức tính giảm sát thương theo giáp, và không gian Vector 12 chiều.
2. **`apps/server/` (Trọng Tài Tối Cao - NestJS Server-Authoritative Engine):**
   - Xây dựng hoàn toàn bằng **NestJS** với 100% Strict TypeScript.
   - Quản lý State Machine phòng đấu qua `@WebSocketGateway()`, vòng lặp mô phỏng xác định 20 ticks/s.
   - Tầng lưu trữ **NoSQL (MongoDB qua `@nestjs/mongoose` & Redis Cache)**: Quản lý hồ sơ người chơi, bộ sưu tập Waifu, lịch sử trận đấu và hàng đợi ghép trận.
3. **`apps/client/` (Đầu Cuối Hiển Thị Đồ Họa 60 FPS - Expo Universal Client):**
   - Xây dựng bằng **Expo SDK (React Native)** render đồng nhất cả **Mobile (iOS, Android)** và **Web (HTML5)** từ 1 codebase duy nhất.
   - Thể hiện sự quyến rũ của dàn 27 nữ chiến binh Valkyrie, cơ chế kéo thả bàn cờ 3x3 với Skia và Reanimated, và hoạt ảnh rách giáp chiến đấu.

---

## ⚔️ 3. CÁC TRỤ CỘT GAMEPLAY CỐT LÕI (CORE GAMEPLAY PILLARS)

### 1. Dàn 27 Valkyrie Đa Dạng — Cân Bằng Đối Xứng Tuyệt Đối (27 Valkyries, Zero Pay-to-Win):
- Hệ thống gồm **27 Valkyries** thuộc 3 Phe Phái (*Solaris Empire*, *Abyssal Dominion*, *Celestial Order*) và 3 Class chuyên biệt:
  - **Assault (Tiền Công):** `HP: 900`, `ATK: 65`, `Giáp: 15`, `Kháng phép: 15` — Sát thương bộc phát cao.
  - **Aegis (Hộ Vệ):** `HP: 1,300`, `ATK: 35`, `Giáp: 35`, `Kháng phép: 25` — Chống chịu kiên cường.
  - **Tactician (Chiến Thuật):** `HP: 850`, `ATK: 45`, `Giáp: 15`, `Kháng phép: 30`, khởi điểm `20 Mana` — Hồi năng lượng, khống chế.
- Cả 2 người chơi đều có quyền tiếp cận 100% danh sách tướng đối xứng; tuyệt đối không có gacha chỉ số hay yếu tố Pay-to-Win.

### 2. Định Hình Vai Trò Qua Tọa Độ Lưới 3x3 (Position-Driven Roles):
- Mỗi bên sắp xếp **đúng 6 quân cờ vào 9 ô** (luôn có đúng **3 ô trống chiến thuật**).
- Vai trò của nữ chiến binh được quyết định bởi vị trí đứng:
  - **Hàng 1 (Ô 1, 2, 3 - Tiền phong / Frontline):** Cận chiến, hút hỏa lực, +15% Năng lượng khi bị tấn công. Ô 2 có khả năng đâm xuyên vào hàng sau đối phương nếu ô trước mặt trống.
  - **Hàng 2 (Ô 4, 5, 6 - Trung quân / Midline):** Tầm đánh 2 ô, bọc lót đồng minh. Ô 4 & 6 kích hoạt cơ chế **Bọc sườn (Flanking: +25% DMG)** nếu cánh đối diện trống.
  - **Hàng 3 (Ô 7, 8, 9 - Hậu tuyến / Backline):** Xạ thủ tầm xa 3 ô, bắn xuyên cột hoặc hạ gục mục tiêu thấp máu nhất. Không thể bị đánh thường khi còn đồng minh Hàng 1/2 che chắn.

### 3. Hệ Thống 9 Buff Thích Ứng Cá Nhân Hóa (12D Vector DB • Cơ Cấu 3-3-3):
- Mỗi Round, Vector DB Server tính toán dựa trên lịch sử tích lũy của hai đấu thủ để sinh **9 Buff riêng biệt cho từng người chơi**:
- Thuật toán 12D Vector kNN phân bổ chính xác theo cơ cấu **3-3-3 History Allocation**:
  - **3 Buff Cường Hóa Nhánh Lịch Sử (Deep Synergy):** Đẩy sâu trường phái chiến thuật mà bản thân đã tích lũy từ các buff trước.
  - **3 Buff Phản Ứng Khắc Chế (Direct Counter):** Phản ứng trực diện vô hiệu hóa trường phái mà đối thủ đã chọn.
  - **3 Buff Định Đoạt / Lật Kèo Đột Biến (Apex Decisive):** Mở rộng theo mức độ khẩn cấp (Urgency) của chuỗi trận BO3/BO5, bùng nổ sức mạnh ở ván quyết định.

### 4. Tính Kế Thừa Trong Chuỗi Trận BO3 / BO5 (Persistent Series Evolution):
- Các Buff đã chọn được tích lũy xuyên suốt các Round và giữ nguyên qua các Ván đấu (Game 1, Game 2, Game 3), chỉ được làm mới khi kết thúc hoàn toàn loạt trận BO3/BO5.

---

## 🌸 4. NGHỆ THUẬT ANIME 18+ & TRẢI NGHIỆM THỊ GIÁC QUYẾN RŨ

1. **Tạo Hình Waifu Sống Động:** Dàn Valkyrie mang phong cách Cyber-Eroge tinh tế, đường nét quyến rũ, trang phục viễn tưởng ôm sát tôn vinh đường cong gợi cảm.
2. **Cơ Chế Rách Giáp 3 Giai Đoạn (Battle Damage Tiers):**
   - **Giai đoạn 1 (HP 100% - 70%):** Trang phục giáp trụ nguyên vẹn, thần thái tự tin, hào quang rực rỡ.
   - **Giai đoạn 2 (HP 69% - 30%):** Giáp trụ bị phá hủy một phần, lộ những đường nét cơ thể quyến rũ, biểu cảm ửng hồng (Blush) và tiếng thở dốc.
   - **Giai đoạn 3 (HP < 30% hoặc Kích hoạt Climax):** Trạng thái chiến đấu cực hạn, trang phục rách tả tơi đầy khiêu gợi, kích phát toàn bộ linh lực ánh sáng bao quanh.
3. **Climax Ultimate Cut-Ins:** Khi nạp đầy 100/100 Năng lượng, màn hình xuất hiện đoạn hoạt cảnh Cut-in phóng đại cận cảnh khuôn mặt và tư thế chiến đấu của Valkyrie trước khi tung đòn quyết định.
4. **Âm Thanh & Phản Hồi Xúc Giác:** Lồng tiếng Nhật ngữ biểu cảm, tiếng thở dốc quyến rũ khi chịu đòn, âm thanh va đập kim loại đanh thép và hiệu ứng rung chấn màn hình (Screenshake) đầy uy lực.

---

## 🚀 5. TIÊU CHUẨN DEPLOY & SẴN SÀNG PRODUCTION
- Đóng gói toàn bộ trong `docker-compose.yml` gồm 4 dịch vụ: Nginx Gateway (SSL), Client Web, Server Combat Engine, và Redis Cache.
- Tài liệu triển khai chuẩn mực tại [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md), cho phép đưa lên server chỉ với một câu lệnh `docker compose up -d --build`.
