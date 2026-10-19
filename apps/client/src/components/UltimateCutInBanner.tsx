import React, { useEffect } from 'react';
import { getValkyrieById } from '@valkyrie/shared-domain';

export interface UltimateCutInData {
  readonly valkyrieId: string;
  readonly ultimateName: string;
  readonly isEnemy: boolean;
}

interface UltimateCutInBannerProps {
  readonly cutIn: UltimateCutInData | null;
  readonly onDismiss: () => void;
}

/**
 * Cinematic Climax Ultimate Cut-In Banner.
 * Banner hoạt cảnh Tuyệt Kỹ Climax phong cách Anime Cyberpunk chiến đấu.
 */
export const UltimateCutInBanner: React.FC<UltimateCutInBannerProps> = ({ cutIn, onDismiss }) => {
  useEffect(() => {
    if (!cutIn) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  }, [cutIn, onDismiss]);

  if (!cutIn) return null;

  const valk = getValkyrieById(cutIn.valkyrieId);
  if (!valk) return null;

  const isEnemy = cutIn.isEnemy;
  const accentColor = isEnemy ? '#FF3344' : '#00F0FF';
  const glowShadow = isEnemy
    ? '0 0 35px rgba(255, 51, 68, 0.7)'
    : '0 0 35px rgba(0, 240, 255, 0.7)';

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
    >
      {/* Dynamic Energy Slash Line */}
      <div className="cut-in-banner w-full relative overflow-hidden py-6 border-y-2 border-[#FF2A85] bg-gradient-to-r from-black/90 via-[#161826]/95 to-black/90 shadow-[0_0_50px_rgba(255,42,133,0.5)]">
        {/* Animated Glow Backing */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`
          }}
        />

        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between gap-6 relative">
          {/* Left: Valkyrie Portrait */}
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 flex-shrink-0 relative bg-gradient-to-tr from-[#FF2A85] to-[#8A2BE2] shadow-2xl"
              style={{
                borderColor: accentColor,
                boxShadow: glowShadow
              }}
            >
              <img
                src={`/avatars/${valk.id}.jpg`}
                alt={valk.name}
                className="w-full h-full object-cover scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl text-white">
                {valk.name[0]}
              </span>
            </div>

            {/* Info and Climax Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 bg-white/10 text-white">
                  {valk.faction.replace('_', ' ')}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border"
                  style={{
                    borderColor: `${accentColor}80`,
                    color: accentColor,
                    backgroundColor: `${accentColor}15`
                  }}
                >
                  {isEnemy ? '⚠️ FOE CLIMAX' : '⚡ ALLY CLIMAX'}
                </span>
              </div>

              <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                {valk.name.toUpperCase()}
              </h2>

              <p className="font-display font-bold text-lg md:text-xl text-[#FFD700] tracking-wide mt-1 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                TUYỆT KỸ: {cutIn.ultimateName.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Right: Voice Line Callout */}
          <div className="hidden lg:block text-right max-w-sm pl-4 border-l border-white/15">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
              CHIẾN NGÔN KÍCH HOẠT
            </p>
            <p className="font-sub text-base text-gray-200 italic leading-relaxed">
              "{valk.battleDamage.battleVoiceLine}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
