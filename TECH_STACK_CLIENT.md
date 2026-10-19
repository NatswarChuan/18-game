# 📱 TECH STACK & CLIENT ARCHITECTURE (EXPO UNIVERSAL: WEB & MOBILE)
*(Valkyrie Protocol: Zero • 100% TypeScript • Expo SDK 52+ • 60-120 FPS High Performance • Dumb Terminal)*

---

## 💻 1. NỀN TẢNG CÔNG NGHỆ EXPO UNIVERSAL (REACT NATIVE CHO CẢ WEB & MOBILE)

Để đồng nhất 100% mã nguồn giữa Web và Mobile từ một codebase duy nhất, Client được xây dựng hoàn toàn bằng **Expo SDK 52+ (React Native)** và **TypeScript Strict Mode**:

- **Framework:** `Expo SDK 52+` (Universal React Native).
  - **Render Web:** Biên dịch ra Web tĩnh tối ưu hóa HTML5/Canvas thông qua `@expo/metro-runtime` và `react-native-web`.
  - **Render Mobile:** Hỗ trợ mượt mà iOS và Android (Cross-Platform Native).
- **Routing:** `expo-router` (File-based routing chuẩn mực cho Universal App).
- **Đồ Họa & Hiệu Năng 60–120 FPS:**
  - `@shopify/react-native-skia`: Render bảng cờ 3x3 2.5D, hiệu ứng ánh sáng Neon và texture chuyển động trên UI Thread native, không bị chặn bởi JavaScript thread.
  - `react-native-reanimated` (v3+): Điều khiển các cử động lướt cờ, kéo thả Magnetic Snap, và các hoạt ảnh rung chấn màn hình (Screenshake).
- **State Management:** `zustand` (State nhẹ, không re-render dư thừa, đồng bộ trực tiếp snapshot từ WebSocket Server).
- **Giao Thức WebSocket Realtime:**
  - Native `WebSocket` kết nối trực tiếp với NestJS WebSocket Gateway (`ws://localhost:4000/ws` hoặc WSS Production).
  - Tận dụng 100% kiểu dữ liệu chung từ `packages/shared-domain`.
- **Hệ Thống Âm Thanh (Audio Engine):**
  - `expo-av`: Xử lý âm thanh đa kênh (BGM Cyberpunk, Sound Effects chém kim loại, Sensual Japanese Voice Lines).

---

## 🎭 2. NGUYÊN TẮC THIẾT KẾ "DUMB TERMINAL, SENSORY MASTERPIECE"

1. **Client Tuyệt Đối Không Xử Lý Logic Thắng Thua:**
   - Client không chứa các hàm tính toán trừ máu ngầm.
   - Khi giao tranh diễn ra, Client nhận danh sách `CombatEvent` từ NestJS Server và đóng vai trò như một cỗ máy diễn hoạt (Playback Orchestrator): phát âm thanh, kích hoạt rung chấn màn hình, chạy hoạt ảnh kiếm chém, và biến đổi phục trang.
2. **Cơ Chế Render 3 Cấp Độ Rách Giáp (Cloth Damage State Machine):**
   - Khi nhận sự kiện `UNIT_DAMAGED` với HP giảm xuống các ngưỡng $70\%$ và $30\%$, Client kích hoạt hiệu ứng vỡ vụn hạt (Particle Shatter) và mượt mà hòa trộn (Cross-fade) texture nhân vật sang trạng thái gợi cảm tương ứng.
3. **Hoạt Cảnh Climax Ultimate Cut-In:**
   - Khi đơn vị đạt đủ 100 Mana, một layer Cut-In toàn màn hình kích hoạt trong 0.8 giây:
     - Làm tối sàn đấu phía sau (Dimming Background).
     - Phóng to chân dung Waifu ở góc nghiêng cận cảnh quyến rũ kèm ánh mắt rực sáng.
     - Lồng tiếng kỹ năng độc quyền vang lên, trước khi trả quyền điều khiển về sàn đấu 3x3 để tung đòn kết liễu.
4. **Tương Tác Kéo Thả 3x3 Không Độ Trễ (Sub-16ms Drag-and-Drop):**
   - Thao tác kéo 6 Valkyrie vào 9 ô được tính toán tọa độ theo thời gian thực với hiệu ứng phản hồi lực hút (Magnetic Snap Effect) vào trung tâm các ô cờ.
   - Hiển thị viền sáng báo hiệu ô hợp lệ / ô không hợp lệ, không gây giật khung hình.

---

## ⚡ 3. TỐI ƯU HÓA HIỆU NĂNG & DỌN DẸP BỘ NHỚ TRÊN EXPO

- **Tránh Rò Rỉ GPU Shaders / Textures:** Mọi texture hình ảnh và âm thanh khi rời khỏi màn hình thi đấu đều phải gọi `sound.unloadAsync()` và giải phóng Skia Picture/Images.
- **Giữ Chuẩn 60 FPS Bất Biến:** Sử dụng Skia Canvas chạy trên GPU thay vì lạm dụng các thẻ `View` HTML/React Native lồng nhau quá sâu.
- **Tách Lớp UI (Decoupled Layering):**
  - *Layer 1 (Dưới cùng):* Bàn cờ 3x3 tĩnh & hiệu ứng ánh sáng sàn đấu.
  - *Layer 2 (Giữa):* Skia Canvas chuyển động của 6 quân cờ, hoạt cảnh tấn công, tia đạn.
  - *Layer 3 (Trên cùng):* HUD giao diện người dùng, thanh máu, đồng hồ đếm ngược 20s, và nút Lock-in.

---

## 🔞 4. CHIẾN LƯỢC PHÂN PHỐI GAME 18+ & CHẾ ĐỘ KIỂM DUYỆT KÉP (STORE COMPLIANCE & DUAL CENSORSHIP)

Do chính sách kiểm duyệt khắt khe của Apple App Store (Guideline 1.1 / 1.2) và Google Play Store đối với nội dung người lớn (Eroge, Cloth Damage Tier 3, rên rỉ khiêu gợi), dự án áp dụng chiến lược đa kênh kết hợp kiến trúc kiểm duyệt kép:

### 4.1. Chiến Lược Phân Phối Đa Kênh:
1. **Kênh Chính — Web HTML5 / PWA (Uncensored 18+ Edition):**
   - Phục vụ trực tiếp qua trình duyệt Chromium / WebKit (Desktop & Mobile Browser).
   - Không phụ thuộc vào bất kỳ chợ ứng dụng nào; người chơi trải nghiệm toàn bộ đồ họa 18+ nguyên bản ở 60 FPS.
2. **Kênh Mobile Android Sideloading (APK Direct Download):**
   - Cung cấp file APK trực tiếp trên website chính thức của dự án và các nền tảng phát hành game 18+ quốc tế (*Erolabs, Nutaku, itch.io, DMM Games*).
3. **Kênh Store Submission (Store Demo Edition):**
   - Sử dụng cờ biên dịch `STORE_SAFE` để đóng gói bản demo tuân thủ nguyên tắc cộng đồng đưa lên Google Play / App Store nhằm tiếp cận tập người dùng đại chúng.

### 4.2. Kiến Trúc Cờ Kiểm Duyệt Kép (`CENSORSHIP_MODE`):
Cấu hình thông qua biến môi trường `EXPO_PUBLIC_CENSORSHIP_MODE` hoặc tùy chọn trong mục Cài Đặt của Client:

| Thuộc Tính Hiển Thị | Chế Độ `UNRATED_18_PLUS` (Web / Sideload APK) | Chế Độ `STORE_SAFE` (App Store / Family-Safe) |
| :--- | :--- | :--- |
| **Cloth Damage Tier 2** | Vải áo rách toạc lộ nội y ren và đường cong cơ thể | Vết xước trang phục nhẹ, giáp nứt vỡ không hở da thịt |
| **Cloth Damage Tier 3** | Quần áo rách tả tơi khiêu gợi, ngực đầy đặn thở dốc | Bao phủ bởi hiệu ứng ánh sáng thần thánh (*Holy Light*) |
| **Âm Thanh Rách Giáp** | Tiếng thở dốc, rên rỉ quyến rũ tiếng Nhật (Ecchi SFX) | Tiếng kim loại va chạm và tiếng thét chiến đấu kiên cường |
| **Climax Cut-In** | Khung hình zoom sát góc máy gợi cảm, ánh mắt đắm say | Chân dung chiến binh anh dũng với ánh hào quang năng lượng |
