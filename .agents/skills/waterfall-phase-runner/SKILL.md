---
name: waterfall-phase-runner
description: "Kỹ năng điều phối quy trình Waterfall 6 giai đoạn khép kín từ con số 0: Architecture -> UI/UX 18+ -> Backend -> Frontend -> QA Balance -> Production Deploy."
---

# QUY TRÌNH ĐIỀU PHỐI WATERFALL (/waterfall-phase-runner)

Khi kích hoạt kỹ năng này, Master Orchestrator sẽ điều phối 5 subagent độc lập tuần tự theo 6 giai đoạn nghiêm ngặt:

## Giai Đoạn 1: Architecture & Monorepo Setup (`system-architect`)
1. Khởi tạo khung thư mục Monorepo: `apps/server`, `apps/client`, `packages/shared-domain`.
2. Ban hành bộ đặc tả kiến trúc tại [`../../../deliverables/phase-1-architecture/`](../../../deliverables/phase-1-architecture/README.md) (WebSocket Contract, NoSQL Schema, State Machines).
3. Kiểm tra Gate 1: Xác nhận không rò rỉ dependencies và client/server phân tách hoàn toàn.

## Giai Đoạn 2: Visual UI/UX & 18+ Art Design (`art-designer`)
1. Ban hành bộ thiết kế đồ họa tại [`../../../deliverables/phase-2-art-design/`](../../../deliverables/phase-2-art-design/README.md) (Design Tokens, 6 Valkyries, 3 Cloth Damage Tiers, Wireframes 3x3, VFX Storyboard, Audio Spec).
2. Tạo mẫu assets bằng `generate_image` lưu vào `deliverables/phase-2-art-design/assets/`.
3. Kiểm tra Gate 2: Xác nhận điểm thẩm mỹ Waifu 18+ đạt $\ge 8.5/10$ và giao diện 3x3 công thái học.

## Giai Đoạn 3: Backend Server & Combat Core (`backend-engineer`)
1. Đọc và kế thừa đặc tả từ `deliverables/phase-1-architecture/`.
2. Viết mã nguồn `packages/shared-domain` (hằng số và toán học).
3. Lập trình Game Engine thời gian thực 20 ticks/s và thuật toán 8D Vector 2-2-2-3.
4. Thiết lập WebSocket Server và cơ chế Fog of Placement.
5. Kiểm tra Gate 3: Unit test $\ge 90\%$, 0 lỗi SonarQube/Coverity.

## Giai Đoạn 4: Frontend Client & Graphics (`frontend-engineer`)
1. Đọc và kế thừa thiết kế từ `deliverables/phase-2-art-design/`.
2. Xây dựng ứng dụng Client Web/Mobile 60 FPS bằng Expo SDK 52+.
3. Lập trình cơ chế kéo thả 3x3 với phản hồi xúc giác tức thời (< 16ms).
4. Tích hợp chuyển đổi trạng thái rách giáp 18+ và hoạt cảnh Climax Ultimate cut-in.
5. Kiểm tra Gate 4: Đảm bảo 60 FPS ổn định, 0 lỗi console, không rò rỉ bộ nhớ GPU/RAM.

## Giai Đoạn 5: QA, Balance & Browser Playtest (`qa-balance-tester`)
1. Mở Web-App bằng `browser_subagent` tự động chơi thử 1 ván đấu trọn vẹn.
2. Chạy giả lập 1,000,000 trận đấu kiểm tra tỷ lệ thắng giữa các Buff.
3. Xuất bảng điểm vào [`PLAYTEST_SCORECARD.md`](../../memory/PLAYTEST_SCORECARD.md).
4. **Vòng lặp Bug Ticketing & Retest ([`TICKETS.md`](../../memory/TICKETS.md)):**
   - Mọi bug phát hiện trong quá trình playtest đều được log vào `TICKETS.md`.
   - `backend-engineer` và `frontend-engineer` cùng nhau fix theo đúng tiêu chuẩn Explicit Types, 100% NPE guard, và TSDoc song ngữ Anh/Việt.
   - `qa-balance-tester` retest lại cho đến khi tính năng đạt chuẩn và chuyển trạng thái sang `CLOSED_PASS`.
5. Kiểm tra Gate 5: 100% tickets trong `TICKETS.md` là `CLOSED_PASS`, Điểm Game Feel $\ge 8.5/10$, Thẩm mỹ $\ge 8.5/10$, 0 lỗi Blocker.

## Giai Đoạn 6: Production Deployment (`system-architect` + All Agents)
1. Đóng gói Docker Compose: Nginx Gateway (SSL), Client Web, Server Node.js, Redis.
2. Kiểm tra tài liệu triển khai [`DEPLOYMENT_GUIDE.md`](../../../DEPLOYMENT_GUIDE.md).
3. Kiểm tra Gate 6: Khởi chạy thành công chỉ với `docker compose up -d --build`.
