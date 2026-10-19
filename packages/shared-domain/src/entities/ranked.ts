/**
 * Ranked tier definitions and Elo calculation helper for Valkyrie Protocol: Zero.
 * Định nghĩa bậc xếp hạng và hệ thống tính điểm Elo.
 */

export type RankTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'VALKYRIE_MASTER';

export interface RankInfo {
  readonly tier: RankTier;
  readonly title: string;
  readonly color: string;
  readonly minElo: number;
  readonly maxElo: number;
}

export const RANK_TIERS: Readonly<Record<RankTier, RankInfo>> = {
  BRONZE: {
    tier: 'BRONZE',
    title: 'Chiến Binh Đồng',
    color: '#CD7F32',
    minElo: 0,
    maxElo: 1199
  },
  SILVER: {
    tier: 'SILVER',
    title: 'Hiệp Sĩ Bạc',
    color: '#A0AAB8',
    minElo: 1200,
    maxElo: 1399
  },
  GOLD: {
    tier: 'GOLD',
    title: 'Chỉ Huy Vàng Kim',
    color: '#FFD700',
    minElo: 1400,
    maxElo: 1599
  },
  PLATINUM: {
    tier: 'PLATINUM',
    title: 'Đại Tướng Bạch Kim',
    color: '#00F0FF',
    minElo: 1600,
    maxElo: 1799
  },
  VALKYRIE_MASTER: {
    tier: 'VALKYRIE_MASTER',
    title: 'Bậc Thầy Valkyrie',
    color: '#FF2A85',
    minElo: 1800,
    maxElo: 9999
  }
};

/**
 * Resolves RankTier information from a given Elo rating number.
 * Xác định thông tin Bậc xếp hạng từ điểm số Elo.
 */
export function getRankTierFromElo(elo: number): RankInfo {
  if (elo >= 1800) return RANK_TIERS.VALKYRIE_MASTER;
  if (elo >= 1600) return RANK_TIERS.PLATINUM;
  if (elo >= 1400) return RANK_TIERS.GOLD;
  if (elo >= 1200) return RANK_TIERS.SILVER;
  return RANK_TIERS.BRONZE;
}
