import React from 'react';
import {
  CombatEntitySnapshot,
  GRID_SLOT_BEHAVIORS,
  SlotIndex,
  UnitPlacement
} from '@valkyrie/shared-domain';
import { ValkyrieCard } from './ValkyrieCard.js';

interface GameBoardProps {
  readonly playerFormation: readonly UnitPlacement[];
  readonly opponentFormation: readonly UnitPlacement[];
  readonly combatEntities: readonly CombatEntitySnapshot[];
  readonly isCombatActive: boolean;
  readonly onSlotClick?: (slotIndex: SlotIndex) => void;
  readonly onDropValkyrie?: (valkyrieId: string, slotIndex: SlotIndex) => void;
  readonly onInspect?: ((valkyrieId: string) => void) | undefined;
  readonly selectedSlotIndex?: SlotIndex | null;
}

/**
 * 2-Sided Cyberpunk Arena GameBoard (Fixed Web Game Viewport).
 * Đấu trường chiến thuật 2 phía đối kháng chuẩn Web Game / Mobile Game.
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  playerFormation,
  opponentFormation,
  combatEntities,
  isCombatActive,
  onSlotClick,
  onDropValkyrie,
  onInspect,
  selectedSlotIndex
}) => {
  const getPlayerPlacement = (slot: SlotIndex) => {
    return playerFormation.find((p) => p.slotIndex === slot);
  };

  const getOpponentPlacement = (slot: SlotIndex) => {
    return opponentFormation.find((p) => p.slotIndex === slot);
  };

  const getEntityForSlot = (slot: SlotIndex, isEnemy: boolean) => {
    return combatEntities.find(
      (e) => e.slotIndex === slot && (isEnemy ? e.ownerId !== 'player_me' : e.ownerId === 'player_me')
    );
  };

  // Opponent rows: Backline (top), Midline, Frontline (facing center clash line)
  const opponentRows: { title: string; slots: SlotIndex[] }[] = [
    { title: 'ĐỐI THỦ • HÀNG 3 (TRÙNG PHÁO)', slots: [6, 7, 8] },
    { title: 'ĐỐI THỦ • HÀNG 2 (ĐỘT KÍCH)', slots: [3, 4, 5] },
    { title: 'ĐỐI THỦ • HÀNG 1 (TIÊN PHONG)', slots: [0, 1, 2] }
  ];

  // Player rows: Frontline (center), Midline, Backline (bottom)
  const playerRows: { title: string; slots: SlotIndex[]; bonus: string; color: string }[] = [
    { title: 'BẠN • HÀNG 1 (TIÊN PHONG)', slots: [0, 1, 2], bonus: '+15% MANA GÁNH CHỊU', color: 'text-[#FFD700]' },
    { title: 'BẠN • HÀNG 2 (ĐỘT KÍCH)', slots: [3, 4, 5], bonus: '+10% TỐC ĐỘ ĐÁNH', color: 'text-[#00F0FF]' },
    { title: 'BẠN • HÀNG 3 (TRÙNG PHÁO)', slots: [6, 7, 8], bonus: '+1 TẦM BẮN XẠ THỦ', color: 'text-[#FF2A85]' }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between max-w-4xl mx-auto px-2 select-none">
      {/* 1. Opponent Sector (Top Grid) */}
      <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-red-500/20 bg-red-950/10 relative">
        <div className="flex items-center justify-between text-[10px] font-mono px-1">
          <span className="text-red-400 font-bold flex items-center gap-1.5">
            <span>🛡️</span> CHIẾN TUYẾN ĐỐI PHƯƠNG
          </span>
          <span className="text-gray-400">
            {isCombatActive ? '🔴 ĐÃ PHÁ GIẢI SƯƠNG MÙ' : '🔒 SƯƠNG MÙ BẢO VỆ (FOG OF WAR)'}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {opponentRows.map((row) => (
            <div key={row.title} className="grid grid-cols-3 gap-2">
              {row.slots.map((slotIndex) => {
                const oppUnit = getOpponentPlacement(slotIndex);
                const entity = isCombatActive ? getEntityForSlot(slotIndex, true) : undefined;

                if (!isCombatActive) {
                  // Shrouded in Fog of War
                  return (
                    <div
                      key={`opp_${slotIndex}`}
                      className="h-[74px] rounded-lg border border-red-500/15 bg-black/40 flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(#FF3344_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                      <span className="text-base text-red-500/40 mb-0.5">🔒</span>
                      <span className="text-[9px] font-mono text-red-400/60 font-bold uppercase tracking-widest">
                        Ô {slotIndex + 1}
                      </span>
                    </div>
                  );
                }

                // In Combat: Render Opponent Unit or empty slot
                return (
                  <div
                    key={`opp_${slotIndex}`}
                    className="h-[74px] rounded-lg border border-red-500/20 bg-black/30 flex items-center justify-center p-1 relative"
                  >
                    {oppUnit ? (
                      <ValkyrieCard
                        valkyrieId={oppUnit.valkyrieId}
                        entity={entity}
                        isEnemy={true}
                        onInspect={onInspect}
                        compact={true}
                      />
                    ) : (
                      <span className="text-[9px] font-mono text-gray-600">Trống</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Central Clash Line / Energy Beam */}
      <div className="my-1.5 py-1 px-3 rounded-lg border border-white/10 bg-black/40 flex items-center justify-between shadow-[0_0_15px_rgba(255,42,133,0.15)]">
        <span className="text-[10px] font-mono text-red-400 font-bold">
          {isCombatActive ? '⚔️ TẤN CÔNG DIỆN RỘNG' : 'CHỜ ĐỐI THỦ'}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF2A85] animate-ping" />
          <span className="font-display font-black text-xs text-white tracking-widest uppercase">
            ⚡ CHIẾN TUYẾN GIAO TRANH 20HZ ⚡
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
        </div>
        <span className="text-[10px] font-mono text-[#00F0FF] font-bold">
          {playerFormation.length}/6 QUÂN BỐ TRÍ
        </span>
      </div>

      {/* 3. Player Sector (Bottom Grid) */}
      <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 relative">
        <div className="flex items-center justify-between text-[10px] font-mono px-1">
          <span className="text-[#00F0FF] font-bold flex items-center gap-1.5">
            <span>⚔️</span> CHIẾN TUYẾN CỦA BẠN (3x3 TACTICAL GRID)
          </span>
          <span className="text-gray-400">
            Kéo thả hoặc nhấp để bố trí quân vào ô cờ
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {playerRows.map((row) => (
            <div key={row.title} className="grid grid-cols-3 gap-2">
              {row.slots.map((slotIndex) => {
                const placement = getPlayerPlacement(slotIndex);
                const entity = isCombatActive ? getEntityForSlot(slotIndex, false) : undefined;
                const isSelected = selectedSlotIndex === slotIndex;
                const behavior = GRID_SLOT_BEHAVIORS[slotIndex];

                return (
                  <div
                    key={`player_${slotIndex}`}
                    title={`Ô ${slotIndex + 1} (${behavior.rowType}): Mana +${behavior.manaGainOnDamageBonus * 100}%, Tốc Đánh +${behavior.attackSpeedBonus * 100}%, Tầm +${behavior.rangeBonus}`}
                    onClick={() => onSlotClick && onSlotClick(slotIndex)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const valkId = e.dataTransfer.getData('text/plain');
                      if (valkId && onDropValkyrie) {
                        onDropValkyrie(valkId, slotIndex);
                      }
                    }}
                    className={`h-[74px] rounded-lg border flex items-center justify-center p-1 relative transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-[#00F0FF] bg-[#00F0FF]/20 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                        : placement
                        ? 'border-white/20 bg-white/5 hover:border-white/40'
                        : 'border-dashed border-white/20 bg-black/40 hover:border-[#00F0FF]/60 hover:bg-[#00F0FF]/10'
                    }`}
                  >
                    {/* Header Marker inside empty slot */}
                    {!placement && (
                      <div className="absolute top-1 left-2 right-2 flex items-center justify-between text-[8px] font-mono text-gray-500 pointer-events-none">
                        <span>Ô {slotIndex + 1}</span>
                        <span className={row.color}>{row.bonus}</span>
                      </div>
                    )}

                    {placement ? (
                      <ValkyrieCard
                        valkyrieId={placement.valkyrieId}
                        entity={entity}
                        isEnemy={false}
                        onInspect={onInspect}
                        compact={true}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500 pt-2">
                        <span className="text-base leading-none text-gray-600">+</span>
                        <span className="text-[9px] font-mono text-gray-400 mt-0.5">Đặt Quân</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
