# 🎫 PHIẾU THEO DÕI SỰ CỐ & LỖI KIỂM THỬ (QA BUG TICKETS TRACKER)
*(Dự án: Valkyrie Protocol: Zero • Quản trị bởi qa-balance-tester, backend-engineer & frontend-engineer)*

---

## 📊 BẢNG TỔNG QUAN TICKETS HIỆN TẠI

| Ticket ID | Tiêu Đề Sự Cố | Phân Loại Tầng (Layer) | Mức Độ Nghiêm Trọng | Người Xử Lý (Assignee) | Trạng Thái (Status) | Lượt Retest |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TK-001** | Khắc phục Type Check & Unused Imports theo chuẩn Strict | Monorepo / BE & FE | Major | `system-architect` | `CLOSED_PASS` | 1 |
| **TK-002** | Đồng bộ hóa kết nối WebSocket & Live Combat Telemetry 20Hz | Network / Protocol | Minor | `backend-engineer` | `CLOSED_PASS` | 1 |
| **TK-003** | Tái thiết kế Đấu Trường Esports Arena 100vh triệt tiêu cuộn trang | Client UI/UX | Critical | `art-designer` & `frontend-engineer` | `CLOSED_PASS` | 1 |
| **TK-004** | Kiểm toán Enterprise Production Quality Gate (SonarQube/Coverity) | Code Quality / SAST | Major | `secops-quality-gate` & `system-architect` | `CLOSED_PASS` | 1 |
| **TK-005** | Đấu Trường 2.5D Isometric Stadium, Widescreen 3 Cánh & Hành Vi Động Học Kinetic | UI/UX & Game Feel | Critical | `art-designer`, `frontend-engineer`, `backend-engineer` | `CLOSED_PASS` | 1 |
| **TK-006** | Tích Hợp Three.js WebGL Engine Render Nhân Vật 2.5D Đa Tầng | 3D Graphics / Engine | Major | `art-designer` & `frontend-engineer` | `CLOSED_PASS` | 1 |
| **TK-007** | Đại Tu Sân Đấu 3D Panoramic 960x520, Lăng Kính Pha Lê Feathered & Triệt Tiêu Clutter | 3D Graphics / UI/UX | Critical | `art-designer` & `frontend-engineer` | `CLOSED_PASS` | 1 |
| **TK-008** | Nâng Cấp Hệ Thống Hành Vi Gamer-Friendly (Kéo Thả Đổi Chỗ, Phím Tắt, Tooltip & 3D VFX) | Game Feel / UX & VFX | Critical | `art-designer` & `frontend-engineer` | `CLOSED_PASS` | 1 |
| **TK-009** | Tái Cấu Trúc Toàn Diện Mỹ Thuật 3D VALK-01 Freyja Theo Chuẩn Concept Art Gốc | 3D Anime Modeling / Shaders & Texture | Critical | `model-3d-designer` & `art-designer` | `CLOSED_PASS` | 1 |

*Trạng thái hợp lệ:* `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED_BE` / `RESOLVED_FE` $\rightarrow$ `RETESTING` $\rightarrow$ `CLOSED_PASS`.

---

## 📝 DANH SÁCH CHI TIẾT TỪNG TICKET

### [TK-001] Khắc phục Type Check & Unused Imports theo chuẩn Strict
- **Thời gian tạo:** 2026-10-19 23:02:00
- **Phân loại tầng:** Shared Domain & Backend & Client
- **Mức độ:** Major
- **Tác tử báo cáo:** `secops-quality-gate`
- **Tác tử chịu trách nhiệm sửa:** `system-architect`
- **Mô tả:** Trình biên dịch TypeScript Strict 100% cảnh báo `exactOptionalPropertyTypes` và các imports chưa sử dụng.
- **Nhật ký xử lý:** Đã refactor toàn bộ kiểu dữ liệu, loại bỏ imports rác, đảm bảo 0 lỗi biên dịch trên toàn bộ Monorepo.
- **Kết quả Retest:** PASS. Biên dịch và tests toàn bộ workspace đạt 100% `CLOSED_PASS`.

### [TK-002] Đồng bộ hóa kết nối WebSocket & Live Combat Telemetry 20Hz
- **Thời gian tạo:** 2026-10-19 23:08:00
- **Phân loại tầng:** Network WebSocket
- **Mức độ:** Minor
- **Tác tử báo cáo:** `qa-balance-tester`
- **Tác tử chịu trách nhiệm sửa:** `backend-engineer`
- **Mô tả:** Kiểm tra kết nối thời gian thực giữa Client và Server trên môi trường trình duyệt.
- **Nhật ký xử lý:** Thiết lập endpoint `/ws` và `/health`, hỗ trợ kết nối tự động và phát snapshot 50ms/tick.
- **Kết quả Retest:** PASS. Browser subagent mở web-app, nhận snapshot liên tục, các thanh máu và nhật ký sự kiện stream trơn tru -> Đóng ticket `CLOSED_PASS`.

### [TK-003] Tái thiết kế Đấu Trường Esports Arena 100vh triệt tiêu cuộn trang
- **Thời gian tạo:** 2026-10-20 00:05:00
- **Phân loại tầng:** Client UI/UX & Graphics
- **Mức độ:** Critical
- **Tác tử báo cáo:** `art-designer` & User Request
- **Tác tử chịu trách nhiệm sửa:** `art-designer` & `frontend-engineer`
- **Mô tả:** UI ban đầu cuộn dọc như văn bản web (15,436px), các ô Hàng 3 bị dock dưới chân che khuất.
- **Nhật ký xử lý:** Chuyển đổi toàn bộ sang bố cục Esports Arena: Tech-Pads 52px, Medallions 48px, Floating Dock Rail 84px lơ lửng, loại bỏ text thừa thãi.
- **Kết quả Retest:** PASS. `browser_subagent` xác nhận chiều cao chính xác 695px/695px, 0 cuộn ngoài, điểm thẩm mỹ đạt 9.6/10 -> Đóng ticket `CLOSED_PASS`.

### [TK-004] Kiểm toán Enterprise Production Quality Gate (SonarQube/Coverity)
- **Thời gian tạo:** 2026-10-20 00:25:00
- **Phân loại tầng:** Code Quality & Security SAST
- **Mức độ:** Major
- **Tác tử báo cáo:** `secops-quality-gate`
- **Tác tử chịu trách nhiệm sửa:** Toàn bộ đội ngũ Subagents
- **Mô tả:** Vượt qua các ngưỡng khắt khe về độ dài tệp ($\le 350$ dòng), độ dài hàm ($\le 60$ dòng), độ phức tạp nhận thức ($\le 15$), và chống rò rỉ sự kiện WebSocket listener.
- **Nhật ký xử lý:** Modular hóa `valkyrie.ts` (3 Factions), `App.tsx` (tách `TopEsportsHud` & `BottomDockRail`), `useGameWebSocket.ts` (tách kết nối & điều phối), `room-state-machine.ts` (tách `room-types` & `room-broadcaster`), bổ sung `socket.off` cleanup trong `main.ts`.
- **Kết quả Retest:** PASS. Script `audit_sonar_coverity_blackduck.py` quét 38 files đạt 100% PASS cho cả 3 cổng -> Đóng ticket `CLOSED_PASS`.

### [TK-005] Đấu Trường 2.5D Isometric Stadium, Widescreen 3 Cánh & Hành Vi Động Học Kinetic
- **Thời gian tạo:** 2026-10-20 11:15:00
- **Phân loại tầng:** Client UI/UX, CSS 3D Engine, Combat Animation & Server WebSocket
- **Mức độ:** Critical
- **Tác tử báo cáo:** User Request & `qa-balance-tester`
- **Tác tử chịu trách nhiệm sửa:** `art-designer`, `frontend-engineer`, `backend-engineer`
- **Mô tả:** Người dùng phản ánh bàn cờ lãng phí không gian 2 bên (~1000px), các ô bị ép bẹp, hành vi combat chỉ là tụt máu tĩnh không có cảm giác va chạm chiến đấu (actions/behaviors thiếu).
- **Nhật ký xử lý:**
  1. Xây dựng tài liệu thiết kế V3 `deliverables/phase-2-art-design/ui-redesign-v3-isometric-arena.md` được Hội đồng 3 Agent ký duyệt (Điểm thẩm mỹ 9.9/10).
  2. Tái cấu trúc bố cục 3 Cánh trên Widescreen: Cánh Trái 260px (`TacticalLeftWing`) hiển thị Tộc/Hệ và Quy tắc Hàng; Sân Đấu Trung Tâm 540px (`GameBoard`) góc nghiêng Isometric 2.5D (`perspective: 1100px`, `rotateX(20deg)`) với thẻ quân bài dựng đứng phản xoay (`rotateX(-20deg)`); Cánh Phải 260px (`CombatRightWing`) hiển thị Telemetry 20Hz thời gian thực.
  3. Bổ sung trọn bộ hoạt ảnh động học (Kinetic Behaviors): Lunge lao tấn công (`@keyframes unitLungePlayer/Enemy`), Giật lùi phản lực (`@keyframes hitRecoil`), Sóng xung kích rách giáp (`@keyframes clothShockwave`), Hào quang rực lửa Overdrive Tier 3 (`@keyframes overdriveFlame`).
  4. Khắc phục lỗi tràn flexbox ở `BottomDockRail` giúp thanh cuộn quân dự bị cuộn độc lập và nút `⚔️ CHIẾN!` cố định chuẩn công thái học.
  5. Sửa lỗi cú pháp ESM `export type { PlayerSession }` trên Server giúp kết nối WebSocket hoạt động trơn tru.
- **Kết quả Retest:** PASS. Playtest hoàn tất trọn vẹn luồng Draft 9 Buffs -> Xếp Trận 3x3 Isometric -> Khóa Chiến -> Combat 20Hz rực lửa -> Đánh giá vòng đấu. Ghi lại video WebP `battle_live_flow_1792496345157.webp` -> Đóng ticket `CLOSED_PASS`.

### [TK-006] Tích Hợp Three.js WebGL Engine Render Nhân Vật 2.5D Đa Tầng
- **Thời gian tạo:** 2026-10-20 18:48:00
- **Phân loại tầng:** 3D Graphics / Three.js WebGL / Client Presentation
- **Mức độ:** Major
- **Tác tử báo cáo:** User Request & `art-designer`
- **Tác tử chịu trách nhiệm sửa:** `art-designer` & `frontend-engineer`
- **Mô tả:** Người dùng yêu cầu sử dụng thêm thư viện đồ họa để render nhân vật 2.5D thay cho ảnh jpg phẳng tĩnh.
- **Nhật ký xử lý:**
  1. Cài đặt thư viện `three` và `@types/three` đạt chuẩn giấy phép thương mại an toàn (MIT License).
  2. Xây dựng tiện ích `apps/client/src/utils/three-valkyrie-builder.ts`:
     - Bệ đỡ Hologram 3D xoay tròn (`TorusGeometry` + `CircleGeometry` wireframe + `CylinderGeometry` light beam).
     - Mặt phẳng thị sai 2.5D đa tầng: Lớp Aura phát quang phía sau ($Z = -0.06$), Lớp nhân vật trung tâm ($Z = 0$) kèm hoạt ảnh thở (breathing idle), Lớp vòng năng lượng công nghệ phía trước ($Z = +0.06$).
     - Đèn hắt chân bệ (PointLight underglow) và ánh sáng định hướng theo màu phe phái (Cyan, Magenta, Gold).
     - Cơ chế dọn dẹp bộ nhớ WebGL nghiêm ngặt (`disposeThreeScene`) chống rò rỉ GPU theo chuẩn Coverity SAST.
  3. Tạo React component `ValkyrieThreeAvatar.tsx`:
     - Tích hợp vòng lặp 60 FPS mượt mà.
     - Phản ứng động với sự kiện giao tranh: Xoay bệ thần tốc khi tung tuyệt kỹ Climax (`isCasting`), rung giật ngẫu nhiên khi dính sát thương (`isHit`), mờ dần khi tử trận (`isDead`).
     - Tương tác thị sai chuột 3D (Mouse tilt parallax) khi di chuột qua mô hình.
  4. Tích hợp `ValkyrieThreeAvatar` vào thẻ bài bàn cờ 3x3 (`ValkyrieCard.tsx`) và sân khấu trình diễn lớn trong `ValkyrieModal.tsx`.
### [TK-007] Đại Tu Sân Đấu 3D Panoramic 960x520, Lăng Kính Pha Lê Feathered & Triệt Tiêu Clutter
- **Thời gian tạo:** 2026-10-20 19:15:00
- **Phân loại tầng:** Three.js WebGL / UI/UX / Canvas Shader
- **Mức độ:** Critical
- **Tác tử báo cáo:** User Request ("game vẫn chưa đẹp") & `art-designer`
- **Tác tử chịu trách nhiệm sửa:** `art-designer` & `frontend-engineer`
- **Mô tả:** Đấu trường Three.js trước đây bị bó hẹp trong khung 560x430px ở giữa màn hình 1920x911, pedestals chỉ là wireframe vòng tròn mỏng, các thẻ bài Valkyrie dạng ảnh chữ nhật đứng thô cứng với viền đen, và các banner text (`CHIẾN TUYẾN 20HZ`, `SECTOR BẢO VỆ`) đè lên nhau ngay trên sàn đấu làm che khuất nhân vật.
- **Nhật ký xử lý:**
  1. **Mở Rộng Không Gian Panoramic 960x520:** Tăng kích thước sàn đấu lên gấp 2.5 lần (`960x520px`), thiết lập góc nhìn Isometric Vàng (`camera.position.set(0, 7.2, 5.8)`, `lookAt(0, -0.1, 0.3)`), khoảng cách hàng $zSpacing = 1.65$ và $xSpacing = 2.45$ giúp 3 hàng quân phân tách mạch lạc.
  2. **Bệ Đài Hologram 3D Cao Cấp:** Thiết kế lại `createSlotPedestal` với đĩa kim loại tối màu dày dặn, vòng beveled Neon phát quang kép, vòng rune công nghệ và cột ánh sáng thẳng đứng bao bọc nhân vật.
  3. **Lăng Kính Pha Lê Feathered 2.5D:** Xây dựng `valkyrie-hologram-texture.ts`: Cắt gọt viền lăng kính pha lê vát góc lục giác, áp dụng kỹ thuật làm mờ viền (feathered edge vignette) giúp ảnh chân dung hòa tan mượt mà vào hào quang Tộc/Hệ mà không còn viền chữ nhật thô kệch. Tích hợp huy hiệu tên nhân vật và cấp độ rách giáp.
  4. **Triệt Tiêu Hoàn Toàn Text Clutter:** Loại bỏ toàn bộ các banner chữ đè lên nhau ở giữa sàn đấu. Drop-zones HTML được chiếu tọa độ chuẩn xác 100% lên đỉnh bệ đài 3D thông qua `vector.project(camera)`.
  5. **Bảng Điều Khiển Cánh Trái & Phải Tối Ưu:** Bổ sung Radar Trinh Sát Ván Đấu trên Cánh Phải và Thông số Tổng Hợp Lực Chiến trên Cánh Trái.
- **Kết quả Retest:** PASS. Biên dịch 0 lỗi, 12/12 unit tests đạt, kiểm thử trực quan qua `browser_subagent` ghi nhận hình ảnh `cyber_stadium_3d_arena_view_1792499540135.png` đạt chuẩn thẩm mỹ Cyberpunk Anime AAA -> Đóng ticket `CLOSED_PASS`.

### [TK-008] Nâng Cấp Hệ Thống Hành Vi Gamer-Friendly (Kéo Thả Đổi Chỗ, Phím Tắt, Tooltip & 3D VFX)
- **Thời gian tạo:** 2026-10-20 19:40:00
- **Phân loại tầng:** Game Feel / Client UX / Sound Synthesis & WebGL 3D VFX
- **Mức độ:** Critical
- **Tác tử báo cáo:** User Request ("behavior vẫn chưa thân thiện với game thủ") & `qa-balance-tester`
- **Tác tử chịu trách nhiệm sửa:** `art-designer` & `frontend-engineer`
- **Mô tả:** Trải nghiệm chơi game ban đầu còn cứng nhắc: Không thể kéo thả đổi chỗ quân trực tiếp trên sàn đấu (Board-to-Board Drag/Swap), nhấp vào quân là bị xóa mất, thiếu phím tắt quen thuộc của game thủ, không có tooltip xem nhanh chỉ số khi rê chuột, và trong giao tranh thiếu số sát thương nảy lên đầu mục tiêu.
- **Nhật ký xử lý:**
  1. **Kéo Thả Hoán Đổi & Di Chuyển Quân Trực Tiếp:** Tích hợp `draggable` trên từng ô đã đặt quân, phân biệt nguồn kéo từ hàng chờ hay từ ô trên bàn cờ. Kéo sang ô trống = Di chuyển; Kéo vào ô có quân = Hoán đổi vị trí (Swap) tức thì.
  2. **Chuột Phải Thu Hồi Quân Tức Thì:** Người chơi có thể nhấp chuột phải (`onContextMenu`) vào bất kỳ Valkyrie nào trên sàn đấu để thu hồi nhanh về hàng chờ kèm âm thanh phản hồi xúc giác.
  3. **Thanh Lệnh Nhanh Chiến Thuật (Quick Action Bar):** Đặt ngay phía trên sàn đấu với các nút: `[ ⚡ Tự Xếp [F] ]` (tự động điền 6 quân kích hoạt tối đa Tộc/Hệ), `[ 🗑️ Thu Hồi [R] ]` (dọn sạch bàn cờ về hàng chờ), `[ ⏩ 1x / 2x Tốc Độ ]` (tua nhanh mô phỏng trận chiến).
  4. **Hệ Thống Phím Tắt Chuẩn Esports:** Tích hợp bộ lắng nghe sự kiện phím tắt toàn cục: `Space`/`Enter` = Bắt đầu chiến đấu, `R` = Thu hồi hết, `F` = Tự động xếp, `1`/`2` = Đổi tốc độ 1x/2x, `Esc` = Đóng toàn bộ popup và hủy chọn.
  5. **Tooltip Tình Báo Chiến Thuật Tức Thời (`TacticalUnitTooltip`):** Rê chuột vào bất kỳ Valkyrie nào (trên bàn cờ hoặc hàng chờ) sẽ hiện popup chỉ số chi tiết: Máu, Công, Giáp, Tầm, Vị trí tối ưu và Tuyệt kỹ Climax.
  6. **Chiếu Sáng Liên Kết Tộc/Hệ (Synergy Hover Beacon):** Rê chuột vào Tộc/Hệ bên cánh trái sẽ làm bừng sáng viền hào quang vàng kim trên toàn bộ quân cờ thuộc hệ đó.
  7. **Động Cơ Hiệu Ứng Sát Thương 3D (`CombatVfxEngine`):** Số sát thương (`-340`, `CRIT! -750`) nảy lên đầu mục tiêu theo dạng chiếu tọa độ 3D $\rightarrow$ 2D, tia laser đạn đạo tốc độ cao giữa người bắn và mục tiêu.
  8. **Bộ Âm Thanh Xúc Giác Mới (`sound.ts`):** Bổ sung các hiệu ứng âm thanh tổng hợp thủ tục: Âm thanh đặt quân, đổi chỗ, và thu hồi quân.
- **Kết quả Retest:** PASS. Biên dịch 0 lỗi, 12/12 unit tests đạt, `browser_subagent` tự động kiểm thử toàn bộ các thao tác Tự xếp [F], Thu hồi [R], Tốc độ [1x/2x], giao tranh 20Hz trơn tru -> Đóng ticket `CLOSED_PASS`.

### [TK-009] Tái Cấu Trúc Toàn Diện Mỹ Thuật 3D VALK-01 Freyja Theo Chuẩn Concept Art Gốc
- **Thời gian tạo:** 2026-10-21 10:30:00
- **Phân loại tầng:** 3D Anime Modeling / Shaders & Texture
- **Mức độ:** Critical
- **Tác tử báo cáo:** User Request ("model chưa được đẹp") & `art-designer`
- **Tác tử chịu trách nhiệm sửa:** `model-3d-designer` & `art-designer`
- **Mô tả:** Mô hình 3D trước đó bị thô sơ so với Concept Art gốc (`public/avatars/VALK-01.jpg`): Mắt tròn xoe búp bê, tóc mái 9 múi tam giác phẳng như răng lược cắm xuống trán, thanh vương miện vàng cắt ngang trán thô cứng, đuôi tóc giấu sau lưng, giáp ngực dạng 2 nửa cầu kim loại tách rời, và thanh đại kiếm dạng hộp hồng phẳng.
- **Nhật ký xử lý:**
  1. **Tái Vẽ Texture Khuôn Mặt Anime Sắc Sảo (`freyja-face-texture.ts`):** Tạo hình đôi mắt mèo hổ phách quyến rũ (*Winged Cat-Eyes*), viền mắt đen dày sắc sảo, nếp mí đôi sâu, chân mày nữ chiến thần kiên định, bờ môi son anh đào căng mọng, và giữ nguyên kính ngắm Scouter HUD Neon Cyan trên mắt trái.
  2. **Tái Thiết Kế Hình Học Tóc Mái & Tóc Lửa (`freyja-geometry.ts`):** Loại bỏ hoàn toàn thanh vương miện ngang trán, thay bằng bộ đàm tai nghe Cyberpunk viễn tưởng ôm sát mang tai (`buildCyberEarComms`). Thiết kế tóc mái rẽ ngôi bất đối xứng (*Side-Swept Bangs*) mềm mại và chùm tóc lửa bồng bềnh cuộn sóng tung bay ra hai bờ vai (*Billowing Fiery Mane*) với ngọn tóc cam rực lửa (`#ff7a18`).
  3. **Lưới Sợi Tóc Mượt Hữu Cơ (`organic-anime-mesh-builder.ts`):** Nâng cấp hàm `buildStylizedAnimeHairLockGeometry` từ thiết diện tam giác sắc nhọn sang thiết diện vòm cong 6 đỉnh mượt mà, triệt tiêu gờ cạnh thô ráp.
  4. **Yếm Cổ Cyber & Giáp Ngực Titan (`buildCuirass`):** Bổ sung yếm cổ giáp bảo vệ (*Cyber Gorget*) nẹp sát cổ họng với dải LED Cyan viền trên; cúp ngực giáp Titan chải xước với rãnh năng lượng Neon Cyan ôm sát vòm ngực giọt nước Cúp G.
  5. **Đại Kiếm Plasma Buster Cybernetic (`buildGreatsword`):** Tích hợp vòng phản ứng năng lượng tròn xoay phát sáng Cyan trên chuôi kiếm và rãnh năng lượng Laser chạy dọc chính giữa thân kiếm Titan.
- **Kết quả Retest:** PASS. Biên dịch 0 lỗi TypeScript, Vite build thành công, kiểm thử trực quan qua `browser_subagent` ghi nhận toàn bộ 5 góc máy soi và 3 cấp độ Cloth Damage hiển thị mượt mà 60 FPS -> Đóng ticket `CLOSED_PASS`.



