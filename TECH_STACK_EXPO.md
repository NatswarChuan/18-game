# 📱 TECH STACK: EXPO UNIVERSAL CLIENT (WEB & MOBILE)
*(Xem tài liệu chi tiết đầy đủ tại: @[TECH_STACK_CLIENT.md](TECH_STACK_CLIENT.md))*

## 1. Nền Tảng Universal Client (Expo SDK 52+ & 100% TypeScript)
- **Framework:** Expo SDK 52+ (React Native) hỗ trợ **Universal App (iOS, Android, Web HTML5)** từ một codebase duy nhất.
- **Routing:** `expo-router` / file-based routing cho màn hình phòng đấu.
- **Rendering & Game Board Visuals:**
  - **2D/2.5D High-Performance Canvas:** `@shopify/react-native-skia` kết hợp `react-native-reanimated` (v3+) chạy 100% trên UI Thread native ở mức **60–120 FPS**.
  - **Mô hình nhân vật Waifu:** Cơ chế rách giáp 3 cấp độ (Pristine $\rightarrow$ Torn $\rightarrow$ Climax Extreme) chuyển đổi texture động.
- **State Management:** `zustand` (Đồng bộ trực tiếp snapshot từ WebSocket NestJS Server).
- **Network Layer:** Native `WebSocket` kết nối trực tiếp với NestJS Server Gateway (`ws://localhost:4000/ws`).
- **Audio:** `expo-av` đa kênh âm thanh.

## 2. Nguyên Tắc "Dumb Terminal, Sensual Visuals"
- **Không bao giờ tính toán kết quả giao tranh ở Client:** Client chỉ gửi Intent (`SELECT_BUFF`, `UPDATE_PLACEMENT`, `LOCK_IN`) và render lại chuỗi sự kiện được Server phê duyệt.
- **Visual Morphing & Rách Giáp (Cloth Damage):**
  - **Hàng 1:** Khiên năng lượng, giáp trụ dày dặn, +15% Mana khi nhận đòn.
  - **Hàng 2:** Vũ khí tầm trung, tư thế bọc lót cơ động, hiệu ứng Flanking (+25% DMG).
  - **Hàng 3:** Pháo photon/nỏ tầm xa, vòng bảo hộ Untargetable.
  - **Cơ chế rách giáp 3 nấc:** Khi HP rơi xuống dưới 70% và 30%, trang phục của Waifu biến đổi sang trạng thái rách gợi cảm và kích hoạt biểu cảm ửng hồng.
