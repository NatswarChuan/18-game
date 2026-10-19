import React from 'react';
import { getValkyrieById } from '@valkyrie/shared-domain';

interface ValkyrieModalProps {
  readonly valkyrieId: string | null;
  readonly onClose: () => void;
}

export const ValkyrieModal: React.FC<ValkyrieModalProps> = ({ valkyrieId, onClose }) => {
  if (!valkyrieId) return null;
  const valk = getValkyrieById(valkyrieId);
  if (!valk) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl border-2 border-[#00F0FF]/40 relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.25)] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Glow Header */}
        <div className="relative p-6 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/50 shadow-lg relative bg-gradient-to-tr from-[#FF2A85] to-[#8A2BE2] flex-shrink-0">
              <img
                src={`/avatars/${valk.id}.jpg`}
                alt={valk.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-white">
                {valk.name[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40">
                  {valk.faction.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-gray-400">#{valk.id}</span>
              </div>
              <h3 className="font-display font-black text-2xl text-white tracking-wide">
                {valk.name}
              </h3>
              <p className="text-xs text-gray-300 font-sub">{valk.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 text-gray-400 hover:text-white hover:border-[#FF2A85] flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Base Stats Grid */}
          <div>
            <h4 className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
              THÔNG SỐ CHIẾN ĐẤU CƠ BẢN
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">MÁU (HP)</span>
                <span className="font-display font-bold text-sm text-[#00F0FF]">{valk.stats.maxHp}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">SÁT THƯƠNG</span>
                <span className="font-display font-bold text-sm text-[#FF2A85]">{valk.stats.attack}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">GIÁP</span>
                <span className="font-display font-bold text-sm text-[#FFD700]">{valk.stats.armor}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">TỐC ĐÁNH</span>
                <span className="font-display font-bold text-sm text-white">{valk.stats.attackSpeed}/s</span>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">TẦM BẮN</span>
                <span className="font-display font-bold text-sm text-white">{valk.stats.attackRange} Ô</span>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                <span className="block text-[10px] font-mono text-gray-400">NĂNG LƯỢNG</span>
                <span className="font-display font-bold text-sm text-[#8A2BE2]">{valk.stats.maxEnergy}</span>
              </div>
            </div>
          </div>

          {/* Ultimate Skill */}
          <div className="p-4 rounded-xl border border-[#FF2A85]/30 bg-[#FF2A85]/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-bold text-xs text-[#FF2A85] uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span> TUYỆT KỸ CLIMAX: {valk.ultimate.name}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                TIÊU HAO: {valk.ultimate.energyCost} NĂNG LƯỢNG
              </span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed font-sub">
              {valk.ultimate.description}
            </p>
          </div>

          {/* 3 Tiers of Battle Damage */}
          <div>
            <h4 className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
              TIẾN TRÌNH TỔN HẠI GIÁP PHỤC CHIẾN ĐẤU (16+ BATTLE DAMAGE)
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-[#00F0FF]/30 bg-[#00F0FF]/5 text-xs">
                <span className="font-mono font-bold text-[#00F0FF] block mb-1">
                  TIER 1 • PRISTINE (MÁU ≥ 70%)
                </span>
                <p className="text-gray-300 font-sub">{valk.battleDamage.tier1Description}</p>
              </div>

              <div className="p-3 rounded-lg border border-[#FFD700]/30 bg-[#FFD700]/5 text-xs">
                <span className="font-mono font-bold text-[#FFD700] block mb-1">
                  TIER 2 • BATTLE-TORN (30% ≤ MÁU &lt; 70%)
                </span>
                <p className="text-gray-300 font-sub">{valk.battleDamage.tier2Description}</p>
              </div>

              <div className="p-3 rounded-lg border border-[#FF2A85]/40 bg-[#FF2A85]/10 text-xs">
                <span className="font-mono font-bold text-[#FF2A85] block mb-1">
                  TIER 3 • OVERDRIVE BURST (MÁU &lt; 30%)
                </span>
                <p className="text-gray-300 font-sub">{valk.battleDamage.tier3Description}</p>
              </div>
            </div>
          </div>

          {/* Voice line quote */}
          <div className="p-3 rounded-xl border border-white/10 bg-black/40 italic text-xs text-gray-300 font-sub flex items-center gap-2">
            <span className="text-lg text-[#00F0FF]">“</span>
            <span>{valk.battleDamage.battleVoiceLine}</span>
            <span className="text-lg text-[#00F0FF]">”</span>
          </div>
        </div>
      </div>
    </div>
  );
};
