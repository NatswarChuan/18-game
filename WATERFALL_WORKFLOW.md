## 📌 1. NGUYÊN TẮC VẬN HÀNH THÁC NƯỚC (WATERFALL GOVERNANCE)

Quy trình phát triển dự án tuân thủ kỷ luật **Strict Sequential Waterfall**:
1. **Một Chiều & Tuần Tự (Strict Downward Flow):** Các giai đoạn chỉ được thực hiện tuần tự. Không được nhảy cóc (ví dụ: cấm FE nhảy vào code khi Designer chưa hoàn thành tài liệu UI/UX, cấm BE triển khai khi Architecture Spec chưa được phê duyệt).
2. **Tác Tử Review Độc Lập & Vòng Lặp Fix/Review Bắt Buộc Tại Mọi Phase:**
   - Mỗi giai đoạn **bắt buộc phải có 1 Tác tử Chủ Trì (Lead / Author) và ít nhất 1 Tác tử Thẩm Định (Designated Reviewer)**.
   - Không tác tử nào được phép tự ký duyệt sản phẩm của chính mình.
   - Reviewer có quyền từ chối nghiệm thu (`REVISION_REQUIRED`) và yêu cầu sửa đổi. Vòng lặp **Fix $\leftrightarrow$ Review** bắt buộc tiếp diễn cho đến khi Reviewer ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
3. **Cơ Chế Phản Biện & Lưu Vết Dài Hạn (Inter-Agent Debates & Memory Tracking):**
   - Các tác tử được khuyến khích chất vấn, tranh luận gay gắt để đạt phương án tối ưu.
   - Toàn bộ quá trình tranh luận, giải trình và thỏa hiệp phải được lưu vết minh bạch tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
   - Mọi bài học kinh nghiệm và quy tắc chống tái phạm lỗi được cập nhật vĩnh viễn vào [`.agents/memory/MEMORY.md`](.agents/memory/MEMORY.md).
4. **Cấu Trúc Monorepo Chuẩn Xác Tại Gốc Dự Án:**
   - Toàn bộ Monorepo (`apps/client`, `apps/server`, `packages/shared-domain`), `deliverables/`, và `.agents/` đều **nằm chuẩn xác tại thư mục gốc của dự án (`./`)**.
5. **Tiêu Chuẩn Đôi (Dual-Excellence Standards):**
   - **Về Kỹ thuật & Game Feel:** Đạt chuẩn game thủ khó tính bậc nhất (độ cân bằng toán học, 60 FPS, netcode không giật lag, 0 bug blocker).
   - **Về Nghệ thuật & Cảm xúc:** Đạt đỉnh cao thẩm mỹ Anime 18+ (gợi cảm, 3 cấp độ rách giáp, Climax cut-in, âm thanh mê đắm).

---

## 🗺️ 2. MA TRẬN 7 GIAI ĐOẠN WATERFALL & REVIEWER (PHASE & REVIEWER MATRIX)

| Giai Đoạn | Tác Tử Chủ Trì (Lead) | Tác Tử Review & Phản Biện (Reviewer) | Sản Phẩm Bàn Giao (Deliverables) | Tiêu Chí Mở Cổng (Gate Criteria) |
| :--- | :--- | :--- | :--- | :--- |
| **Pha 1: Kiến Trúc & Đặc Tả Hệ Thống** | `system-architect` | `backend-engineer`, `qa-balance-tester` | `deliverables/phase-1-architecture/` (Monorepo, WebSocket Contract, NoSQL Schema, State Machines) | **Gate 1:** Reviewer ký `STAGE_GATE_PASS`; 0 rò rỉ dependency; NoSQL & WS contract hoàn tất. |
| **Pha 2: Thiết Kế UI/UX & Nghệ Thuật 18+** | `art-designer` | `frontend-engineer`, `qa-balance-tester` | `deliverables/phase-2-art-design/` (Tokens, 27 Valkyries, 3 Cloth Damage Tiers, Wireframes 3x3, Cut-in Storyboard, Audio) | **Gate 2:** Reviewer ký `STAGE_GATE_PASS`; Điểm thẩm mỹ 18+ $\ge 8.5/10$; Bố cục 3x3 công thái học. |
| **Pha 3: Thiết Kế Hệ Thống Buff & Cân Bằng Động** | `buff-systems-designer` | `qa-balance-tester`, `backend-engineer` | `deliverables/phase-3-buff-system/` (Tối thiểu 243 Buffs, Vector DB Spec, BO3/BO5 Dynamic Warping, History-Driven Engine) | **Gate 3:** Reviewer ký `STAGE_GATE_PASS`; Thuật toán Vector kNN sinh 9 Buffs phụ thuộc 100% lịch sử; không chia theo round; 0 dominant buff ($<53\%$ winrate). |
| **Pha 4: Phát Triển Backend & Combat Core** | `backend-engineer` | `system-architect`, `qa-balance-tester` | `packages/shared-domain`, `apps/server`, Engine 20 ticks/s, Vector DB Buff Service (In-Memory/Qdrant), NoSQL & Fallback | **Gate 4:** Reviewer ký `STAGE_GATE_PASS`; Deterministic 100%; unit test $\ge 90\%$; 0 NPE, 0 `any`. |
| **Pha 5: Phát Triển Frontend & Đồ Họa Client** | `frontend-engineer` | `art-designer`, `system-architect` | `apps/client` (Expo Universal 60fps), Skia Cloth Damage, Kéo thả 3x3 <16ms, Draft 9 Buffs UI | **Gate 5:** Reviewer ký `STAGE_GATE_PASS`; Duy trì 60 FPS ổn định; Dumb Terminal; 0 NPE; 0 memory leak. |
| **Pha 6: Kiểm Thử, Cân Bằng & Playtest Tự Động** | `qa-balance-tester` | `system-architect` | Playtest Scorecard, 1M Sim Balance Report (BO3 & BO5), Video Playtest WebP, `TICKETS.md` | **Gate 6:** Reviewer ký `STAGE_GATE_PASS`; Game feel & Art $\ge 8.5/10$; **100% Tickets `CLOSED_PASS`**. |
| **Pha 7: Đóng Gói Triển Khai & Bàn Giao Vận Hành** | `system-architect` | `backend-engineer`, `qa-balance-tester` | Docker Compose, Nginx Reverse Proxy SSL/WS, `DEPLOYMENT_GUIDE.md` | **Gate 7:** Reviewer ký `STAGE_GATE_PASS`; `docker compose up` 1 lệnh; Healthcheck 200 OK (<10ms). |

---

## 🔍 3. CHI TIẾT TỪNG GIAI ĐOẠN, VÒNG LẶP REVIEW & THỦ TỤC NGHIỆM THU

### 📐 Pha 1: Kiến Trúc Hệ Thống & Thiết Lập Monorepo (Architecture & Monorepo Setup)
- **Tác tử chủ trì:** `system-architect`
- **Tác tử thẩm định & phản biện (Reviewer):** `backend-engineer` & `qa-balance-tester`
- **Mục tiêu:** Xây dựng khung móng vững chắc cho toàn bộ dự án tại thư mục gốc Monorepo, phân định ranh giới rạch ròi Client / Server, ban hành hợp đồng WebSocket và thiết kế cấu trúc NoSQL.
- **Thư mục lưu trữ kết quả bàn giao (Deliverables Storage):** [`deliverables/phase-1-architecture/`](deliverables/phase-1-architecture/README.md)
  1. [`system-architecture-spec.md`](deliverables/phase-1-architecture/system-architecture-spec.md) — Kiến trúc Monorepo và phân tầng Clean Hexagonal.
  2. [`websocket-protocol-contract.md`](deliverables/phase-1-architecture/websocket-protocol-contract.md) — Hợp đồng giao thức WebSocket Client-Server.
  3. [`database-schema-spec.md`](deliverables/phase-1-architecture/database-schema-spec.md) — Thiết kế NoSQL (MongoDB, Redis Cache, Vector DB) & In-Memory Store.
  4. [`state-machines.md`](deliverables/phase-1-architecture/state-machines.md) — State Machine phòng đấu và vòng lặp Combat 20Hz.
- **Vòng lặp Review $\leftrightarrow$ Fix (Review-Fix Loop):**
  1. `system-architect` hoàn thiện tài liệu và nộp vào `deliverables/phase-1-architecture/`.
  2. `backend-engineer` và `qa-balance-tester` kiểm tra tính khả thi, nếu phát hiện thiếu sót $\rightarrow$ ghi nhận phản biện vào [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  3. `system-architect` tiếp thu, sửa đổi cho đến khi Reviewer ký duyệt `STAGE_GATE_PASS`.
- **Thủ tục nghiệm thu Cổng 1 (Gate 1 Sign-Off Checklist):**
  - [ ] Biên bản nghiệm thu và phản biện được ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  - [ ] Bộ tài liệu tại [`deliverables/phase-1-architecture/`](deliverables/phase-1-architecture/README.md) hoàn thiện 100%.
  - [ ] Toàn bộ cấu trúc thư mục định nghĩa nằm chuẩn xác tại Monorepo Root (`apps/client`, `apps/server`, `packages/shared-domain`).
  - [ ] `packages/shared-domain` độc lập hoàn toàn với framework bên ngoài.
  - [ ] Client tuyệt đối là "Dumb Terminal", không chứa logic tính toán sát thương.

---

### 🎨 Pha 2: Thiết Kế UI/UX & Nghệ Thuật 18+ (Visual UI/UX & Sensual Art Specification)
- **Tác tử chủ trì:** `art-designer`
- **Tác tử thẩm định & phản biện (Reviewer):** `frontend-engineer` & `qa-balance-tester`
- **Mục tiêu:** Định hình phong cách thị giác Cyberpunk quyến rũ, tạo hình dàn 27 Valkyrie 18+ và xây dựng trải nghiệm người dùng không một vết gợn.
- **Thư mục lưu trữ kết quả bàn giao (Deliverables Storage):** [`deliverables/phase-2-art-design/`](deliverables/phase-2-art-design/README.md)
  1. [`design-system-tokens.md`](deliverables/phase-2-art-design/design-system-tokens.md) — Bảng mã màu Dark Cyberpunk Neon, Glassmorphism, khoảng cách chạm.
  2. [`character-roster-18plus.md`](deliverables/phase-2-art-design/character-roster-18plus.md) — Dàn 27 Valkyrie, Lore và đặc tả 3 cấp độ Cloth Damage.
  3. [`ui-wireframes-3x3.md`](deliverables/phase-2-art-design/ui-wireframes-3x3.md) — Wireframes 3 màn hình cốt lõi (Draft 9 Buff, Xếp cờ 3x3, Combat HUD).
  4. [`vfx-climax-storyboard.md`](deliverables/phase-2-art-design/vfx-climax-storyboard.md) — Kịch bản phân cảnh Ultimate Cut-In, VFX Skia 60 FPS.
  5. [`audio-voice-spec.md`](deliverables/phase-2-art-design/audio-voice-spec.md) — Đặc tả âm thanh SFX, BGM và voice-lines tiếng Nhật gợi cảm.
  6. [`assets/`](deliverables/phase-2-art-design/assets/README.md) — Thư mục lưu trữ hình ảnh concept art sinh từ `generate_image`.
- **Vòng lặp Review $\leftrightarrow$ Fix (Review-Fix Loop):**
  1. `art-designer` xuất bản deliverables.
  2. `frontend-engineer` kiểm toán tính khả thi diễn hoạt Skia 60fps và vùng chạm; `qa-balance-tester` kiểm toán tính gợi cảm Waifu 18+ $\ge 8.5/10$.
  3. Bất đồng được ghi nhận và giải quyết tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md). Lặp lại đến khi Reviewer ký `STAGE_GATE_PASS`.
- **Thủ tục nghiệm thu Cổng 2 (Gate 2 Sign-Off Checklist):**
  - [ ] Biên bản nghiệm thu được ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  - [ ] Toàn bộ deliverables tại [`deliverables/phase-2-art-design/`](deliverables/phase-2-art-design/README.md) hoàn thiện 100%.
  - [ ] Các Valkyrie sở hữu nét đẹp 18+ quyến rũ, tỉ lệ cơ thể chuẩn mực, thần thái hút mắt.
  - [ ] Lưới 3x3 rõ ràng, phân biệt rành mạch Hàng 1 (Frontline), Hàng 2 (Midline), Hàng 3 (Backline).

---

### 🎲 Pha 3: Thiết Kế Hệ Thống Buff & Cân Bằng Động (Buff & Strategic Dynamics Design)
- **Tác tử chủ trì:** `buff-systems-designer`
- **Tác tử thẩm định & phản biện (Reviewer):** `qa-balance-tester` & `backend-engineer`
- **Mục tiêu:** Cực đại hóa đa dạng chiến thuật với **tối thiểu 243 Buffs ($N \ge 243$)**, xây dựng động cơ Vector DB tuyển chọn 9 Buffs phụ thuộc 100% vào chuỗi buff đã chọn trước đó (không phân chia theo round), điều biến tối ưu cho cả 2 thể thức BO3 và BO5.
- **Thư mục lưu trữ kết quả bàn giao (Deliverables Storage):** [`deliverables/phase-3-buff-system/`](deliverables/phase-3-buff-system/README.md)
  1. [`dynamic-buff-matrix-spec.md`](deliverables/phase-3-buff-system/dynamic-buff-matrix-spec.md) — Kho tối thiểu 243 Buffs phân theo 5 Cấp Độ Sâu Tiến Hóa ($\mathcal{D}_1 \to \mathcal{D}_5$) & Hiệu ứng Khiêu Gợi 18+.
  2. [`history-dependent-algorithm.md`](deliverables/phase-3-buff-system/history-dependent-algorithm.md) — Giải thuật sinh 9 Buffs kế thừa 100% từ lịch sử lựa chọn, loại bỏ hoàn toàn biến round.
  3. [`vector-db-buff-selection-spec.md`](deliverables/phase-3-buff-system/vector-db-buff-selection-spec.md) — Kiến trúc Vector DB (12D Embeddings, Dual-Driver In-Memory/Qdrant) & Giải thuật điều biến khẩn cấp BO3/BO5.
- **Vòng lặp Review $\leftrightarrow$ Fix (Review-Fix Loop):**
  1. `buff-systems-designer` xuất bản deliverables hệ thống Buff.
  2. `qa-balance-tester` kiểm tra tính cân bằng lý thuyết (không có chiến thuật thống trị trên cả BO3/BO5); `backend-engineer` kiểm tra tính khả thi và độ phức tạp kNN $< 1\text{ms}$.
  3. Lặp lại việc tinh chỉnh chỉ số đến khi Reviewer ký duyệt `STAGE_GATE_PASS`.
- **Thủ tục nghiệm thu Cổng 3 (Gate 3 Sign-Off Checklist):**
  - [ ] Biên bản nghiệm thu được ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  - [ ] Bộ tài liệu tại [`deliverables/phase-3-buff-system/`](deliverables/phase-3-buff-system/README.md) hoàn thiện 100% (gồm 3 tài liệu cốt lõi).
  - [ ] Thuật toán sinh Buff chứng minh được tính phụ thuộc 100% lịch sử và hoạt động tối ưu trên cả thể thức BO3 và BO5.
  - [ ] Không có Buff đơn lẻ nào tạo tỷ lệ thắng áp đảo $> 53\%$.

---

### ⚙️ Pha 4: Triển Khai Backend & Game Engine Thời Gian Thực (Backend Implementation)
- **Tác tử chủ trì:** `backend-engineer`
- **Tác tử thẩm định & phản biện (Reviewer):** `system-architect` & `qa-balance-tester`
- **Mục tiêu:** Lập trình Server-Authoritative hoàn chỉnh bên trong `apps/server` và `packages/shared-domain`, chạy Deterministic Combat Loop 20 ticks/s, module `VectorBuffSelectionService` hỗ trợ thể thức BO3/BO5, và NoSQL database với in-memory fallback.
- **Quy trình thực thi & Kế thừa:**
  1. Kế thừa hợp đồng từ Pha 1, dàn 27 Valkyrie từ Pha 2, và kho 243 Buffs + Vector DB từ [`deliverables/phase-3-buff-system/`](deliverables/phase-3-buff-system/README.md).
  2. Xây dựng `packages/shared-domain`: Chứa hằng số cơ bản, mô hình toán học Vector 12D, công thức tính Giáp/Mana.
  3. Xây dựng Server Application (`apps/server`): NestJS Framework + `@WebSocketGateway()` + Mongoose MongoDB & Redis Cache, module `VectorBuffSelectionService` với `USE_IN_MEMORY_VECTOR_DB=true`.
  4. Lập trình Game Loop (20 Ticks/giây - 50ms/tick) độc lập với FPS client.
  5. Viết bộ Unit Test & Simulation Test đạt độ phủ $\ge 90\%$.
- **Vòng lặp Review $\leftrightarrow$ Fix (Review-Fix Loop):**
  1. `backend-engineer` submit PR/Code.
  2. `system-architect` kiểm toán phân tầng, 0 `any`, 0 NPE, TSDoc song ngữ; `qa-balance-tester` chạy mô phỏng cân bằng 1,000,000 trận.
  3. Nếu phát hiện vi phạm, mở yêu cầu sửa đổi tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md). `backend-engineer` refactor và nộp lại cho đến khi pass.
- **Thủ tục nghiệm thu Cổng 4 (Gate 4 Sign-Off Checklist):**
  - [ ] Biên bản nghiệm thu được ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  - [ ] Chạy `npm test` hoặc `pnpm test` đạt độ bao phủ code $\ge 90\%$.
  - [ ] 100% code TypeScript có kiểu tường minh (0 `any`, 0 `object`), 0 vi phạm NPE (`noUncheckedIndexedAccess: true`), TSDoc song ngữ Anh/Việt.
  - [ ] Khởi chạy local thành công với In-Memory mode trên cổng 4000.
  - [ ] Không có hiện tượng rò rỉ bộ nhớ khi tạo và hủy liên tục 1,000 phòng đấu.

---

### 💻 Pha 5: Triển Khai Frontend & Đồ Họa 60 FPS (Frontend Client Implementation)
- **Tác tử chủ trì:** `frontend-engineer`
- **Tác tử thẩm định & phản biện (Reviewer):** `art-designer` & `system-architect`
- **Mục tiêu:** Xây dựng Client Universal (Web & Mobile) sống động bên trong `apps/client` bằng Expo SDK 52+, tái hiện trung thực bản thiết kế của `art-designer`, giao diện Draft 9 Buffs của Pha 3, kết nối mượt mà với Server qua WebSocket.
- **Quy trình thực thi & Kế thừa:**
  1. Kế thừa Design Tokens, Wireframes, và Assets từ [`deliverables/phase-2-art-design/`](deliverables/phase-2-art-design/README.md), cây Buff từ Pha 3 và hợp đồng WebSocket từ Phase 1.
  2. Dựng khung ứng dụng (`apps/client`) bằng Expo SDK 52+ Universal.
  3. Triển khai bảng cờ 3x3 kéo thả Magnetic Snap (< 16ms) và màn hình chọn 9 Buffs thích ứng.
  4. Xây dựng Skia Renderer hiển thị chuyển động Valkyrie, biến đổi 3 cấp độ rách giáp 18+, và Climax Ultimate Cut-In 60 FPS.
  5. Đồng bộ trạng thái WebSocket nội suy mượt mà; tích hợp SFX và voice-lines tiếng Nhật.
- **Vòng lặp Review $\leftrightarrow$ Fix (Review-Fix Loop):**
  1. `frontend-engineer` submit bản dựng Client.
  2. `art-designer` kiểm tra độ trung thực visual 18+ và animation; `system-architect` kiểm tra nguyên tắc Dumb Terminal và vệ sinh RAM/GPU.
  3. Sửa chữa các điểm chưa đạt và cập nhật tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md). Lặp lại đến khi Reviewer ký `STAGE_GATE_PASS`.
- **Thủ tục nghiệm thu Cổng 5 (Gate 5 Sign-Off Checklist):**
  - [ ] Biên bản nghiệm thu được ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  - [ ] Tốc độ khung hình duy trì ổn định $\ge 60\text{ FPS}$.
  - [ ] Trải nghiệm kéo thả quân cờ vào 9 ô đạt độ trễ $< 16\text{ms}$.
  - [ ] Client kết nối thành công với Local Server (`ws://localhost:4000/ws`).
  - [ ] 100% code TypeScript có kiểu tường minh, 0 NPE, 0 floating promises.

---

### 🧪 Pha 5: Kiểm Thử, Cân Bằng & Chơi Thử Độc Lập (QA, Balance & Automated Playtest)
- **Tác tử chủ trì:** `qa-balance-tester`
- **Tác tử thẩm định & phản biện (Reviewer):** `system-architect` (Trọng tài tối cao nghiệm thu Scorecard & Đóng Cổng)
- **Mục tiêu:** Thẩm định chất lượng toàn diện với tư duy của một game thủ khó tính bậc nhất, săn lùng bug, kiểm toán cân bằng game, thiết lập vòng lặp xử lý ticket sự cố và chạy playtest tự động trên máy Local.
- **Quy trình thực thi:**
  1. Tự động kiểm tra xem Server (`http://localhost:4000/api/health`) và Client (`http://localhost:5173` hoặc `http://localhost:8081`) đã chạy chưa; nếu chưa, tự động dùng `run_command` khởi động ngay.
  2. Kích hoạt `browser_subagent` tự động mở trình duyệt vào Web-App thực tế trên máy local.
  3. Tự tay chơi qua các giai đoạn: Chọn Buff $\rightarrow$ Sắp xếp 6 quân cờ $\rightarrow$ Bấm Khóa $\rightarrow$ Quan sát giao tranh $\rightarrow$ Kiểm tra rách giáp $\rightarrow$ Thắng/Thua.
  4. Ghi hình video WebP và chụp ảnh màn hình lưu vào Artifacts.
  5. Chạy script mô phỏng 1,000,000 trận đấu ngẫu nhiên để vẽ biểu đồ phân phối tỷ lệ thắng giữa các tổ hợp Buff (đảm bảo không tổ hợp nào vượt ngưỡng $53\%$ Winrate).
  6. **Quy Trình Quản Trị Ticket & Vòng Lặp Sửa Lỗi Tương Tác (QA Ticketing & Retest Loop):**
     - Khi `qa-balance-tester` phát hiện bất kỳ lỗi nào (Logic, Desync, Khựng khung hình, Rách giáp lệch layer, Lỗi mạng, Vi phạm NPE, hoặc Thiếu TSDoc song ngữ), lập tức ghi ticket vào [`.agents/memory/TICKETS.md`](.agents/memory/TICKETS.md) theo mẫu `[TK-XXX]`.
     - Phân định rõ tầng lỗi (`Shared Domain`, `Backend NestJS`, `Frontend Expo`, `Network WebSocket`, `Database NoSQL`) và chỉ định Agent xử lý (`backend-engineer`, `frontend-engineer`, hoặc cả hai).
     - `backend-engineer` và `frontend-engineer` phối hợp sửa lỗi: Tuân thủ 100% kiểu dữ liệu tường minh (không `any`/`object`), cover 100% NPE guard (`?.`, `??`, type guard, cấm `!`), bảo toàn phân tầng và cập nhật comment TSDoc song ngữ Anh/Việt. Cập nhật Fix Log và đổi trạng thái sang `RESOLVED`.
     - `qa-balance-tester` **bắt buộc chạy lại bài kiểm thử / `browser_subagent`** để xác thực tính năng đó:
       - Nếu pass $\rightarrow$ Đổi trạng thái sang `CLOSED_PASS`.
       - Nếu fail $\rightarrow$ Đổi trạng thái sang `REOPENED_FAIL` và yêu cầu BE/FE sửa tiếp.
       - Vòng lặp chỉ dừng lại khi tính năng được kiểm tra thực tế pass 100%.
  7. Chấm điểm chi tiết và lập biên bản kiểm toán Playtest trong [`.agents/memory/PLAYTEST_SCORECARD.md`](.agents/memory/PLAYTEST_SCORECARD.md).
- **Vòng lặp Review $\leftrightarrow$ Fix (Review-Fix Loop):**
  1. `qa-balance-tester` nộp Playtest Scorecard và danh sách Tickets.
  2. `system-architect` review lại toàn bộ: Kiểm tra 100% tickets đã `CLOSED_PASS` chưa, điểm số có trung thực $\ge 8.5/10$ không.
  3. Nếu còn nghi vấn hoặc bất đồng, ghi nhận tranh luận tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md). Chỉ ký duyệt `STAGE_GATE_PASS` khi 0 ticket tồn đọng.
- **Thủ tục nghiệm thu Cổng 5 (Gate 5 Sign-Off Checklist):**
  - [ ] Biên bản nghiệm thu được ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  - [ ] **100% Tickets trong [`.agents/memory/TICKETS.md`](.agents/memory/TICKETS.md) đạt trạng thái `CLOSED_PASS`** (Số ticket tồn đọng `OPEN` / `IN_PROGRESS` / `REOPENED_FAIL` = 0).
  - [ ] Điểm **Game Feel & Đòn Đánh**: $\ge 8.5 / 10$.
  - [ ] Điểm **Thẩm Mỹ 18+ & Đồ Họa Waifu**: $\ge 8.5 / 10$.
  - [ ] Điểm **Độ Mượt UI/UX & Phản Hồi**: $\ge 8.5 / 10$.
  - [ ] Toàn bộ chu trình chơi thử hoàn thành trơn tru trên môi trường Local (không cần deploy).
  - [ ] Số lượng lỗi Blocker / Critical / High: **Chính xác bằng 0**.
  - [ ] Sai số bất đối xứng của thuật toán Vector 8D $\epsilon \le 0.05$.

---

### 🚀 Pha 6: Đóng Gói Triển Khai & Vận Hành (DevOps & Production Deployment)
- **Tác tử chủ trì:** `system-architect` (Phối hợp cùng toàn bộ team)
- **Tác tử thẩm định & phản biện (Reviewer):** `backend-engineer` & `qa-balance-tester`
- **Mục tiêu:** Đóng gói toàn bộ hệ thống vào Docker Containers, thiết lập mạng nội bộ, máy chủ đảo chiều Nginx có SSL, và hoàn thiện bộ tài liệu hướng dẫn triển khai từ A đến Z.
- **Quy trình thực thi:**
  1. Viết `Dockerfile.server` tối ưu hóa đa tầng (Multi-stage build, kích thước < 150MB, Alpine Node).
  2. Viết `Dockerfile.client` biên dịch tĩnh và phục vụ qua Nginx siêu nhẹ.
  3. Thiết lập file `docker-compose.yml` điều phối cụm: Client, Server, Redis (Session/Room State), Nginx Reverse Proxy.
  4. Cấu hình Nginx chuyển tiếp WebSocket (`proxy_set_header Upgrade`), nén Gzip/Brotli, và bảo vệ Rate Limit.
  5. Viết tài liệu triển khai chi tiết từng lệnh tại [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md).
- **Vòng lặp Review $\leftrightarrow$ Fix (Review-Fix Loop):**
  1. `system-architect` hoàn thiện script deploy và docker-compose.
  2. `backend-engineer` kiểm tra network/volume mounting; `qa-balance-tester` chạy thử nghiệm `docker compose up` trên máy local kiểm tra thời gian đáp ứng `/health`.
  3. Tranh luận/sửa đổi nếu có issue tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md). Chỉ ký `STAGE_GATE_PASS` khi 1 lệnh khởi chạy thành công.
- **Thủ tục nghiệm thu Cổng 6 (Gate 6 Sign-Off Checklist):**
  - [ ] Biên bản nghiệm thu được ký duyệt `STAGE_GATE_PASS` tại [`.agents/memory/DEBATES_AND_REVIEWS.md`](.agents/memory/DEBATES_AND_REVIEWS.md).
  - [ ] Chạy thử nghiệm thành công toàn bộ hệ thống bằng đúng 1 câu lệnh duy nhất: `docker compose up -d --build`.
  - [ ] Endpoint `/health` trả về mã trạng thái HTTP 200 kèm theo thời gian đáp ứng (Latency) < 10ms.
  - [ ] Thử nghiệm ngắt kết nối và tái khởi động container: Dữ liệu cấu hình và trạng thái trận đấu không bị lỗi.
  - [ ] Toàn bộ tài liệu triển khai được rà soát kỹ lưỡng, người mới có thể đọc và deploy được ngay.

---

## 📝 4. MẪU BIÊN BẢN NGHIỆM THU CỔNG (GATE SIGN-OFF TEMPLATE)
Mỗi khi vượt qua một Cổng, `system-architect` ghi nhận vào [`.agents/memory/WATERFALL_STATUS.md`](.agents/memory/WATERFALL_STATUS.md) theo mẫu chuẩn:

```markdown
### 📋 GATE [X] SIGN-OFF REPORT: [TÊN GIAI ĐOẠN]
- **Thời gian nghiệm thu:** [YYYY-MM-DD HH:MM:SS]
- **Tác tử chủ trì:** [Tên Agent]
- **Danh sách sản phẩm bàn giao (Deliverables):**
  - [File 1](deliverables/phase-x/file1.md)
  - [File 2](deliverables/phase-x/file2.md)
- **Kết quả kiểm toán tiêu chí (Checklist Results):** [PASS 100% / Tồn đọng]
- **Đánh giá của Hội đồng Khó tính:**
  - *Hardcore Gamer Review:* [Nhận xét về gameplay, cân bằng, cảm giác chơi]
  - *18+ Anime Art Review:* [Nhận xét về độ gợi cảm, tạo hình waifu, hiệu ứng thị giác]
  - *Engineering Lead Review:* [Nhận xét về clean code, kiến trúc, hiệu năng]
- **Quyết định chuyển giai đoạn:** [APPROVED - CHUYỂN SANG PHA TIẾP THEO]
```
