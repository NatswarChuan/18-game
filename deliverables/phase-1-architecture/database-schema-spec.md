# 🗄️ ĐẶC TẢ CƠ SỞ DỮ LIỆU NOSQL & VECTOR DB (DATABASE SCHEMA SPECIFICATION)
*(Valkyrie Protocol: Zero • Phase 1 Deliverable • MongoDB, Redis, Vector DB & In-Memory Fallbacks)*

---

## 1. MÔ HÌNH DỮ LIỆU ĐA TẦNG TỔNG THỂ (HYBRID NOSQL & VECTOR ARCHITECTURE)

Hệ thống sử dụng mô hình kết hợp 3 trụ cột dữ liệu:
- **MongoDB (Persistent Storage):** Quản lý hồ sơ người chơi (`Player`), lịch sử trận đấu (`MatchHistory`), và bộ sưu tập Waifu (`ValkyrieInventory`).
- **Redis (Real-time Cache & Pub/Sub):** Quản lý trạng thái phòng đấu (`RoomState`), session người dùng và hàng đợi ghép trận (`MatchmakingQueue`).
- **Vector DB (Tactical Buff Embeddings & kNN Selection):** Lưu trữ 243 vector đặc trưng 12 chiều của hệ thống Buff, hỗ trợ tuyển chọn 9 Buff thích ứng siêu tốc qua k-Nearest Neighbors cho cả 2 thể thức BO3 và BO5.
- **In-Memory Store Fallbacks:** Hệ thống tự trị chạy 100% trên RAM khi chạy Local (`USE_IN_MEMORY_STORE=true` và `USE_IN_MEMORY_VECTOR_DB=true`), hoàn toàn không cần cài đặt MongoDB, Redis hay Qdrant bên ngoài.

---

## 2. MONGOOSE SCHEMAS (MONGODB)

### 2.1. `PlayerSchema`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true, collection: 'players' })
export class Player {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 1000, index: true })
  eloRating: number;

  @Prop({ default: 0 })
  totalWins: number;

  @Prop({ default: 0 })
  totalMatches: number;

  @Prop({ type: [String], default: [] })
  unlockedValkyrieIds: string[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
```

### 2.2. `MatchHistorySchema`
```typescript
@Schema({ timestamps: true, collection: 'match_histories' })
export class MatchHistory {
  @Prop({ required: true, index: true })
  matchId: string;

  @Prop({ type: [String], required: true })
  playerIds: string[];

  @Prop({ required: true })
  winnerId: string;

  @Prop({ type: String, enum: ['BO3', 'BO5'], default: 'BO3' })
  matchFormat: string;

  @Prop({ type: Object, required: true })
  finalFormationSnapshots: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  playerAChosenBuffIds: string[];

  @Prop({ type: [String], default: [] })
  playerBChosenBuffIds: string[];

  @Prop({ default: 0 })
  durationSeconds: number;
}
export const MatchHistorySchema = SchemaFactory.createForClass(MatchHistory);
```

---

## 3. REDIS DATA STRUCTURES & TTL
- `room:{matchId}` $\rightarrow$ Hash lưu trữ `hostId`, `guestId`, `state`, `format` (BO3/BO5), TTL: 1800 giây (30 phút).
- `queue:ranked:bo3` & `queue:ranked:bo5` $\rightarrow$ Sorted Set lưu `playerId` theo điểm `eloRating`.
- `inmemory:fallback` $\rightarrow$ JavaScript Map `<string, RoomSession>` với timer tự động hủy sau khi trận kết thúc để chống rò rỉ RAM.

---

## 4. VECTOR DATABASE ARCHITECTURE (QDRANT & IN-MEMORY VSS)

- **Collection:** `valkyrie_buff_embeddings` (Hỗ trợ quy mô tối thiểu $N \ge 243$ Buffs, mở rộng không giới hạn).
- **Vector Dimensions:** 12 chiều (Physical, Magic, Armor, Shield, Crit, Energy, CC, Spatial, Erotic, Synergy Depth, Counter Intensity, Decisive Impact).
- **Distance Metric:** Cosine Similarity (`distance: "Cosine"`).
- **Dual-Driver Implementation:**
  - `InMemoryVectorDatabaseService`: Chạy trực tiếp trong process Node.js, sử dụng mảng động $N \ge 243$ phần tử, tìm kiếm kNN $< 0.3\text{ms}$.
  - `QdrantVectorDatabaseService`: Kết nối qua `@qdrant/js-client-rest`, hỗ trợ phân tán khi scale cụm server.
- **Kế thừa chi tiết:** Xem tại [`../phase-3-buff-system/vector-db-buff-selection-spec.md`](../phase-3-buff-system/vector-db-buff-selection-spec.md).
