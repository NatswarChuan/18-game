---
trigger: always_on
description: "Quy chuẩn lập trình công nghiệp bắt buộc: Code-Style chuẩn Google/Airbnb TypeScript, Bộ Design Patterns (Strategy, State, Factory, Adapter, Command, Result), Nguyên lý SOLID, Clean Architecture và Tiêu chí Maintainability dài hạn."
---

# QUY CHUẨN CODE-STYLE, DESIGN PATTERNS & BẢO TRÌ PHẦN MỀM DÀI HẠN (ALWAYS-ON)

Tài liệu này quy định các tiêu chuẩn kỹ thuật phần mềm chuẩn công nghiệp bắt buộc áp dụng cho toàn bộ dự án **VALKYRIE PROTOCOL: ZERO**. Mọi dòng mã nguồn được viết bởi bất kỳ Subagent nào (`system-architect`, `backend-engineer`, `frontend-engineer`, `art-designer`, `qa-balance-tester`) đều phải tuân thủ nghiêm ngặt để đảm bảo khả năng đọc hiểu (Readability), kiểm thử (Testability), và bảo trì dài hạn (Maintainability).

---

## 🏛️ 1. NGUYÊN LÝ THIẾT KẾ PHẦN MỀM KINH ĐIỂN (SOFTWARE PRINCIPLES)

Mọi module phải được thiết kế dựa trên các nguyên lý vàng của kỹ nghệ phần mềm:

### 1.1. Nguyên Lý SOLID:
1. **Single Responsibility Principle (SRP) — Đơn Trách Nhiệm:**
   - Mỗi file, class hoặc hàm chỉ đảm nhiệm một lý do duy nhất để thay đổi.
   - Hàm tối đa **50 dòng**, file tối đa **300 dòng**. Tách nhỏ hàm tính toán sát thương, hàm cập nhật rách giáp, và hàm gửi gói tin WebSocket thành các module riêng biệt.
2. **Open-Closed Principle (OCP) — Đóng Để Sửa, Mở Để Mở Rộng:**
   - Khi thêm Valkyrie mới hoặc Buff mới, tuyệt đối không sửa đổi mã nguồn của Engine cốt lõi. Hãy sử dụng hệ thống cấu hình (Config Driven) và Interfaces.
3. **Liskov Substitution Principle (LSP) — Thay Thế Liskov:**
   - Các class con hoặc implementations phải có khả năng thay thế hoàn toàn cho interface cha mà không làm thay đổi tính đúng đắn của chương trình (Ví dụ: `InMemoryRoomRepository` và `RedisRoomRepository` phải thay thế được cho nhau 100%).
4. **Interface Segregation Principle (ISP) — Phân Tách Giao Diện:**
   - Tạo nhiều interface nhỏ, chuyên biệt thay vì một "God Interface" khổng lồ.
5. **Dependency Inversion Principle (DIP) — Đảo Ngược Phụ Thuộc:**
   - Các module cấp cao (Game Simulation Loop) không phụ thuộc trực tiếp vào module cấp thấp (WebSocket Transport / Redis). Cả hai phải phụ thuộc thông qua Abstractions (Ports & Adapters).

### 1.2. KISS, YAGNI, DRY & Boy Scout Rule:
- **KISS (Keep It Simple, Stupid):** Ưu tiên giải pháp đơn giản, trực diện, dễ hiểu. Tránh các cấu trúc trừu tượng quá mức không cần thiết.
- **YAGNI (You Aren't Gonna Need It):** Chỉ viết code phục vụ yêu cầu hiện tại của ván đấu 3x3 và thể thức BO3/BO5, không tự ý thêm các tính năng giả định viển vông.
- **DRY (Don't Repeat Yourself):** Không lặp lại logic hoặc công thức toán học. Toàn bộ công thức sát thương, giảm giáp, và tính toán Vector 8D phải nằm tập trung duy nhất tại `packages/shared-domain`.
- **Boy Scout Rule:** Luôn để lại vùng code sạch sẽ hơn trước khi bạn chạm vào nó. Khi sửa bug, hãy chủ động refactor các đoạn code cũ còn mùi (Code Smells).

---

## 🧩 2. CÁC DESIGN PATTERNS BẮT BUỘC TRONG DỰ ÁN (MANDATORY PATTERNS)

Để tránh mã nguồn biến thành spaghetti, dự án quy định các Design Patterns chuẩn mực cho từng tác vụ:

| Tác Vụ Kỹ Thuật | Design Pattern Áp Dụng | Cách Triển Khai Cụ Thể Trong Dự Án |
| :--- | :--- | :--- |
| **Hành vi 9 ô trên lưới 3x3** | **Strategy Pattern / Lookup Table** | Sử dụng bảng ánh xạ bất biến `Readonly<Record<SlotIndex, SlotBehaviorStrategy>>`. Cấm viết `if/else` lồng nhau quá 2 cấp để xử lý tọa độ. |
| **Vòng đời ván đấu BO3/BO5** | **State Machine Pattern** | Tách từng pha thành các class riêng: `DraftPhaseState`, `PlacementPhaseState`, `CombatPhaseState`, `RoundEndState`. |
| **Ý định của người chơi** | **Command Pattern** | Đóng gói mọi hành động của Client thành Command Object (`SelectBuffCommand`, `UpdatePlacementCommand`, `LockInCommand`) có khả năng validate và replay. |
| **Dòng sự kiện giao tranh** | **Observer / Event-Driven Pattern** | Combat Engine phát ra các sự kiện: `UnitAttackedEvent`, `ClothDamageTierChangedEvent`, `ClimaxTriggeredEvent`. Client lắng nghe và render. |
| **Lưu trữ phòng đấu** | **Port & Adapter (Hexagonal)** | Định nghĩa Port `IRoomStore`. Cung cấp 2 Adapters: `InMemoryRoomAdapter` (cho Local Run) và `RedisRoomAdapter` (cho Production). |
| **Khởi tạo Valkyrie & Buff** | **Factory Pattern** | Sử dụng `ValkyrieFactory.createUnit()` và `BuffFactory.createVector8D()` đảm bảo luôn tạo ra đối tượng có chỉ số hợp lệ. |
| **Xử lý lỗi an toàn** | **Result Pattern (`Result<T, E>`)** | Cấm dùng `throw new Error()` cho các lỗi nghiệp vụ thông thường. Sử dụng kiểu trả về `{ ok: true, data: T } \| { ok: false, error: DomainError }`. |

---

## 🎨 3. QUY CHUẨN CÚ PHÁP & CODE-STYLE (GOOGLE & AIRBNB TYPESCRIPT STANDARD)

### 3.1. Quy Ước Đặt Tên & Kiểu Dữ Liệu Tường Minh (Explicit Typing, No Dynamic Types):
- **Cấm Tuyệt Đối Kiểu Động:** Cấm dùng `any`, `object`, `Function`, hay `Record<string, any>`. Mọi tham số và biến phải có interface/type cụ thể.
- **Khai Báo Kiểu Trả Về Tường Minh:** Mọi function/method (cả public và private) bắt buộc phải khai báo explicit return type.
- **`PascalCase`:** Dành cho Classes, Interfaces, Types, Enums, và React Components (`ValkyrieUnit`, `CombatTickFrame`, `BuffVector8D`, `GameBoardGrid`).
- **`camelCase`:** Dành cho Functions, Methods, Variables, Object Properties (`calculateHyperbolicDamage`, `currentMana`, `unitPlacements`).
- **`UPPER_SNAKE_CASE`:** Dành cho Hằng số toàn cục và Cấu hình bất biến: `BASE_HP`, `BASE_ATK`, `TICK_RATE_HZ`, `MAX_SLOT_COUNT`.
- **`kebab-case`:** Dành cho tên thư mục và tên files: `combat-engine.ts`, `vector-math.service.ts`.
- **Tiền tố Biến Boolean:** Luôn có các tiền tố rõ ràng như `is`, `has`, `can`, `should` (`isAlive`, `hasClimaxReady`, `canMoveForward`).

### 3.2. Tính Bất Biến & Bao Phủ 100% Lỗi NPE (100% NPE Protection & Immutability):
- **Bao Phủ 100% Nguy Cơ Null/Undefined (NPE Guard):**
  - Luôn sử dụng toán tử Optional Chaining (`?.`) và Nullish Coalescing (`??`) khi truy xuất thuộc tính.
  - Khi đọc phần tử mảng hoặc Map (`board[slotId]`, `units[index]`), luôn kiểm tra Guard Clause `if (!target) return ...` trước khi thao tác.
  - Cấm hoàn toàn toán tử non-null assertion `!` (`unit!.hp` là phạm quy).
- **Mặc định là Immutability:** Sử dụng từ khóa `readonly` cho thuộc tính và `ReadonlyArray<T>` cho danh sách mảng.
- **Cấm đột biến trực tiếp (No State Mutation):**
  - *Sai:* `unit.hp -= damage;`
  - *Đúng:* `return { ...unit, hp: Math.max(0, unit.hp - damage) };`
- **Exhaustiveness Checking với `never`:** Mọi khối lệnh `switch/case` trên Discriminated Union bắt buộc phải có nhánh `default: const _exhaustive: never = action; throw new Error(...)`.

### 3.3. Tài Liệu Hóa Code Chuẩn Google Bằng Song Ngữ Anh / Việt (Bilingual TSDoc):
Mọi hàm, class, interface công khai (`exported`) bắt buộc phải có chú thích TSDoc bằng **Song Ngữ Anh / Việt**:
```typescript
/**
 * Calculates the final combat damage multiplier using hyperbolic armor formula.
 * Tính toán hệ số sát thương thực tế dựa trên công thức giáp Hyperbolic.
 * 
 * @param defenseValue - The physical armor value of the defending Valkyrie (clamped at -80).
 *                     Chỉ số giáp vật lý của Valkyrie phòng thủ (kẹp tối thiểu -80).
 * @returns The final multiplier between (0, +infinity) to be applied to raw attack power.
 *          Hệ số nhân cuối cùng trong khoảng (0, +vô cùng) được áp dụng vào sát thương gốc.
 * @throws {RangeError} If defenseValue is NaN or Infinity.
 *                      Nếu defenseValue không phải là số hợp lệ.
 */
export function calculateDamageMultiplier(defenseValue: number): number {
  const safeDefense = Math.max(-80, defenseValue);
  return 100 / (100 + safeDefense);
}
```

---

## 📊 4. CHỈ SỐ BẢO TRÌ MÃ NGUỒN (MAINTAINABILITY METRICS)

Mọi dòng code trước khi vượt qua Gate nghiệm thu phải được đo đạc và thỏa mãn các chỉ số:
1. **Cognitive Complexity:** Tối đa **$\le 15$** trên mỗi hàm (SonarQube Gate A).
2. **Cyclomatic Complexity:** Tối đa **$\le 10$** trên mỗi hàm.
3. **Số Lượng Tham Số:** Tối đa **$\le 3$** tham số. Nếu cần truyền từ 4 biến trở lên, bắt buộc phải gom vào một Parameter Object: `Readonly<DamageCalculationParams>`.
4. **Cấm Magic Numbers / Magic Strings:** 100% các con số (`1000`, `50`, `20`, `0.15`, `0.25`, `0.05`) và chuỗi định danh phải được khai báo trong file constants.
5. **Structured Logging:** Cấm tuyệt đối để lại `console.log()` rác trong mã nguồn Production. Phải sử dụng bộ logger có gắn context (`logger.info({ roomId, tick }, "Combat tick executed")`).
