import React, { useState } from 'react';
import { BuffDefinition } from '@valkyrie/shared-domain';

interface DraftModalProps {
  readonly buffs: readonly BuffDefinition[];
  readonly timeoutSeconds: number;
  readonly onSelectBuff: (buffId: string) => void;
  readonly chosenBuffId: string | null;
}

export const DraftModal: React.FC<DraftModalProps> = ({
  buffs,
  timeoutSeconds,
  onSelectBuff,
  chosenBuffId
}) => {
  const [selectedId, setSelectedId] = useState<string>(chosenBuffId ?? buffs[0]?.id ?? '');

  const handleConfirm = () => {
    if (selectedId) {
      onSelectBuff(selectedId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl p-6 border-2 border-[#FF2A85]/50 relative shadow-[0_0_50px_rgba(255,42,133,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="font-display font-black text-2xl text-white tracking-widest flex items-center gap-2">
              <span className="text-[#FF2A85]">⚡</span> DRAFT 9 BUFFS (12D VECTOR ADAPTIVE)
            </h2>
            <p className="text-sm text-gray-300">
              Thuật toán kNN 12 chiều đã tuyển chọn 9 Buffs thích ứng tối ưu cho phong cách chiến đấu của bạn.
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-gray-400">THỜI GIAN CÒN LẠI</span>
            <div className="font-display font-black text-2xl text-[#00F0FF]">
              {timeoutSeconds}s
            </div>
          </div>
        </div>

        {/* 9 Buffs Grid (3x3 layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {buffs.map((buff, idx) => {
            const isSelected = selectedId === buff.id;
            let categoryBadge = 'SYNERGY';
            let catColor = 'text-[#00F0FF] border-[#00F0FF]/40 bg-[#00F0FF]/10';

            if (idx >= 3 && idx < 6) {
              categoryBadge = 'COUNTER';
              catColor = 'text-[#FF2A85] border-[#FF2A85]/40 bg-[#FF2A85]/10';
            } else if (idx >= 6) {
              categoryBadge = 'DECISIVE';
              catColor = 'text-[#FFD700] border-[#FFD700]/40 bg-[#FFD700]/10';
            }

            return (
              <div
                key={buff.id}
                onClick={() => setSelectedId(buff.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 glass-panel ${
                  isSelected
                    ? 'border-[#FF2A85] bg-[#FF2A85]/15 shadow-[0_0_20px_rgba(255,42,133,0.5)] scale-102'
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${catColor}`}>
                    {categoryBadge} • DEPTH {buff.depth}
                  </span>
                  <span className="font-mono text-xs text-gray-400">#{buff.id}</span>
                </div>
                <h4 className="font-display font-bold text-base text-white mb-2 leading-snug">
                  {buff.name}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {buff.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {buff.tags.map((t) => (
                    <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-gray-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="cyber-button text-sm px-8 py-3 neon-glow-primary"
          >
            XÁC NHẬN CHỌN BUFF NÀY ➔
          </button>
        </div>
      </div>
    </div>
  );
};
