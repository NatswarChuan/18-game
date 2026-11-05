import React from 'react';
import { GamePhase, MatchFormat, SeriesScore } from '@valkyrie/shared-domain';

export interface MatchEvaluationOverlayProps {
  readonly phase: GamePhase;
  readonly roundNumber: number;
  readonly seriesScore: SeriesScore;
  readonly matchFormat: MatchFormat;
  readonly matchWinnerId: string | null;
  readonly playerId: string;
  readonly onNewMatch: () => void;
}

/**
 * Match evaluation and victory/defeat overlay modal.
 * Màn hình tổng kết Round và hiển thị Vinh Quang Chiến Thắng / Thất Trận chuẩn Esports.
 */
export const MatchEvaluationOverlay: React.FC<MatchEvaluationOverlayProps> = ({
  phase,
  roundNumber,
  seriesScore,
  matchFormat,
  matchWinnerId,
  playerId,
  onNewMatch
}) => {
  if (phase === 'ROUND_EVALUATION') {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-none">
        <div className="glass-panel p-5 text-center max-w-sm w-full border-2 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.4)]">
          <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider block mb-1">
            KẾT QUẢ ROUND {roundNumber}
          </span>
          <h3 className="font-display font-black text-xl text-white tracking-widest mb-3">
            ROUND HOÀN TẤT
          </h3>
          <div className="flex items-center justify-center gap-4 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 mb-3">
            <div className="text-center">
              <span className="text-[9px] font-mono text-gray-400 block">BẠN</span>
              <span className="font-display font-black text-2xl text-[#00F0FF]">
                {seriesScore.playerWins}
              </span>
            </div>
            <span className="font-display font-bold text-gray-500 text-lg">-</span>
            <div className="text-center">
              <span className="text-[9px] font-mono text-gray-400 block">ĐỐI THỦ</span>
              <span className="font-display font-black text-2xl text-[#FF2A85]">
                {seriesScore.opponentWins}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono animate-pulse">
            Đang chuẩn bị tiến vào Round {roundNumber + 1}...
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'MATCH_OVER') {
    const isWinner = matchWinnerId === playerId;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
        <div className="glass-panel p-6 text-center max-w-md w-full border-2 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.4)]">
          <h2 className="font-display font-black text-2xl text-white mb-2 tracking-widest">
            {isWinner ? '🏆 CHIẾN THẮNG QUANG VINH!' : '⚔️ KẾT THÚC TRẬN ĐẤU'}
          </h2>
          <p className="text-sm text-gray-300 mb-5">
            Chuỗi trận {matchFormat} đã khép lại với tỷ số {seriesScore.playerWins} - {seriesScore.opponentWins}.
          </p>
          <button
            onClick={onNewMatch}
            className="cyber-button text-xs px-8 py-2.5 neon-glow-primary"
          >
            CHƠI VÁN MỚI ➔
          </button>
        </div>
      </div>
    );
  }

  return null;
};
