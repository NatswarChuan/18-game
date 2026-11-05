import React, { useState } from 'react';
import { FactionId, GamePhase, SlotIndex, UnitPlacement, ValkyrieDefinition } from '@valkyrie/shared-domain';

export interface BottomDockRailProps {
  readonly benchFaction: FactionId | 'ALL';
  readonly onSelectBenchFaction: (faction: FactionId | 'ALL') => void;
  readonly onApplyPreset: (presetName: 'VANGUARD' | 'FLANK' | 'BUNKER') => void;
  readonly filteredValkyries: readonly ValkyrieDefinition[];
  readonly selectedBenchValkyrie: string | null;
  readonly onSelectBenchValkyrie: (valkyrieId: string | null) => void;
  readonly playerFormation: readonly UnitPlacement[];
  readonly phase: GamePhase;
  readonly isLockedIn: boolean;
  readonly isCombatActive: boolean;
  readonly onLockFormation: () => void;
  readonly onInspect: (valkyrieId: string) => void;
  readonly onHoverUnit?: ((valkyrieId: string | null, x: number, y: number) => void) | undefined;
  readonly onRecallSlot?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly onAutoDeploy?: ((valkyrieId: string) => void) | undefined;
  readonly onSelectSlot?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly selectedSlotIndex?: SlotIndex | null | undefined;
}

export const BottomDockRail: React.FC<BottomDockRailProps> = ({
  benchFaction,
  onSelectBenchFaction,
  onApplyPreset,
  filteredValkyries,
  selectedBenchValkyrie,
  onSelectBenchValkyrie,
  playerFormation,
  phase,
  isLockedIn,
  isCombatActive,
  onLockFormation,
  onInspect,
  onHoverUnit,
  onRecallSlot,
  onAutoDeploy,
  onSelectSlot,
  selectedSlotIndex
}) => {
  const [isDragOverDock, setIsDragOverDock] = useState(false);

  const isTargetSlotEmpty =
    selectedSlotIndex !== null &&
    selectedSlotIndex !== undefined &&
    !playerFormation.some((p) => p.slotIndex === selectedSlotIndex);

  return (
    <footer
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/x-source-slot')) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setIsDragOverDock(true);
        }
      }}
      onDragLeave={() => setIsDragOverDock(false)}
      onDrop={(e) => {
        setIsDragOverDock(false);
        const sourceSlotStr = e.dataTransfer.getData('application/x-source-slot');
        if (sourceSlotStr && onRecallSlot) {
          e.preventDefault();
          onRecallSlot(Number(sourceSlotStr) as SlotIndex);
        }
      }}
      className={`h-[84px] flex-shrink-0 floating-dock-rail rounded-2xl mb-2 px-3 py-1 flex items-center justify-between gap-3 z-20 transition-all ${
        isDragOverDock
          ? 'border-2 border-red-400 bg-red-950/40 shadow-[0_0_25px_rgba(239,68,68,0.5)]'
          : ''
      }`}
      style={{
        width: 'calc(100vw - 32px)',
        marginLeft: '16px',
        marginRight: '16px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Left: Minimalist Faction Chips & Quick Presets */}
      <div
        className="flex flex-col gap-1"
        style={{ flex: '0 0 130px', width: '130px', minWidth: '130px' }}
      >
        <div className="flex items-center gap-1">
          {(['ALL', 'NEO_VALHALLA', 'ABYSSAL_EDEN', 'SOL_DYNASTY'] as const).map((fac) => (
            <button
              key={fac}
              onClick={() => onSelectBenchFaction(fac)}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold transition-all ${
                benchFaction === fac
                  ? 'bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/60 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {fac === 'ALL'
                ? 'TẤT CẢ'
                : fac === 'NEO_VALHALLA'
                ? 'VAL'
                : fac === 'ABYSSAL_EDEN'
                ? 'EDEN'
                : 'SOL'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onApplyPreset('VANGUARD')}
            className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 hover:bg-[#FFD700]/20 border border-white/10 hover:border-[#FFD700] text-gray-300 hover:text-[#FFD700] transition-colors"
            title="3 Tiên phong"
          >
            🛡️ Tiên Phong
          </button>
          <button
            onClick={() => onApplyPreset('FLANK')}
            className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 hover:bg-[#FF2A85]/20 border border-white/10 hover:border-[#FF2A85] text-gray-300 hover:text-[#FF2A85] transition-colors"
            title="Đột kích sườn"
          >
            ⚡ Đột Kích
          </button>
        </div>
      </div>

      {/* Center: Horizontal Scrollable Reserve Valkyries */}
      <div
        className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-0.5"
        style={{ flex: '1 1 0px', minWidth: 0, overflowX: 'auto', overflowY: 'hidden' }}
      >
        {filteredValkyries.map((valk) => {
            const isSelected = selectedBenchValkyrie === valk.id;
            const isAlreadyPlaced = playerFormation.some((p) => p.valkyrieId === valk.id);
            const isSlotTargetable = isTargetSlotEmpty && !isAlreadyPlaced;
            const factionColor =
              valk.faction === 'NEO_VALHALLA'
                ? '#00F0FF'
                : valk.faction === 'ABYSSAL_EDEN'
                ? '#FF2A85'
                : '#FFD700';

            const placedUnit = playerFormation.find((p) => p.valkyrieId === valk.id);

            return (
              <div
                key={valk.id}
                draggable={!isAlreadyPlaced && !isCombatActive}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', valk.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => {
                  if (isAlreadyPlaced) {
                    if (placedUnit && onSelectSlot) {
                      onSelectSlot(placedUnit.slotIndex);
                    }
                    return;
                  }
                  onSelectBenchValkyrie(isSelected ? null : valk.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (!isAlreadyPlaced && !isCombatActive && onAutoDeploy) {
                    onAutoDeploy(valk.id);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (placedUnit && onRecallSlot && !isCombatActive) {
                    onRecallSlot(placedUnit.slotIndex);
                  }
                }}
                onMouseEnter={(e) => onHoverUnit && onHoverUnit(valk.id, e.clientX, e.clientY)}
                onMouseLeave={() => onHoverUnit && onHoverUnit(null, 0, 0)}
                className={`flex-shrink-0 p-1 rounded-xl border transition-all duration-150 cursor-grab active:cursor-grabbing flex items-center gap-1.5 w-[140px] h-[60px] relative select-none ${
                  isSelected
                    ? 'border-[#00F0FF] bg-[#00F0FF]/25 shadow-[0_0_15px_#00F0FF] scale-102 ring-2 ring-[#00F0FF]/50'
                    : isSlotTargetable
                    ? 'border-emerald-400/80 bg-emerald-950/30 hover:bg-emerald-900/50 hover:border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.35)] scale-102 ring-1 ring-emerald-400/50'
                    : isAlreadyPlaced
                    ? 'opacity-80 border-cyan-400/30 bg-black/75 cursor-pointer hover:border-[#00F0FF]'
                    : 'border-white/15 hover:border-[#00F0FF]/60 bg-[#0C0F1D]/80 hover:bg-[#12162A] hover:scale-102 shadow-sm'
                }`}
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor: factionColor
                }}
                title={
                  isSlotTargetable
                    ? `Nhấp để đặt vào Ô #${selectedSlotIndex + 1}`
                    : isAlreadyPlaced
                    ? `Đang ở Ô #${placedUnit ? placedUnit.slotIndex + 1 : ''} (Nhấp để chọn ô, Chuột phải để thu hồi)`
                    : isSelected
                    ? 'Đang chọn (Nhấp lại để hủy hoặc nhấp ô bàn cờ để đặt)'
                    : '⚡ Double-click để xếp nhanh • Kéo thả hoặc nhấp để chọn'
                }
              >
                {/* Target Slot Placement Badge */}
                {isSlotTargetable && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-emerald-400 text-black font-mono font-black text-[7.5px] uppercase shadow-[0_0_10px_#34d399] animate-pulse z-30">
                    + Ô #{selectedSlotIndex + 1}
                  </span>
                )}

                {/* Quick Recall Button on Deployed Cards */}
                {isAlreadyPlaced && placedUnit && onRecallSlot && !isCombatActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRecallSlot(placedUnit.slotIndex);
                    }}
                    className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-red-950 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/50 flex items-center justify-center text-[8px] z-30 transition-all shadow-sm"
                    title="Thu hồi về hàng dự bị"
                  >
                    ✕
                  </button>
                )}

              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-black/60 flex-shrink-0 relative shadow-sm">
                <img
                  src={`/avatars/${valk.id}.jpg`}
                  alt={valk.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-white">
                  {valk.name[0]}
                </span>
                {isAlreadyPlaced && (
                  <span className="absolute bottom-0 inset-x-0 bg-cyan-950/90 text-[#00F0FF] text-[6.5px] font-mono text-center font-bold">
                    Ô #{placedUnit ? placedUnit.slotIndex + 1 : ''}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[7px] font-mono text-gray-400">
                  <span className="truncate" style={{ color: factionColor }}>{valk.role.split('_')[0]}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspect(valk.id);
                    }}
                    className="hover:text-[#00F0FF] px-0.5 text-[8px]"
                    title="Chi tiết"
                  >
                    ℹ
                  </button>
                </div>
                <div className="font-display font-bold text-[10px] text-white truncate leading-tight">
                  {valk.name}
                </div>
                <div className="text-[8px] text-gray-400 font-mono">
                  HP:{valk.stats.maxHp} ATK:{valk.stats.attack}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Battle CTA Button */}
      <div
        className="z-30"
        style={{ flex: '0 0 130px', width: '130px', minWidth: '130px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
      >
        {phase === 'FORMATION_PLACEMENT' && !isLockedIn && (
          <button
            onClick={onLockFormation}
            className="cyber-button text-xs py-2 px-3.5 neon-glow-primary shadow-[0_0_20px_rgba(255,42,133,0.7)] font-display tracking-widest font-black uppercase text-white hover:scale-105 active:scale-95 transition-all"
            style={{ whiteSpace: 'nowrap' }}
          >
            ⚔️ CHIẾN ĐẤU!
          </button>
        )}

        {isLockedIn && phase === 'FORMATION_PLACEMENT' && (
          <span
            className="px-3 py-1.5 rounded-lg bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 text-xs font-mono font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            style={{ whiteSpace: 'nowrap' }}
          >
            ✓ ĐÃ KHÓA
          </span>
        )}

        {isCombatActive && (
          <span
            className="px-3 py-1.5 rounded-lg bg-red-950/50 text-red-400 border border-red-500/50 text-xs font-mono font-bold animate-pulse"
            style={{ whiteSpace: 'nowrap' }}
          >
            ⚡ 20HZ
          </span>
        )}
      </div>
    </footer>
  );
};
