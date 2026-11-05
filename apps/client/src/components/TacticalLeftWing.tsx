import React from 'react';
import {
  FactionId,
  UnitPlacement,
  VALKYRIE_ROSTER
} from '@valkyrie/shared-domain';

export interface TacticalLeftWingProps {
  readonly playerFormation: readonly UnitPlacement[];
  readonly chosenBuffId: string | null;
  readonly isCombatActive: boolean;
  readonly onHoverFaction?: ((faction: FactionId | null) => void) | undefined;
}

interface SynergyCount {
  readonly faction: FactionId;
  readonly name: string;
  readonly count: number;
  readonly bonusDescription: string;
  readonly color: string;
}

export const TacticalLeftWing: React.FC<TacticalLeftWingProps> = ({
  playerFormation,
  chosenBuffId,
  isCombatActive,
  onHoverFaction
}) => {
  // Compute active faction counts from deployed units
  const factionCounts: Record<FactionId, number> = {
    NEO_VALHALLA: 0,
    ABYSSAL_EDEN: 0,
    SOL_DYNASTY: 0
  };

  for (const placement of playerFormation) {
    const valk = VALKYRIE_ROSTER.find((v) => v.id === placement.valkyrieId);
    if (valk) {
      factionCounts[valk.faction] += 1;
    }
  }

  const synergies: readonly SynergyCount[] = [
    {
      faction: 'NEO_VALHALLA',
      name: 'VALHALLA',
      count: factionCounts.NEO_VALHALLA,
      bonusDescription: factionCounts.NEO_VALHALLA >= 2 ? '⚡ +15% Tốc Đánh Toàn Đội' : 'Kích hoạt tại mốc 2',
      color: '#00F0FF'
    },
    {
      faction: 'ABYSSAL_EDEN',
      name: 'ABYSSAL EDEN',
      count: factionCounts.ABYSSAL_EDEN,
      bonusDescription: factionCounts.ABYSSAL_EDEN >= 2 ? '🩸 +12% Hút Máu Sát Thương' : 'Kích hoạt tại mốc 2',
      color: '#FF2A85'
    },
    {
      faction: 'SOL_DYNASTY',
      name: 'SOL DYNASTY',
      count: factionCounts.SOL_DYNASTY,
      bonusDescription: factionCounts.SOL_DYNASTY >= 2 ? '☀️ +20 Giáp Vật Lý' : 'Kích hoạt tại mốc 2',
      color: '#FFD700'
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col gap-2 w-[260px] min-w-[260px] h-full p-2.5 rounded-2xl border border-[#00F0FF]/30 bg-[#0B0D18]/90 shadow-[0_10px_35px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,240,255,0.06)] select-none overflow-hidden text-xs backdrop-blur-md">
      {/* Sector Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span className="font-display font-bold text-[#00F0FF] text-[11px] tracking-wider uppercase flex items-center gap-1.5">
          <span>🛡️</span> CHIẾN THUẬT ĐỘI HÌNH
        </span>
        <span className="font-mono text-[9px] text-gray-400">
          {playerFormation.length}/6 QUÂN
        </span>
      </div>

      {/* Faction Synergies Matrix */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
          Kích Hoạt Tộc / Hệ:
        </span>
        {synergies.map((syn) => {
          const isActive = syn.count >= 2;
          return (
            <div
              key={syn.faction}
              onMouseEnter={() => onHoverFaction && onHoverFaction(syn.faction)}
              onMouseLeave={() => onHoverFaction && onHoverFaction(null)}
              className={`p-1.5 rounded-lg border transition-all duration-150 flex flex-col gap-0.5 cursor-pointer hover:scale-102 ${
                isActive
                  ? 'border-[#00F0FF]/50 bg-[#00F0FF]/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'border-white/5 bg-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-display font-bold text-[10px]"
                  style={{ color: syn.color }}
                >
                  {syn.name}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-black/50 border border-white/10">
                  {syn.count}/3
                </span>
              </div>
              <span className="text-[9px] font-mono text-gray-300">
                {syn.bonusDescription}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Tactical Buff */}
      <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
          Buff Vector Đã Chọn:
        </span>
        <div className="p-1.5 rounded-lg border border-[#FFD700]/30 bg-[#FFD700]/10 flex items-center gap-2">
          <span className="text-sm">💎</span>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-[10px] text-[#FFD700] truncate">
              {chosenBuffId ? `Buff ID: ${chosenBuffId}` : 'Chưa chọn (Auto Round 1)'}
            </div>
            <div className="text-[8px] font-mono text-gray-400">
              {isCombatActive ? 'Đang kích hoạt giao tranh' : 'Sẵn sàng triển khai'}
            </div>
          </div>
        </div>
      </div>

      {/* Slot Behavior Perks */}
      <div className="flex flex-col gap-1 pt-1 border-t border-white/10 text-[8px] font-mono text-gray-400">
        <span className="text-[9px] text-gray-300 uppercase">Quy Tắc 3 Hàng:</span>
        <div className="flex items-center gap-1.5 text-[#FFD700]">
          <span>🛡️ Hàng 1:</span>
          <span>Mana +15% khi nhận sát thương</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#00F0FF]">
          <span>⚡ Hàng 2:</span>
          <span>Tốc độ đánh cơ bản +10%</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#FF2A85]">
          <span>🎯 Hàng 3:</span>
          <span>Tầm đánh tối đa +1 ô</span>
        </div>
      </div>
    </aside>
  );
};
