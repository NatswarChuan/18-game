import { useEffect } from 'react';
import { GamePhase } from '@valkyrie/shared-domain';

export interface UseEsportsHotkeysOptions {
  readonly phase: GamePhase;
  readonly isLockedIn: boolean;
  readonly onLockFormation: () => void;
  readonly onClearBoard: () => void;
  readonly onAutoFill: () => void;
  readonly onSetSpeed: (speed: 1 | 2) => void;
  readonly onEscape: () => void;
  readonly onApplyPreset?: ((preset: 'VANGUARD' | 'FLANK' | 'BUNKER') => void) | undefined;
}

/**
 * Global keyboard shortcuts listener for hardcore esports gaming.
 * Bộ lắng nghe phím tắt toàn cục chuẩn game thủ (Space, R, F, Q, W, E, 1, 2, Esc).
 */
export function useEsportsHotkeys(options: UseEsportsHotkeysOptions): void {
  const {
    phase,
    isLockedIn,
    onLockFormation,
    onClearBoard,
    onAutoFill,
    onSetSpeed,
    onEscape,
    onApplyPreset
  } = options;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        if (phase === 'FORMATION_PLACEMENT' && !isLockedIn) {
          e.preventDefault();
          onLockFormation();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        onClearBoard();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        onAutoFill();
      } else if (e.code === 'KeyQ' && onApplyPreset && phase === 'FORMATION_PLACEMENT') {
        e.preventDefault();
        onApplyPreset('VANGUARD');
      } else if (e.code === 'KeyW' && onApplyPreset && phase === 'FORMATION_PLACEMENT') {
        e.preventDefault();
        onApplyPreset('FLANK');
      } else if (e.code === 'KeyE' && onApplyPreset && phase === 'FORMATION_PLACEMENT') {
        e.preventDefault();
        onApplyPreset('BUNKER');
      } else if (e.code === 'Digit1') {
        onSetSpeed(1);
      } else if (e.code === 'Digit2') {
        onSetSpeed(2);
      } else if (e.code === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, isLockedIn, onLockFormation, onClearBoard, onAutoFill, onSetSpeed, onEscape, onApplyPreset]);
}
