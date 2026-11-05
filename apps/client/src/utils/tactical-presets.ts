import { UnitPlacement } from '@valkyrie/shared-domain';

export type TacticalPresetType = 'VANGUARD' | 'FLANK' | 'BUNKER';

/**
 * Standard esports tactical formation presets for 3x3 Auto-Battler.
 * Các mẫu bố trí đội hình chiến thuật chuẩn Esports cho bàn cờ 3x3.
 */
export const TACTICAL_PRESETS: Readonly<Record<TacticalPresetType, readonly UnitPlacement[]>> = {
  VANGUARD: [
    { valkyrieId: 'VALK-01', slotIndex: 1 },
    { valkyrieId: 'VALK-02', slotIndex: 0 },
    { valkyrieId: 'VALK-07', slotIndex: 2 }
  ],
  FLANK: [
    { valkyrieId: 'VALK-03', slotIndex: 3 },
    { valkyrieId: 'VALK-11', slotIndex: 1 },
    { valkyrieId: 'VALK-12', slotIndex: 5 }
  ],
  BUNKER: [
    { valkyrieId: 'VALK-02', slotIndex: 1 },
    { valkyrieId: 'VALK-04', slotIndex: 6 },
    { valkyrieId: 'VALK-05', slotIndex: 8 }
  ]
};
