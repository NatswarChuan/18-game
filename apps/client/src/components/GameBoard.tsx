import React from 'react';
import {
  CombatEntitySnapshot,
  CombatEventItem,
  FactionId,
  SlotIndex,
  UnitPlacement
} from '@valkyrie/shared-domain';
import { CyberStadiumCanvas } from './CyberStadiumCanvas.js';

interface GameBoardProps {
  readonly playerFormation: readonly UnitPlacement[];
  readonly opponentFormation: readonly UnitPlacement[];
  readonly combatEntities: readonly CombatEntitySnapshot[];
  readonly combatEvents?: readonly CombatEventItem[] | undefined;
  readonly isCombatActive: boolean;
  readonly combatSpeed?: 1 | 2 | undefined;
  readonly selectedSlotIndex?: SlotIndex | null | undefined;
  readonly hasBenchSelection?: boolean | undefined;
  readonly hoveredFaction?: FactionId | null | undefined;
  readonly onSlotClick?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly onDropValkyrie?: ((valkyrieId: string, targetSlot: SlotIndex, sourceSlot?: SlotIndex | null) => void) | undefined;
  readonly onRemoveUnit?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly onInspect?: ((valkyrieId: string) => void) | undefined;
  readonly onHoverUnit?: ((valkyrieId: string | null, x: number, y: number) => void) | undefined;
  readonly onClearBoard?: (() => void) | undefined;
  readonly onAutoFill?: (() => void) | undefined;
  readonly onToggleSpeed?: (() => void) | undefined;
  readonly onLockFormation?: (() => void) | undefined;
}

/**
 * 3D Cyberpunk Battlefield Stadium (Three.js WebGL Panoramic Arena).
 * Đấu trường Sân Đấu Không Gian 3D Cyberpunk toàn cảnh vận hành bằng Three.js:
 * Tỉ lệ màn ảnh rộng 960x520, sàn đấu phát quang, 18 bệ đài Hologram 3D và nhân vật 2.5D pha lê.
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  playerFormation,
  opponentFormation,
  combatEntities,
  combatEvents,
  isCombatActive,
  combatSpeed,
  selectedSlotIndex,
  hasBenchSelection,
  hoveredFaction,
  onSlotClick,
  onDropValkyrie,
  onRemoveUnit,
  onInspect,
  onHoverUnit,
  onClearBoard,
  onAutoFill,
  onToggleSpeed,
  onLockFormation
}) => {
  return (
    <div
      className="w-[960px] max-w-[960px] h-[520px] flex items-center justify-center mx-auto select-none py-0.5"
      style={{ width: '960px', height: '520px', minWidth: '960px', minHeight: '520px' }}
    >
      <CyberStadiumCanvas
        playerFormation={playerFormation}
        opponentFormation={opponentFormation}
        combatEntities={combatEntities}
        combatEvents={combatEvents}
        isCombatActive={isCombatActive}
        combatSpeed={combatSpeed}
        selectedSlotIndex={selectedSlotIndex}
        hasBenchSelection={hasBenchSelection}
        hoveredFaction={hoveredFaction}
        onSlotClick={onSlotClick}
        onDropValkyrie={onDropValkyrie}
        onRemoveUnit={onRemoveUnit}
        onInspect={onInspect}
        onHoverUnit={onHoverUnit}
        onClearBoard={onClearBoard}
        onAutoFill={onAutoFill}
        onToggleSpeed={onToggleSpeed}
        onLockFormation={onLockFormation}
      />
    </div>
  );
};
