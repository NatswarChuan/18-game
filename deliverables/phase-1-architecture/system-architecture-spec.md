# 🏛️ ĐẶC TẢ KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE SPECIFICATION)
*(Valkyrie Protocol: Zero • Phase 1 Deliverable • Căn cứ triển khai cốt lõi)*

---

## 1. MÔ HÌNH MONOREPO & PHÂN CHIA THƯ MỤC CỐT LÕI

Toàn bộ hệ thống mã nguồn, tài liệu, quy chuẩn và deliverables của dự án được cấu trúc chuẩn hóa dưới dạng **Monorepo tại thư mục gốc (`./`)** (quản trị bằng `pnpm workspaces`):

```
.                                       # THƯ MỤC GỐC MONOREPO (WORKSPACE ROOT)
├── apps/
│   ├── client/                         # [Expo SDK 52+] Universal Mobile (iOS/Android) & Web (HTML5)
│   │   ├── src/
│   │   │   ├── components/             # UI Buttons, Glassmorphism Cards, Modals
│   │   │   ├── screens/                # DraftScreen, BoardScreen, CombatScreen
│   │   │   ├── graphics/               # Skia Canvas Renderers, Shaders, Cloth Damage Layers
│   │   │   ├── stores/                 # Zustand Store (UI State, Selected Buffs)
│   │   │   └── network/                # WebSocket Client Adapter
│   │   ├── assets/                     # Concept art & waifu sprites (từ phase-2 deliverables)
│   │   └── package.json
│   │
│   └── server/                         # [NestJS Framework] Server-Authoritative 20 ticks/s
│       ├── src/
│       │   ├── modules/
│       │   │   ├── match/              # Matchmaking (BO3 & BO5), Fog of Placement Guard
│       │   │   ├── combat/             # CombatEngineService (50ms Loop, Deterministic Math)
│       │   │   ├── buff/               # VectorBuffSelectionService (BO3/BO5 kNN Search)
│       │   │   ├── vector-db/          # InMemoryVectorDatabaseService / Qdrant Adapter
│       │   │   ├── gateway/            # WebSocket Gateway, Protocol Handlers
│       │   │   └── persistence/        # Mongoose Schemas (MongoDB) & Redis Store
│       │   └── main.ts
│       └── package.json
│
├── packages/
│   └── shared-domain/                  # Pure TypeScript (Hạt nhân toán học, 0 dependencies)
│       ├── src/
│       │   ├── constants/              # Grid 3x3 dimensions, BASE_HP, BASE_ATK, tickrate
│       │   ├── math/                   # Hyperbolic Armor formula, 12D Vector Dot Product
│       │   ├── types/                  # Strict TypeScript Types, Discriminated Unions
│       │   └── contracts/              # DTOs, Event Schemas
│       └── package.json
│
├── deliverables/                       # THƯ MỤC LƯU TRỮ KẾT QUẢ BÀN GIAO CÁC PHASE
│   ├── phase-1-architecture/           # Specs kiến trúc của system-architect (Gate 1)
│   ├── phase-2-art-design/             # Specs đồ họa & 27 Valkyries 18+ của art-designer (Gate 2)
│   └── phase-3-buff-system/            # Specs 243 Buffs, Vector DB BO3/BO5 của buff-systems-designer (Gate 3)
│
├── .agents/                            # HỆ SINH THÁI TÁC TỬ ANTIGRAVITY
│   ├── agents/                         # 6 Subagents độc lập (Architect, Designer, Buff, BE, FE, Tester)
│   ├── memory/                         # Persistent Memory, Tickets, Debates & Reviews
│   ├── rules/                          # Always-on Coding Rules & Quality Gates
│   └── skills/                         # Waterfall Runner, Playtest, Dev Bootstrap
│
├── package.json                        # Root pnpm workspaces configuration
├── pnpm-workspace.yaml                 # Khai báo packages: ['apps/*', 'packages/*']
├── AGENTS.md                           # Master Waterfall Constitution
├── WATERFALL_WORKFLOW.md               # 7-Phase Pipeline & Reviewer Matrix
└── CODING_STANDARDS_PRODUCTION.md      # Production Coding Standards
```

---

## 2. QUY CHUẨN PHÂN TẦNG CLEAN HEXAGONAL ARCHITECTURE

Để đảm bảo tính maintainability dài hạn và dễ mở rộng:

1. **Domain Layer (`packages/shared-domain`):**
   - Không chứa bất kỳ thư viện framework nào (`express`, `nestjs`, `react`, `mongoose`).
   - Mọi hàm toán học là Pure Functions (chuẩn xác định, không side-effect).
   - 100% kiểu dữ liệu tường minh, không dùng `any` hay `object`.

2. **Application Layer (Use Cases & Engine):**
   - Điều phối luồng trận đấu, tính toán va chạm theo tick 50ms.
   - Giao tiếp với Domain thông qua interfaces, không phụ thuộc vào công nghệ mạng.

3. **Infrastructure Layer (NestJS / DB / Redis):**
   - Chịu trách nhiệm lưu trữ NoSQL (Mongoose), quản lý bộ nhớ đệm (Redis) và socket I/O.
   - Hỗ trợ cờ tự trị `USE_IN_MEMORY_STORE=true` khi chạy local không có server ngoài.

4. **Presentation Layer (Expo Client):**
   - Đóng vai trò Dumb Terminal: Không được phép tự tính toán lượng sát thương cục bộ.

---

## 3. NGUYÊN TẮC BẢO VỆ AN TOÀN DỮ LIỆU & ZERO CLIENT TRUST

- **Fog of Placement:** Server chỉ gửi thông tin đội hình đối phương sau khi cả 2 bên đã bấm Lock-in hoặc hết 20 giây xếp cờ.
- **Strict Input Validation:** Mọi gói tin WebSocket gửi từ Client phải được kiểm tra qua Guard:
  - Quân cờ phải thuộc quyền sở hữu của người chơi.
  - Tọa độ bàn cờ phải hợp lệ (ô từ 0 đến 8).
  - Không được xếp trùng ô; tổng số quân cờ trên bàn tối đa bằng 6 (luôn chừa 3 ô trống).
- **NaN / Division by Zero Guard:** Mọi công thức sát thương và vector đều kẹp biên $\epsilon = 10^{-9}$.
