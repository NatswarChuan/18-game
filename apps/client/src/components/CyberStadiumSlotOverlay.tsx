import React from 'react';
import {
  FactionId,
  SlotIndex,
  UnitPlacement,
  getValkyrieById
} from '@valkyrie/shared-domain';

export interface ScreenSlotPos {
  readonly slotIndex: SlotIndex;
  readonly x: number;
  readonly y: number;
}

export interface CyberStadiumSlotOverlayProps {
  readonly screenSlots: readonly ScreenSlotPos[];
  readonly playerFormation: readonly UnitPlacement[];
  readonly selectedSlotIndex?: SlotIndex | null | undefined;
  readonly hasSelection: boolean;
  readonly hoveredFaction?: FactionId | null | undefined;
  readonly isCombatActive: boolean;
  readonly onSlotClick?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly onDropValkyrie?: ((valkyrieId: string, targetSlot: SlotIndex, sourceSlot?: SlotIndex | null) => void) | undefined;
  readonly onRemoveUnit?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly onInspect?: ((valkyrieId: string) => void) | undefined;
  readonly onHoverUnit?: ((valkyrieId: string | null, x: number, y: number) => void) | undefined;
}

/**
 * Interactive 3x3 tactical board slot drop & swap zones overlay.
 * Lớp phủ tương tác 9 ô cờ hỗ trợ chọn, di chuyển, hoán đổi, thu hồi và hiển thị chiến thuật hàng.
 */
export const CyberStadiumSlotOverlay: React.FC<CyberStadiumSlotOverlayProps> = ({
  screenSlots,
  playerFormation,
  selectedSlotIndex,
  hasSelection,
  hoveredFaction,
  isCombatActive,
  onSlotClick,
  onDropValkyrie,
  onRemoveUnit,
  onInspect,
  onHoverUnit
}) => {
  return (
    <>
      {screenSlots.map((slot) => {
        const placement = playerFormation.find((p) => p.slotIndex === slot.slotIndex);
        const isSelected = selectedSlotIndex === slot.slotIndex;
        const valk = placement ? getValkyrieById(placement.valkyrieId) : undefined;
        const isHoveredSynergy = hoveredFaction && valk && valk.faction === hoveredFaction;
        const canTarget = hasSelection && !isSelected;

        return (
          <div
            key={`drop_slot_${slot.slotIndex}`}
            draggable={!!placement && !isCombatActive}
            onDragStart={(e) => {
              if (placement && !isCombatActive) {
                e.dataTransfer.setData('text/plain', placement.valkyrieId);
                e.dataTransfer.setData('application/x-source-slot', String(slot.slotIndex));
                e.dataTransfer.effectAllowed = 'move';
              }
            }}
            onClick={() => onSlotClick && onSlotClick(slot.slotIndex)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (placement && onRemoveUnit && !isCombatActive) {
                onRemoveUnit(placement.slotIndex);
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              if (placement && onRemoveUnit && !isCombatActive) {
                onRemoveUnit(placement.slotIndex);
              }
            }}
            onMouseEnter={(e) => {
              if (placement && onHoverUnit) {
                onHoverUnit(placement.valkyrieId, e.clientX, e.clientY);
              }
            }}
            onMouseLeave={() => onHoverUnit && onHoverUnit(null, 0, 0)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const valkId = e.dataTransfer.getData('text/plain');
              const sourceSlotStr = e.dataTransfer.getData('application/x-source-slot');
              const sourceSlot = sourceSlotStr ? (Number(sourceSlotStr) as SlotIndex) : null;
              if (valkId && onDropValkyrie) {
                onDropValkyrie(valkId, slot.slotIndex, sourceSlot);
              }
            }}
            className={`absolute z-20 cursor-pointer rounded-2xl transition-all duration-150 flex flex-col items-center justify-between p-1.5 ${
              isSelected
                ? 'border-2 border-[#00F0FF] bg-[#00F0FF]/25 shadow-[0_0_35px_rgba(0,240,255,0.85)] ring-2 ring-[#00F0FF]/70'
                : isHoveredSynergy
                ? 'border-2 border-[#FFD700] bg-[#FFD700]/25 shadow-[0_0_25px_rgba(255,215,0,0.8)] scale-105'
                : canTarget
                ? placement
                  ? 'border-2 border-dashed border-[#FFD700]/70 hover:border-[#FFD700] hover:bg-[#FFD700]/25 shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-102'
                  : 'border-2 border-dashed border-emerald-400/70 hover:border-emerald-400 hover:bg-emerald-500/25 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-102'
                : placement
                ? 'border border-transparent hover:border-[#00F0FF]/60 hover:bg-white/5'
                : 'border border-dashed border-white/15 hover:border-[#00F0FF] hover:bg-[#00F0FF]/15 shadow-sm'
            }`}
            style={{
              left: `${slot.x}px`,
              top: `${slot.y}px`,
              transform: placement ? 'translate(-50%, -70%)' : 'translate(-50%, -50%)',
              width: placement ? '136px' : '118px',
              height: placement ? '155px' : '90px'
            }}
          >
            {/* Top Tactical Status Badge */}
            <div className="w-full flex items-center justify-between z-30 pointer-events-none">
              {placement && onRemoveUnit && !isCombatActive ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveUnit(placement.slotIndex);
                  }}
                  className="w-5 h-5 rounded-full bg-red-950/90 hover:bg-red-600 text-[9px] text-red-200 hover:text-white flex items-center justify-center transition-all shadow-sm border border-red-500/40 pointer-events-auto"
                  title="Thu hồi về hàng dự bị [Phím R hoặc Chuột phải]"
                >
                  ✕
                </button>
              ) : <div className="w-5" />}

              {isSelected ? (
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF] text-black font-display font-black text-[7.5px] tracking-wider uppercase shadow-[0_0_12px_#00F0FF] animate-pulse">
                  ✓ ĐANG CHỌN
                </span>
              ) : canTarget ? (
                placement ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFD700] text-black font-mono font-black text-[7.5px] uppercase shadow-[0_0_10px_#FFD700]">
                    ⇄ HOÁN ĐỔI
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black font-mono font-black text-[7.5px] uppercase shadow-[0_0_10px_#34d399]">
                    + ĐẶT VÀO
                  </span>
                )
              ) : (
                <span className="text-[8px] font-mono text-gray-400/80">
                  Ô #{slot.slotIndex + 1}
                </span>
              )}

              {placement && onInspect ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspect(placement.valkyrieId);
                  }}
                  className="w-5 h-5 rounded-full bg-black/80 hover:bg-[#00F0FF] hover:text-black text-[9px] text-gray-300 flex items-center justify-center transition-all shadow-sm border border-white/20 pointer-events-auto"
                  title="Xem chi tiết kỹ năng"
                >
                  ℹ
                </button>
              ) : <div className="w-5" />}
            </div>

            {/* Middle Breathing Space for 3D Valkyrie Character Visual */}
            <div className="flex-1 w-full flex items-center justify-center pointer-events-none">
              {isSelected && !placement ? (
                <div className="px-2 py-1 rounded-lg bg-black/80 border border-[#00F0FF]/50 text-center backdrop-blur-sm animate-pulse">
                  <span className="text-[8px] font-mono font-bold text-[#00F0FF] block">
                    📍 Chọn quân bên dưới
                  </span>
                </div>
              ) : canTarget ? (
                <div className="px-2 py-1 rounded-lg bg-black/75 border border-white/20 text-center backdrop-blur-sm animate-in fade-in">
                  <span className={`text-[8.5px] font-mono font-bold block ${placement ? 'text-[#FFD700]' : 'text-emerald-400'}`}>
                    {placement ? '⇄ Bấm để Hoán Đổi' : '➔ Bấm để Đặt Vào'}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Bottom Row Tag */}
            <div className="w-full text-center pointer-events-none z-30">
              {placement && valk ? (
                <span className="text-[8px] font-display font-bold text-white px-2 py-0.5 rounded bg-black/70 border border-white/10 truncate max-w-full inline-block">
                  {valk.name}
                </span>
              ) : (
                <span className="text-[7.5px] font-mono text-gray-400">
                  {slot.slotIndex < 3 ? '🛡️ Tiên Phong' : slot.slotIndex < 6 ? '⚡ Đột Kích' : '🎯 Hậu Phương'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
