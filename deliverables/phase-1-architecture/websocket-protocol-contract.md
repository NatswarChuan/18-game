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

### 2.4. `C2S_RECONNECT`
Yêu cầu tái đồng bộ trạng thái khi Client bị rớt mạng hoặc reload trình duyệt:
```typescript
export interface C2SReconnectPayload {
  readonly matchId: string;
  readonly playerId: string;
  readonly sessionToken: string;
}
```

---

## 3. DANH MỤC GÓI TIN TỪ SERVER ĐẨY VỀ CLIENT (S2C MESSAGES)

### 3.1. `S2C_MATCH_INIT`
Khởi tạo phòng đấu BO3 / BO5 và thông tin đối thủ:
```typescript
export interface S2CMatchInitPayload {
  readonly matchId: string;
  readonly format: 'BO3' | 'BO5';
  readonly targetWins: number; // 2 (BO3) hoặc 3 (BO5)
  readonly opponentProfile: {
    readonly id: string;
    readonly displayName: string;
    readonly rankRating: number;
    readonly avatarWaifuId: string;
  };
}
```

### 3.2. `S2C_ROUND_DRAFT_START`
Thông báo bắt đầu pha Draft 9 Buff cho từng Round đấu trong chuỗi BO3/BO5:
```typescript
export interface S2CRoundDraftStartPayload {
  readonly matchId: string;
  readonly roundNumber: number; // 1, 2, 3, 4, 5
  readonly seriesScore: {
    readonly playerWins: number;
    readonly opponentWins: number;
  };
  readonly draftTimeoutSeconds: number; // Mặc định 20 giây
  readonly personalizedBuffs: ReadonlyArray<BuffDefinition>; // Chính xác 9 Buffs (3-3-3: Synergy, Counter, Decisive)
  readonly historyAccumulationDepth: number; // Số buff đã tích lũy từ các round trước
}
```

### 3.3. `S2C_PREPARATION_START`
Bắt đầu 20 giây xếp cờ 3x3 dưới sương mù che giấu (*Fog of Placement*):
```typescript
export interface S2CPreparationStartPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly timeoutSeconds: number; // 20 giây
  readonly playerChosenBuffId: string; // Xác nhận buff đã chọn
}
```

### 3.4. `S2C_COMBAT_START`
Khai hỏa giao tranh tự động, vén màn sương mù (*Fog Lifted*), công bố đội hình 2 bên và Random Seed:
```typescript
export interface S2CCombatStartPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly randomSeed: number; // PRNG Seed phục vụ mô phỏng xác định
  readonly playerFormation: ReadonlyArray<{
    readonly valkyrieId: string;
    readonly slotIndex: number; // 0..8
  }>;
  readonly opponentFormation: ReadonlyArray<{
    readonly valkyrieId: string;
    readonly slotIndex: number; // 0..8 (đã giải mã sau Fog of Placement)
  }>;
  readonly activeBuffs: {
    readonly playerBuffIds: ReadonlyArray<string>;
    readonly opponentBuffIds: ReadonlyArray<string>;
  };
}
```

### 3.5. `S2C_COMBAT_SNAPSHOT` (20 Ticks/giây - 50ms interval)
Server phát sóng trạng thái chiến trường thời gian thực cho Client nội suy diễn hoạt:
```typescript
export interface S2CCombatSnapshotPayload {
  readonly matchId: string;
  readonly roundNumber: number;
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

### 3.6. `S2C_ROUND_RESULT`
Kết thúc một ván đấu đơn lẻ trong chuỗi BO3/BO5:
```typescript
export interface S2CRoundResultPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly winnerPlayerId: string | null; // null nếu hòa do hết 60s
  readonly updatedSeriesScore: {
    readonly playerWins: number;
    readonly opponentWins: number;
  };
  readonly nextState: 'BUFF_DRAFTING' | 'MATCH_ENDED';
  readonly roundSummary: {
    readonly totalDamageDealt: number;
    readonly totalClothTearTriggers: number;
    readonly climaxUltimateCount: number;
  };
}
```

### 3.7. `S2C_MATCH_RESULT`
Kết thúc toàn bộ chuỗi trận BO3/BO5 khi một bên chạm ngưỡng 2 hoặc 3 ván thắng:
```typescript
export interface S2CMatchResultPayload {
  readonly matchId: string;
  readonly championPlayerId: string;
  readonly finalScores: {
    readonly playerWins: number;
    readonly opponentWins: number;
  };
  readonly mvpWaifuId: string;
  readonly mmrDelta: number;
}
```

### 3.8. `S2C_SYNC_STATE` (Phục Hồi Trạng Thái Mất Kết Nối)
Đồng bộ hóa tức thời toàn bộ trạng thái phòng đấu khi người chơi kết nối lại:
```typescript
export interface S2CSyncStatePayload {
  readonly matchId: string;
  readonly currentPhase: 'BUFF_DRAFTING' | 'FORMATION_PLACEMENT' | 'BATTLE_SIMULATION' | 'ROUND_EVALUATION';
  readonly remainingSecondsInPhase: number;
  readonly roundNumber: number;
  readonly seriesScore: {
    readonly playerWins: number;
    readonly opponentWins: number;
  };
  readonly myAccumulatedBuffs: ReadonlyArray<string>;
  readonly opponentAccumulatedBuffs: ReadonlyArray<string>;
  readonly currentDraftPool?: ReadonlyArray<BuffDefinition>; // Nếu đang trong BUFF_DRAFTING
  readonly currentFormation?: ReadonlyArray<{ readonly valkyrieId: string; readonly slotIndex: number }>;
}
```
