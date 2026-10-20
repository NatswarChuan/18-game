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
 * 2-Sided Cyberpunk Esports Arena GameBoard (V2 Zero-Clutter Hologram Grid).
 * Đấu trường 3x3 đối kháng chuẩn Esports Auto-Battler: Không chữ thừa, Bệ Hologram 52px.
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
  const opponentRows: { slots: SlotIndex[] }[] = [
    { slots: [6, 7, 8] },
    { slots: [3, 4, 5] },
    { slots: [0, 1, 2] }
  ];

  // Player rows: Frontline (center), Midline, Backline (bottom)
  const playerRows: { slots: SlotIndex[]; glyph: string; color: string }[] = [
    { slots: [0, 1, 2], glyph: '🛡️ +15% MANA', color: 'text-[#FFD700]' },
    { slots: [3, 4, 5], glyph: '⚡ +10% TỐC ĐÁNH', color: 'text-[#00F0FF]' },
    { slots: [6, 7, 8], glyph: '🎯 +1 TẦM BẮN', color: 'text-[#FF2A85]' }
  ];

  return (
    <div className="w-full max-w-[460px] flex flex-col justify-center gap-1 mx-auto select-none py-1">
      {/* 1. Opponent Sector (Top 3x3 Hologram Grid) */}
      <div className="flex flex-col gap-1 p-1 rounded-xl border border-red-500/20 bg-red-950/10 relative">
        <div className="flex items-center justify-between text-[9px] font-mono px-1">
          <span className="text-red-400 font-bold flex items-center gap-1">
            <span>🛡️</span> SECTOR ĐỐI PHƯƠNG
          </span>
          <span className="text-red-500/60 font-mono">
            {isCombatActive ? '⚡ KÍCH HOẠT GIAO TRANH' : '🔒 RADAR FOG-OF-WAR'}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {opponentRows.map((row, rIdx) => (
            <div key={`opp_row_${rIdx}`} className="grid grid-cols-3 gap-1.5">
              {row.slots.map((slotIndex) => {
                const oppUnit = getOpponentPlacement(slotIndex);
                const entity = isCombatActive ? getEntityForSlot(slotIndex, true) : undefined;

                if (!isCombatActive) {
                  // Shrouded in Hologram Crimson Radar Grid
                  return (
                    <div
                      key={`opp_${slotIndex}`}
                      className="h-[52px] rounded-lg hologram-pad-enemy flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                      <span className="text-[10px] font-mono text-red-500/50 font-bold">
                        ⬡ Ô {slotIndex + 1}
                      </span>
                    </div>
                  );
                }

                // In Combat: Render Opponent Unit or empty slot
                return (
                  <div
                    key={`opp_${slotIndex}`}
                    className="h-[52px] rounded-lg border border-red-500/20 bg-black/40 flex items-center justify-center p-0.5 relative"
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
                      <span className="text-[8px] font-mono text-gray-600">Trống</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Central Clash Laser Beam (18px) */}
      <div className="h-4.5 my-0.5 px-3 rounded-full clash-laser-beam flex items-center justify-between shadow-[0_0_12px_rgba(0,240,255,0.3)]">
        <span className="text-[9px] font-mono text-red-400 font-bold tracking-wide">
          {isCombatActive ? '⚔️ GIAO TRANH' : '1v1 ESPORTS'}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF2A85] animate-ping" />
          <span className="font-display font-black text-[10px] text-white tracking-widest uppercase">
            ⚡ CHIẾN TUYẾN 20HZ ⚡
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
        </div>
        <span className="text-[9px] font-mono text-[#00F0FF] font-bold">
          {playerFormation.length}/6 QUÂN
        </span>
      </div>

      {/* 3. Player Sector (Bottom 3x3 Hologram Grid) */}
      <div className="flex flex-col gap-1 p-1 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 relative">
        <div className="flex items-center justify-between text-[9px] font-mono px-1">
          <span className="text-[#00F0FF] font-bold flex items-center gap-1">
            <span>⚔️</span> SECTOR CỦA BẠN
          </span>
          <span className="text-gray-400">
            Nhấp hoặc thả quân vào bệ
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {playerRows.map((row, rIdx) => (
            <div key={`player_row_${rIdx}`} className="grid grid-cols-3 gap-1.5">
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
                    className={`h-[52px] rounded-lg hologram-pad flex items-center justify-center p-0.5 relative transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-[#00F0FF] bg-[#00F0FF]/25 shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                        : placement
                        ? 'border-white/20 bg-white/5 hover:border-white/40'
                        : 'border-dashed border-white/20 hover:border-[#00F0FF]/60 hover:bg-[#00F0FF]/10'
                    }`}
                  >
                    {/* Header Marker inside empty slot */}
                    {!placement && (
                      <div className="w-full px-2 flex items-center justify-between text-[8px] font-mono text-gray-500 pointer-events-none">
                        <span>Ô {slotIndex + 1}</span>
                        <span className={row.color}>{row.glyph}</span>
                      </div>
                    )}

                    {placement && (
                      <ValkyrieCard
                        valkyrieId={placement.valkyrieId}
                        entity={entity}
                        isEnemy={false}
                        onInspect={onInspect}
                        compact={true}
                      />
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
