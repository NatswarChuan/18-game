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

  const getEntityForSlot = (slot: SlotIndex, isEnemy: boolean) => {
    return combatEntities.find(
      (e) => e.slotIndex === slot && (isEnemy ? e.ownerId !== 'player_me' : e.ownerId === 'player_me')
    );
  };

  const rows = [
    { title: 'FRONTLINE • TIÊN PHONG (+15% MANA KHI CHỊU SÁT THƯƠNG)', slots: [0, 1, 2] as SlotIndex[] },
    { title: 'MIDLINE • ĐỘT KÍCH (+10% TỐC ĐỘ ĐÁNH CHIẾN THUẬT)', slots: [3, 4, 5] as SlotIndex[] },
    { title: 'BACKLINE • TRÙNG PHÁO / YỂM TRỢ (+1 TẦM TẤN CÔNG)', slots: [6, 7, 8] as SlotIndex[] }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* 3x3 Tactical Grid */}
      <div className="glass-panel p-5 border border-white/10 relative">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-white">
              BÀN CỜ CHIẾN THUẬT 3x3
            </span>
            <span className="text-xs font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
              {playerFormation.length} / 6 QUÂN (3 Ô TRỐNG)
            </span>
          </div>
          <span className="font-mono text-xs text-gray-400">
            {isCombatActive ? '🔴 GIAO TRANH 20HZ (AUTO-COMBAT)' : '🟢 BỐ TRÍ ĐỘI HÌNH (SƯƠNG MÙ CHE GIẤU)'}
          </span>
        </div>

        {/* Rows Container */}
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row.title} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider pl-1">
                {row.title}
              </span>
              <div className="grid grid-cols-3 gap-3">
                {row.slots.map((slotIndex) => {
                  const placement = getPlayerPlacement(slotIndex);
                  const entity = isCombatActive ? getEntityForSlot(slotIndex, false) : undefined;
                  const isSelected = selectedSlotIndex === slotIndex;
                  const behavior = GRID_SLOT_BEHAVIORS[slotIndex];

                  return (
                    <div
                      key={slotIndex}
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
                      className={`min-h-[140px] rounded-xl border flex flex-col items-center justify-center p-2 relative transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                          : placement
                          ? 'border-white/20 bg-white/5 hover:border-white/40'
                          : 'border-dashed border-white/15 bg-black/20 hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/5'
                      }`}
                    >
                      {/* Slot Header Marker with Tactical Bonus */}
                      <div className="absolute top-1.5 left-2 right-2 flex items-center justify-between font-mono text-[9px] pointer-events-none z-10">
                        <span className="text-gray-400 font-bold">Ô {slotIndex + 1}</span>
                        <span
                          className={`tracking-wider font-bold ${
                            behavior.rowType === 'FRONTLINE'
                              ? 'text-[#FFD700]'
                              : behavior.rowType === 'MIDLINE'
                              ? 'text-[#00F0FF]'
                              : 'text-[#FF2A85]'
                          }`}
                        >
                          {behavior.rowType === 'FRONTLINE'
                            ? '+15% NỘ MANA'
                            : behavior.rowType === 'MIDLINE'
                            ? '+10% TỐC ĐÁNH'
                            : '+1 TẦM BẮN'}
                        </span>
                      </div>

                      {placement ? (
                        <div className="w-full">
                          <ValkyrieCard
                            valkyrieId={placement.valkyrieId}
                            entity={entity}
                            isEnemy={false}
                            onInspect={onInspect}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-3 text-gray-500">
                          <span className="text-xl mb-1 text-gray-600">+</span>
                          <span className="text-[11px] font-mono text-gray-400">Ô Trống</span>
                          <span className="text-[9px] text-gray-500 mt-1">
                            {behavior.rowType}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opponent Units (Revealed when Combat starts) */}
      {isCombatActive && opponentFormation.length > 0 && (
        <div className="glass-panel p-4 border border-[#FF3344]/30 bg-[#FF3344]/5">
          <h4 className="font-display font-bold text-sm text-[#FF3344] mb-3 flex items-center gap-2">
            <span>⚔️</span> ĐỘI HÌNH ĐỐI THỦ (ĐÃ GIẢI MÃ SƯƠNG MÙ)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {opponentFormation.map((opp) => (
              <ValkyrieCard
                key={opp.valkyrieId}
                valkyrieId={opp.valkyrieId}
                entity={getEntityForSlot(opp.slotIndex, true)}
                isEnemy={true}
                onInspect={onInspect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
