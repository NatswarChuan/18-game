import React from 'react';
import { MatchFormat, SeriesScore } from '@valkyrie/shared-domain';

export interface TopEsportsHudProps {
  readonly playerRankInfo: { readonly color: string; readonly title: string };
  readonly playerElo: number;
  readonly seriesScore: SeriesScore;
  readonly matchFormat: MatchFormat;
  readonly roundNumber: number;
  readonly isCombatActive: boolean;
  readonly combatEventsCount: number;
  readonly isLogOpen: boolean;
  readonly isAudioMuted: boolean;
  readonly isStreamerMode: boolean;
  readonly onOpenLeaderboard: () => void;
  readonly onToggleLog: () => void;
  readonly onOpenGuide: () => void;
  readonly onToggleAudio: () => void;
  readonly onToggleStreamerMode: () => void;
  readonly onRestart: () => void;
  readonly onOpenStudio?: (() => void) | undefined;
}

export const TopEsportsHud: React.FC<TopEsportsHudProps> = ({
  playerRankInfo,
  playerElo,
  seriesScore,
  matchFormat,
  roundNumber,
  isCombatActive,
  combatEventsCount,
  isLogOpen,
  isAudioMuted,
  isStreamerMode,
  onOpenLeaderboard,
  onToggleLog,
  onOpenGuide,
  onToggleAudio,
  onToggleStreamerMode,
  onRestart,
  onOpenStudio
}) => {
  return (
    <header className="h-[36px] min-h-[36px] flex-shrink-0 px-3 flex items-center justify-between border-b border-white/10 glass-panel z-20">
      {/* Left: Player Profile & Elo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#FF2A85] to-[#00F0FF] flex items-center justify-center font-display font-black text-xs text-white shadow-sm">
          V
        </div>
        <span className="font-display font-bold text-xs text-white tracking-wide hidden sm:inline">
          Commander Alpha
        </span>
        <button
          onClick={onOpenLeaderboard}
          className="px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-all border"
          style={{
            borderColor: `${playerRankInfo.color}80`,
            backgroundColor: `${playerRankInfo.color}20`,
            color: playerRankInfo.color
          }}
          title="Bảng Xếp Hạng Đấu Hạng"
        >
          🏆 {playerRankInfo.title} ({playerElo})
        </button>
      </div>

      {/* Center: Match Series Score & Phase Tracker */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono">
          <span className="font-display font-bold text-[#00F0FF]">{seriesScore.playerWins}</span>
          <span className="text-gray-500 font-bold">-</span>
          <span className="font-display font-bold text-[#FF2A85]">{seriesScore.opponentWins}</span>
          <span className="text-[9px] text-gray-400">({matchFormat})</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#FFD700]/15 to-[#FF2A85]/15 border border-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-ping" />
          <span className="font-display font-bold text-[10px] text-[#FFD700] tracking-wider uppercase">
            ROUND {roundNumber} • {isCombatActive ? 'GIAO TRANH 20HZ' : 'BỐ TRÍ ĐỘI HÌNH'}
          </span>
        </div>
      </div>

      {/* Right: Actions & Audio Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleLog}
          className={`px-2 py-0.5 rounded border font-mono text-[10px] transition-colors flex items-center gap-1 ${
            isLogOpen
              ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]'
              : 'border-white/20 bg-white/5 text-gray-300 hover:text-white'
          }`}
          title="Mở nhật ký giao tranh 20Hz"
        >
          <span>📜</span>
          <span className="hidden sm:inline">LOG</span>
          <span className="text-[9px] text-gray-400 font-mono">({combatEventsCount})</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="px-2 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[10px] text-gray-300 hover:border-[#00F0FF] hover:text-white transition-colors"
          title="Hướng dẫn quy tắc 3x3"
        >
          ℹ️ QUY TẮC
        </button>

        <button
          onClick={onToggleAudio}
          className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[10px] text-gray-300 hover:border-[#00F0FF] hover:text-white transition-colors"
          title="Bật/Tắt âm thanh Web Audio"
        >
          {isAudioMuted ? '🔇' : '🔊'}
        </button>

        <button
          onClick={onToggleStreamerMode}
          className={`px-1.5 py-0.5 rounded border font-mono text-[10px] transition-colors ${
            isStreamerMode
              ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]'
              : 'border-white/20 bg-white/5 text-gray-300 hover:border-[#FF2A85]'
          }`}
          title="Chuyển đổi SFW Streamer Mode / 16+ Tactical Mode"
        >
          {isStreamerMode ? '🛡️ SFW' : '⚔️ 16+'}
        </button>

        {onOpenStudio && (
          <button
            onClick={onOpenStudio}
            className="px-2 py-0.5 rounded border border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black font-display font-black text-[9.5px] transition-all shadow-[0_0_8px_rgba(0,240,255,0.3)] animate-pulse"
            title="Mở phòng Lab 3D Studio để soi chi tiết từng Valkyrie"
          >
            💃 3D STUDIO
          </button>
        )}

        <button
          onClick={onRestart}
          className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[10px] text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
          title="Khởi động lại ván đấu mới"
        >
          🔄
        </button>
      </div>
    </header>
  );
};
