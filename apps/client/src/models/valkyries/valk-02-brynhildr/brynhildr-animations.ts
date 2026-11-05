import { BrynhildrBones } from './brynhildr-geometry.js';
import { UnitCombatVisualState } from '../valkyrie-3d-types.js';

export interface BrynhildrAnimationController {
  readonly update: (delta: number, elapsed: number, state: UnitCombatVisualState) => void;
  readonly triggerAttack: () => void;
  readonly triggerUltimate: () => void;
  readonly triggerHit: () => void;
}

/**
 * Creates the animation controller for Brynhildr (VALK-02).
 * Điều khiển hoạt ảnh 3D mượt mà cho Brynhildr: nhịp thở phòng thủ, đỡ đòn bằng khiên, và tuyệt kỹ Băng Trụ.
 *
 * @param bones - BrynhildrBones hierarchy.
 * @returns BrynhildrAnimationController instance.
 */
export function createBrynhildrAnimations(bones: BrynhildrBones): BrynhildrAnimationController {
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
      bones.rootGroup.position.y = 0.15;
      return;
    }

    // 1. Natural Paladin Guard Breathing (0.3 Hz calm rate)
    const breathCycle = Math.sin(elapsed * 2.1);
    bones.chestGroup.scale.set(
      1.0 + breathCycle * 0.015,
      1.0 + breathCycle * 0.02,
      1.0 + breathCycle * 0.025
    );
    bones.spineGroup.rotation.x = breathCycle * 0.018;

    // 2. Living Stance: Subtle Weight Shift
    const idleSway = Math.sin(elapsed * 1.4);
    bones.hipsGroup.rotation.y = idleSway * 0.035;
    bones.headGroup.rotation.y = -idleSway * 0.025;

    // 3. Hair Wind Physics (Ponytail swaying softly behind back)
    const hairWind = Math.sin(elapsed * 3.0 + 0.4);
    bones.ponytail.rotation.z = hairWind * 0.08;
    bones.ponytail.rotation.x = -0.32 + Math.cos(elapsed * 2.5) * 0.04;

    // Default Paladin Shield Guard Posture
    bones.leftArmGroup.rotation.x = 0.35 + breathCycle * 0.02;
    bones.leftArmGroup.rotation.y = 0.25;
    bones.leftArmGroup.rotation.z = -0.15;

    bones.rightArmGroup.rotation.x = -0.15 - breathCycle * 0.015;
    bones.rightArmGroup.rotation.y = -0.10;
    bones.rightArmGroup.rotation.z = 0.12;

    // 4. Attack Animation: Shield Bash & Frost Blade Thrust (0.65s cycle)
    if (attackProgress >= 0) {
      attackProgress += delta / 0.65;
      if (attackProgress > 1.0) {
        attackProgress = -1;
      } else if (attackProgress < 0.4) {
        // Phase 1: Heavy Shield Bash forward
        const t = attackProgress / 0.4;
        bones.leftArmGroup.rotation.x = 0.35 + Math.sin(t * Math.PI) * 0.75;
        bones.leftArmGroup.rotation.y = 0.25 + Math.sin(t * Math.PI) * 0.35;
        bones.spineGroup.rotation.y = Math.sin(t * Math.PI) * -0.25;
      } else {
        // Phase 2: Glacial Rapier thrust
        const t = (attackProgress - 0.4) / 0.6;
        bones.rightArmGroup.rotation.x = -0.15 + Math.sin(t * Math.PI) * 1.15;
        bones.swordGroup.rotation.x = Math.PI / 2.2 + Math.sin(t * Math.PI) * 0.35;
        bones.spineGroup.rotation.y = Math.sin(t * Math.PI) * 0.22;
      }
    }

    // 5. Ultimate Animation: 'Absolute Glaciation' (1.3s cycle)
    if (ultimateProgress >= 0 || state.isCasting) {
      if (ultimateProgress < 0) ultimateProgress = 0;
      ultimateProgress += delta / 1.3;
      if (ultimateProgress > 1.0) {
        ultimateProgress = -1;
      } else {
        const u = ultimateProgress;
        if (u < 0.35) {
          // Raise shield high with two hands
          const t = u / 0.35;
          bones.leftArmGroup.rotation.x = 0.35 + t * 0.95;
          bones.rightArmGroup.rotation.x = -0.15 + t * 0.95;
          bones.spineGroup.rotation.x = -t * 0.25;
        } else if (u < 0.75) {
          // Slam shield firmly into the ground to summon ice fortress
          const t = (u - 0.35) / 0.4;
          bones.leftArmGroup.rotation.x = 1.30 - Math.sin(t * Math.PI * 0.5) * 0.85;
          bones.spineGroup.position.y = 0.14 - Math.sin(t * Math.PI) * 0.08;
          bones.shieldGroup.rotation.x = 0.45;
        } else {
          // Recover to glorious guard stance
          const t = (u - 0.75) / 0.25;
          bones.leftArmGroup.rotation.x = 0.45 - t * 0.10;
          bones.spineGroup.position.y = 0.14;
          bones.shieldGroup.rotation.x = 0;
        }
      }
    }

    // 6. Hit Reaction: Flinch and Raise Tower Shield to Brace (0.3s cycle)
    if (hitProgress >= 0) {
      hitProgress += delta / 0.30;
      if (hitProgress > 1.0) {
        hitProgress = -1;
      } else {
        const h = Math.sin(hitProgress * Math.PI);
        bones.leftArmGroup.rotation.x = 0.35 + h * 0.45;
        bones.leftArmGroup.rotation.y = 0.25 + h * 0.30;
        bones.chestGroup.rotation.x = -h * 0.18;
        bones.rootGroup.position.z = -h * 0.06;
      }
    } else {
      bones.rootGroup.position.z = 0;
    }
  };

  return {
    update,
    triggerAttack,
    triggerUltimate,
    triggerHit
  };
}
