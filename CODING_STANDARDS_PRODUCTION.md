# 🏗️ PRODUCTION CODING STANDARDS & ENTERPRISE QUALITY GATES
*(Strict Language Patterns, SonarQube Clean Code, Coverity SAST & Black Duck SCA)*

Tài liệu này quy định tiêu chuẩn kỹ thuật bắt buộc ở cấp độ **Production-Ready & Long-Term Maintainability** cho dự án **VALKYRIE PROTOCOL: ZERO**. Mọi AI Subagent (`system-architect`, `backend-engineer`, `frontend-engineer`, `art-designer`, `qa-balance-tester`) khi viết hoặc chỉnh sửa bất kỳ dòng code nào đều phải vượt qua 4 chốt chặn: **Architecture & Language Patterns**, **SonarQube**, **Coverity**, và **Black Duck**.

---

## 1. NGUYÊN LÝ THIẾT KẾ, DESIGN PATTERNS & CODE-STYLE BẮT BUỘC

### 1.1. Năm Nguyên Lý Thiết Kế Phần Mềm SOLID
Mọi module trong dự án bắt buộc phải tuân theo 5 nguyên lý SOLID để dễ bảo trì, dễ mở rộng và dễ viết unit test:
1. **Single Responsibility Principle (SRP):** Mỗi file/hàm chỉ đảm nhận 1 trách nhiệm duy nhất (hàm $\le 50$ dòng, file $\le 300$ dòng). Không gộp logic tính sát thương, cập nhật UI và gửi WebSocket vào chung 1 component.
2. **Open-Closed Principle (OCP):** Mở rộng hệ thống bằng cách thêm cấu hình hoặc implements interface mới; cấm sửa đổi mã nguồn cốt lõi (ví dụ: thêm Buff mới bằng cách thêm data record, không sửa hàm switch khổng lồ).
3. **Liskov Substitution Principle (LSP):** Các class con hoặc implementations phải thay thế được cho interface cha mà không làm hỏng tính đúng đắn (Ví dụ: `InMemoryRoomAdapter` và `RedisRoomAdapter` đều tuân thủ 100% hợp đồng `IRoomStore`).
4. **Interface Segregation Principle (ISP):** Chia nhỏ các interface theo vai trò; không ép buộc các class phải phụ thuộc vào các phương thức mà chúng không sử dụng.
5. **Dependency Inversion Principle (DIP):** Module cấp cao (Combat Simulation) chỉ phụ thuộc vào Abstraction, không phụ thuộc vào thư viện cụ thể bên ngoài (WebSocket/Redis).

### 1.2. Danh Mục Design Patterns Bắt Buộc Trong Dự Án
- **Strategy Pattern / Lookup Table:** Áp dụng cho hành vi 9 ô trên bàn cờ 3x3 (`Readonly<Record<SlotIndex, SlotBehaviorStrategy>>`). Cấm lồng `if/else` quá 2 cấp.
- **State Machine Pattern:** Áp dụng cho vòng đời trận đấu BO3/BO5 (`DraftPhaseState` $\rightarrow$ `PlacementPhaseState` $\rightarrow$ `CombatPhaseState` $\rightarrow$ `RoundEndState`).
- **Command Pattern:** Đóng gói toàn bộ Intent của người chơi gửi qua mạng thành Command Objects (`SelectBuffCommand`, `UpdatePlacementCommand`, `LockInCommand`).
- **Observer / Event-Driven Pattern:** Server Combat Engine phát ra chuỗi sự kiện (`UnitDamagedEvent`, `ClothDamageTierChangedEvent`, `ClimaxTriggeredEvent`) để Client lắng nghe và diễn hoạt.
- **Port & Adapter (Hexagonal Architecture):** Tách biệt tầng logic nghiệp vụ khỏi tầng hạ tầng (Database, Cache, WebSocket).
- **Factory Pattern:** Dùng `ValkyrieFactory` và `BuffFactory` để chuẩn hóa quá trình khởi tạo dữ liệu.
- **Result Pattern (`Result<T, E>`):** Sử dụng kiểu trả về tường minh `{ ok: true, data: T } | { ok: false, error: DomainError }` thay cho việc ném exceptions tràn lan.

### 1.3. Phân Tách Kiến Trúc (Clean Architecture & DDD)
- **`packages/shared-domain/` (Pure TypeScript - Zero External Runtime Dependencies):**
  - Chứa toàn bộ hằng số bất biến (`BASE_STATS_BY_CLASS`, `TICKS_PER_SECOND = 20`), Value Objects (`UnitState`, `BoardGrid3x3`, `BuffVector12D`), và Pure Functions.
  - Tuyệt đối cấm import React Native, Node.js `fs`/`http` hay cơ sở dữ liệu vào đây.
- **`apps/server/` (Hexagonal / Ports & Adapters Architecture):**
  - `domain/`: State Machine trận đấu (`BO3/BO5`), `DeterministicCombatEngine` (20 ticks/s), `SymmetricVectorDraftEngine`.
  - `application/`: Use-cases xử lý Command từ người chơi (`SelectBuffUseCase`, `PlaceUnit3x3UseCase`).
  - `infrastructure/`: WebSocket transport, Vector DB adapter, Redis/Memory room store, Anti-cheat rate limiter.
- **`apps/client/` (Feature-Sliced Design - FSD):**
  - `features/`: Tách biệt `draft-9-buffs/`, `board-3x3-placement/`, `realtime-combat-renderer/`.
  - `entities/`: Visual components của `ValkyrieUnit` (Role Morphing Hàng 1/2/3, 3 Cấp độ rách giáp), `GridTile`, `BuffCard`.
  - `shared/`: UI Kit Glassmorphism, Canvas/Skia shaders, Audio hooks, WebSocket client wrapper.

### 1.4. Kiểu Dữ Liệu Tường Minh 100% & Cấm Tuyệt Đối Kiểu Động (No Dynamic Types)
1. **Cấm tuyệt đối `any`, `object`, `Function`:**
   - Cấm sử dụng `any`, `object`, `Function`, hoặc `Record<string, any>`. Mọi cấu trúc dữ liệu đều phải có `interface` hoặc `type` cụ thể với từng trường được định kiểu rõ ràng.
   - Khi nhận dữ liệu từ bên ngoài (mạng, json), bắt buộc validate qua schema (Zod hoặc `class-validator`) để chuyển đổi thành kiểu dữ liệu tĩnh cụ thể trước khi đưa vào domain logic.
2. **Khai báo kiểu trả về tường minh (Explicit Return Types):**
   - Mọi hàm, phương thức (cả public và private) bắt buộc phải khai báo kiểu trả về rõ ràng:
     ```typescript
     // ĐÚNG:
     public calculateDamage(target: Readonly<UnitState>, rawAtk: number): Readonly<DamageResult>
     // SAI: Không khai báo kiểu trả về
     public calculateDamage(target, rawAtk)
     ```

### 1.5. Bao Phủ 100% Nguy Cơ Lỗi Null/Undefined (100% NPE Protection)
1. **Chống Null Pointer Exception (NPE) Tuyệt Đối:**
   - Luôn sử dụng toán tử Optional Chaining (`?.`) và Nullish Coalescing (`??`) khi truy cập thuộc tính có khả năng rỗng.
   - Khi truy cập mảng hoặc Record (`board[slotId]`, `units[index]`), do bật `"noUncheckedIndexedAccess": true`, kiểu trả về luôn là `T | undefined`. Lập trình viên **bắt buộc** phải kiểm tra Guard Clause trước khi thao tác:
     ```typescript
     const targetUnit = board.get(slotId);
     if (!targetUnit) {
       return Result.fail(new UnitNotFoundError(`Unit not found at slot ${slotId}`));
     }
     ```
   - **Cấm hoàn toàn toán tử Non-Null Assertion `!`:** Tuyệt đối cấm viết `unit!.hp` hoặc `board.get(id)!`.
2. **Exhaustive Type Checking Với `never`:**
   - Mọi nhánh rẽ `switch/case` trên Discriminated Union phải có khối `default: const _exhaustive: never = action; throw new Error(...)` để đảm bảo trình biên dịch báo lỗi ngay khi thiếu case.

### 1.6. Phân Tầng Kiến Trúc Rạch Ròi (Strict Layer Separation Invariants)
Dự án chia làm 4 tầng độc lập theo quy tắc phụ thuộc 1 chiều hướng vào trong (Dependency Rule):
1. **Tầng Domain (`packages/shared-domain`):** Chứa hạt nhân toán học, hằng số và quy tắc bất biến. Độc lập 100%, không biết đến database hay UI.
2. **Tầng Application (`apps/server/src/modules/*/services`):** Điều phối use-cases, thực thi state machine trận đấu.
3. **Tầng Infrastructure (`apps/server/src/modules/database`, `transports`):** Cung cấp các adapter cho WebSocket, MongoDB NoSQL, Redis.
4. **Tầng Presentation (`apps/client/src`):** Expo Universal UI (Web & Mobile), chỉ nhận snapshot và render.
*Quy tắc cấm:* Tầng trong không bao giờ được import từ tầng ngoài. Domain không được phụ thuộc Application/Infrastructure.

### 1.7. Chuẩn Comment Google Code Document Bằng Song Ngữ Anh / Việt (Bilingual TSDoc)
Mọi hàm, class, interface công khai (`exported`) bắt buộc phải có tài liệu chú thích theo chuẩn **Google Code / TSDoc** sử dụng **Song Ngữ Anh / Việt**:
- **Tóm tắt (Summary):** Viết bằng tiếng Anh và tiếng Việt.
- **Tham số (`@param`):** Giải thích rõ ràng cả tiếng Anh và tiếng Việt.
- **Giá trị trả về (`@returns`):** Mô tả kiểu dữ liệu và ý nghĩa.
- **Ngoại lệ (`@throws`):** Mô tả các trường hợp lỗi nếu có.

**Mẫu Code Chuẩn Mực Bắt Buộc:**
```typescript
/**
 * Calculates the final combat damage multiplier using hyperbolic armor formula.
 * Tính toán hệ số sát thương thực tế dựa trên công thức giáp Hyperbolic.
 *
 * @param armorValue - The physical armor value of the defending Valkyrie (clamped at -80).
 *                     Chỉ số giáp vật lý của Valkyrie phòng thủ (kẹp tối thiểu -80).
 * @param armorPenetrationRate - Percentage of armor ignored by the attacker (0.0 to 1.0).
 *                               Tỷ lệ phần trăm giáp bị bỏ qua bởi kẻ tấn công (0.0 đến 1.0).
 * @returns The final multiplier between (0, +infinity) to be applied to raw attack power.
 *          Hệ số nhân cuối cùng trong khoảng (0, +vô cùng) được áp dụng vào sát thương gốc.
 * @throws {RangeError} If armorPenetrationRate is outside the valid [0, 1] range.
 *                      Nếu tỷ lệ xuyên giáp nằm ngoài khoảng hợp lệ [0, 1].
 *
 * @example
 * ```typescript
 * const multiplier = calculateDamageMultiplier(20, 0); // ~0.8333 (16.67% reduction)
 * ```
 */
export function calculateDamageMultiplier(
  armorValue: number,
  armorPenetrationRate: number,
): number {
  if (armorPenetrationRate < 0 || armorPenetrationRate > 1) {
    throw new RangeError('Armor penetration rate must be between 0 and 1');
  }
  const effectiveArmor = Math.max(-80, armorValue * (1 - armorPenetrationRate));
  return 100 / (100 + effectiveArmor);
}
```

---

## 2. TIÊU CHUẨN SONARQUBE (CLEAN CODE & MAINTAINABILITY GATE)

Mọi file mã nguồn phải đạt **SonarQube Quality Gate Rating A** ở cả 3 chỉ số Maintainability, Reliability và Security:

| Chỉ số SonarQube | Ngưỡng Bắt Buộc (Hard Limit) | Quy tắc Thực thi Cụ thể |
| :--- | :--- | :--- |
| **Cognitive Complexity** | `<= 15` / hàm | Cấm `if/else` hoặc `switch` lồng nhau quá 2 cấp. Áp dụng **Early Return (Guard Clauses)** và **Strategy / Lookup Table Pattern** cho hành vi 9 ô trên bàn cờ 3x3. |
| **Cyclomatic Complexity** | `<= 10` / hàm | Tách nhỏ các bước tính sát thương, hồi Mana (+15% Hàng 1), Flanking (+25% Ô 4, 6) thành các hàm đơn nhiệm. |
| **Kích thước Hàm & File** | Hàm `<= 60` dòng, File `<= 350` dòng | Không viết "God Component" hay "God Class". Mỗi file chỉ xuất (export) 1 thành phần chính. |
| **Số lượng Tham số** | `<= 4` tham số / hàm | Nếu cần truyền nhiều hơn 3 tham số, đóng gói thành `Readonly<ParamsObject>`. |
| **Duplicated Lines** | `< 3%` toàn dự án | Không copy-paste công thức tính Giáp/Kháng phép hoặc chuẩn hóa Vector giữa các file. |
| **No Magic Numbers** | `0` vi phạm | Mọi con số (`1000`, `50`, `20`, `0.15`, `0.25`, `0.05`, `9`, `6`) phải được khai báo thành hằng số `UPPER_SNAKE_CASE` có chú thích đơn vị. |
| **Async / Promise Safety** | `0` floating promises | Thực thi quy tắc `no-floating-promises` và `no-misused-promises`. Mọi hàm `async` phải có `try/catch` hoặc `.catch()` tường minh. |

---

## 3. TIÊU CHUẨN COVERITY (SAST - DEFECT & SECURITY PREVENTION GATE)

Phòng chống triệt để các nhóm lỗi tĩnh (Static Defects) và lỗ hổng bảo mật theo chuẩn **Synopsys Coverity & CWE Top 25**:

1. **Null / Undefined Dereference (`FORWARD_NULL` / `NULL_RETURNS`):**
   - Khi truy cập mảng lưới 3x3 (`board[index]`), do bật `noUncheckedIndexedAccess`, luôn phải kiểm tra `if (!tile) return;` trước khi đọc thuộc tính.
2. **Resource & Memory Leaks (`RESOURCE_LEAK`):**
   - **Trên Expo Client:** Mọi `useEffect` đăng ký WebSocket listener, `setInterval`, `setTimeout`, `requestAnimationFrame`, hoặc khởi tạo Skia RuntimeShader / Three.js Geometry & Material **bắt buộc** phải có hàm `cleanup` giải phóng bộ nhớ khi unmount.
   - **Trên Server:** Mọi phòng đấu (`MatchRoom`) khi kết thúc loạt `BO3/BO5` hoặc khi cả 2 người chơi ngắt kết nối quá thời gian quy định phải hủy toàn bộ `combatTickInterval` và xóa tham chiếu trong `RoomRegistry` để tránh rò rỉ RAM.
3. **Concurrency & Race Conditions (`LOCK_INVERSION` / `ATOMICITY`):**
   - Khi cả 2 người chơi cùng gửi gói tin `LOCK_IN` hoặc `SELECT_BUFF` ở mili-giây cuối cùng của 20s, Server phải xử lý tuần tự qua **Per-Room Action Queue (Mutex/Serialized Command Buffer)** để tránh ghi đè trạng thái (State Corruption).
4. **Numeric & Floating-Point Hazards (`DIVIDE_BY_ZERO` / `NAN_PROPAGATION`):**
   - Trong phép tính Cosine Similarity $\frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$ và công thức Giáp $\frac{100}{100 + \text{Armor}}$: Luôn kiểm tra mẫu số `denominator <= 1e-9` hoặc `Armor < -100` để không bao giờ sinh ra `NaN` hoặc `Infinity` làm sập Server.
5. **Untrusted Input & Prototype Pollution (`TAINTED_SCALAR` / CWE-1321):**
   - Không bao giờ dùng trực tiếp payload từ Client làm key truy cập Object (` obj[clientInput] `) mà không qua `Object.hasOwn()` hoặc `Map<string, T>`.
   - Giới hạn kích thước gói tin WebSocket (`maxPayload <= 16KB`) và tần suất gửi (`Rate Limit <= 20 actions/s`) để chống tấn công DoS.

---

## 4. TIÊU CHUẨN BLACK DUCK (SCA - OPEN SOURCE & LICENSE COMPLIANCE GATE)

Đảm bảo dự án sạch hoàn toàn về bản quyền thương mại và lỗ hổng thư viện bên thứ ba (Software Composition Analysis):

1. **Chính sách Bản quyền Mã nguồn mở (Strict License Allowlist):**
   - **ĐƯỢC PHÉP (Permissive Licenses):** `MIT`, `ISC`, `Apache-2.0`, `BSD-2-Clause`, `BSD-3-Clause`, `0BSD`, `Unlicense`.
   - **CẤM TUYỆT ĐỐI (Copyleft / Viral / Non-Commercial Licenses):** `GPL-2.0`, `GPL-3.0`, `AGPL-3.0`, `LGPL-*` (nếu liên kết tĩnh trên iOS/Web bundle), `SSPL`, `CC-BY-NC-*`, `EUPL`.
   - Trước khi cài thêm bất kỳ thư viện nào vào `package.json`, Agent phải kiểm tra trường `license` của thư viện đó và các transitive dependencies.
2. **Quản lý Lỗ hổng Bảo mật (Zero Known High/Critical CVEs):**
   - Không sử dụng các gói thư viện đã bị ngừng bảo trì (deprecated) hoặc có lỗ hổng `Critical` / `High` trên National Vulnerability Database (NVD) / GitHub Advisory.
3. **Dependency Hygiene & Pinning:**
   - Cấm cài đặt thư viện thừa cho những tác vụ đơn giản (ví dụ: cấm cài `lodash` hay `moment`; phải dùng hàm gốc của ES2023+ hoặc viết hàm toán học Vector 12D thuần túy).
   - Giữ cố định phiên bản trong `package.json` và luôn đồng bộ lockfile (`package-lock.json` / `pnpm-lock.yaml`).
