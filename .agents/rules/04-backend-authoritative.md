---
trigger: glob
globs:
  - "apps/server/**"
  - "packages/shared-domain/**"
description: "Quy tắc Server-Authoritative 20 ticks/s, giải thuật 8D Vector đối xứng tuyệt đối, và phòng chống gian lận Zero Client Trust."
---

# QUY TẮC BACKEND & GAME ENGINE THỜI GIAN THỰC (SERVER-AUTHORITATIVE)

Khi viết hoặc sửa đổi mã nguồn Server hoặc Shared Domain:

1. **Triết Lý "Zero Client Trust":**
   - Không tin tưởng bất kỳ gói tin nào từ Client. Mọi payload phải được validate qua Zod Schema hoặc Type Predicate.
   - Giữ kín tọa độ đội hình của đối phương trong suốt 20 giây xếp cờ (*Fog of Placement*).
2. **Deterministic Combat Engine (20 Ticks/giây):**
   - Vòng lặp mô phỏng phải cố định đúng 50ms/tick.
   - Sử dụng các hàm toán học thuần túy (Pure Functions) và PRNG có Seed xác định.
   - Áp dụng Strategy Pattern hoặc Lookup Table bất biến (`Readonly<Record<SlotIndex, SlotBehavior>>`) cho 9 ô trên lưới 3x3, cấm lồng ghép quá nhiều `if/else`.
3. **Thuật Toán 8D Vector Equilibrium (2-2-2-3 Formula):**
   - Luôn kẹp mẫu số $\epsilon \ge 10^{-9}$ khi tính Cosine Similarity để ngăn chặn lỗi chia cho `0` (`NaN` propagation).
   - Đảm bảo độ lệch đối xứng của 2 Buff Synergy: $|\text{cos}(\vec{V}_{syn1}, \vec{P}_1) - \text{cos}(\vec{V}_{syn2}, \vec{P}_2)| \le 0.05$.
4. **Quản Lý Bộ Nhớ & Dọn Dẹp Tài Nguyên:**
   - Mọi `MatchRoom` khi kết thúc ván đấu phải gọi hàm `dispose()` để xóa sạch `setInterval` và tham chiếu trong bộ nhớ.
   - Giới hạn kích thước gói tin WebSocket $\le 16\text{KB}$ và giới hạn tần suất $\le 20\text{ actions/giây}$.
5. **Kiến Trúc NestJS & Cơ Sở Dữ Liệu NoSQL (MongoDB & Redis):**
   - Tuân thủ cấu trúc module của NestJS (`@Module()`, `@Injectable()`, `@WebSocketGateway()`).
   - Tầng lưu trữ bền vững sử dụng NoSQL (MongoDB qua `@nestjs/mongoose`); tầng tạm thời dùng Redis/RAM.
   - Luôn hỗ trợ cờ `USE_IN_MEMORY_STORE=true` để chạy độc lập trên máy local mà không cần database ngoài.
