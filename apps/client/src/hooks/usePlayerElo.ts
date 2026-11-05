import { useState, useEffect } from 'react';
import { GamePhase, getRankTierFromElo } from '@valkyrie/shared-domain';

export interface PlayerRankInfo {
  readonly color: string;
  readonly title: string;
}

export interface UsePlayerEloResult {
  readonly playerElo: number;
  readonly playerRankInfo: PlayerRankInfo;
}

/**
 * Manages player Elo rating and rank tier calculations across matches.
 * Quản lý điểm Elo và phân cấp xếp hạng Đấu Hạng của Chỉ Huy Trưởng.
 */
export function usePlayerElo(
  phase: GamePhase,
  matchWinnerId: string | null,
  playerId: string
): UsePlayerEloResult {
  const [playerElo, setPlayerElo] = useState<number>(() => {
    if (typeof window === 'undefined') return 1525;
    const saved = localStorage.getItem('valkyrie_elo');
    return saved ? parseInt(saved, 10) : 1525;
  });

  useEffect(() => {
    if (phase === 'MATCH_OVER') {
      const isWinner = matchWinnerId === playerId;
      const delta = isWinner ? 25 : -25;
      setPlayerElo((prev) => {
        const nextElo = Math.max(0, prev + delta);
        localStorage.setItem('valkyrie_elo', nextElo.toString());
        return nextElo;
      });
    }
  }, [phase, matchWinnerId, playerId]);

  const playerRankInfo = getRankTierFromElo(playerElo);

  return { playerElo, playerRankInfo };
}
