/**
 * Valkyrie entities and full roster for Valkyrie Protocol: Zero (16+ Tactical Edition).
 * Thực thể Valkyrie và danh sách 27 nữ chiến binh được hợp nhất từ 3 Faction.
 */

import { ValkyrieDefinition } from './valkyrie-types.js';
import { VALHALLA_ROSTER } from './roster-valhalla.js';
import { EDEN_ROSTER } from './roster-eden.js';
import { SOL_ROSTER } from './roster-sol.js';

export * from './valkyrie-types.js';
export { VALHALLA_ROSTER } from './roster-valhalla.js';
export { EDEN_ROSTER } from './roster-eden.js';
export { SOL_ROSTER } from './roster-sol.js';

/**
 * Full roster of 27 Valkyries across Neo-Valhalla, Abyssal Eden, and Sol Dynasty.
 * Danh sách toàn diện 27 Valkyrie thuộc 3 Faction.
 */
export const VALKYRIE_ROSTER: readonly ValkyrieDefinition[] = [
  ...VALHALLA_ROSTER,
  ...EDEN_ROSTER,
  ...SOL_ROSTER
];

/**
 * Lookup Valkyrie by ID.
 * Tìm kiếm Valkyrie theo mã định danh.
 * 
 * @param id - The unique ID of the Valkyrie (e.g. 'VALK-01')
 * @returns The Valkyrie definition if found, or undefined
 */
export function getValkyrieById(id: string): ValkyrieDefinition | undefined {
  return VALKYRIE_ROSTER.find((valkyrie: ValkyrieDefinition): boolean => valkyrie.id === id);
}
