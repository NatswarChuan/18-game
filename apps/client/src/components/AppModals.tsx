import React from 'react';
import { BuffDefinition, CombatEventItem } from '@valkyrie/shared-domain';
import { CombatLog } from './CombatLog.js';
import { DraftModal } from './DraftModal.js';
import { ValkyrieModal } from './ValkyrieModal.js';
import { LeaderboardModal } from './LeaderboardModal.js';
import { TacticalGuideModal } from './TacticalGuideModal.js';
import { UltimateCutInBanner, UltimateCutInData } from './UltimateCutInBanner.js';
import { TacticalUnitTooltip } from './TacticalUnitTooltip.js';

export interface AppModalsProps {
  readonly combatEvents: readonly CombatEventItem[];
  readonly isLogOpen: boolean;
  readonly onCloseLog: () => void;
  readonly isGuideOpen: boolean;
  readonly onCloseGuide: () => void;
  readonly isDraftActive: boolean;
  readonly draftBuffs: readonly BuffDefinition[];
  readonly draftTimeoutSeconds: number;
  readonly chosenBuffId: string | null;
  readonly onSelectBuff: (buffId: string) => void;
  readonly inspectingValkyrieId: string | null;
  readonly onCloseInspect: () => void;
  readonly activeCutIn: UltimateCutInData | null;
  readonly onDismissCutIn: () => void;
  readonly isLeaderboardOpen: boolean;
  readonly playerElo: number;
  readonly onCloseLeaderboard: () => void;
  readonly hoveredUnitId: string | null;
  readonly tooltipPos: { readonly x: number; readonly y: number };
}

/**
 * Overlay modals container for VALKYRIE PROTOCOL: ZERO.
 * Đóng gói toàn bộ hộp thoại chi viện, hướng dẫn, nhật ký, bảng xếp hạng và tooltip.
 */
export const AppModals: React.FC<AppModalsProps> = (props) => {
  const {
    combatEvents, isLogOpen, onCloseLog, isGuideOpen, onCloseGuide,
    isDraftActive, draftBuffs, draftTimeoutSeconds, chosenBuffId, onSelectBuff,
    inspectingValkyrieId, onCloseInspect, activeCutIn, onDismissCutIn,
    isLeaderboardOpen, playerElo, onCloseLeaderboard, hoveredUnitId, tooltipPos
  } = props;

  return (
    <>
      <CombatLog
        events={combatEvents}
        isOpen={isLogOpen}
        onClose={onCloseLog}
      />

      <TacticalGuideModal
        isOpen={isGuideOpen}
        onClose={onCloseGuide}
      />

      {isDraftActive && draftBuffs.length > 0 && !chosenBuffId && (
        <DraftModal
          buffs={draftBuffs}
          timeoutSeconds={draftTimeoutSeconds}
          onSelectBuff={onSelectBuff}
          chosenBuffId={chosenBuffId}
        />
      )}

      <ValkyrieModal
        valkyrieId={inspectingValkyrieId}
        onClose={onCloseInspect}
      />

      <UltimateCutInBanner
        cutIn={activeCutIn}
        onDismiss={onDismissCutIn}
      />

      <LeaderboardModal
        playerElo={playerElo}
        isOpen={isLeaderboardOpen}
        onClose={onCloseLeaderboard}
      />

      <TacticalUnitTooltip
        valkyrieId={hoveredUnitId}
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={!!hoveredUnitId}
      />
    </>
  );
};
