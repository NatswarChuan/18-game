---
name: waterfall-phase-runner
description: "Kỹ năng điều phối quy trình Waterfall 7 giai đoạn khép kín từ con số 0: Architecture -> UI/UX 18+ (27 Valkyries) -> Buff Systems (243 Buffs & 12D Vector DB) -> Backend -> Frontend -> QA Balance -> Production Deploy."
---

# QUY TRÌNH ĐIỀU PHỐI WATERFALL (/waterfall-phase-runner)

Khi kích hoạt kỹ năng này, Master Orchestrator sẽ điều phối 7 subagents độc lập tuần tự theo 7 giai đoạn nghiêm ngặt:

## Giai Đoạn 1: Architecture & Monorepo Setup (`system-architect`)
1. Khởi tạo khung thư mục Monorepo: `apps/server`, `apps/client`, `packages/shared-domain`.
2. Ban hành bộ đặc tả kiến trúc tại [deliverables/phase-1-architecture/README.md](../../../deliverables/phase-1-architecture/README.md) (WebSocket Contract, NoSQL Schema, State Machines).
3. Kiểm tra Gate 1: Xác nhận không rò rỉ dependencies và client/server phân tách hoàn toàn.

## Giai Đoạn 2: Visual UI/UX & 18+ Art Design (`art-designer`)
1. Ban hành bộ thiết kế đồ họa tại [deliverables/phase-2-art-design/README.md](../../../deliverables/phase-2-art-design/README.md) (Design Tokens, 27 Valkyries, 3 Cloth Damage Tiers, Wireframes 3x3 với cơ cấu 3-3-3, VFX Storyboard, Audio Spec).
2. Tạo mẫu assets bằng `generate_image` lưu vào `deliverables/phase-2-art-design/assets/`.
3. Kiểm tra Gate 2: Xác nhận điểm thẩm mỹ Waifu 18+ đạt $\ge 8.5/10$ và giao diện 3x3 công thái học.

## Giai Đoạn 3: Hệ Thống Buff Chiến Thuật & Vector DB (`buff-systems-designer`)
1. Ban hành bộ đặc tả hệ thống Buff tại [deliverables/phase-3-buff-system/README.md](../../../deliverables/phase-3-buff-system/README.md).
2. Thiết kế ma trận $\ge 243$ Buffs phân tầng 5 cấp độ sâu tiến hóa (Depth 1 đến Depth 5).
3. Xây dựng mô hình toán học không gian Vector 12D và thuật toán kNN sinh 9 Buffs cá nhân hóa theo cơ cấu 3-3-3 History Allocation.
4. Điều biến hệ số khẩn cấp $\mathcal{U}$ cho cả hai thể thức BO3 & BO5 và cơ chế Cross-Depth Resurfacing.
5. Kiểm tra Gate 3: Cân bằng toán học $\epsilon \le 0.05$, phân bổ 3-3-3 khả thi, độ trễ kNN $< 1\text{ms}$.

## Giai Đoạn 4: Backend Server & Combat Core (`backend-engineer`)
1. Đọc và kế thừa đặc tả từ `deliverables/phase-1-architecture/` và `deliverables/phase-3-buff-system/`.
2. Viết mã nguồn `packages/shared-domain` (hằng số, stats 27 Valkyries, và toán học 12D).
3. Lập trình Game Engine thời gian thực 20 ticks/s và InMemoryVectorDatabaseService 12D Vector 3-3-3.
4. Thiết lập WebSocket Server với đầy đủ các gói tin BO3/BO5 và cơ chế Fog of Placement.
5. Kiểm tra Gate 4: Unit test $\ge 90\%$, 0 lỗi SonarQube/Coverity.

## Giai Đoạn 5: Frontend Client & Graphics (`frontend-engineer`)
1. Đọc và kế thừa thiết kế từ `deliverables/phase-2-art-design/` và logic từ Pha 3 & Pha 4.
2. Xây dựng ứng dụng Client Web/Mobile 60 FPS bằng Expo SDK 52+.
3. Lập trình cơ chế kéo thả 3x3 với phản hồi xúc giác tức thời (< 16ms) và màn hình 9 Buffs 3-3-3.
4. Tích hợp chuyển đổi trạng thái rách giáp 18+ và hoạt cảnh Climax Ultimate cut-in.
5. Kiểm tra Gate 5: Đảm bảo 60 FPS ổn định, 0 lỗi console, không rò rỉ bộ nhớ GPU/RAM.

## Giai Đoạn 6: QA, Balance & Browser Playtest (`qa-balance-tester`)
1. Mở Web-App bằng `browser_subagent` tự động chơi thử 1 ván đấu trọn vẹn.
2. Chạy giả lập 1,000,000 trận đấu kiểm tra tỷ lệ thắng giữa các Buff:
   ```bash
   python3 .agents/skills/game-balance-verifier/scripts/verify_12d_equilibrium.py
   ```
3. Xuất bảng điểm vào [PLAYTEST_SCORECARD.md](../../memory/PLAYTEST_SCORECARD.md).
4. **Vòng lặp Bug Ticketing & Retest ([TICKETS.md](../../memory/TICKETS.md)):**
   - Mọi bug phát hiện trong quá trình playtest đều được log vào `TICKETS.md`.
   - `backend-engineer` và `frontend-engineer` cùng nhau fix theo đúng tiêu chuẩn Explicit Types, 100% NPE guard, và TSDoc song ngữ Anh/Việt.
   - `qa-balance-tester` retest lại cho đến khi tính năng đạt chuẩn và chuyển trạng thái sang `CLOSED_PASS`.
5. Kiểm tra Gate 6: 100% tickets trong `TICKETS.md` là `CLOSED_PASS`, Điểm Game Feel $\ge 8.5/10$, Thẩm mỹ $\ge 8.5/10$, 0 lỗi Blocker.

## Giai Đoạn 7: Production Deployment (`system-architect` + All Agents)
1. Đóng gói Docker Compose: Nginx Gateway (SSL), Client Web, Server Node.js, Redis.
2. Kiểm tra tài liệu triển khai [DEPLOYMENT_GUIDE.md](../../../DEPLOYMENT_GUIDE.md).
3. Kiểm tra Gate 7: Khởi chạy thành công chỉ với `docker compose up -d --build`.
