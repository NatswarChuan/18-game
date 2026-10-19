import React, { useState, useEffect } from 'react';
import {
  FactionId,
  SlotIndex,
  UnitPlacement,
  VALKYRIE_ROSTER,
  getValkyrieById,
  getRankTierFromElo
} from '@valkyrie/shared-domain';
import { CombatLog } from './components/CombatLog.js';
import { DraftModal } from './components/DraftModal.js';
import { GameBoard } from './components/GameBoard.js';
import { ValkyrieModal } from './components/ValkyrieModal.js';
import { LeaderboardModal } from './components/LeaderboardModal.js';
import { TacticalGuideModal } from './components/TacticalGuideModal.js';
import { UltimateCutInBanner, UltimateCutInData } from './components/UltimateCutInBanner.js';
import { useGameWebSocket } from './hooks/useGameWebSocket.js';

/**
 * Main Web Game Arena Viewport (VALKYRIE PROTOCOL: ZERO).
 * Đấu trường Web Game toàn màn hình chuẩn Esports Auto-Battler 60-120 FPS.
 */
export const App: React.FC = () => {
  const playerId = 'player_me';
  const displayName = 'Commander_Alpha';
  const { state, selectBuff, updateFormation, lockFormation } = useGameWebSocket(playerId, displayName);

  const [selectedBenchValkyrie, setSelectedBenchValkyrie] = useState<string | null>(null);
  const [inspectingValkyrieId, setInspectingValkyrieId] = useState<string | null>(null);
  const [activeCutIn, setActiveCutIn] = useState<UltimateCutInData | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isStreamerMode, setIsStreamerMode] = useState(false);
  const [benchFaction, setBenchFaction] = useState<FactionId | 'ALL'>('ALL');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const [playerElo, setPlayerElo] = useState<number>(() => {
    const saved = localStorage.getItem('valkyrie_elo');
    return saved ? parseInt(saved, 10) : 1525;
  });

  const playerRankInfo = getRankTierFromElo(playerElo);

  // Update Elo on match completion
  useEffect(() => {
    if (state.phase === 'MATCH_OVER') {
      const isWinner = state.matchWinnerId === playerId;
      const delta = isWinner ? 25 : -25;
      setPlayerElo((prev) => {
        const nextElo = Math.max(0, prev + delta);
        localStorage.setItem('valkyrie_elo', nextElo.toString());
        return nextElo;
      });
    }
  }, [state.phase, state.matchWinnerId, playerId]);

  const applyPreset = (presetName: 'VANGUARD' | 'FLANK' | 'BUNKER') => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;
    let preset: UnitPlacement[] = [];
    if (presetName === 'VANGUARD') {
      preset = [
        { valkyrieId: 'VALK-01', slotIndex: 1 },
        { valkyrieId: 'VALK-02', slotIndex: 0 },
        { valkyrieId: 'VALK-07', slotIndex: 2 }
      ];
    } else if (presetName === 'FLANK') {
      preset = [
        { valkyrieId: 'VALK-03', slotIndex: 3 },
        { valkyrieId: 'VALK-11', slotIndex: 1 },
        { valkyrieId: 'VALK-12', slotIndex: 5 }
      ];
    } else if (presetName === 'BUNKER') {
      preset = [
        { valkyrieId: 'VALK-02', slotIndex: 1 },
        { valkyrieId: 'VALK-04', slotIndex: 6 },
        { valkyrieId: 'VALK-05', slotIndex: 8 }
      ];
    }
    updateFormation(preset);
  };

  // Filter reserve Valkyries across 3 factions (all 27 Valkyries)
  const filteredValkyries = benchFaction === 'ALL'
    ? VALKYRIE_ROSTER
    : VALKYRIE_ROSTER.filter((v) => v.faction === benchFaction);

  const handleSlotClick = (slotIndex: SlotIndex) => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;

    if (selectedBenchValkyrie) {
      // Place selected valkyrie into this slot
      const existing = state.playerFormation.filter((p) => p.slotIndex !== slotIndex);
      const newFormation: UnitPlacement[] = [
        ...existing,
        { valkyrieId: selectedBenchValkyrie, slotIndex }
      ];
      updateFormation(newFormation);
      setSelectedBenchValkyrie(null);
    } else {
      // If clicking existing unit, remove it
      const existing = state.playerFormation.find((p) => p.slotIndex === slotIndex);
      if (existing) {
        const remaining = state.playerFormation.filter((p) => p.slotIndex !== slotIndex);
        updateFormation(remaining);
      }
    }
  };

  const handleDropValkyrie = (valkyrieId: string, slotIndex: SlotIndex) => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;
    const existing = state.playerFormation.filter((p) => p.slotIndex !== slotIndex && p.valkyrieId !== valkyrieId);
    const newFormation: UnitPlacement[] = [
      ...existing,
      { valkyrieId, slotIndex }
    ];
    updateFormation(newFormation);
    setSelectedBenchValkyrie(null);
  };

  // Detect Climax Ultimate cast events to show dramatic anime cut-in banner
  useEffect(() => {
    if (state.phase !== 'BATTLE_SIMULATION') {
      setActiveCutIn(null);
      return;
    }
    const lastEvent = state.combatEvents[state.combatEvents.length - 1];
    if (lastEvent && lastEvent.eventType === 'ULTIMATE_CAST' && lastEvent.sourceEntityId) {
      const castingEntity = state.combatEntities.find((e) => e.id === lastEvent.sourceEntityId);
      if (castingEntity) {
        const valk = getValkyrieById(castingEntity.valkyrieId);
        if (valk) {
          setActiveCutIn({
            valkyrieId: valk.id,
            ultimateName: valk.ultimate.name,
            isEnemy: castingEntity.ownerId !== playerId
          });
        }
      }
    }
  }, [state.combatEvents, state.phase, state.combatEntities, playerId]);

  const isCombatActive = state.phase === 'BATTLE_SIMULATION';

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col justify-between bg-black text-white select-none relative">
      {/* 1. TOP GAMING HUD (Fixed 48px Header) */}
      <header className="h-[48px] flex-shrink-0 px-3 py-1 flex items-center justify-between border-b border-white/10 glass-panel z-20">
        {/* Left: Player Profile & Elo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF2A85] to-[#00F0FF] flex items-center justify-center font-display font-black text-sm text-white shadow-md">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xs text-white tracking-wide">
                Commander Alpha
              </span>
              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="px-2 py-0.2 rounded text-[9px] font-mono font-bold transition-all border"
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
            <span className="text-[9px] text-gray-400 font-mono block leading-none">
              VALKYRIE PROTOCOL: ZERO • 20HZ
            </span>
          </div>
        </div>

        {/* Center: Match Score & Phase Emblem */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
            <span className="font-display font-black text-base text-[#00F0FF]">
              {state.seriesScore.playerWins}
            </span>
            <span className="text-gray-500 font-bold text-xs">-</span>
            <span className="font-display font-black text-base text-[#FF2A85]">
              {state.seriesScore.opponentWins}
            </span>
            <span className="text-[10px] font-mono text-gray-400 ml-1">
              ({state.format})
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#FFD700]/15 to-[#FF2A85]/15 border border-[#FFD700]/30 shadow-[0_0_12px_rgba(255,215,0,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
            <span className="font-display font-black text-xs text-[#FFD700] tracking-wider">
              ROUND {state.roundNumber}
            </span>
            <span className="text-[10px] font-mono text-gray-300 ml-1">
              • {isCombatActive ? 'GIAO TRANH 20HZ' : 'BỐ TRÍ ĐỘI HÌNH'}
            </span>
          </div>
        </div>

        {/* Right: Actions & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Combat Log Drawer Button */}
          <button
            onClick={() => setIsLogOpen(!isLogOpen)}
            className={`px-2 py-1 rounded-lg border font-mono text-xs transition-colors flex items-center gap-1 ${
              isLogOpen
                ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]'
                : 'border-white/20 bg-white/5 text-gray-300 hover:text-white'
            }`}
            title="Mở nhật ký giao tranh 20Hz"
          >
            <span>📜</span>
            <span className="hidden sm:inline">LOG</span>
            <span className="text-[10px] text-gray-400 font-mono">({state.combatEvents.length})</span>
          </button>

          {/* Tactical Guide Modal Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-2 py-1 rounded-lg border border-white/20 bg-white/5 font-mono text-xs text-gray-300 hover:border-[#00F0FF] hover:text-white transition-colors"
            title="Hướng dẫn quy tắc 3x3"
          >
            ℹ️ QUY TẮC
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="px-2 py-1 rounded-lg border border-white/20 bg-white/5 font-mono text-xs text-gray-300 hover:border-[#00F0FF] hover:text-white transition-colors"
            title="Bật/Tắt âm thanh Web Audio"
          >
            {isAudioMuted ? '🔇' : '🔊'}
          </button>

          {/* SFW / 16+ Switch */}
          <button
            onClick={() => setIsStreamerMode(!isStreamerMode)}
            className={`px-2 py-1 rounded-lg border font-mono text-xs transition-colors ${
              isStreamerMode
                ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]'
                : 'border-white/20 bg-white/5 text-gray-300 hover:border-[#FF2A85]'
            }`}
            title="Chuyển đổi SFW Streamer Mode / 16+ Tactical Mode"
          >
            {isStreamerMode ? '🛡️ SFW' : '⚔️ 16+'}
          </button>

          {/* Quick Restart */}
          <button
            onClick={() => window.location.reload()}
            className="px-2 py-1 rounded-lg border border-white/20 bg-white/5 font-mono text-xs text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
            title="Khởi động lại ván đấu mới"
          >
            🔄
          </button>
        </div>
      </header>

      {/* 2. CENTRAL BATTLEFIELD (Fixed Viewport Stage) */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center p-1 md:p-2 relative">
        <GameBoard
          playerFormation={state.playerFormation}
          opponentFormation={state.opponentFormation}
          combatEntities={state.combatEntities}
          isCombatActive={isCombatActive}
          onSlotClick={handleSlotClick}
          onDropValkyrie={handleDropValkyrie}
          onInspect={setInspectingValkyrieId}
        />
      </main>

      {/* 3. BOTTOM COMMAND DECK & BENCH (Docked 115px Bar) */}
      <footer className="h-[120px] md:h-[128px] flex-shrink-0 border-t border-white/10 glass-panel px-3 py-1.5 flex flex-col justify-between z-20">
        {/* Top Control Bar: Faction Filters, Presets, and Lock CTA */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
          {/* Faction Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-gray-400 uppercase hidden sm:inline mr-1">
              PHE:
            </span>
            {(['ALL', 'NEO_VALHALLA', 'ABYSSAL_EDEN', 'SOL_DYNASTY'] as const).map((fac) => (
              <button
                key={fac}
                onClick={() => setBenchFaction(fac)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                  benchFaction === fac
                    ? 'bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/60 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {fac === 'ALL' ? 'TẤT CẢ (27)' : fac.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Quick Formation Presets */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-gray-400 uppercase mr-1">
              MẪU NHANH:
            </span>
            <button
              onClick={() => applyPreset('VANGUARD')}
              className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 hover:bg-[#FFD700]/20 border border-white/10 hover:border-[#FFD700] text-gray-300 hover:text-[#FFD700] transition-colors"
              title="3 Tiên phong vững chắc"
            >
              🛡️ Tiên Phong
            </button>
            <button
              onClick={() => applyPreset('FLANK')}
              className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 hover:bg-[#FF2A85]/20 border border-white/10 hover:border-[#FF2A85] text-gray-300 hover:text-[#FF2A85] transition-colors"
              title="Đột kích 2 cánh sườn"
            >
              ⚡ Đột Kích
            </button>
            <button
              onClick={() => applyPreset('BUNKER')}
              className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 hover:bg-[#00F0FF]/20 border border-white/10 hover:border-[#00F0FF] text-gray-300 hover:text-[#00F0FF] transition-colors"
              title="Xạ thủ pháo kích tầm xa"
            >
              🎯 Pháo Đài
            </button>
          </div>

          {/* Lock In / Deployment Action CTA */}
          <div>
            {state.phase === 'FORMATION_PLACEMENT' && !state.isLockedIn && (
              <button
                onClick={lockFormation}
                className="cyber-button text-xs py-1 px-4 neon-glow-primary shadow-[0_0_15px_rgba(255,42,133,0.5)] font-display tracking-wider"
              >
                KHÓA ĐỘI HÌNH & CHIẾN ➔
              </button>
            )}

            {state.isLockedIn && state.phase === 'FORMATION_PLACEMENT' && (
              <span className="px-3 py-1 rounded bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 text-xs font-mono font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                ✓ ĐÃ KHÓA (CHỜ ĐẤU)
              </span>
            )}

            {isCombatActive && (
              <span className="px-3 py-1 rounded bg-red-950/40 text-red-400 border border-red-500/40 text-xs font-mono font-bold animate-pulse">
                ⚡ ĐANG GIAO TRANH 20HZ
              </span>
            )}
          </div>
        </div>

        {/* Bottom Horizontal Bench Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 pt-1">
          {filteredValkyries.map((valk) => {
            const isSelected = selectedBenchValkyrie === valk.id;
            const isAlreadyPlaced = state.playerFormation.some((p) => p.valkyrieId === valk.id);

            return (
              <div
                key={valk.id}
                draggable={!isAlreadyPlaced}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', valk.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => !isAlreadyPlaced && setSelectedBenchValkyrie(valk.id)}
                className={`flex-shrink-0 p-1.5 rounded-lg border transition-all duration-150 cursor-grab active:cursor-grabbing flex items-center gap-2 min-w-[145px] relative ${
                  isSelected
                    ? 'border-[#FF2A85] bg-[#FF2A85]/20 shadow-[0_0_12px_#FF2A85]'
                    : isAlreadyPlaced
                    ? 'opacity-35 border-white/5 bg-black/40 cursor-not-allowed'
                    : 'border-white/10 hover:border-white/30 bg-white/5 hover:scale-102'
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-gradient-to-tr from-[#FF2A85] to-[#8A2BE2] flex-shrink-0 relative shadow-sm">
                  <img
                    src={`/avatars/${valk.id}.jpg`}
                    alt={valk.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-white">
                    {valk.name[0]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[8px] font-mono text-gray-400">
                    <span className="truncate">{valk.role.split('_')[0]}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingValkyrieId(valk.id);
                      }}
                      className="hover:text-[#00F0FF] px-1 text-[9px]"
                      title="Xem chi tiết"
                    >
                      ℹ
                    </button>
                  </div>
                  <div className="font-display font-bold text-[11px] text-white truncate leading-tight">
                    {valk.name}
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono">
                    HP:{valk.stats.maxHp} ATK:{valk.stats.attack}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </footer>

      {/* 4. MODALS, DRAWERS & OVERLAYS */}

      {/* Slide-out Combat Log Drawer */}
      <CombatLog
        events={state.combatEvents}
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
      />

      {/* Tactical Rules Guide Modal */}
      <TacticalGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Draft 9 Buffs Modal */}
      {state.phase === 'BUFF_DRAFTING' && state.draftBuffs.length > 0 && !state.chosenBuffId && (
        <DraftModal
          buffs={state.draftBuffs}
          timeoutSeconds={state.draftTimeoutSeconds}
          onSelectBuff={selectBuff}
          chosenBuffId={state.chosenBuffId}
        />
      )}

      {/* Valkyrie Detail Inspection Modal */}
      <ValkyrieModal
        valkyrieId={inspectingValkyrieId}
        onClose={() => setInspectingValkyrieId(null)}
      />

      {/* Round Evaluation Overlay Banner */}
      {state.phase === 'ROUND_EVALUATION' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-none">
          <div className="glass-panel p-5 text-center max-w-sm w-full border-2 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.4)]">
            <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider block mb-1">
              KẾT QUẢ ROUND {state.roundNumber}
            </span>
            <h3 className="font-display font-black text-xl text-white tracking-widest mb-3">
              ROUND HOÀN TẤT
            </h3>
            <div className="flex items-center justify-center gap-4 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 mb-3">
              <div className="text-center">
                <span className="text-[9px] font-mono text-gray-400 block">BẠN</span>
                <span className="font-display font-black text-2xl text-[#00F0FF]">
                  {state.seriesScore.playerWins}
                </span>
              </div>
              <span className="font-display font-bold text-gray-500 text-lg">-</span>
              <div className="text-center">
                <span className="text-[9px] font-mono text-gray-400 block">ĐỐI THỦ</span>
                <span className="font-display font-black text-2xl text-[#FF2A85]">
                  {state.seriesScore.opponentWins}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-mono animate-pulse">
              Đang chuẩn bị tiến vào Round {state.roundNumber + 1}...
            </p>
          </div>
        </div>
      )}

      {/* Match Over Modal */}
      {state.phase === 'MATCH_OVER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="glass-panel p-6 text-center max-w-md w-full border-2 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.4)]">
            <h2 className="font-display font-black text-2xl text-white mb-2 tracking-widest">
              {state.matchWinnerId === playerId ? '🏆 CHIẾN THẮNG QUANG VINH!' : '⚔️ KẾT THÚC TRẬN ĐẤU'}
            </h2>
            <p className="text-sm text-gray-300 mb-5">
              Chuỗi trận {state.format} đã khép lại với tỷ số {state.seriesScore.playerWins} - {state.seriesScore.opponentWins}.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="cyber-button text-xs px-8 py-2.5 neon-glow-primary"
            >
              CHƠI VÁN MỚI ➔
            </button>
          </div>
        </div>
      )}

      {/* Cinematic Climax Ultimate Cut-In Banner */}
      <UltimateCutInBanner
        cutIn={activeCutIn}
        onDismiss={() => setActiveCutIn(null)}
      />

      {/* Global Ranked Leaderboard Modal */}
      <LeaderboardModal
        playerElo={playerElo}
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
};

export default App;
