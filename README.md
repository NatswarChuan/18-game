# ⚔️ VALKYRIE PROTOCOL: ZERO — WATERFALL 18+ ANIME GAME DEV ECOSYSTEM
*(High-Stakes 3x3 Tactical Auto-Battler • Server-Authoritative Monorepo • Antigravity Production V2)*

---

## 🌸 1. TỔNG QUAN HỆ SINH THÁI (ECOSYSTEM OVERVIEW)

**VALKYRIE PROTOCOL: ZERO** là bộ công cụ và hiến pháp phát triển phần mềm đa tác tử (Multi-Agent Ecosystem) trên nền tảng **Google Antigravity**. Hệ thống được thiết kế chuyên biệt để xây dựng từ con số 0 một tựa game chiến thuật đối kháng thời gian thực 3x3 Auto-Battler, áp dụng triệt để kiến trúc phân tách rạch ròi **Client / Server** và mô hình phát triển phần mềm thác nước khắt khe (**Strict Stage-Gated Waterfall**).

### 🎭 Điểm Độc Đáo Về Bản Sắc (Dual-Persona Standards):
1. **Đam mê Anime 18+ (Ecchi / Eroge Waifu Connoisseurs):** Toàn bộ 5 tác tử đều có tình yêu sâu sắc với nghệ thuật Anime 18+, tạo hình Waifu quyến rũ, cơ chế rách giáp chiến đấu (*Battle Damage Tiers*), hiệu ứng Ultimate Climax mãn nhãn và âm thanh mê hoặc.
2. **Game Thủ Khó Tính Bậc Nhất (Hardcore Gaming Elitists):** Đội ngũ kiên quyết loại bỏ mọi yếu tố Pay-to-Win, bài trừ sự mất cân bằng game, nói không với netcode giật lag và trải nghiệm UX cẩu thả. Điểm chất lượng trung bình phải đạt $\ge 8.5/10$ mới được chuyển giao đoạn.

---

## 🏛️ 2. HỆ THỐNG 7 SUBAGENT ĐỘC LẬP & CHUYÊN BIỆT (`.agents/agents/`)

Hệ thống phân tách thành 7 Agent độc lập, mỗi agent phụ trách một chuyên môn tương ứng trong Waterfall 7 Pha:

| Agent Identifier | Chức Danh Chuyên Môn | Persona & Trách Nhiệm Cốt Lõi | Đường Dẫn Định Nghĩa |
| :--- | :--- | :--- | :--- |
| **`system-architect`** | Principal System Architect & Tech Lead | Otaku đam mê visual novel sâu sắc; Khó tính về cấu trúc Monorepo, Data Flow, WebSocket Contract, State Machine và tài liệu Deploy. | [`.agents/agents/system-architect/agent.md`](.agents/agents/system-architect/agent.md) |
| **`art-designer`** | Lead UI/UX & 18+ Anime Art Director | Bậc thầy thẩm mỹ Ecchi/Hentai; Đòi hỏi visual gợi cảm tinh tế cho 27 Valkyries, 3 cấp độ Cloth Damage, HUD Glassmorphism, 60fps VFX. | [`.agents/agents/art-designer/agent.md`](.agents/agents/art-designer/agent.md) |
| **`buff-systems-designer`** | Lead Combat Buff & Tactical Vector DB Architect | Chuyên gia toán học & game theory; Thiết kế hệ sinh thái ≥243 Buffs 5 tầng, Vector nhúng 12D, kNN History Allocation 3-3-3 cho BO3/BO5. | [`.agents/agents/buff-systems-designer/agent.md`](.agents/agents/buff-systems-designer/agent.md) |
| **`backend-engineer`** | Senior Backend & Combat Engine Specialist | Kỹ sư cự phách dòng game chiến thuật; Lập trình Server-Authoritative 20 ticks/s, giải thuật 12D Vector đối xứng, zero-trust anti-cheat. | [`.agents/agents/backend-engineer/agent.md`](.agents/agents/backend-engineer/agent.md) |
| **`frontend-engineer`** | Senior Frontend & Graphics/Animation Lead | Game thủ nghiền nhịp điệu & fighter; Tối ưu 60-120 FPS, Canvas/Skia/WebGL, kéo thả 3x3 siêu nhạy, Waifu Climax cut-ins. | [`.agents/agents/frontend-engineer/agent.md`](.agents/agents/frontend-engineer/agent.md) |
| **`qa-balance-tester`** | Lead QA, Anti-Cheat & Hardcore Game Critic | Nhà phê bình game tàn nhẫn; Tự động playtest qua `browser_subagent`, chạy giả lập hàng triệu trận đấu, săn lùng lỗi blocker. | [`.agents/agents/qa-balance-tester/agent.md`](.agents/agents/qa-balance-tester/agent.md) |
| **`secops-quality-gate`** | Lead DevSecOps & Production Quality Auditor | Trưởng ban kiểm toán SonarQube Clean Code, Coverity SAST chống rò rỉ bộ nhớ, Black Duck SCA giấy phép bản quyền. | [`.agents/agents/secops-quality-gate/agent.md`](.agents/agents/secops-quality-gate/agent.md) |

---

## 🗺️ 3. DANH MỤC TÀI LIỆU TOÀN DIỆN (DOCUMENTATION DIRECTORY)

### 📌 Nhóm 1: Quản Trị Dự Án & Quy Trình Waterfall
- [`AGENTS.md`](AGENTS.md) — **[Luôn Bật]** Hiến pháp dự án & Giao thức điều phối Master Waterfall Orchestrator.
- [`WATERFALL_WORKFLOW.md`](WATERFALL_WORKFLOW.md) — Đặc tả 7 pha Waterfall, tiêu chí nghiệm thu từng Cổng (Stage-Gates) và biên bản bàn giao.
- [`LOCAL_SETUP_GUIDE.md`](LOCAL_SETUP_GUIDE.md) — **[MỚI]** Cẩm nang Agent tự động cài đặt thư viện & chạy Local không cần deploy.
- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) — Hướng dẫn triển khai Production từ con số 0 (Docker, Nginx, SSL, WebSocket, Redis).
- [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) — Tóm tắt dự án, cấu trúc Monorepo Client/Server và các trụ cột cốt lõi.
- [`INTRODUCTION.md`](INTRODUCTION.md) — Giới thiệu triết lý, tầm nhìn nghệ thuật và tư duy game thuần kỹ năng.

### ⚔️ Nhóm 2: Thiết Kế Game & Cân Bằng Toán Học
- [`GAME_DESIGN_DOCUMENT.md`](GAME_DESIGN_DOCUMENT.md) — Game Design Document (GDD) chi tiết với vũ trụ Anime 18+ Valkyrie.
- [`GAME_MECHANICS.md`](GAME_MECHANICS.md) — Ma trận hành vi 9 ô trên lưới 3x3, công thức sát thương và vòng lặp giao tranh.
- [`BUFF_VECTOR_SYSTEM.md`](BUFF_VECTOR_SYSTEM.md) — Không gian Vector 12 chiều, Vector DB kNN & Thuật toán thích ứng 243 Buffs cho BO3/BO5.

### 💻 Nhóm 3: Tiêu Chuẩn Kỹ Thuật, Design Patterns & Kiến Trúc Phần Mềm
- [`CODING_STANDARDS_PRODUCTION.md`](CODING_STANDARDS_PRODUCTION.md) — **[Cốt Lõi]** Chuẩn mực SOLID, 7 Design Patterns, TypeScript tường minh (0 `any`/`object`), 100% NPE guard, phân tầng sạch và TSDoc song ngữ Anh/Việt.
- [`ARCHITECTURE_SERVER.md`](ARCHITECTURE_SERVER.md) — Kiến trúc Server-Authoritative NestJS, Mongoose NoSQL, Redis & In-Memory Store.
- [`TECH_STACK_CLIENT.md`](TECH_STACK_CLIENT.md) — Kiến trúc Client Expo SDK 52+ Universal (Web & Mobile), 60fps Skia Canvas và Waifu VFX.
- [`.agents/rules/09-code-style-design-patterns-maintainability.md`](.agents/rules/09-code-style-design-patterns-maintainability.md) — **[Luôn Bật]** Quy tắc cú pháp nghiêm ngặt, kiểu dữ liệu tường minh, 100% NPE protection và TSDoc song ngữ.

### 🎫 Nhóm 4: Theo Dõi Sự Cố, Kiểm Thử & Quản Trị Tiến Độ
- [`.agents/memory/TICKETS.md`](.agents/memory/TICKETS.md) — **[Cốt Lõi Pha 6]** Phiếu theo dõi sự cố & lỗi kiểm thử (Vòng lặp phối hợp Fix lỗi giữa `qa-balance-tester`, `backend-engineer` và `frontend-engineer`).
- [`.agents/memory/WATERFALL_STATUS.md`](.agents/memory/WATERFALL_STATUS.md) — Bảng trạng thái tiến độ các cổng Waterfall & Biên bản nghiệm thu.
- [`.agents/memory/PLAYTEST_SCORECARD.md`](.agents/memory/PLAYTEST_SCORECARD.md) — Bảng điểm đánh giá thực tế trải nghiệm Game Feel & Thẩm mỹ 18+.

### 📦 Nhóm 5: Thư Mục Lưu Trữ Kết QuẢ Bàn Giao (Phase Deliverables)
- [`deliverables/phase-1-architecture/`](deliverables/phase-1-architecture/README.md) — **[Căn cứ Phase 1]** Toàn bộ kết quả bàn giao Kiến trúc của `system-architect` (Monorepo spec, WebSocket Contract, NoSQL Schema, State Machines).
- [`deliverables/phase-2-art-design/`](deliverables/phase-2-art-design/README.md) — **[Căn cứ Phase 2]** Toàn bộ kết quả bàn giao Đồ họa & UI/UX của `art-designer` (Design Tokens, 27 Valkyries, 3 Cloth Damage Tiers, Wireframes 3x3, VFX Storyboard, Audio Spec, Assets).
- [`deliverables/phase-3-buff-system/`](deliverables/phase-3-buff-system/README.md) — **[Căn cứ Phase 3]** Toàn bộ kết quả bàn giao Hệ Thống Buff & Vector DB của `buff-systems-designer` (243 Buffs Matrix, Vector DB Spec, Thuật toán BO3/BO5).

---

## ⚡ 4. TÍCH HỢP TỐI ĐA NĂNG LỰC CỦA GOOGLE ANTIGRAVITY

```
           ┌────────────────────────────────────────────────────────┐
           │            GOOGLE ANTIGRAVITY POWER TOOLS              │
           └───────────────────────────┬────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│   `browser_subagent`  │   │   `generate_image`    │   │  Artifacts & Carousels│
│  Tự động Playtest     │   │  Tạo Concept Art 18+  │   │  Báo cáo trực quan    │
│  Thu thập video/logs  │   │  Không dùng ảnh rác   │   │  Mermaid & Markdown   │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

1. **`browser_subagent`:** Cho phép `qa-balance-tester` và `art-designer` tự động mở trình duyệt Chromium thực tế, trải nghiệm từng click chuột, kiểm tra tương tác kéo thả 3x3 và ghi lại video playtest.
2. **`generate_image`:** Giúp `art-designer` sản xuất tức thời concept art Waifu 18+ và sprite minh họa độ nét cao mà không cần placeholder.
3. **Artifacts Reporting:** Toàn bộ bản thiết kế kiến trúc SDD, bảng điểm Playtest Scorecard và diff refactor code được lưu trữ trực tiếp dưới dạng Artifacts phong phú.

---

## 🎯 5. BẮT ĐẦU DỰ ÁN TỪ CON SỐ 0 (QUICKSTART)

### 💻 Cách 1: Chạy Thử Nghiệm Local Tức Thì (Không Cần Deploy, Không Cần Docker)
Chỉ cần gõ lệnh hoặc yêu cầu Agent:
```bash
/local-dev-bootstrap
```
Agent sẽ tự động kiểm tra runtime, cài đặt `pnpm`, tải toàn bộ thư viện, biên dịch `packages/shared-domain` và bật ngầm Server (cổng 4000) cùng Client (cổng 5173) để bạn chơi thử ngay trên máy!

### 🚀 Cách 2: Triển Khai Production Đầy Đủ
Thực thi theo hướng dẫn tại [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) bằng lệnh:
```bash
docker compose up -d --build
```
