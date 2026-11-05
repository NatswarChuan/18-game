import React from 'react';
import { getValkyrieById } from '@valkyrie/shared-domain';

export interface TacticalUnitTooltipProps {
  readonly valkyrieId: string | null;
  readonly x: number;
  readonly y: number;
  readonly visible: boolean;
}

/**
 * Tactical Unit Tooltip providing instantaneous gamer intelligence on hover.
 * Tooltip tình báo chiến thuật hiển thị tức thời chỉ số, kỹ năng và vị trí tối ưu khi di chuột.
 */
export const TacticalUnitTooltip: React.FC<TacticalUnitTooltipProps> = ({
  valkyrieId,
  x,
  y,
  visible
}) => {
  if (!visible || !valkyrieId) return null;
  const valk = getValkyrieById(valkyrieId);
  if (!valk) return null;

  const factionColor =
    valk.faction === 'NEO_VALHALLA'
      ? '#00F0FF'
      : valk.faction === 'ABYSSAL_EDEN'
      ? '#FF2A85'
      : '#FFD700';

  const rowRecommendation = valk.role.startsWith('FRONTLINE')
    ? '🛡️ Hàng 1 (Tiên Phong: Nhận +15% Mana khi dính đòn)'
    : valk.role.startsWith('MIDLINE')
    ? '⚡ Hàng 2 (Đột Kích: Tăng +10% Tốc Đánh cơ bản)'
    : '🎯 Hàng 3 (Trùng Pháo: Tăng +1 Tầm Đánh)';

  // Clamp within viewport
  const left = Math.min(x + 16, window.innerWidth - 260);
  const top = Math.min(y + 16, window.innerHeight - 240);

  return (
    <div
      className="fixed z-50 pointer-events-none p-2.5 rounded-xl border border-white/20 bg-[#0B0D19]/95 text-white shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md w-[240px] text-xs flex flex-col gap-1.5 animate-in fade-in duration-100"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <div className="flex items-center gap-1.5 truncate">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: factionColor }}
          />
          <span className="font-display font-bold text-white text-[11px] truncate">
            {valk.name}
          </span>
        </div>
        <span
          className="font-mono text-[8px] font-bold px-1.5 py-0.2 rounded border"
          style={{ borderColor: factionColor, color: factionColor }}
        >
          {valk.role.replace('_', ' ')}
        </span>
      </div>

      {/* Row Recommendation */}
      <div className="text-[8px] font-mono p-1 rounded bg-white/5 border border-white/10 text-gray-300">
        <span className="text-gray-400 block mb-0.5">Vị trí tối ưu:</span>
        <span className="text-[#00F0FF]">{rowRecommendation}</span>
      </div>

      {/* Combat Stats Grid */}
      <div className="grid grid-cols-4 gap-1 text-[8px] font-mono text-center">
        <div className="p-1 rounded bg-black/40 border border-white/10">
          <span className="text-gray-400 block">HP</span>
          <span className="text-emerald-400 font-bold">{valk.stats.maxHp}</span>
        </div>
        <div className="p-1 rounded bg-black/40 border border-white/10">
          <span className="text-gray-400 block">ATK</span>
          <span className="text-red-400 font-bold">{valk.stats.attack}</span>
        </div>
        <div className="p-1 rounded bg-black/40 border border-white/10">
          <span className="text-gray-400 block">GIÁP</span>
          <span className="text-[#FFD700] font-bold">{valk.stats.armor}</span>
        </div>
        <div className="p-1 rounded bg-black/40 border border-white/10">
          <span className="text-gray-400 block">TẦM</span>
          <span className="text-[#00F0FF] font-bold">{valk.stats.attackRange} ô</span>
        </div>
      </div>

      {/* Ultimate Skill */}
      <div className="pt-1 border-t border-white/10 flex flex-col gap-0.5">
        <div className="flex items-center justify-between text-[8px] font-mono">
          <span className="text-[#FF2A85] font-bold truncate">⚡ {valk.ultimate.name}</span>
          <span className="text-purple-400">{valk.ultimate.energyCost} Năng lượng</span>
        </div>
        <p className="text-[7.5px] text-gray-300 leading-tight">
          {valk.ultimate.description}
        </p>
      </div>

      {/* Gamer Quick Tip */}
      <div className="text-[7px] font-mono text-gray-400 pt-0.5 border-t border-white/5 flex items-center justify-between">
        <span>🖱️ Kéo để đổi chỗ</span>
        <span>🖱️ Chuột phải thu hồi</span>
      </div>
    </div>
  );
};
