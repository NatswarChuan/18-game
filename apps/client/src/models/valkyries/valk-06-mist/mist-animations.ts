import { MistMeshParts } from './mist-geometry';
import { MistMaterialBundle } from './mist-materials';

export interface MistAnimationController {
  update: (delta: number, time: number) => void;
  triggerAttack: () => void;
  triggerUltimate: () => void;
  triggerHit: () => void;
}

/**
 * Creates the animation controller for VALK-06: Mist (Holy Saint / Support).
 * Quản lý động tác 3D cho Mist:
 * - Nhịp thở Idle sống động (ngực Cup H phập phồng nhẹ, đôi cánh thiên thần đập nhịp nhàng).
 * - Lõi sao quyền trượng xoay tròn đa trục.
 * - Động tác tấn công phát tia thánh quang.
 * - Tuyệt Kỹ: Thánh Địa Valkyrie (Sanctuary of Valkyries) - vươn cánh cực đại, giơ trượng ban phước.
 * - Phản ứng trúng đòn khép cánh e thẹn.
 */
export function createMistAnimations(
  parts: MistMeshParts,
  mats: MistMaterialBundle
): MistAnimationController {
  let attackTimer = 0;
  let ultimateTimer = 0;
  let hitTimer = 0;

  const update = (delta: number, time: number): void => {
    // 1. Nhịp thở Idle tự nhiên (Breathing & Subtle Jiggle Cup H)
    const breath = Math.sin(time * 2.1);
    parts.bustGroup.position.y = 0.33 + breath * 0.008;
    parts.bustGroup.scale.set(
      1.0 + breath * 0.012,
      1.0 + Math.cos(time * 2.1) * 0.01,
      1.0 + breath * 0.015
    );

    // Mái tóc xanh ngọc đung đưa theo gió
    parts.hairGroup.rotation.z = Math.sin(time * 1.6) * 0.035;
    parts.hairGroup.rotation.x = Math.cos(time * 1.4) * 0.02;

    // 2. Đôi cánh thiên sứ ánh sáng đập nhẹ nhàng (Angelic Wing Flap)
    const wingFlap = Math.sin(time * 1.8);
    parts.leftWing.rotation.z = wingFlap * 0.12;
    parts.leftWing.rotation.y = Math.cos(time * 1.8) * 0.08;
    parts.rightWing.rotation.z = -wingFlap * 0.12;
    parts.rightWing.rotation.y = -Math.cos(time * 1.8) * 0.08;

    // 3. Quyền trượng Nano Thánh Quang nhấp nhô & Lõi sao xoay
    parts.scepterGroup.position.y = 0.78 + Math.sin(time * 2.4) * 0.022;
    parts.scepterCoreMesh.rotation.y += delta * 2.6;
    parts.scepterCoreMesh.rotation.x += delta * 1.8;

    // 4. Xử lý hoạt ảnh Tấn công thường (Holy Light Pulse)
    if (attackTimer > 0) {
      attackTimer -= delta;
      const progress = 1 - attackTimer / 0.55;
      const swing = Math.sin(progress * Math.PI);

      // Giơ trượng về phía trước ban phước / tấn công
      parts.rightArm.rotation.x = 0.32 - swing * 0.65;
      parts.scepterGroup.position.z = 0.18 + swing * 0.25;
      mats.scepterCoreMat.emissiveIntensity = 1.45 + swing * 1.2;
    } else {
      parts.rightArm.rotation.x = 0.32;
      parts.scepterGroup.position.z = 0.18;
      mats.scepterCoreMat.emissiveIntensity = 1.45;
    }

    // 5. Xử lý Tuyệt Kỹ: Thánh Địa Valkyrie (Sanctuary of Valkyries Ultimate)
    if (ultimateTimer > 0) {
      ultimateTimer -= delta;
      const progress = 1 - ultimateTimer / 1.8;
      const burst = Math.sin(progress * Math.PI);

      // Đôi cánh dang rộng cực đại và tỏa hào quang
      parts.leftWing.rotation.z = -0.38 * burst;
      parts.rightWing.rotation.z = 0.38 * burst;
      parts.leftWing.scale.setScalar(1.0 + burst * 0.25);
      parts.rightWing.scale.setScalar(1.0 + burst * 0.25);

      // Giơ quyền trượng lên cao về phía bầu trời
      parts.rightArm.rotation.x = 0.32 - burst * 1.1;
      parts.leftArm.rotation.x = -0.45 - burst * 0.65;
      parts.scepterGroup.position.set(0.35, 0.78 + burst * 0.35, 0.18 + burst * 0.12);

      // Ngửa đầu cầu nguyện thánh thiện
      parts.headGroup.rotation.x = -burst * 0.28;

      // Hào quang bùng nổ cực hạn
      mats.wingMat.emissiveIntensity = 0.95 + burst * 1.6;
      mats.scepterCoreMat.emissiveIntensity = 1.45 + burst * 2.2;
    } else if (attackTimer <= 0) {
      parts.leftWing.scale.setScalar(1.0);
      parts.rightWing.scale.setScalar(1.0);
      parts.headGroup.rotation.x = 0;
      parts.leftArm.rotation.x = -0.45;
      parts.scepterGroup.position.set(0.48, 0.78, 0.18);
    }

    // 6. Xử lý Trúng Đòn (Hit Flinch)
    if (hitTimer > 0) {
      hitTimer -= delta;
      const flinch = Math.sin((1 - hitTimer / 0.45) * Math.PI);
      parts.rootGroup.position.z = -flinch * 0.08;
      parts.leftWing.rotation.y = flinch * 0.35; // Khép cánh che thân
      parts.rightWing.rotation.y = -flinch * 0.35;
      parts.headGroup.rotation.z = flinch * 0.08;
    } else {
      parts.rootGroup.position.z = 0;
    }
  };

  const triggerAttack = (): void => {
    attackTimer = 0.55;
  };

  const triggerUltimate = (): void => {
    ultimateTimer = 1.8;
  };

  const triggerHit = (): void => {
    hitTimer = 0.45;
  };

  return {
    update,
    triggerAttack,
    triggerUltimate,
    triggerHit
  };
}
