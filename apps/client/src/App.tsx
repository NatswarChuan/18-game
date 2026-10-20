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
      {/* 1. TOP ULTRA-SLIM ESPORTS HUD (Fixed 36px Header) */}
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
            onClick={() => setIsLeaderboardOpen(true)}
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
            <span className="font-display font-bold text-[#00F0FF]">{state.seriesScore.playerWins}</span>
            <span className="text-gray-500 font-bold">-</span>
            <span className="font-display font-bold text-[#FF2A85]">{state.seriesScore.opponentWins}</span>
            <span className="text-[9px] text-gray-400">({state.format})</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#FFD700]/15 to-[#FF2A85]/15 border border-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-ping" />
            <span className="font-display font-bold text-[10px] text-[#FFD700] tracking-wider uppercase">
              ROUND {state.roundNumber} • {isCombatActive ? 'GIAO TRANH 20HZ' : 'BỐ TRÍ ĐỘI HÌNH'}
            </span>
          </div>
        </div>

        {/* Right: Actions & Audio Controls */}
        <div className="flex items-center gap-1.5">
          {/* Combat Log Drawer Button */}
          <button
            onClick={() => setIsLogOpen(!isLogOpen)}
            className={`px-2 py-0.5 rounded border font-mono text-[10px] transition-colors flex items-center gap-1 ${
              isLogOpen
                ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]'
                : 'border-white/20 bg-white/5 text-gray-300 hover:text-white'
            }`}
            title="Mở nhật ký giao tranh 20Hz"
          >
            <span>📜</span>
            <span className="hidden sm:inline">LOG</span>
            <span className="text-[9px] text-gray-400 font-mono">({state.combatEvents.length})</span>
          </button>

          {/* Tactical Guide Modal Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-2 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[10px] text-gray-300 hover:border-[#00F0FF] hover:text-white transition-colors"
            title="Hướng dẫn quy tắc 3x3"
          >
            ℹ️ QUY TẮC
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[10px] text-gray-300 hover:border-[#00F0FF] hover:text-white transition-colors"
            title="Bật/Tắt âm thanh Web Audio"
          >
            {isAudioMuted ? '🔇' : '🔊'}
          </button>

          {/* SFW / 16+ Switch */}
          <button
            onClick={() => setIsStreamerMode(!isStreamerMode)}
            className={`px-1.5 py-0.5 rounded border font-mono text-[10px] transition-colors ${
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
            className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[10px] text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
            title="Khởi động lại ván đấu mới"
          >
            🔄
          </button>
        </div>
      </header>

      {/* 2. CENTRAL BATTLEFIELD (540px Unobstructed Space) */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center p-1 relative">
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

      {/* 3. BOTTOM FLOATING DOCK RAIL (84px Floating Dock) */}
      <footer className="h-[84px] flex-shrink-0 floating-dock-rail rounded-2xl mx-2 md:mx-4 mb-2 px-3 py-1 flex items-center justify-between gap-3 z-20">
        {/* Left: Minimalist Faction Chips & Quick Presets */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            {(['ALL', 'NEO_VALHALLA', 'ABYSSAL_EDEN', 'SOL_DYNASTY'] as const).map((fac) => (
              <button
                key={fac}
                onClick={() => setBenchFaction(fac)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold transition-all ${
                  benchFaction === fac
                    ? 'bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/60 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {fac === 'ALL'
                  ? 'TẤT CẢ'
                  : fac === 'NEO_VALHALLA'
                  ? 'VAL'
                  : fac === 'ABYSSAL_EDEN'
                  ? 'EDEN'
                  : 'SOL'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => applyPreset('VANGUARD')}
              className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 hover:bg-[#FFD700]/20 border border-white/10 hover:border-[#FFD700] text-gray-300 hover:text-[#FFD700] transition-colors"
              title="3 Tiên phong"
            >
              🛡️ Tiên Phong
            </button>
            <button
              onClick={() => applyPreset('FLANK')}
              className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 hover:bg-[#FF2A85]/20 border border-white/10 hover:border-[#FF2A85] text-gray-300 hover:text-[#FF2A85] transition-colors"
              title="Đột kích sườn"
            >
              ⚡ Đột Kích
            </button>
          </div>
        </div>

        {/* Center: Horizontal Scrollable Reserve Valkyries */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto scrollbar-thin py-0.5">
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
                className={`flex-shrink-0 p-1 rounded-lg border transition-all duration-150 cursor-grab active:cursor-grabbing flex items-center gap-1.5 w-[136px] h-[58px] relative ${
                  isSelected
                    ? 'border-[#FF2A85] bg-[#FF2A85]/20 shadow-[0_0_12px_#FF2A85]'
                    : isAlreadyPlaced
                    ? 'opacity-35 border-white/5 bg-black/40 cursor-not-allowed'
                    : 'border-white/10 hover:border-white/30 bg-white/5 hover:scale-102'
                }`}
              >
                <div className="w-8 h-8 rounded-md overflow-hidden border border-white/20 bg-black/60 flex-shrink-0 relative shadow-sm">
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
                  <div className="flex items-center justify-between text-[7px] font-mono text-gray-400">
                    <span className="truncate">{valk.role.split('_')[0]}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingValkyrieId(valk.id);
                      }}
                      className="hover:text-[#00F0FF] px-0.5 text-[8px]"
                      title="Chi tiết"
                    >
                      ℹ
                    </button>
                  </div>
                  <div className="font-display font-bold text-[10px] text-white truncate leading-tight">
                    {valk.name}
                  </div>
                  <div className="text-[8px] text-gray-400 font-mono">
                    HP:{valk.stats.maxHp} ATK:{valk.stats.attack}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Battle CTA Button */}
        <div className="flex-shrink-0">
          {state.phase === 'FORMATION_PLACEMENT' && !state.isLockedIn && (
            <button
              onClick={lockFormation}
              className="cyber-button text-xs py-2 px-4 neon-glow-primary shadow-[0_0_15px_rgba(255,42,133,0.6)] font-display tracking-wider font-bold"
            >
              ⚔️ CHIẾN!
            </button>
          )}

          {state.isLockedIn && state.phase === 'FORMATION_PLACEMENT' && (
            <span className="px-3 py-1.5 rounded-lg bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 text-xs font-mono font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              ✓ ĐÃ KHÓA
            </span>
          )}

          {isCombatActive && (
            <span className="px-3 py-1.5 rounded-lg bg-red-950/50 text-red-400 border border-red-500/50 text-xs font-mono font-bold animate-pulse">
              ⚡ 20HZ
            </span>
          )}
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
