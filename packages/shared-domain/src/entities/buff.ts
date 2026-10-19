import { Vector12D } from '../math/vector12d.js';

export type BuffDepth = 1 | 2 | 3 | 4 | 5;

export type BuffCategory = 'SYNERGY' | 'COUNTER' | 'PIVOT' | 'DECISIVE';

export interface BuffDefinition {
  readonly id: string;
  readonly name: string;
  readonly depth: BuffDepth;
  readonly category: BuffCategory;
  readonly weights: Vector12D;
  readonly prerequisiteTags: readonly string[];
  readonly counterTags: readonly string[];
  readonly tags: readonly string[];
  readonly description: string;
}

/**
 * Filter buffs by depth level.
 * Lọc buff theo tầng tiến hóa.
 */
export function filterBuffsByDepth(buffs: readonly BuffDefinition[], depth: BuffDepth): readonly BuffDefinition[] {
  return buffs.filter((b) => b.depth === depth);
}

/**
 * Filter buffs by category.
 * Lọc buff theo danh mục chiến thuật.
 */
export function filterBuffsByCategory(buffs: readonly BuffDefinition[], category: BuffCategory): readonly BuffDefinition[] {
  return buffs.filter((b) => b.category === category);
}
