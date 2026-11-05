import { HerjaMeshParts } from './herja-geometry';
import { HerjaMaterialBundle } from './herja-materials';

export interface HerjaAnimationController {
  update: (delta: number, time: number) => void;
  triggerAttack: () => void;
  triggerUltimate: () => void;
  triggerHit: () => void;
}

/**
 * Creates the animation controller for VALK-07: Herja (Frontline Berserker).
 * Quản lý cử động 3D cho Herja:
 * - Nhịp thở chiến binh cuồng nộ (ngực nở nang phập phồng, cơ bụng số 11 co duỗi).
 * - Động tác múa thương Gungnir thế thủ vững như bàn thạch.
 * - Đòn đâm thương sấm sét cuồng phong (Thunder Spear Thrust).
 * - Tuyệt Kỹ: Xung Kích Thương Sấm (Thunder Spear Blitz) - phóng điện plasma cực hạn.
 * - Phản ứng trúng đòn ngạo nghễ thách thức.
 */
export function createHerjaAnimations(
  parts: HerjaMeshParts,
  mats: HerjaMaterialBundle
): HerjaAnimationController {
  let attackTimer = 0;
  let ultimateTimer = 0;
  let hitTimer = 0;

  const update = (delta: number, time: number): void => {
    // 1. Nhịp thở chiến binh dồn dập (Berserker Breathing & Midriff Flex)
    const breath = Math.sin(time * 2.6);
    parts.bustGroup.position.y = 0.34 + breath * 0.009;
    parts.bustGroup.scale.set(
      1.0 + breath * 0.012,
      1.0 + Math.cos(time * 2.6) * 0.01,
      1.0 + breath * 0.015
    );

    // Cơ bụng số 11 co giãn theo nhịp thở chiến trận
    parts.absGroup.scale.set(
      1.0 + breath * 0.01,
      1.0,
      1.0 + breath * 0.012
    );

    // Mái tóc vàng hoang dã giật nhẹ theo gió
    parts.hairGroup.rotation.z = Math.sin(time * 2.2) * 0.045;
    parts.hairGroup.rotation.x = Math.cos(time * 1.8) * 0.03;

    // 2. Ngọn thương Gungnir nhấp nhô & Xung điện sấm sét nhấp nháy
    parts.spearGroup.position.y = 0.88 + Math.sin(time * 2.2) * 0.02;
    mats.thunderPlasmaMat.emissiveIntensity = 1.45 + Math.sin(time * 5.0) * 0.35;

    // 3. Xử lý Hoạt ảnh Đâm Thương (Spear Thrust Attack)
    if (attackTimer > 0) {
      attackTimer -= delta;
      const progress = 1 - attackTimer / 0.50;
      const thrust = Math.sin(progress * Math.PI);

      // Hạ thấp người và đâm thẳng ngọn thương ra phía trước
      parts.rightArm.rotation.x = 0.42 - thrust * 0.95;
      parts.spearGroup.position.z = 0.25 + thrust * 0.55;
      parts.spearGroup.rotation.x = 0.22 - thrust * 0.35;
      mats.thunderPlasmaMat.emissiveIntensity = 2.2 + thrust * 1.5;
    } else {
      parts.rightArm.rotation.x = 0.42;
      parts.spearGroup.position.z = 0.25;
      parts.spearGroup.rotation.x = 0.22;
    }

    // 4. Xử lý Tuyệt Kỹ: Xung Kích Thương Sấm (Thunder Spear Blitz Ultimate)
    if (ultimateTimer > 0) {
      ultimateTimer -= delta;
      const progress = 1 - ultimateTimer / 1.7;
      const blitz = Math.sin(progress * Math.PI);

      // Tư thế chuẩn bị phóng: Kéo thương lùi lại rồi phóng cực đại
      if (progress < 0.35) {
        // Tụ lực lùi về sau
        const prep = progress / 0.35;
        parts.rootGroup.position.z = -prep * 0.15;
        parts.spearGroup.position.set(-0.52, 0.88, 0.25 - prep * 0.3);
        parts.spearGroup.rotation.x = 0.22 + prep * 0.45;
      } else {
        // Lao vút về phía trước đâm xuyên giáp
        parts.rootGroup.position.z = (progress - 0.35) * 0.5;
        parts.spearGroup.position.set(-0.52, 0.88, 0.25 + blitz * 0.85);
        parts.spearGroup.rotation.x = 0.22 - blitz * 0.45;
      }

      // Ngửa cổ gầm vang chiến binh
      parts.headGroup.rotation.x = -blitz * 0.32;
      parts.leftArm.rotation.x = -0.35 + blitz * 0.75; // Nắm đấm vung mạnh

      // Ngọn thương bùng nổ sấm sét cực hạn
      mats.thunderPlasmaMat.emissiveIntensity = 3.6 + blitz * 2.0;
    } else if (attackTimer <= 0) {
      parts.rootGroup.position.z = 0;
      parts.headGroup.rotation.x = 0;
      parts.leftArm.rotation.x = -0.35;
      parts.spearGroup.position.set(-0.52, 0.88, 0.25);
    }

    // 5. Xử lý Trúng Đòn (Hit Flinch)
    if (hitTimer > 0) {
      hitTimer -= delta;
      const flinch = Math.sin((1 - hitTimer / 0.40) * Math.PI);
      parts.rootGroup.position.z = -flinch * 0.09;
      parts.headGroup.rotation.z = -flinch * 0.12; // Lắc đầu ngạo nghễ
      parts.bustGroup.position.y = 0.34 + flinch * 0.02; // Rung rinh ngực nẩy
    }
  };

  const triggerAttack = (): void => {
    attackTimer = 0.50;
  };

  const triggerUltimate = (): void => {
    ultimateTimer = 1.7;
  };

  const triggerHit = (): void => {
    hitTimer = 0.40;
  };

  return {
    update,
    triggerAttack,
    triggerUltimate,
    triggerHit
  };
}
