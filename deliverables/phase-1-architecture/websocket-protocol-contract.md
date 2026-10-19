# 📡 HỢP ĐỒNG GIAO THỨC WEBSOCKET (WEBSOCKET PROTOCOL CONTRACT)
*(Valkyrie Protocol: Zero • Phase 1 Deliverable • Chuẩn giao tiếp Client - Server)*

---

## 1. CẤU TRÚC PHIÊN KẾT NỐI & HANDSHAKE

- **Endpoint:** `ws://localhost:4000/ws` (hoặc `wss://domain/ws` trên production).
- **Authentication:** JWT Token truyền qua query parameter `?token=...` hoặc message handshake ban đầu.

---

## 2. DANH MỤC GÓI TIN TỪ CLIENT GỬI LÊN SERVER (C2S MESSAGES)

Tất cả các gói tin đều có kiểu dữ liệu tường minh kế thừa từ `packages/shared-domain`:

### 2.1. `C2S_SELECT_BUFF`
Gửi lựa chọn Buff trong 20s đầu trận:
```typescript
export interface C2SSelectBuffPayload {
  readonly matchId: string;
  readonly playerId: string;
  readonly buffId: string; // Phải thuộc danh mục 9 Buff hợp lệ
}
```

### 2.2. `C2S_UPDATE_FORMATION`
Cập nhật vị trí xếp quân cờ thời gian thực trong giai đoạn chuẩn bị:
```typescript
export interface C2SUpdateFormationPayload {
  readonly matchId: string;
  readonly playerId: string;
  readonly formation: ReadonlyArray<{
    readonly valkyrieId: string;
    readonly slotIndex: number; // 0..8 (Lưới 3x3)
  }>; // Độ dài mảng tối đa 6
}
```

### 2.3. `C2S_LOCK_FORMATION`
Khóa đội hình sớm (Ready để bắt đầu giao tranh):
```typescript
export interface C2SLockFormationPayload {
  readonly matchId: string;
  readonly playerId: string;
}
```

---

## 3. DANH MỤC GÓI TIN TỪ SERVER ĐẨY VỀ CLIENT (S2C MESSAGES)

### 3.1. `S2C_MATCH_INIT`
Khởi tạo ván đấu, cung cấp danh sách 9 Buff ngẫu nhiên đối xứng:
```typescript
export interface S2CMatchInitPayload {
  readonly matchId: string;
  readonly opponentProfile: {
    readonly id: string;
    readonly displayName: string;
    readonly rankRating: number;
  };
  readonly availableBuffs: ReadonlyArray<BuffDefinition>; // Chính xác 9 Buff
  readonly draftTimeoutSeconds: number; // 20
}
```

### 3.2. `S2C_COMBAT_SNAPSHOT` (20 Ticks/giây - 50ms interval)
Server phát sóng trạng thái chiến trường thời gian thực cho Client nội suy diễn hoạt:
```typescript
export interface S2CCombatSnapshotPayload {
  readonly matchId: string;
  readonly tick: number;
  readonly timestamp: number;
  readonly entities: ReadonlyArray<{
    readonly id: string;
    readonly ownerId: string;
    readonly currentHp: number;
    readonly maxHp: number;
    readonly currentMana: number;
    readonly maxMana: number; // 100
    readonly clothDamageTier: 1 | 2 | 3; // 1: Pristine, 2: Torn, 3: Climax Extreme
    readonly position: { readonly x: number; readonly y: number };
    readonly activeBuffIds: ReadonlyArray<string>;
  }>;
  readonly events: ReadonlyArray<CombatEventItem>; // Sát thương, Hiệu ứng Cloth Damage, Climax Cut-in
}
```

### 3.3. `S2C_MATCH_RESULT`
Kết thúc Round hoặc Match BO3/BO5:
```typescript
export interface S2CMatchResultPayload {
  readonly matchId: string;
  readonly winnerPlayerId: string;
  readonly finalScores: Record<string, number>;
  readonly roundSummary: {
    readonly totalDamageDealt: number;
    readonly totalClothTearTriggers: number;
    readonly climaxUltimateCount: number;
  };
}
```
