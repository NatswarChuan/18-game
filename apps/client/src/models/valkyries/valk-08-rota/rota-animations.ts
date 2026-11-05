import { RotaMeshParts } from './rota-geometry';
import { RotaMaterialBundle } from './rota-materials';

export interface RotaAnimationController {
  update: (delta: number, time: number) => void;
  triggerAttack: () => void;
  triggerUltimate: () => void;
  triggerHit: () => void;
}

/**
 * Creates the animation controller for VALK-08: Rota (Midline Skirmisher / Blade Dancer).
 * Quản lý cử động 3D cho Rota:
 * - Nhịp thở vũ công thanh thoát (ngực Cup D phập phồng nhẹ, đuôi ngựa xanh đung đưa).
 * - 4 Lưỡi kiếm bay liên tục xoay quanh cơ thể theo quỹ đạo elip mượt mà.
 * - Động tác tấn công múa kiếm phóng hai lưỡi kiếm xuyên phá.
 * - Tuyệt Kỹ: Vũ Điệu Lốc Kiếm (Whirlwind Blade Waltz) - xoay tròn vũ bão ballet, 4 thanh kiếm mở rộng bão kiếm khí sapphire cực hạn.
 * - Phản ứng trúng đòn khép 4 lưỡi kiếm phòng thủ.
 */
export function createRotaAnimations(
  parts: RotaMeshParts,
  mats: RotaMaterialBundle
): RotaAnimationController {
  let attackTimer = 0;
  let ultimateTimer = 0;
  let hitTimer = 0;

  const update = (delta: number, time: number): void => {
    // 1. Nhịp thở vũ công thanh thoát & Đuôi ngựa bồng bềnh
    const breath = Math.sin(time * 2.2);
    parts.bustGroup.position.y = 0.33 + breath * 0.007;
    parts.bustGroup.scale.set(
      1.0 + breath * 0.010,
      1.0 + Math.cos(time * 2.2) * 0.008,
      1.0 + breath * 0.012
    );

    // Đuôi ngựa xanh cobalt đung đưa uyển chuyển theo gió
    parts.ponytailMesh.rotation.x = -1.05 + Math.sin(time * 1.8) * 0.06;
    parts.hairGroup.rotation.z = Math.sin(time * 1.5) * 0.035;

    // 2. Quỹ đạo quay liên tục của 4 lưỡi kiếm bay lơ lửng
    let orbitSpeed = 1.4;
    let orbitRadius = 0.72;

    if (ultimateTimer > 0) {
      ultimateTimer -= delta;
      const progress = 1 - ultimateTimer / 1.8;
      const waltz = Math.sin(progress * Math.PI);

      // Xoay tròn vũ bão như một vũ công ballet
      parts.rootGroup.rotation.y += delta * 14.0;
      orbitSpeed = 8.5; // Kiếm xoay siêu tốc
      orbitRadius = 0.72 + waltz * 0.65; // Mở rộng bán kính bão kiếm khí

      // Đưa hai tay lên cao vũ điệu ballet
      parts.rightArm.rotation.set(-0.35 - waltz * 0.85, 0, -0.48 - waltz * 0.35);
      parts.leftArm.rotation.set(-0.35 - waltz * 0.85, 0, 0.48 + waltz * 0.35);

      // Lưỡi kiếm rực sáng Plasma xanh sapphire cực hạn
      mats.bladePlasmaMat.emissiveIntensity = 2.4 + waltz * 1.8;
    } else {
      parts.rootGroup.rotation.y = 0;
      mats.bladePlasmaMat.emissiveIntensity = 1.45;

      if (attackTimer > 0) {
        attackTimer -= delta;
        const progress = 1 - attackTimer / 0.50;
        const thrust = Math.sin(progress * Math.PI);

        // Chỉ tay phóng 2 kiếm phía trước lao thẳng tới mục tiêu
        parts.rightArm.rotation.x = -0.35 - thrust * 0.65;
        orbitSpeed = 3.2;
      } else {
        parts.rightArm.rotation.x = -0.35;
        parts.leftArm.rotation.x = 0.28;
      }
    }

    // Cập nhật vị trí và góc xoay của 4 lưỡi kiếm bay
    const baseAngle = time * orbitSpeed;
    parts.floatingBlades.forEach((blade, i) => {
      const angle = baseAngle + (i * Math.PI) / 2;
      blade.position.set(
        orbitRadius * Math.cos(angle),
        Math.sin(angle * 2) * 0.14,
        orbitRadius * Math.sin(angle)
      );
      // Lưỡi kiếm hướng mũi về phía tiếp tuyến quỹ đạo
      blade.rotation.y = -angle + Math.PI / 2;
      blade.rotation.z = Math.PI * 0.15;
    });

    // 3. Xử lý Trúng Đòn (Hit Flinch)
    if (hitTimer > 0) {
      hitTimer -= delta;
      const flinch = Math.sin((1 - hitTimer / 0.42) * Math.PI);
      parts.rootGroup.position.z = -flinch * 0.08;
      parts.headGroup.rotation.x = flinch * 0.12;

      // 4 lưỡi kiếm thu hẹp bán kính lại che chắn cơ thể
      parts.floatingBlades.forEach((blade) => {
        blade.position.multiplyScalar(0.75);
      });
    } else if (ultimateTimer <= 0) {
      parts.rootGroup.position.z = 0;
      parts.headGroup.rotation.x = 0;
    }
  };

  const triggerAttack = (): void => {
    attackTimer = 0.50;
  };

  const triggerUltimate = (): void => {
    ultimateTimer = 1.8;
  };

  const triggerHit = (): void => {
    hitTimer = 0.42;
  };

  return {
    update,
    triggerAttack,
    triggerUltimate,
    triggerHit
  };
}
