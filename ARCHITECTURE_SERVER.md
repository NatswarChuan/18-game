# 🛡️ NESTJS SERVER-AUTHORITATIVE ARCHITECTURE & NOSQL DATABASE SPEC
*(Zero Client Trust • NestJS 100% TypeScript • MongoDB NoSQL & Redis • Deterministic 20 Ticks/s Simulation)*

---

## 🏛️ 1. TRIẾT LÝ "ZERO CLIENT TRUST" TRÊN NỀN TẢNG NESTJS

Trong **Valkyrie Protocol: Zero**, toàn bộ logic định đoạt thắng thua, đếm thời gian, tính toán sát thương, phân bổ Buff và lưu trữ dữ liệu nằm **100% trên Server NestJS**:
1. **Client Chỉ Là Đầu Cuối Hiển Thị (Dumb Terminal):**
   - Client Expo không được phép tự tính toán HP, không quyết định quân nào bị đánh, và không tự sinh kết quả trận đấu.
   - Client chỉ gửi các Intent của người chơi (`SELECT_BUFF`, `UPDATE_PLACEMENT`, `LOCK_IN`) qua WebSocket Gateway của NestJS và tiếp nhận dòng sự kiện `CombatEventSnapshot` đã được xác thực.
2. **Che Giấu Thông Tin Tuyệt Đối (Fog of Placement):**
   - Trong giai đoạn xếp đội hình 3x3 (`PLACEMENT_PHASE - 20s`), tọa độ 6 Valkyrie của Người chơi 1 được Server giữ kín và không bao giờ gửi sang Client của Người chơi 2 (và ngược lại).
   - Chỉ khi cả hai người chơi cùng bấm Khóa đội hình (`LOCK_IN`) hoặc khi đồng hồ đếm ngược 20 giây kết thúc, Gateway mới giải phóng thông tin và đồng loạt gửi dữ liệu vị trí cho cả hai bên.
3. **Mô Phỏng Xác Định (Deterministic Combat Engine 20 Ticks/s):**
   - Vòng lặp giao tranh chạy cố định **20 Ticks/giây (50ms/tick)** được quản lý bởi `CombatEngineService`.
   - Sử dụng Pseudo-Random Generator (PRNG) có Seed xác định gắn kèm trong gói tin `COMBAT_START`.

---

## 🏗️ 2. KIẾN TRÚC MÔ-ĐUN NESTJS (NESTJS MODULAR ARCHITECTURE)

Ứng dụng Server (`apps/server`) được tổ chức theo chuẩn Enterprise NestJS với Dependency Injection:

```
apps/server/src/
├── app.module.ts                    # Root Module kết nối toàn bộ hệ thống
├── main.ts                          # Bootstrap Fastify/Express + WebSocket Adapter
├── modules/
│   ├── combat-engine/               # [Cốt Lõi] Vòng lặp 20 ticks/s & 12D Vector Math
│   │   ├── combat-engine.service.ts # 50ms Tick Simulation Loop
│   │   ├── vector-draft.service.ts  # Thuật toán 12D Vector 3-3-3 History Allocation
│   │   └── combat-engine.module.ts
│   ├── game-room/                   # Quản lý vòng đời phòng đấu BO3/BO5
│   │   ├── game-room.gateway.ts     # @WebSocketGateway() xử lý gói tin realtime
│   │   ├── game-room.service.ts     # State Machine (Draft -> Placement -> Combat)
│   │   └── game-room.module.ts
│   ├── matchmaking/                 # Hàng đợi ghép trận 1v1 PvP
│   │   ├── matchmaking.service.ts
│   │   └── matchmaking.module.ts
│   ├── database/                    # Tầng dữ liệu NoSQL (MongoDB + Redis)
│   │   ├── schemas/                 # Mongoose NoSQL Schemas
│   │   │   ├── player.schema.ts     # Tài khoản, MMR, Bộ sưu tập Waifu
│   │   │   └── match-history.schema.ts # Lịch sử trận đấu, Vector Buffs, MVP
│   │   ├── repositories/            # Repository Pattern (Port & Adapter)
│   │   │   ├── in-memory-room.repo.ts # [Local Fallback] Lưu RAM khi chạy local
│   │   │   ├── redis-room.repo.ts     # [Production] Cụm Redis phân tán
│   │   │   └── mongo-player.repo.ts   # [Persistence] Lưu trữ MongoDB NoSQL
│   │   └── database.module.ts
│   └── auth/                        # Xác thực JWT & Guard bảo mật
│       ├── guards/ws-jwt.guard.ts   # Kiểm tra Token trên từng kết nối WebSocket
│       └── auth.module.ts
```

---

## 🗄️ 3. THIẾT KẾ CƠ SỞ DỮ LIỆU NOSQL (MONGODB & REDIS)

Vì đặc thù game chiến thuật có dữ liệu trận đấu phi cấu trúc (danh sách Buffs tích lũy động, ma trận tọa độ bàn cờ, chuỗi sự kiện combat), **NoSQL (MongoDB)** là sự lựa chọn tối ưu về hiệu năng và tính linh hoạt:

### 3.1. Mongoose Schema: `Player` (Hồ Sơ & Bộ Sưu Tập Waifu)
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ default: 1000 })
  eloRating: number;

  @Prop({ type: [String], default: ['VALK_01', 'VALK_02', 'VALK_03'] })
  unlockedWaifuIds: string[];

  @Prop({ type: Object, default: {} })
  stats: {
    totalMatches: number;
    wins: number;
    winrate: number;
    mvpCount: number;
  };
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
```

### 3.2. Mongoose Schema: `MatchHistory` (Lịch Sử Loạt Trận BO3/BO5)
```typescript
@Schema({ timestamps: true })
export class MatchHistory {
  @Prop({ required: true, index: true })
  seriesId: string;

  @Prop({ required: true })
  format: 'BO3' | 'BO5';

  @Prop({ required: true })
  player1Id: string;

  @Prop({ required: true })
  player2Id: string;

  @Prop({ required: true })
  winnerId: string;

  @Prop({ type: [Number] }) // [2, 1]
  finalScore: number[];

  @Prop({ type: Array }) // Lưu vết các vector 12D buff được chọn từng round
  p1BuffVectors: number[][];

  @Prop({ type: Array })
  p2BuffVectors: number[][];

  @Prop({ type: String })
  mvpWaifuId: string;
}

export const MatchHistorySchema = SchemaFactory.createForClass(MatchHistory);
```

### 3.3. Tầng Dữ Liệu Tạm Thời (Ephemeral In-Memory / Redis):
- **Trạng thái phòng đấu tức thời (`MatchRoomState`):** Lưu trữ trong RAM (Local) hoặc Redis Hashes (Production) để đảm bảo tốc độ đọc/ghi $< 1\text{ms}$.
- Khi kết thúc loạt trận (`SERIES_CONCLUDED`), kết quả tổng kết mới được ghi vào MongoDB để giải phóng RAM/Redis.

---

## 📡 4. ĐẶC TẢ GIAO THỨC WEBSOCKET GATEWAY TRONG NESTJS

Được hiện thực qua `@WebSocketGateway()` với 100% Strict TypeScript:

```typescript
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/ws',
})
export class GameRoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('SELECT_BUFF')
  handleSelectBuff(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SelectBuffDto,
  ): void {
    // Xử lý Command chọn 1 trong 9 Buff trong 20s
  }

  @SubscribeMessage('UPDATE_PLACEMENT')
  handleUpdatePlacement(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: UpdatePlacementDto,
  ): void {
    // Cập nhật vị trí 6 quân cờ (Fog of Placement)
  }

  @SubscribeMessage('LOCK_IN')
  handleLockIn(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LockInDto,
  ): void {
    // Khóa đội hình và bắt đầu giao tranh nếu cả 2 bên đã khóa
  }
}
```

---

## 🛡️ 5. CHỐT CHẶN BẢO VỆ & VALIDATION INVARIANTS TRÊN NESTJS

1. **Validation Pipe Toàn Cục (`ValidationPipe`):** Mọi DTO gửi lên qua REST API hay WebSocket đều được kiểm tra bằng `class-validator` và `class-transformer`.
2. **Kiểm Tra Tính Hợp Lệ Của Bàn Cờ 3x3:**
   - **Số lượng quân cờ:** Chính xác `count === 6`.
   - **Tọa độ ô:** Thuộc tập hợp $\{1, 2, 3, 4, 5, 6, 7, 8, 9\}$.
   - **Không trùng ô:** Không có 2 quân cờ nào đứng chung một ô.
   - **Ô trống chiến thuật:** Luôn có chính xác $9 - 6 = 3$ ô trống.
3. **Phòng Chống Rò Rỉ Tài Nguyên (Memory Leak Prevention):**
   - Khi loạt trận kết thúc (`SERIES_CONCLUDED`) hoặc người chơi mất kết nối quá thời gian, Service kích hoạt `room.dispose()`:
     - Hủy toàn bộ `setInterval` của combat loop (20 ticks/s).
     - Xóa trạng thái phòng đấu khỏi Redis / RAM.
     - Đóng các socket liên quan để trả lại tài nguyên cho hệ thống.
