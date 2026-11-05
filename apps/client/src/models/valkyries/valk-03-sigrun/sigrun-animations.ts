import { SigrunBones } from './sigrun-geometry.js';
import { UnitCombatVisualState } from '../valkyrie-3d-types.js';

export interface SigrunAnimationController {
  readonly update: (delta: number, elapsed: number, state: UnitCombatVisualState) => void;
  readonly triggerAttack: () => void;
  readonly triggerUltimate: () => void;
  readonly triggerHit: () => void;
}

/**
 * Creates the animation controller for Sigrun (VALK-03).
 * Điều khiển hoạt ảnh 3D mượt mà cho Sigrun: nhịp thở rình rập, song kiếm chém chéo, và tuyệt kỹ Vũ Điệu Bóng Đêm.
 *
 * @param bones - SigrunBones hierarchy.
 * @returns SigrunAnimationController instance.
 */
export function createSigrunAnimations(bones: SigrunBones): SigrunAnimationController {
  let attackProgress = -1;
  let ultimateProgress = -1;
  let hitProgress = -1;

  const triggerAttack = (): void => {
    attackProgress = 0;
  };

  const triggerUltimate = (): void => {
    ultimateProgress = 0;
  };

  const triggerHit = (): void => {
    hitProgress = 0;
  };

  const update = (delta: number, elapsed: number, state: UnitCombatVisualState): void => {
    if (!state.isAlive) {
      bones.rootGroup.rotation.x = -Math.PI / 2.2;
      bones.rootGroup.position.y = 0.12;
      return;
    }

    // 1. Agile Assassin Stealth Breathing (0.35 Hz rapid stealth rate)
    const breathCycle = Math.sin(elapsed * 2.4);
    bones.chestGroup.scale.set(
      1.0 + breathCycle * 0.015,
      1.0 + breathCycle * 0.02,
      1.0 + breathCycle * 0.022
    );
    bones.spineGroup.rotation.x = breathCycle * 0.02 + 0.08; // Slightly hunched predatory forward lean

    // 2. Low Center-of-Gravity Stance
    const idleSway = Math.sin(elapsed * 1.6);
    bones.hipsGroup.rotation.y = idleSway * 0.04;
    bones.headGroup.rotation.y = -idleSway * 0.03;

    // 3. Hair Physics (Side braid swaying with wind)
    const hairWind = Math.sin(elapsed * 3.5);
    bones.braid.rotation.z = -0.15 + hairWind * 0.06;
    bones.braid.rotation.x = Math.cos(elapsed * 3.0) * 0.05;

    // Default Dual Dagger Assassin Stance
    bones.leftArmGroup.rotation.x = -0.20 - breathCycle * 0.02;
    bones.leftArmGroup.rotation.y = -0.30;
    bones.leftArmGroup.rotation.z = -0.25;

    bones.rightArmGroup.rotation.x = 0.45 + breathCycle * 0.02;
    bones.rightArmGroup.rotation.y = 0.20;
    bones.rightArmGroup.rotation.z = 0.20;

    // 4. Attack Animation: Rapid Dual Dagger Cross-Slash (0.50s cycle)
    if (attackProgress >= 0) {
      attackProgress += delta / 0.50;
      if (attackProgress > 1.0) {
        attackProgress = -1;
      } else if (attackProgress < 0.5) {
        // Phase 1: Left dagger upward reverse slash
        const t = attackProgress / 0.5;
        bones.leftArmGroup.rotation.x = -0.20 + Math.sin(t * Math.PI) * 1.25;
        bones.leftArmGroup.rotation.y = -0.30 + Math.sin(t * Math.PI) * 0.65;
        bones.spineGroup.rotation.y = Math.sin(t * Math.PI) * 0.35;
      } else {
        // Phase 2: Right dagger downward cross slash
        const t = (attackProgress - 0.5) / 0.5;
        bones.rightArmGroup.rotation.x = 0.45 - Math.sin(t * Math.PI) * 1.25;
        bones.rightArmGroup.rotation.y = 0.20 - Math.sin(t * Math.PI) * 0.55;
        bones.spineGroup.rotation.y = -Math.sin(t * Math.PI) * 0.35;
      }
    }

    // 5. Ultimate Animation: 'Shadow Dance: Decapitate' (1.1s cycle)
    if (ultimateProgress >= 0 || state.isCasting) {
      if (ultimateProgress < 0) ultimateProgress = 0;
      ultimateProgress += delta / 1.1;
      if (ultimateProgress > 1.0) {
        ultimateProgress = -1;
      } else {
        const u = ultimateProgress;
        if (u < 0.3) {
          // Crouch low into shadow
          const t = u / 0.3;
          bones.rootGroup.position.y = -t * 0.20;
          bones.spineGroup.rotation.x = 0.08 + t * 0.45;
          bones.leftArmGroup.rotation.x = -0.20 - t * 0.85;
          bones.rightArmGroup.rotation.x = 0.45 - t * 0.85;
        } else if (u < 0.7) {
          // Leap forward into lethal dual cross execution
          const t = (u - 0.3) / 0.4;
          bones.rootGroup.position.y = Math.sin(t * Math.PI) * 0.25;
          bones.rootGroup.position.z = Math.sin(t * Math.PI) * 0.45;
          bones.leftArmGroup.rotation.x = 1.10 - t * 1.8;
          bones.rightArmGroup.rotation.x = 1.10 - t * 1.8;
          bones.leftArmGroup.rotation.z = Math.sin(t * Math.PI) * 0.85;
          bones.rightArmGroup.rotation.z = -Math.sin(t * Math.PI) * 0.85;
        } else {
          // Land softly in low ninja pose
          const t = (u - 0.7) / 0.4;
          bones.rootGroup.position.y = -0.15 * (1.0 - t);
          bones.rootGroup.position.z = 0;
          bones.spineGroup.rotation.x = 0.08;
        }
      }
    }

    // 6. Hit Reaction: Agile Back-Step Evasion Flinch (0.28s cycle)
    if (hitProgress >= 0) {
      hitProgress += delta / 0.28;
      if (hitProgress > 1.0) {
        hitProgress = -1;
      } else {
        const h = Math.sin(hitProgress * Math.PI);
        bones.rootGroup.position.z = -h * 0.12;
        bones.spineGroup.rotation.x = 0.08 - h * 0.25;
        bones.leftArmGroup.rotation.x = -0.20 + h * 0.55;
        bones.rightArmGroup.rotation.x = 0.45 + h * 0.55;
      }
    } else if (ultimateProgress < 0) {
      bones.rootGroup.position.z = 0;
      bones.rootGroup.position.y = 0;
    }
  };

  return {
    update,
    triggerAttack,
    triggerUltimate,
    triggerHit
  };
}
