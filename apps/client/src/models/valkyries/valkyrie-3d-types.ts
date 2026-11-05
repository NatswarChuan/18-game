import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '@valkyrie/shared-domain';

/**
 * Combat visual state parameters passed to the 3D Valkyrie model on each animation tick.
 * Thông số trạng thái chiến đấu truyền vào model 3D Valkyrie trên mỗi nhịp khung hình.
 */
export interface UnitCombatVisualState {
  readonly currentHp: number;
  readonly maxHp: number;
  readonly currentMana: number;
  readonly maxMana: number;
  readonly tier: ClothDamageTier;
  readonly isEnemy: boolean;
  readonly isCasting: boolean;
  readonly isAlive: boolean;
  readonly isSelected?: boolean | undefined;
  readonly isHovered?: boolean | undefined;
  readonly cameraPosition?: THREE.Vector3 | undefined;
  readonly cursorPosition?: THREE.Vector2 | undefined;
}

/**
 * Standard interface for fully interactive procedural 3D Valkyrie humanoid models.
 * Giao diện chuẩn cho mô hình 3D hình người hoàn chỉnh của nữ chiến binh Valkyrie.
 */
export interface Valkyrie3DModelInstance {
  readonly rootGroup: THREE.Group;
  readonly update: (delta: number, elapsedTime: number, state: UnitCombatVisualState) => void;
  readonly setClothTier: (tier: ClothDamageTier) => void;
  readonly triggerAttack: () => void;
  readonly triggerUltimate: () => void;
  readonly triggerHit: () => void;
  readonly triggerPoke?: (() => void) | undefined;
  readonly dispose: () => void;
}

/**
 * Configuration payload for instantiating a Valkyrie 3D model.
 * Cấu hình khởi tạo model 3D cho Valkyrie.
 */
export interface ValkyrieModelInitConfig {
  readonly valkyrieId: string;
  readonly faction: FactionId;
  readonly tier: ClothDamageTier;
  readonly isEnemy: boolean;
  readonly primaryColor: number;
}
