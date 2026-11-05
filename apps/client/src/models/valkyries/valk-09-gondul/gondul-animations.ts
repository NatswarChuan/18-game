import { UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { GondulMeshHierarchy } from './gondul-geometry.js';

export interface GondulAnimationController {
  readonly update: (delta: number, elapsedTime: number, state: UnitCombatVisualState) => void;
  readonly triggerAttack: () => void;
  readonly triggerUltimate: () => void;
  readonly triggerHit: () => void;
}

/**
 * Procedural animation controller for VALK-09 Gondul.
 * Quản lý hoạt ảnh cử động cho VALK-09 Gondul:
 * - Nhịp thở trí thức (ngực Cúp F phập phồng, vạt áo blouse đung đưa)
 * - 2 Drone bay lượn nhấp nhô nhịp nhàng theo quỹ đạo
 * - Thao tác bấm máy tính Hologram & chỉnh kính cận
 * - Tuyệt kỹ: Overclock Forcefield (Kích hoạt trường lực ma trận lục giác)
 */
export function createGondulAnimations(mesh: GondulMeshHierarchy): GondulAnimationController {
  let attackTimer = 0;
  let ultimateTimer = 0;
  let hitTimer = 0;

  const triggerAttack = (): void => {
    attackTimer = 0.65;
  };

  const triggerUltimate = (): void => {
    ultimateTimer = 2.4;
  };

  const triggerHit = (): void => {
    hitTimer = 0.45;
  };

  const update = (delta: number, elapsedTime: number, _state: UnitCombatVisualState): void => {
    if (attackTimer > 0) attackTimer = Math.max(0, attackTimer - delta);
    if (ultimateTimer > 0) ultimateTimer = Math.max(0, ultimateTimer - delta);
    if (hitTimer > 0) hitTimer = Math.max(0, hitTimer - delta);

    const isAttacking = attackTimer > 0;
    const isUltimating = ultimateTimer > 0;
    const isHit = hitTimer > 0;

    // 1. Idle Breathing & Body Posture
    const breathCycle = Math.sin(elapsedTime * 2.2);
    mesh.chestGroup.scale.set(
      1.0 + breathCycle * 0.02,
      1.0 + breathCycle * 0.025,
      1.0 + breathCycle * 0.035
    );
    mesh.bodyGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.015;

    // Soft hair swaying
    for (let i = 0; i < mesh.hairLocks.length; i++) {
      const lock = mesh.hairLocks[i];
      if (lock) {
        lock.rotation.z += Math.sin(elapsedTime * 2.5 + i) * 0.003;
      }
    }

    // 2. Drone Floating Motion (Quỹ đạo bay của 2 Drone Hộ Vệ)
    const drone1Y = 1.45 + Math.sin(elapsedTime * 2.8) * 0.06;
    const drone1X = -0.42 + Math.cos(elapsedTime * 1.5) * 0.04;
    mesh.drone1Group.position.set(drone1X, drone1Y, -0.15 + Math.sin(elapsedTime * 1.5) * 0.03);
    mesh.drone1Group.rotation.y = elapsedTime * 1.8;

    const drone2Y = 1.45 + Math.cos(elapsedTime * 2.8) * 0.06;
    const drone2X = 0.42 - Math.cos(elapsedTime * 1.5) * 0.04;
    mesh.drone2Group.position.set(drone2X, drone2Y, -0.15 - Math.sin(elapsedTime * 1.5) * 0.03);
    mesh.drone2Group.rotation.y = -elapsedTime * 1.8;

    // 3. Hologram Pad Display Pulse
    mesh.hologramPadGroup.rotation.x = Math.sin(elapsedTime * 2.0) * 0.08 - 0.2;

    // 4. Combat & Action States
    if (isHit) {
      // Hit Flinch
      const recoil = hitTimer / 0.45;
      mesh.bodyGroup.position.z = -recoil * 0.12;
      mesh.bodyGroup.rotation.x = recoil * 0.15;
      mesh.headGroup.rotation.y = Math.sin(recoil * Math.PI * 4) * 0.1;
      mesh.forcefieldMesh.visible = false;
    } else if (isUltimating) {
      // Ultimate Climax: Overclock Forcefield
      const ultPhase = 1.0 - ultimateTimer / 2.4;
      mesh.forcefieldMesh.visible = true;

      // Expand and pulsate hexagonal forcefield
      const scale = 1.0 + Math.sin(ultPhase * Math.PI * 6) * 0.25;
      mesh.forcefieldMesh.scale.set(scale, scale, scale);
      mesh.forcefieldMesh.rotation.y = elapsedTime * 3.5;

      // Drones spread out wide
      mesh.drone1Group.position.set(-0.75, 1.6, 0);
      mesh.drone2Group.position.set(0.75, 1.6, 0);

      // Gondul raises her arms commanding forcefield
      mesh.leftArmGroup.rotation.x = -1.2;
      mesh.leftArmGroup.rotation.z = -0.4;
      mesh.rightArmGroup.rotation.x = -1.2;
      mesh.rightArmGroup.rotation.z = 0.4;
      mesh.headGroup.rotation.x = -0.2; // Look up proudly
    } else if (isAttacking) {
      // Normal Attack: Quick command input & drone pulse
      const atkPhase = 1.0 - attackTimer / 0.65;
      mesh.forcefieldMesh.visible = false;

      // Tap holographic keyboard
      mesh.rightArmGroup.rotation.x = -0.8 + Math.sin(atkPhase * Math.PI * 2) * 0.3;
      mesh.rightArmGroup.rotation.y = -0.3;

      // Drones surge forward
      mesh.drone1Group.position.z = 0.25;
      mesh.drone2Group.position.z = 0.25;
    } else {
      // Normal Idle State
      mesh.forcefieldMesh.visible = false;

      // Left arm holds tablet in front
      mesh.leftArmGroup.rotation.x = -0.65 + breathCycle * 0.03;
      mesh.leftArmGroup.rotation.y = 0.35;
      mesh.leftArmGroup.rotation.z = -0.15;

      // Right arm rests or gently gestures towards tablet
      mesh.rightArmGroup.rotation.x = -0.4 + breathCycle * 0.02;
      mesh.rightArmGroup.rotation.y = -0.25;
      mesh.rightArmGroup.rotation.z = 0.15;

      mesh.bodyGroup.rotation.set(0, 0, 0);
      mesh.headGroup.rotation.set(0, 0, 0);
    }
  };

  return {
    update,
    triggerAttack,
    triggerUltimate,
    triggerHit
  };
}
