import React from 'react';
import {
  CombatEntitySnapshot,
  CombatEventItem,
  UnitPlacement,
  getValkyrieById
} from '@valkyrie/shared-domain';

export interface CombatRightWingProps {
  readonly combatEntities: readonly CombatEntitySnapshot[];
  readonly combatEvents: readonly CombatEventItem[];
  readonly isCombatActive: boolean;
  readonly roundNumber: number;
  readonly opponentFormation?: readonly UnitPlacement[] | undefined;
  readonly onApplyPreset?: ((preset: 'VANGUARD' | 'FLANK' | 'BUNKER') => void) | undefined;
}

/**
 * Live 20Hz Telemetry & Combat Stream Wing Panel with Opponent Radar & Counter Presets.
 * Bảng cánh phải hiển thị thông số viễn trắc 20Hz, radar trinh sát đối thủ 3x3 và thao tác phản đòn.
 */
export const CombatRightWing: React.FC<CombatRightWingProps> = ({
  combatEntities,
  combatEvents,
  isCombatActive,
  roundNumber,
  opponentFormation = [],
  onApplyPreset
}) => {
  const latestEvents = combatEvents.slice(-6).reverse();

  return (
    <aside className="hidden lg:flex flex-col gap-2 w-[260px] min-w-[260px] h-full p-2.5 rounded-2xl border border-[#FF2A85]/30 bg-[#0B0D18]/90 shadow-[0_10px_35px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,42,133,0.06)] select-none overflow-hidden text-xs backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span className="font-display font-bold text-[#FF2A85] text-[11px] tracking-wider uppercase flex items-center gap-1.5">
          <span>📡</span> {isCombatActive ? 'TELEMETRY 20HZ' : 'RADAR CHIẾN THUẬT'}
        </span>
        <span className="font-mono text-[9px] text-[#FFD700] animate-pulse">
          {isCombatActive ? '⚡ LIVE CLASH' : `STANDBY R${roundNumber}`}
        </span>
      </div>

      {/* Live Unit Health or Pre-Clash Radar Intel */}
      <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
          {isCombatActive ? 'Trạng Thái Nữ Chiến Binh:' : 'Trinh Sát Đội Hình Đối Thủ:'}
        </span>

        {!isCombatActive ? (
          <div className="flex-1 flex flex-col gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-mono justify-between overflow-y-auto scrollbar-thin">
            {/* Opponent Identity & Mini 3x3 Radar Grid */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[#FF2A85] font-bold flex items-center gap-1">
                  <span>🔴</span> OMEGA-9 (AI)
                </span>
                <span className="text-[8px] px-1 rounded bg-red-950/60 border border-red-500/40 text-red-300">
                  GRANDMASTER
                </span>
              </div>

              {/* Mini 3x3 Opponent Radar Map */}
              <div className="flex flex-col gap-1 p-1.5 rounded-lg bg-black/60 border border-red-500/30">
                <span className="text-[7.5px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>BẢN ĐỒ BỐ TRÍ ĐỐI THỦ (3x3):</span>
                  <span className="text-red-400">{opponentFormation.length}/6 quân</span>
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
                    const unit = opponentFormation.find((p) => p.slotIndex === s);
                    const valk = unit ? getValkyrieById(unit.valkyrieId) : null;
                    return (
                      <div
                        key={`mini_scout_${s}`}
                        className={`h-7 rounded flex items-center justify-center p-0.5 border text-center transition-all ${
                          unit
                            ? 'bg-red-950/70 border-red-500/60 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                            : 'bg-white/5 border-white/5 text-gray-600'
                        }`}
                        title={valk ? `${valk.name} (${valk.role})` : `Ô ${s + 1} trống`}
                      >
                        {valk ? (
                          <span className="text-[7.5px] font-bold truncate max-w-full">
                            {valk.name.slice(0, 5)}
                          </span>
                        ) : (
                          <span className="text-[6.5px] text-gray-600 font-mono">·</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Counter Tactical Buttons */}
              {onApplyPreset && (
                <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
                  <span className="text-[7.5px] font-bold text-[#FFD700] uppercase tracking-wider">
                    ⚡ PHẢN ĐÒN NHANH:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => onApplyPreset('VANGUARD')}
                      className="p-1 rounded bg-white/5 hover:bg-[#FFD700]/20 border border-white/10 hover:border-[#FFD700] text-gray-300 hover:text-[#FFD700] text-[7.5px] font-bold text-center transition-all"
                      title="Bố trí 3 Tiên Phong chặn đòn trực diện [Phím Q]"
                    >
                      🛡️ Tiên Phong [Q]
                    </button>
                    <button
                      onClick={() => onApplyPreset('FLANK')}
                      className="p-1 rounded bg-white/5 hover:bg-[#FF2A85]/20 border border-white/10 hover:border-[#FF2A85] text-gray-300 hover:text-[#FF2A85] text-[7.5px] font-bold text-center transition-all"
                      title="Bố trí Đột Kích tấn công sườn đối thủ [Phím W]"
                    >
                      ⚡ Đột Kích [W]
                    </button>
                    <button
                      onClick={() => onApplyPreset('BUNKER')}
                      className="p-1 rounded bg-white/5 hover:bg-[#00F0FF]/20 border border-white/10 hover:border-[#00F0FF] text-gray-300 hover:text-[#00F0FF] text-[7.5px] font-bold text-center transition-all"
                      title="Bố trí Hậu Phương bảo vệ chủ lực [Phím E]"
                    >
                      🏰 Boongke [E]
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Gamer Shortcuts List */}
            <div className="flex flex-col gap-0.5 p-1.5 rounded-lg bg-black/50 border border-[#00F0FF]/25">
              <span className="text-[7.5px] font-bold text-[#00F0FF] uppercase tracking-wider">
                🎮 PHÍM TẮT ESPORTS:
              </span>
              <div className="flex items-center justify-between text-[7.5px] text-gray-300">
                <span>• Tự xếp đội hình:</span>
                <span className="text-[#00F0FF] font-bold">[F]</span>
              </div>
              <div className="flex items-center justify-between text-[7.5px] text-gray-300">
                <span>• Thu hồi tất cả:</span>
                <span className="text-red-400 font-bold">[R]</span>
              </div>
              <div className="flex items-center justify-between text-[7.5px] text-gray-300">
                <span>• Bắt đầu chiến đấu:</span>
                <span className="text-emerald-400 font-bold">[Space]</span>
              </div>
              <div className="flex items-center justify-between text-[7.5px] text-gray-300">
                <span>• Đổi tốc độ 1x/2x:</span>
                <span className="text-[#FFD700] font-bold">[1] / [2]</span>
              </div>
              <div className="text-[7px] text-gray-400 italic pt-0.5 border-t border-white/5">
                💡 Double-click thẻ tướng để xuất chiến tức thì!
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col gap-1 pr-1">
            {combatEntities.map((entity) => {
              const valk = getValkyrieById(entity.valkyrieId);
              if (!valk) return null;
              const isPlayer = entity.ownerId === 'player_me';
              const hpPercent = Math.max(0, Math.min(100, Math.round((entity.currentHp / valk.stats.maxHp) * 100)));

              return (
                <div
                  key={entity.id}
                  className={`p-1 rounded border text-[9px] font-mono flex flex-col gap-0.5 ${
                    isPlayer ? 'border-[#00F0FF]/30 bg-[#00F0FF]/5' : 'border-red-500/30 bg-red-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-white truncate max-w-[120px]">
                      {isPlayer ? '🔵' : '🔴'} {valk.name}
                    </span>
                    <span
                      className={`px-1 rounded text-[7px] font-bold ${
                        entity.clothDamageTier === 3
                          ? 'bg-[#FF2A85] text-white animate-pulse'
                          : entity.clothDamageTier === 2
                          ? 'bg-[#FFD700]/30 text-[#FFD700]'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      T{entity.clothDamageTier}
                    </span>
                  </div>

                  <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        isPlayer ? 'bg-[#00F0FF]' : 'bg-red-500'
                      }`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Real-time Combat Events Stream */}
      <div className="flex flex-col gap-1 pt-1.5 border-t border-white/10">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
          Luồng Sự Kiện Tức Thì:
        </span>
        <div className="flex flex-col gap-1 max-h-[120px] overflow-hidden">
          {latestEvents.length === 0 ? (
            <span className="text-[8px] font-mono text-gray-500 italic">Đang chờ đợt giao tranh...</span>
          ) : (
            latestEvents.map((ev, idx) => (
              <div
                key={`stream_${idx}_${ev.tick}`}
                className="text-[8px] font-mono truncate flex items-center gap-1 text-gray-300"
              >
                <span
                  className={`px-1 py-0.2 rounded font-bold text-[7px] ${
                    ev.eventType === 'ULTIMATE_CAST'
                      ? 'bg-[#FF2A85] text-white'
                      : ev.eventType === 'CLOTH_TIER_CHANGED'
                      ? 'bg-[#FFD700] text-black font-black'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {ev.eventType === 'ULTIMATE_CAST' ? 'ULT' : ev.eventType === 'CLOTH_TIER_CHANGED' ? 'TEAR' : 'HIT'}
                </span>
                <span className="truncate">{ev.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
