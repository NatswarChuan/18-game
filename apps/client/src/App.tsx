import React, { useState, useEffect } from 'react';
import {
  FactionId,
  SlotIndex,
  UnitPlacement,
  VALKYRIE_ROSTER,
  getValkyrieById
} from '@valkyrie/shared-domain';
import { CombatLog } from './components/CombatLog.js';
import { DraftModal } from './components/DraftModal.js';
import { GameBoard } from './components/GameBoard.js';
import { ValkyrieModal } from './components/ValkyrieModal.js';
import { UltimateCutInBanner, UltimateCutInData } from './components/UltimateCutInBanner.js';
import { useGameWebSocket } from './hooks/useGameWebSocket.js';

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
    <div className="min-h-screen flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
      {/* Top Cyberpunk Header */}
      <header className="glass-panel p-4 mb-6 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2A85] to-[#00F0FF] flex items-center justify-center font-display font-black text-xl text-white shadow-lg">
            V
          </div>
          <div>
            <h1 className="font-display font-black text-xl md:text-2xl tracking-wider text-white flex items-center gap-2">
              VALKYRIE PROTOCOL: ZERO
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40">
                {isStreamerMode ? 'SFW STREAMER MODE' : '16+ TACTICAL EDITION'}
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Server-Authoritative 20Hz Auto-Battler • 12D Vector DB Adaptive Buffs
            </p>
          </div>
        </div>

        {/* Center: Controls & Settings */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 font-mono text-xs text-gray-300 hover:border-[#00F0FF] hover:text-white transition-colors"
          >
            {isAudioMuted ? '🔇 SFX TẮT' : '🔊 SFX BẬT'}
          </button>
          <button
            onClick={() => setIsStreamerMode(!isStreamerMode)}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors ${
              isStreamerMode
                ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]'
                : 'border-white/20 bg-white/5 text-gray-300 hover:border-[#FF2A85]'
            }`}
          >
            {isStreamerMode ? '🛡️ SFW MODE' : '⚔️ 16+ MODE'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 font-mono text-xs text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
            title="Khởi động lại ván đấu mới"
          >
            🔄 VÁN MỚI
          </button>
        </div>

        {/* Series Score & Round Badge */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="font-mono text-[10px] text-gray-400 uppercase">THỂ THỨC & TỶ SỐ</span>
            <div className="font-display font-bold text-lg text-white flex items-center gap-2">
              <span className="text-[#00F0FF]">{state.seriesScore.playerWins}</span>
              <span className="text-gray-500">-</span>
              <span className="text-[#FF2A85]">{state.seriesScore.opponentWins}</span>
              <span className="text-xs font-mono text-gray-400">({state.format})</span>
            </div>
          </div>

          <div className="text-center">
            <span className="font-mono text-[10px] text-gray-400 uppercase">ROUND</span>
            <div className="font-display font-bold text-lg text-[#FFD700]">
              ROUND {state.roundNumber}
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                state.connected ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]' : 'bg-red-500'
              }`}
            />
            <span className="font-mono text-xs text-gray-300">
              {state.connected ? 'WS CONNECTED' : 'CONNECTING...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Gameplay Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left 2 Cols: 3x3 Grid & Bench */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Phase Banner */}
          <div className="glass-panel p-4 flex items-center justify-between border border-white/10">
            <div>
              <span className="font-mono text-[10px] text-gray-400 uppercase">TRẠNG THÁI HIỆN TẠI</span>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <span className="text-[#FF2A85]">▶</span> {state.phase.replace('_', ' ')}
              </h3>
            </div>

            {state.phase === 'FORMATION_PLACEMENT' && !state.isLockedIn && (
              <button
                onClick={lockFormation}
                className="cyber-button text-xs px-6 py-2.5 neon-glow-primary"
              >
                KHÓA ĐỘI HÌNH & BẮT ĐẦU ➔
              </button>
            )}

            {state.isLockedIn && state.phase === 'FORMATION_PLACEMENT' && (
              <span className="font-mono text-xs text-[#00F0FF] px-4 py-2 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/30 font-bold">
                ✓ ĐÃ KHÓA ĐỘI HÌNH (CHỜ GIAO TRANH)
              </span>
            )}
          </div>

          {/* 3x3 Tactical Board */}
          <GameBoard
            playerFormation={state.playerFormation}
            opponentFormation={state.opponentFormation}
            combatEntities={state.combatEntities}
            isCombatActive={isCombatActive}
            onSlotClick={handleSlotClick}
            onDropValkyrie={handleDropValkyrie}
            onInspect={setInspectingValkyrieId}
          />

          {/* Reserve Valkyries Bench (All 27 Valkyries with Faction Filters) */}
          {!isCombatActive && (
            <div className="glass-panel p-4 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-xs text-white">
                    HÀNG CHỜ DỰ BỊ ({filteredValkyries.length}/27 CHIẾN BINH)
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">
                    {selectedBenchValkyrie ? `Đã chọn: ${selectedBenchValkyrie}` : 'Kéo thả hoặc nhấp để xếp đội'}
                  </span>
                </div>

                {/* Faction Tabs */}
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'NEO_VALHALLA', 'ABYSSAL_EDEN', 'SOL_DYNASTY'] as const).map((fac) => (
                    <button
                      key={fac}
                      onClick={() => setBenchFaction(fac)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                        benchFaction === fac
                          ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {fac === 'ALL' ? 'TẤT CẢ (27)' : fac.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bench Grid */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
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
                      className={`flex-shrink-0 p-2.5 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing flex items-center gap-2.5 min-w-[170px] relative ${
                        isSelected
                          ? 'border-[#FF2A85] bg-[#FF2A85]/20 shadow-[0_0_12px_#FF2A85]'
                          : isAlreadyPlaced
                          ? 'opacity-40 border-white/5 bg-black/20 cursor-not-allowed'
                          : 'border-white/10 hover:border-white/30 bg-white/5 hover:scale-102'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/20 bg-gradient-to-tr from-[#FF2A85] to-[#8A2BE2] flex-shrink-0 relative">
                        <img
                          src={`/avatars/${valk.id}.jpg`}
                          alt={valk.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">
                          {valk.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                          <span>{valk.role.split('_')[0]}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectingValkyrieId(valk.id);
                            }}
                            className="hover:text-[#00F0FF] px-1"
                            title="Xem chi tiết"
                          >
                            ℹ
                          </button>
                        </div>
                        <div className="font-display font-bold text-xs text-white">
                          {valk.name}
                        </div>
                        <div className="text-[10px] text-gray-300">
                          HP: {valk.stats.maxHp} | ATK: {valk.stats.attack}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Combat Log & Game Stats */}
        <div className="flex flex-col gap-6">
          <CombatLog events={state.combatEvents} />

          {/* Tactical Guide / Information Card */}
          <div className="glass-panel p-4 border border-white/10 flex-1">
            <h4 className="font-display font-bold text-xs text-[#00F0FF] mb-3 flex items-center gap-1.5">
              <span>ℹ️</span> QUY TẮC CHIẾN THUẬT 3x3
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300 leading-relaxed font-sub">
              <p>
                • <strong>Tiên Phong (Hàng 1):</strong> Ô 1, 2, 3 nhận thêm +15% Mana khi bị tấn công, làm lá chắn hút sát thương.
              </p>
              <p>
                • <strong>Đột Kích (Hàng 2):</strong> Ô 4, 5, 6 tăng +10% Tốc độ đánh, tấn công sườn đối phương.
              </p>
              <p>
                • <strong>Trùng Pháo / Yểm Trợ (Hàng 3):</strong> Ô 7, 8, 9 tăng +1 Tầm đánh, được bảo vệ khỏi đòn cận chiến trực diện.
              </p>
              <p>
                • <strong>3 Cấp Độ Rách Giáp (16+):</strong>
                <br />- Tier 1: Pristine (Máu ≥ 70%)
                <br />- Tier 2: Battle-Torn (30% ≤ Máu &lt; 70%)
                <br />- Tier 3: Critical Overdrive (Máu &lt; 30%)
              </p>
            </div>
          </div>
        </div>
      </div>

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
          <div className="glass-panel p-6 text-center max-w-sm w-full border-2 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.4)]">
            <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider block mb-1">
              KẾT QUẢ ROUND {state.roundNumber}
            </span>
            <h3 className="font-display font-black text-2xl text-white tracking-widest mb-3">
              ROUND HOÀN TẤT
            </h3>
            <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-xl bg-white/5 border border-white/10 mb-4">
              <div className="text-center">
                <span className="text-[10px] font-mono text-gray-400 block">BẠN</span>
                <span className="font-display font-black text-2xl text-[#00F0FF]">
                  {state.seriesScore.playerWins}
                </span>
              </div>
              <span className="font-display font-bold text-gray-500 text-lg">-</span>
              <div className="text-center">
                <span className="text-[10px] font-mono text-gray-400 block">ĐỐI THỦ</span>
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
          <div className="glass-panel p-8 text-center max-w-md w-full border-2 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.4)]">
            <h2 className="font-display font-black text-3xl text-white mb-2 tracking-widest">
              {state.matchWinnerId === playerId ? '🏆 CHIẾN THẮNG QUANG VINH!' : '⚔️ KẾT THÚC TRẬN ĐẤU'}
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              Chuỗi trận {state.format} đã khép lại với tỷ số {state.seriesScore.playerWins} - {state.seriesScore.opponentWins}.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="cyber-button text-sm px-8 py-3 neon-glow-primary"
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
    </div>
  );
};

export default App;
