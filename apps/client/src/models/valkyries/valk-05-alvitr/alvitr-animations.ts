import { AlvitrMeshHierarchy } from './alvitr-geometry.js';
import { AlvitrMaterials } from './alvitr-materials.js';

export interface AlvitrAnimationController {
  readonly update: (delta: number, customTime?: number, state?: unknown) => void;
  readonly triggerAttack: () => void;
  readonly triggerUltimate: () => void;
  readonly triggerHit: () => void;
  readonly dispose: () => void;
}

/**
 * Procedural animation controller for Alvitr (VALK-05).
 * Điều khiển hoạt ảnh 3D thời gian thực:
 * - Tư thế bay lơ lửng nhấp nhô (Levitation Bobbing) và nhịp thở vòng 1 cúp F.
 * - Quả cầu lôi điện tử: 3 vòng quỹ đạo Gimbal xoay độc lập 3 trục XYZ.
 * - Tuyệt kỹ Chain Lightning Tempest: Nâng bổng người lên không trung, quả cầu lôi điện tụ đỉnh đầu và phóng bão sấm sét.
 * - Phản ứng trúng đòn ma mị uốn lượn.
 */
export function createAlvitrAnimations(
  mesh: AlvitrMeshHierarchy,
  materials: AlvitrMaterials
): AlvitrAnimationController {
  let elapsedTime = 0;
  let attackProgress = 0; // 0 to 1
  let isAttacking = false;
  let ultimateProgress = 0; // 0 to 1
  let isUltimating = false;
  let hitProgress = 0; // 0 to 1
  let isHit = false;

  const update = (delta: number): void => {
    elapsedTime += delta;

    // 1. Levitation Floating Bobbing Loop
    const floatOffset = Math.sin(elapsedTime * 2.0) * 0.035;
    mesh.pelvisGroup.position.y = 0.90 + floatOffset;

    // Breathing motion (Deep voluptuous Cup-F chest expansion)
    const breath = Math.sin(elapsedTime * 2.2);
    mesh.chestGroup.scale.set(
      1.0 + breath * 0.025,
      1.0 + breath * 0.035,
      1.0 + breath * 0.025
    );

    // Cascading Wavy Hair Undulation (Silk floating in ether)
    mesh.longHairGroup.rotation.x = 0.06 + Math.sin(elapsedTime * 1.8) * 0.05;
    mesh.longHairGroup.rotation.z = Math.cos(elapsedTime * 1.5) * 0.03;

    // Electro-Orb Gimbal Gyroscope Rings Rotation (Independent 3-axis spin)
    mesh.orbRing1.rotation.x += delta * 2.2;
    mesh.orbRing2.rotation.y += delta * 1.7;
    mesh.orbRing3.rotation.z += delta * 1.2;

    // Electro-Orb Float Hovering
    mesh.orbGroup.position.y = 0.10 + Math.sin(elapsedTime * 3.2) * 0.02;

    // 2. Attack Animation (Electro-Bolt Zap)
    if (isAttacking) {
      attackProgress += delta * 3.2;
      if (attackProgress < 0.3) {
        // Forward cast gesture
        const cast = attackProgress / 0.3;
        mesh.rightArmGroup.rotation.x = -0.7 - cast * 0.45;
        mesh.orbGroup.position.z = 0.38 + cast * 0.15;
        materials.orbCore.emissiveIntensity = 5.0;
      } else if (attackProgress < 1.0) {
        // Return to hover stance
        const recover = (attackProgress - 0.3) / 0.7;
        const spring = Math.cos(recover * Math.PI * 0.5);
        mesh.rightArmGroup.rotation.x = -0.7 - spring * 0.45;
        mesh.orbGroup.position.z = 0.38 + spring * 0.15;
        materials.orbCore.emissiveIntensity = 3.2 + spring * 1.8;
      } else {
        isAttacking = false;
        attackProgress = 0;
        mesh.rightArmGroup.rotation.x = -0.7;
        mesh.orbGroup.position.z = 0.38;
        materials.orbCore.emissiveIntensity = 3.2;
      }
    }

    // 3. Ultimate Climax Animation (Chain Lightning Tempest)
    if (isUltimating) {
      ultimateProgress += delta * 1.1;
      if (ultimateProgress < 0.45) {
        // Phase 1: High levitation & Electro-Orb rises overhead
        const charge = ultimateProgress / 0.45;
        mesh.pelvisGroup.position.y = 0.90 + charge * 0.22;
        mesh.orbGroup.position.set(0, 0.10 + charge * 0.38, 0.38 - charge * 0.25);
        mesh.orbRing1.rotation.x += delta * 8.0;
        mesh.orbRing2.rotation.y += delta * 7.0;
        mesh.orbRing3.rotation.z += delta * 6.0;
        materials.orbCore.emissiveIntensity = 3.2 + charge * 6.0;
      } else if (ultimateProgress < 0.70) {
        // Phase 2: Electric Cataclysm — Pulse waves
        const burst = (ultimateProgress - 0.45) / 0.25;
        mesh.orbGroup.scale.setScalar(1.0 + (1.0 - burst) * 0.4);
        materials.orbCore.emissiveIntensity = 9.0 * (1.0 - burst);
      } else if (ultimateProgress < 1.0) {
        // Phase 3: Descend gently back to baseline float
        const reset = (ultimateProgress - 0.70) / 0.30;
        mesh.pelvisGroup.position.y = 1.12 - reset * 0.22;
        mesh.orbGroup.position.set(0.26 * reset, 0.48 - reset * 0.38, 0.13 + reset * 0.25);
        mesh.orbGroup.scale.setScalar(1.0);
        materials.orbCore.emissiveIntensity = 3.2;
      } else {
        isUltimating = false;
        ultimateProgress = 0;
        mesh.pelvisGroup.position.y = 0.90;
        mesh.orbGroup.position.set(0.26, 0.10, 0.38);
        mesh.orbGroup.scale.setScalar(1.0);
        materials.orbCore.emissiveIntensity = 3.2;
      }
    }

    // 4. Hit Flinch Animation (Graceful sorceress recoil)
    if (isHit) {
      hitProgress += delta * 4.0;
      if (hitProgress < 0.5) {
        const flinch = Math.sin(hitProgress * Math.PI * 2);
        mesh.headGroup.rotation.x = -flinch * 0.20;
        mesh.chestGroup.rotation.x = -flinch * 0.15;
        mesh.leftArmGroup.rotation.z = 0.5 - flinch * 0.25;
        mesh.rightArmGroup.rotation.z = -0.35 + flinch * 0.25;
      } else {
        isHit = false;
        hitProgress = 0;
        mesh.headGroup.rotation.x = 0;
        mesh.chestGroup.rotation.x = 0;
        mesh.leftArmGroup.rotation.z = 0.5;
        mesh.rightArmGroup.rotation.z = -0.35;
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
