import React, { useState, useEffect } from 'react';
import {
  FactionId, SlotIndex, UnitPlacement, VALKYRIE_ROSTER, getValkyrieById
} from '@valkyrie/shared-domain';
import { GameBoard } from './components/GameBoard.js';
import { TacticalLeftWing } from './components/TacticalLeftWing.js';
import { CombatRightWing } from './components/CombatRightWing.js';
import { TopEsportsHud } from './components/TopEsportsHud.js';
import { BottomDockRail } from './components/BottomDockRail.js';
import { MatchEvaluationOverlay } from './components/MatchEvaluationOverlay.js';
import { AppModals } from './components/AppModals.js';
import { CyberGamerToast, CyberToastData } from './components/CyberGamerToast.js';
import { Valkyrie3DStudio } from './components/Valkyrie3DStudio.js';
import type { UltimateCutInData } from './components/UltimateCutInBanner.js';
import { TACTICAL_PRESETS, TacticalPresetType } from './utils/tactical-presets.js';
import { usePlayerElo } from './hooks/usePlayerElo.js';
import { useEsportsHotkeys } from './hooks/useEsportsHotkeys.js';
import { soundManager } from './utils/sound.js';
import { useGameWebSocket } from './hooks/useGameWebSocket.js';

/**
 * Main Web Game Arena Viewport (VALKYRIE PROTOCOL: ZERO).
 * Đấu trường Web Game toàn màn hình chuẩn Esports Auto-Battler 60-120 FPS.
 */
export const App: React.FC = () => {
  const playerId = 'player_me';
  const displayName = 'Commander_Alpha';
  const { state, selectBuff, updateFormation, lockFormation } = useGameWebSocket(playerId, displayName);

  // 3D Inspection Studio Route / Query Param State (?mode=model-viewer or ?valk=VALK-01)
  const [studioValkId, setStudioValkId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'VALK-01';
    const params = new URLSearchParams(window.location.search);
    return params.get('valk') || params.get('valkId') || 'VALK-01';
  });

  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'model-viewer' || params.has('valk') || window.location.hash.includes('model-viewer');
  });

  const [selectedBenchValkyrie, setSelectedBenchValkyrie] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<SlotIndex | null>(null);
  const [inspectingValkyrieId, setInspectingValkyrieId] = useState<string | null>(null);
  const [activeCutIn, setActiveCutIn] = useState<UltimateCutInData | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false), [isStreamerMode, setIsStreamerMode] = useState(false);
  const [benchFaction, setBenchFaction] = useState<FactionId | 'ALL'>('ALL');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false), [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false), [combatSpeed, setCombatSpeed] = useState<1 | 2>(1);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null), [hoveredFaction, setHoveredFaction] = useState<FactionId | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [toast, setToast] = useState<CyberToastData | null>(null);

  const showToast = (text: string, type: 'INFO' | 'WARN' | 'SUCCESS' = 'INFO'): void => {
    setToast({ text, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast?.id]);

  // Synchronize audio mute state with Web Audio engine
  useEffect(() => {
    soundManager.setMuted(isAudioMuted);
  }, [isAudioMuted]);

  const { playerElo, playerRankInfo } = usePlayerElo(state.phase, state.matchWinnerId, playerId);

  const applyPreset = (presetName: TacticalPresetType): void => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;
    const preset = TACTICAL_PRESETS[presetName];
    if (preset) {
      updateFormation([...preset]);
      setSelectedSlotIndex(null);
      soundManager.playPlaceUnit();
      const name = presetName === 'VANGUARD' ? '🛡️ Tiên Phong' : presetName === 'FLANK' ? '⚡ Đột Kích' : '🏰 Boongke';
      showToast(`Đã chuyển chiến thuật sang ${name}!`, 'SUCCESS');
    }
  };

  const filteredValkyries = benchFaction === 'ALL'
    ? VALKYRIE_ROSTER
    : VALKYRIE_ROSTER.filter((v) => v.faction === benchFaction);

  const handleSelectBenchValkyrie = (valkId: string | null): void => {
    if (!valkId) {
      setSelectedBenchValkyrie(null);
      return;
    }
    // If a board slot is already selected and empty, place the bench valkyrie into it
    if (selectedSlotIndex !== null) {
      const targetOccupant = state.playerFormation.find((p) => p.slotIndex === selectedSlotIndex);
      if (!targetOccupant) {
        if (state.playerFormation.length >= 6) {
          showToast('⚠️ Đội hình đã đủ 6 quân! Nhấp quân trên bàn cờ để hoán đổi.', 'WARN');
          return;
        }
        const filtered = state.playerFormation.filter((p) => p.valkyrieId !== valkId);
        updateFormation([...filtered, { valkyrieId: valkId, slotIndex: selectedSlotIndex }]);
        setSelectedSlotIndex(null);
        setSelectedBenchValkyrie(null);
        soundManager.playPlaceUnit();
        const valk = getValkyrieById(valkId);
        showToast(`⚡ Đã xuất chiến ${valk?.name ?? valkId} vào ô #${selectedSlotIndex + 1}!`, 'SUCCESS');
        return;
      }
    }
    setSelectedBenchValkyrie((prev) => (prev === valkId ? null : valkId));
  };

  const handleSlotClick = (slotIndex: SlotIndex): void => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;

    // Case 1: Deploying unit selected from dock
    if (selectedBenchValkyrie) {
      const existing = state.playerFormation.find((p) => p.slotIndex === slotIndex);
      if (!existing && state.playerFormation.length >= 6) {
        showToast('⚠️ Đội hình đã đủ 6 quân! Nhấp quân trên bàn cờ để hoán đổi, hoặc nhấn [R] để thu hồi.', 'WARN');
        return;
      }
      const filtered = state.playerFormation.filter(
        (p) => p.slotIndex !== slotIndex && p.valkyrieId !== selectedBenchValkyrie
      );
      updateFormation([...filtered, { valkyrieId: selectedBenchValkyrie, slotIndex }]);
      setSelectedBenchValkyrie(null);
      setSelectedSlotIndex(null);
      soundManager.playPlaceUnit();
      showToast(existing ? '⇄ Đã hoán đổi vị trí xuất trận!' : '⚡ Đã bố trí quân vào vị trí!', 'SUCCESS');
      return;
    }

    // Case 2: A board slot is already selected
    if (selectedSlotIndex !== null) {
      if (selectedSlotIndex === slotIndex) {
        setSelectedSlotIndex(null);
        return;
      }
      const targetUnit = state.playerFormation.find((p) => p.slotIndex === slotIndex);
      const sourceUnit = state.playerFormation.find((p) => p.slotIndex === selectedSlotIndex);

      if (sourceUnit && targetUnit) {
        const next = state.playerFormation.map((p) => {
          if (p.slotIndex === selectedSlotIndex) return { ...p, slotIndex };
          if (p.slotIndex === slotIndex) return { ...p, slotIndex: selectedSlotIndex };
          return p;
        });
        updateFormation(next);
        soundManager.playSwapUnit();
        showToast('⇄ Đã hoán đổi vị trí giữa 2 Valkyrie!', 'SUCCESS');
      } else if (sourceUnit && !targetUnit) {
        const next = state.playerFormation.map((p) =>
          p.slotIndex === selectedSlotIndex ? { ...p, slotIndex } : p
        );
        updateFormation(next);
        soundManager.playPlaceUnit();
        showToast('➔ Đã di chuyển Valkyrie tới ô mới!', 'SUCCESS');
      } else {
        setSelectedSlotIndex(slotIndex);
        soundManager.playSelectUnit();
        const occupant = state.playerFormation.find((p) => p.slotIndex === slotIndex);
        if (!occupant) {
          showToast(`📍 Đã chọn ô #${slotIndex + 1}. Nhấp 1 Valkyrie bên dưới để xuất chiến!`, 'INFO');
        }
        return;
      }
      setSelectedSlotIndex(null);
      return;
    }

    // Case 3: Select unit or empty slot on board
    setSelectedSlotIndex(slotIndex);
    soundManager.playSelectUnit();
    const occupant = state.playerFormation.find((p) => p.slotIndex === slotIndex);
    if (!occupant) {
      showToast(`📍 Đã chọn ô #${slotIndex + 1}. Nhấp 1 Valkyrie bên dưới để xuất chiến!`, 'INFO');
    }
  };

  const handleDropValkyrie = (
    valkyrieId: string,
    targetSlot: SlotIndex,
    sourceSlot?: SlotIndex | null
  ): void => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;

    let next = [...state.playerFormation];
    if (sourceSlot !== undefined && sourceSlot !== null) {
      const targetOccupant = next.find((p) => p.slotIndex === targetSlot);
      if (targetOccupant) {
        next = next.map((p) => {
          if (p.slotIndex === sourceSlot) return { ...p, slotIndex: targetSlot };
          if (p.slotIndex === targetSlot) return { ...p, slotIndex: sourceSlot };
          return p;
        });
        soundManager.playSwapUnit();
        showToast('⇄ Đã hoán đổi vị trí 2 Valkyrie!', 'SUCCESS');
      } else {
        next = next.map((p) => (p.slotIndex === sourceSlot ? { ...p, slotIndex: targetSlot } : p));
        soundManager.playPlaceUnit();
        showToast('➔ Đã di chuyển Valkyrie!', 'SUCCESS');
      }
      updateFormation(next);
    } else {
      const targetOccupant = next.find((p) => p.slotIndex === targetSlot);
      if (!targetOccupant && next.length >= 6) {
        showToast('⚠️ Đội hình đã đủ 6 quân! Thả đè lên quân có sẵn để hoán đổi.', 'WARN');
        return;
      }
      next = next.filter((p) => p.slotIndex !== targetSlot && p.valkyrieId !== valkyrieId);
      next.push({ valkyrieId, slotIndex: targetSlot });
      updateFormation(next);
      soundManager.playPlaceUnit();
      showToast('⚡ Đã thả Valkyrie vào bàn cờ!', 'SUCCESS');
    }
    setSelectedBenchValkyrie(null);
    setSelectedSlotIndex(null);
  };

  const handleRemoveUnit = (slotIndex: SlotIndex): void => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;
    updateFormation(state.playerFormation.filter((p) => p.slotIndex !== slotIndex));
    if (selectedSlotIndex === slotIndex) setSelectedSlotIndex(null);
    soundManager.playRecallUnit();
    showToast('🗑️ Đã thu hồi Valkyrie về hàng dự bị!', 'INFO');
  };

  const handleClearBoard = (): void => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;
    updateFormation([]);
    setSelectedSlotIndex(null);
    soundManager.playRecallUnit();
    showToast('🗑️ Đã thu hồi toàn bộ đội hình về hàng dự bị!', 'INFO');
  };

  const handleAutoFill = (): void => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;
    const autoTeam: UnitPlacement[] = [
      { valkyrieId: 'VALK-01', slotIndex: 1 }, { valkyrieId: 'VALK-02', slotIndex: 0 },
      { valkyrieId: 'VALK-03', slotIndex: 2 }, { valkyrieId: 'VALK-04', slotIndex: 3 },
      { valkyrieId: 'VALK-05', slotIndex: 5 }, { valkyrieId: 'VALK-06', slotIndex: 7 }
    ];
    updateFormation(autoTeam);
    setSelectedSlotIndex(null);
    soundManager.playPlaceUnit();
    showToast('⚡ Đã tự động xếp 6 quân tối ưu theo Tộc/Hệ!', 'SUCCESS');
  };

  const handleAutoDeploy = (valkId: string): void => {
    if (state.phase !== 'FORMATION_PLACEMENT' && state.phase !== 'MATCHMAKING') return;
    if (state.playerFormation.some((p) => p.valkyrieId === valkId)) {
      showToast('Valkyrie này đã xuất chiến!', 'INFO');
      return;
    }
    if (state.playerFormation.length >= 6) {
      showToast('⚠️ Đội hình đã đạt tối đa 6/6 quân! Nhấp quân trên bàn cờ để hoán đổi.', 'WARN');
      return;
    }
    const occupied = new Set(state.playerFormation.map((p) => p.slotIndex));
    const valk = getValkyrieById(valkId);
    const pref: SlotIndex[] = valk?.role.includes('FRONT') || valk?.role.includes('MELEE')
      ? [1, 0, 2, 4, 3, 5, 7, 6, 8] : [7, 6, 8, 4, 3, 5, 1, 0, 2];
    const target = pref.find((s) => !occupied.has(s));
    if (target !== undefined) {
      updateFormation([...state.playerFormation, { valkyrieId: valkId, slotIndex: target }]);
      soundManager.playPlaceUnit();
      showToast(`⚡ Đã xuất chiến ${valk?.name ?? valkId}!`, 'SUCCESS');
    }
  };

  const handleLockFormation = (): void => {
    if (state.playerFormation.length === 0) {
      showToast('⚠️ Bố trí ít nhất 1 Valkyrie vào bàn cờ trước khi xuất chiến! [Phím F để xếp nhanh]', 'WARN');
      return;
    }
    lockFormation();
  };

  const handleHoverUnit = (valkId: string | null, x: number, y: number): void => {
    setHoveredUnitId(valkId);
    if (valkId) {
      setTooltipPos({ x, y });
    }
  };

  // Keyboard Shortcuts for Hardcore Gamers
  useEsportsHotkeys({
    phase: state.phase,
    isLockedIn: state.isLockedIn,
    onLockFormation: handleLockFormation,
    onClearBoard: handleClearBoard,
    onAutoFill: handleAutoFill,
    onSetSpeed: setCombatSpeed,
    onApplyPreset: applyPreset,
    onEscape: () => {
      setInspectingValkyrieId(null);
      setSelectedBenchValkyrie(null);
      setSelectedSlotIndex(null);
      setIsLeaderboardOpen(false);
      setIsGuideOpen(false);
      setIsLogOpen(false);
    }
  });

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

  // Synchronize 3D Studio mode with browser URL parameters (?mode=model-viewer or ?valk=VALK-01)
  useEffect(() => {
    const handleUrlChange = (): void => {
      const params = new URLSearchParams(window.location.search);
      const isViewer = params.get('mode') === 'model-viewer' || params.has('valk') || window.location.hash.includes('model-viewer');
      setIsStudioOpen(isViewer);
      const valk = params.get('valk') || params.get('valkId');
      if (valk) setStudioValkId(valk);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  if (isStudioOpen) {
    return (
      <Valkyrie3DStudio
        initialValkyrieId={studioValkId}
        onBackToGame={() => {
          setIsStudioOpen(false);
          const url = new URL(window.location.href);
          url.searchParams.delete('mode');
          url.searchParams.delete('valk');
          url.searchParams.delete('valkId');
          window.history.pushState({}, '', url.pathname);
        }}
      />
    );
  }

  const isCombatActive = state.phase === 'BATTLE_SIMULATION';

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col justify-between bg-black text-white select-none relative">
      {/* 1. TOP ULTRA-SLIM ESPORTS HUD (Fixed 36px Header) */}
      <TopEsportsHud
        playerRankInfo={playerRankInfo} playerElo={playerElo}
        seriesScore={state.seriesScore} matchFormat={state.format}
        roundNumber={state.roundNumber} isCombatActive={isCombatActive}
        combatEventsCount={state.combatEvents.length} isLogOpen={isLogOpen}
        isAudioMuted={isAudioMuted} isStreamerMode={isStreamerMode}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onToggleLog={() => setIsLogOpen(!isLogOpen)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
        onToggleStreamerMode={() => setIsStreamerMode(!isStreamerMode)}
        onRestart={() => window.location.reload()}
        onOpenStudio={() => {
          setIsStudioOpen(true);
          const url = new URL(window.location.href);
          url.searchParams.set('mode', 'model-viewer');
          window.history.pushState({}, '', url.toString());
        }}
      />

      {/* Esports Tactical Floating Feedback Toast */}
      <CyberGamerToast toast={toast} />

      {/* 2. 3-COLUMN TACTICAL BATTLE THEATER (1536px Space Optimization) */}
      <main className="flex-1 min-h-0 overflow-hidden flex items-center justify-between px-3 py-1 gap-2.5 relative">
        {/* Left Wing: Commander Deck & Faction Synergies */}
        <TacticalLeftWing
          playerFormation={state.playerFormation}
          chosenBuffId={state.chosenBuffId}
          isCombatActive={isCombatActive}
          onHoverFaction={setHoveredFaction}
        />

        {/* Center: 2.5D Isometric Stadium */}
        <div className="flex-1 min-w-0 flex items-center justify-center h-full overflow-hidden">
          <GameBoard
            playerFormation={state.playerFormation} opponentFormation={state.opponentFormation}
            combatEntities={state.combatEntities} combatEvents={state.combatEvents}
            isCombatActive={isCombatActive} combatSpeed={combatSpeed}
            selectedSlotIndex={selectedSlotIndex}
            hasBenchSelection={!!selectedBenchValkyrie}
            hoveredFaction={hoveredFaction}
            onSlotClick={handleSlotClick}
            onDropValkyrie={handleDropValkyrie}
            onRemoveUnit={handleRemoveUnit}
            onInspect={setInspectingValkyrieId}
            onHoverUnit={handleHoverUnit}
            onClearBoard={handleClearBoard}
            onAutoFill={handleAutoFill}
            onToggleSpeed={() => setCombatSpeed((s) => (s === 1 ? 2 : 1))}
            onLockFormation={handleLockFormation}
          />
        </div>

        {/* Right Wing: Live 20Hz Telemetry & Combat Stream */}
        <CombatRightWing
          combatEntities={state.combatEntities}
          combatEvents={state.combatEvents}
          isCombatActive={isCombatActive}
          roundNumber={state.roundNumber}
          opponentFormation={state.opponentFormation}
          onApplyPreset={applyPreset}
        />
      </main>

      {/* 3. BOTTOM FLOATING DOCK RAIL (84px Floating Dock) */}
      <BottomDockRail
        benchFaction={benchFaction}
        onSelectBenchFaction={setBenchFaction}
        onApplyPreset={applyPreset}
        filteredValkyries={filteredValkyries}
        selectedBenchValkyrie={selectedBenchValkyrie}
        onSelectBenchValkyrie={handleSelectBenchValkyrie}
        playerFormation={state.playerFormation}
        phase={state.phase}
        isLockedIn={state.isLockedIn}
        isCombatActive={isCombatActive}
        onLockFormation={handleLockFormation}
        onInspect={setInspectingValkyrieId}
        onHoverUnit={handleHoverUnit}
        onRecallSlot={handleRemoveUnit}
        onAutoDeploy={handleAutoDeploy}
        onSelectSlot={setSelectedSlotIndex}
        selectedSlotIndex={selectedSlotIndex}
      />

      {/* 4. MODALS, DRAWERS & OVERLAYS */}
      <AppModals
        combatEvents={state.combatEvents}
        isLogOpen={isLogOpen}
        onCloseLog={() => setIsLogOpen(false)}
        isGuideOpen={isGuideOpen}
        onCloseGuide={() => setIsGuideOpen(false)}
        isDraftActive={state.phase === 'BUFF_DRAFTING'}
        draftBuffs={state.draftBuffs}
        draftTimeoutSeconds={state.draftTimeoutSeconds}
        chosenBuffId={state.chosenBuffId}
        onSelectBuff={selectBuff}
        inspectingValkyrieId={inspectingValkyrieId}
        onCloseInspect={() => setInspectingValkyrieId(null)}
        activeCutIn={activeCutIn}
        onDismissCutIn={() => setActiveCutIn(null)}
        isLeaderboardOpen={isLeaderboardOpen}
        playerElo={playerElo}
        onCloseLeaderboard={() => setIsLeaderboardOpen(false)}
        hoveredUnitId={hoveredUnitId}
        tooltipPos={tooltipPos}
      />

      {/* Esports Round Evaluation & Match Victory/Defeat Overlay */}
      <MatchEvaluationOverlay
        phase={state.phase}
        roundNumber={state.roundNumber}
        seriesScore={state.seriesScore}
        matchFormat={state.format}
        matchWinnerId={state.matchWinnerId}
        playerId={playerId}
        onNewMatch={() => window.location.reload()}
      />
    </div>
  );
};

export default App;
