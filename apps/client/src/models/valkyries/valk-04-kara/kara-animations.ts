import { KaraMeshHierarchy } from './kara-geometry.js';
import { KaraMaterials } from './kara-materials.js';

export interface KaraAnimationController {
  readonly update: (delta: number, customTime?: number, state?: unknown) => void;
  readonly triggerAttack: () => void;
  readonly triggerUltimate: () => void;
  readonly triggerHit: () => void;
  readonly dispose: () => void;
}

/**
 * Procedural animation controller for Kara (VALK-04).
 * Điều khiển hoạt ảnh 3D thời gian thực:
 * - Nhịp thở Idle nhấp nhô vòng 1 cúp D và tóc twin-tails bồng bềnh.
 * - Trọng pháo giật lùi (Recoil Kickback) khi bắn đạn pháo hạt nhân.
 * - Tuyệt kỹ Annihilation Shell: Quỳ hạ trọng tâm, nạp năng lượng cực hạn và phóng chùm photon.
 * - Phản ứng trúng đòn flinch tsundere.
 */
export function createKaraAnimations(
  mesh: KaraMeshHierarchy,
  materials: KaraMaterials
): KaraAnimationController {
  let elapsedTime = 0;
  let attackProgress = 0; // 0 to 1
  let isAttacking = false;
  let ultimateProgress = 0; // 0 to 1
  let isUltimating = false;
  let hitProgress = 0; // 0 to 1
  let isHit = false;

  const update = (delta: number): void => {
    elapsedTime += delta;

    // 1. Idle Breathing Loop (Tsundere breath rhythm)
    const breath = Math.sin(elapsedTime * 2.4);
    mesh.chestGroup.scale.set(
      1.0 + breath * 0.025,
      1.0 + breath * 0.035,
      1.0 + breath * 0.025
    );

    // Natural Twin-Tail Physics Sway
    mesh.leftTwinTail.rotation.z = 0.28 + Math.sin(elapsedTime * 2.8) * 0.08;
    mesh.leftTwinTail.rotation.x = Math.cos(elapsedTime * 2.0) * 0.05;
    mesh.rightTwinTail.rotation.z = -0.28 - Math.sin(elapsedTime * 2.8) * 0.08;
    mesh.rightTwinTail.rotation.x = Math.cos(elapsedTime * 2.0) * 0.05;

    // Subtle Railgun Core Energy Vibration
    mesh.cannonGroup.position.y = 0.18 + Math.sin(elapsedTime * 4.5) * 0.003;

    // 2. Attack Recoil Animation (Heavy artillery kickback)
    if (isAttacking) {
      attackProgress += delta * 3.8;
      if (attackProgress < 0.25) {
        // Instant massive recoil kickback
        const recoil = attackProgress / 0.25;
        mesh.cannonGroup.position.z = -0.25 - recoil * 0.22;
        mesh.chestGroup.rotation.x = -recoil * 0.18;
        materials.nuclearCoreGlow.emissiveIntensity = 4.0;
      } else if (attackProgress < 1.0) {
        // Recovery spring back
        const recover = (attackProgress - 0.25) / 0.75;
        const spring = Math.cos(recover * Math.PI * 0.5);
        mesh.cannonGroup.position.z = -0.25 - spring * 0.22;
        mesh.chestGroup.rotation.x = -spring * 0.18;
        materials.nuclearCoreGlow.emissiveIntensity = 2.4 + spring * 1.6;
      } else {
        isAttacking = false;
        attackProgress = 0;
        mesh.cannonGroup.position.z = -0.25;
        mesh.chestGroup.rotation.x = 0;
        materials.nuclearCoreGlow.emissiveIntensity = 2.4;
      }
    }

    // 3. Ultimate Climax Animation (Valkyrie Annihilation Shell)
    if (isUltimating) {
      ultimateProgress += delta * 1.2;
      if (ultimateProgress < 0.4) {
        // Phase 1: Knee brace & energy charge
        const chargeRatio = ultimateProgress / 0.4;
        mesh.pelvisGroup.position.y = 0.84 - chargeRatio * 0.14; // Lower hips into brace
        mesh.leftLegGroup.rotation.x = chargeRatio * 0.35;
        mesh.rightLegGroup.rotation.x = -chargeRatio * 0.25;
        mesh.cannonGroup.rotation.x = -0.08 - chargeRatio * 0.12; // Elevate cannon
        materials.nuclearCoreGlow.emissiveIntensity = 2.4 + chargeRatio * 5.0; // Glow super bright
      } else if (ultimateProgress < 0.65) {
        // Phase 2: Cataclysmic Fire! Massive recoil shockwave
        const blast = (ultimateProgress - 0.4) / 0.25;
        mesh.cannonGroup.position.z = -0.25 - (1.0 - blast) * 0.35;
        materials.nuclearCoreGlow.emissiveIntensity = 8.0 * (1.0 - blast);
      } else if (ultimateProgress < 1.0) {
        // Phase 3: Return to standing stance
        const reset = (ultimateProgress - 0.65) / 0.35;
        mesh.pelvisGroup.position.y = 0.70 + reset * 0.14;
        mesh.leftLegGroup.rotation.x = 0.35 * (1.0 - reset);
        mesh.rightLegGroup.rotation.x = -0.25 * (1.0 - reset);
        mesh.cannonGroup.rotation.x = -0.20 + reset * 0.12;
        mesh.cannonGroup.position.z = -0.25;
        materials.nuclearCoreGlow.emissiveIntensity = 2.4;
      } else {
        isUltimating = false;
        ultimateProgress = 0;
        mesh.pelvisGroup.position.y = 0.84;
        mesh.leftLegGroup.rotation.x = 0;
        mesh.rightLegGroup.rotation.x = 0;
        mesh.cannonGroup.rotation.x = -0.08;
        mesh.cannonGroup.position.z = -0.25;
        materials.nuclearCoreGlow.emissiveIntensity = 2.4;
      }
    }

    // 4. Hit Flinch Animation (Tsundere indignant jerk)
    if (isHit) {
      hitProgress += delta * 4.5;
      if (hitProgress < 0.5) {
        const flinch = Math.sin(hitProgress * Math.PI * 2);
        mesh.headGroup.rotation.x = -flinch * 0.25;
        mesh.headGroup.rotation.y = flinch * 0.18;
        mesh.chestGroup.rotation.y = -flinch * 0.12;
      } else {
        isHit = false;
        hitProgress = 0;
        mesh.headGroup.rotation.set(0, 0, 0);
        mesh.chestGroup.rotation.y = 0;
      }
    }
  };

  const triggerAttack = (): void => {
    isAttacking = true;
    attackProgress = 0;
  };

  const triggerUltimate = (): void => {
    isUltimating = true;
    ultimateProgress = 0;
  };

  const triggerHit = (): void => {
    isHit = true;
    hitProgress = 0;
  };

  const dispose = (): void => {
    // Reset state
    isAttacking = false;
    isUltimating = false;
    isHit = false;
  };

  return {
    update,
    triggerAttack,
    triggerUltimate,
    triggerHit,
    dispose
  };
}
