import React from 'react';
import { getRankTierFromElo } from '@valkyrie/shared-domain';

export interface CommanderRankEntry {
  readonly rankPosition: number;
  readonly name: string;
  readonly elo: number;
  readonly signatureValkyrieId: string;
  readonly signatureFaction: string;
  readonly winRatePercent: number;
  readonly isCurrentPlayer?: boolean | undefined;
}

interface LeaderboardModalProps {
  readonly playerElo: number;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/**
 * Global Cyberpunk Ranked Leaderboard Modal.
 * Bảng xếp hạng Chỉ Huy Toàn Cầu Valkyrie Protocol: Zero.
 */
export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ playerElo, isOpen, onClose }) => {
  if (!isOpen) return null;

  const playerRankInfo = getRankTierFromElo(playerElo);

  const leaderboardData: CommanderRankEntry[] = [
    {
      rankPosition: 1,
      name: 'Valkyrie-Zero Core',
      elo: 2150,
      signatureValkyrieId: 'VALK-20',
      signatureFaction: 'SOL_DYNASTY',
      winRatePercent: 78
    },
    {
      rankPosition: 2,
      name: 'Abyssal Queen Lilith',
      elo: 1780,
      signatureValkyrieId: 'VALK-10',
      signatureFaction: 'ABYSSAL_EDEN',
      winRatePercent: 66
    },
    {
      rankPosition: 3,
      name: 'Valkyrie General Freyja',
      elo: 1690,
      signatureValkyrieId: 'VALK-01',
      signatureFaction: 'NEO_VALHALLA',
      winRatePercent: 62
    },
    {
      rankPosition: 4,
      name: 'Commander Alpha (BẠN)',
      elo: playerElo,
      signatureValkyrieId: 'VALK-01',
      signatureFaction: 'NEO_VALHALLA',
      winRatePercent: 57,
      isCurrentPlayer: true
    },
    {
      rankPosition: 5,
      name: 'Crimson Blade Carmilla',
      elo: 1480,
      signatureValkyrieId: 'VALK-11',
      signatureFaction: 'ABYSSAL_EDEN',
      winRatePercent: 54
    },
    {
      rankPosition: 6,
      name: 'Sun Samurai Tomoe',
      elo: 1420,
      signatureValkyrieId: 'VALK-21',
      signatureFaction: 'SOL_DYNASTY',
      winRatePercent: 52
    },
    {
      rankPosition: 7,
      name: 'Thunder Spear Herja',
      elo: 1350,
      signatureValkyrieId: 'VALK-07',
      signatureFaction: 'NEO_VALHALLA',
      winRatePercent: 49
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl border-2 border-[#FFD700]/50 shadow-[0_0_50px_rgba(255,215,0,0.25)] relative overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#FFD700]/10 to-transparent">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="font-display font-black text-xl text-white tracking-wide flex items-center gap-2">
                BẢNG XẾP HẠNG ĐẤU HẠNG (GLOBAL LEADERBOARD)
              </h3>
              <p className="text-xs text-gray-300 font-mono">
                Xếp hạng khu vực máy chủ • Cập nhật theo thời gian thực
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 text-gray-400 hover:text-white hover:border-[#FF2A85] flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Current Player Rank Summary Card */}
        <div className="p-4 mx-5 my-3 rounded-xl border border-white/15 bg-white/5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg border"
              style={{
                borderColor: `${playerRankInfo.color}80`,
                backgroundColor: `${playerRankInfo.color}20`,
                color: playerRankInfo.color
              }}
            >
              #4
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase">HẠNG CỦA BẠN</span>
              <h4 className="font-display font-bold text-base text-white">
                Commander Alpha
              </h4>
              <span
                className="text-xs font-mono font-bold"
                style={{ color: playerRankInfo.color }}
              >
                {playerRankInfo.title}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase">ĐIỂM XẾP HẠNG</span>
            <div className="font-display font-black text-2xl text-[#FFD700]">
              {playerElo} <span className="text-xs font-mono text-gray-400">ELO</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {leaderboardData.map((entry) => {
            const rankInfo = getRankTierFromElo(entry.elo);
            const isTop3 = entry.rankPosition <= 3;
            const topColors = ['#FFD700', '#E0E6ED', '#CD7F32'];

            return (
              <div
                key={entry.rankPosition}
                className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  entry.isCurrentPlayer
                    ? 'border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Left: Position & Commander Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-xs ${
                      isTop3
                        ? 'font-black border'
                        : 'text-gray-400 bg-white/5'
                    }`}
                    style={
                      isTop3
                        ? {
                            color: topColors[entry.rankPosition - 1],
                            borderColor: topColors[entry.rankPosition - 1],
                            backgroundColor: `${topColors[entry.rankPosition - 1]}20`
                          }
                        : {}
                    }
                  >
                    {entry.rankPosition}
                  </div>

                  {/* Valkyrie Avatar Thumbnail */}
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-white/10 flex-shrink-0">
                    <img
                      src={`/avatars/${entry.signatureValkyrieId}.jpg`}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <h5 className="font-display font-bold text-xs text-white flex items-center gap-2">
                      {entry.name}
                      {entry.isCurrentPlayer && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00F0FF]/20 text-[#00F0FF] font-mono border border-[#00F0FF]/40">
                          BẠN
                        </span>
                      )}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                      <span style={{ color: rankInfo.color }}>{rankInfo.title}</span>
                      <span>•</span>
                      <span>{entry.signatureFaction.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Elo & Winrate */}
                <div className="text-right">
                  <span className="font-display font-bold text-sm text-[#FFD700]">
                    {entry.elo}{' '}
                    <span className="text-[10px] font-mono text-gray-400 font-normal">ELO</span>
                  </span>
                  <div className="text-[10px] font-mono text-gray-400">
                    Tỷ lệ thắng: <span className="text-white font-bold">{entry.winRatePercent}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
