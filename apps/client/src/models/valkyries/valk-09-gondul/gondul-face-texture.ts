import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';

/**
 * Creates high-detail procedural anime face textures for VALK-09 Gondul (Meganekko Researcher).
 * Tạo texture khuôn mặt anime chi tiết cao cho VALK-09 Gondul:
 * Đôi mắt hồng ngọc thông thái (Rose Ruby Eyes), cặp kính cận tri thức (Cyber Glasses),
 * và biểu cảm bối rối đỏ mặt (Flustered Dere Blush) chuyển biến qua 3 cấp độ rách giáp.
 */
export function createGondulFaceTexture(tier: ClothDamageTier = 1): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Soft Porcelain Skin Tone with rosy glow
  ctx.fillStyle = '#ffefeb';
  ctx.fillRect(0, 0, 512, 512);

  // 2. Rosy Cheek Blush
  const blushOpacity = tier === 3 ? 0.65 : tier === 2 ? 0.45 : 0.25;
  const blushGradientLeft = ctx.createRadialGradient(160, 290, 10, 160, 290, 55);
  blushGradientLeft.addColorStop(0, `rgba(255, 90, 140, ${blushOpacity})`);
  blushGradientLeft.addColorStop(1, 'rgba(255, 90, 140, 0)');
  ctx.fillStyle = blushGradientLeft;
  ctx.beginPath();
  ctx.arc(160, 290, 55, 0, Math.PI * 2);
  ctx.fill();

  const blushGradientRight = ctx.createRadialGradient(352, 290, 10, 352, 290, 55);
  blushGradientRight.addColorStop(0, `rgba(255, 90, 140, ${blushOpacity})`);
  blushGradientRight.addColorStop(1, 'rgba(255, 90, 140, 0)');
  ctx.fillStyle = blushGradientRight;
  ctx.beginPath();
  ctx.arc(352, 290, 55, 0, Math.PI * 2);
  ctx.fill();

  // Tier 2/3 Cute Anime Blush Hash Lines
  if (tier >= 2) {
    ctx.strokeStyle = `rgba(255, 50, 110, ${tier === 3 ? 0.75 : 0.5})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    // Left cheek lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(135 + i * 15, 275);
      ctx.lineTo(150 + i * 15, 295);
      ctx.stroke();
    }
    // Right cheek lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(330 + i * 15, 275);
      ctx.lineTo(345 + i * 15, 295);
      ctx.stroke();
    }
  }

  // 3. Nose: Dainty anime button nose
  ctx.fillStyle = '#f0b8af';
  ctx.beginPath();
  ctx.arc(256, 310, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. Lips: Shy intellectual pout
  if (tier === 3) {
    // Trembling parted lips
    ctx.strokeStyle = '#d4566c';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(238, 362);
    ctx.quadraticCurveTo(256, 372, 274, 362);
    ctx.stroke();

    // Open mouth gap
    ctx.fillStyle = '#942238';
    ctx.beginPath();
    ctx.ellipse(256, 366, 10, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (tier === 2) {
    // Flustered wavy mouth
    ctx.strokeStyle = '#e06078';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(240, 362);
    ctx.quadraticCurveTo(248, 358, 256, 362);
    ctx.quadraticCurveTo(264, 366, 272, 362);
    ctx.stroke();
  } else {
    // Neat quiet shy smile
    ctx.strokeStyle = '#e6738a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(242, 360);
    ctx.quadraticCurveTo(256, 366, 270, 360);
    ctx.stroke();
  }

  // 5. Eyebrows: Soft pastel pink, thoughtful arched angle
  ctx.strokeStyle = '#d66885';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  // Left eyebrow
  ctx.beginPath();
  ctx.moveTo(135, tier >= 2 ? 185 : 190);
  ctx.quadraticCurveTo(175, tier >= 2 ? 175 : 180, 215, tier >= 2 ? 195 : 192);
  ctx.stroke();
  // Right eyebrow
  ctx.beginPath();
  ctx.moveTo(297, tier >= 2 ? 195 : 192);
  ctx.quadraticCurveTo(337, tier >= 2 ? 175 : 180, 377, tier >= 2 ? 185 : 190);
  ctx.stroke();

  // 6. Large Anime Rose Ruby Eyes
  const renderGondulEye = (centerX: number, centerY: number, isRight: boolean): void => {
    // Sclera (White of the eye)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 38, 48, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Iris Gradient (Deep Rose Ruby to Vibrant Pink with holographic cyan ring)
    const irisGrad = ctx.createRadialGradient(centerX, centerY + 8, 5, centerX, centerY, 36);
    irisGrad.addColorStop(0, '#ff4081');
    irisGrad.addColorStop(0.5, '#d81b60');
    irisGrad.addColorStop(0.85, '#880e4f');
    irisGrad.addColorStop(1, '#4a0024');

    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 4, 32, 42, 0, 0, Math.PI * 2);
    ctx.fillStyle = irisGrad;
    ctx.fill();

    // Hexagonal cyber calculation aperture in pupil
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let a = 0; a < 6; a++) {
      const angle = (a * Math.PI) / 3;
      const hx = centerX + Math.cos(angle) * 12;
      const hy = centerY + 4 + Math.sin(angle) * 15;
      if (a === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();

    // Pupil
    ctx.fillStyle = '#260012';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 4, 13, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye Highlights (Gleam of intelligence and emotion)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(centerX - 10, centerY - 8, 8, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX + 11, centerY + 14, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Secondary subtle star sparkle
    ctx.fillStyle = 'rgba(255, 180, 220, 0.85)';
    ctx.beginPath();
    ctx.arc(centerX - 8, centerY + 18, 3, 0, Math.PI * 2);
    ctx.fill();

    // Upper Eyelash Line (Deep wine-purple with stylish outer flick)
    ctx.strokeStyle = '#380c20';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (isRight) {
      ctx.moveTo(centerX - 35, centerY - 32);
      ctx.quadraticCurveTo(centerX, centerY - 46, centerX + 40, centerY - 28);
      ctx.lineTo(centerX + 48, centerY - 35); // Cat eye flick
    } else {
      ctx.moveTo(centerX - 48, centerY - 35);
      ctx.lineTo(centerX - 40, centerY - 28);
      ctx.quadraticCurveTo(centerX, centerY - 46, centerX + 35, centerY - 32);
    }
    ctx.stroke();

    // Delicate lower lashes
    ctx.strokeStyle = 'rgba(56, 12, 32, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 26, 28, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    ctx.restore();
  };

  renderGondulEye(175, 240, false);
  renderGondulEye(337, 240, true);

  // 7. Tears of embarrassment for Tier 3
  if (tier === 3) {
    ctx.fillStyle = 'rgba(160, 230, 255, 0.85)';
    // Left eye tear drop
    ctx.beginPath();
    ctx.arc(148, 295, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(148, 290);
    ctx.lineTo(152, 282);
    ctx.lineTo(144, 282);
    ctx.closePath();
    ctx.fill();

    // Right eye glistening tear
    ctx.beginPath();
    ctx.arc(364, 295, 6.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 8. Meganekko Cyber Glasses (Cặp kính cận tri thức)
  ctx.save();
  const glassesTilt = tier === 2 ? 0.08 : tier === 3 ? 0.16 : 0.0;
  ctx.translate(256, 240);
  ctx.rotate(glassesTilt);

  // Glasses Frame: Elegant gold alloy oval rims
  ctx.strokeStyle = tier === 3 ? '#998030' : '#ffd700';
  ctx.lineWidth = 3.5;

  // Left Rim
  ctx.beginPath();
  ctx.roundRect(-125, -35, 82, 64, 16);
  ctx.stroke();

  // Right Rim
  ctx.beginPath();
  ctx.roundRect(43, -35, 82, 64, 16);
  ctx.stroke();

  // Bridge between rims
  ctx.beginPath();
  ctx.moveTo(-43, -12);
  ctx.quadraticCurveTo(0, -18, 43, -12);
  ctx.stroke();

  // Left & Right Temple arms
  ctx.beginPath();
  ctx.moveTo(-125, -12);
  ctx.lineTo(-155, -8);
  ctx.moveTo(125, -12);
  ctx.lineTo(155, -8);
  ctx.stroke();

  // Glass Lens reflection sheen (Cyan light bounce)
  if (tier < 3) {
    ctx.fillStyle = 'rgba(0, 240, 255, 0.18)';
    // Left sheen diagonal
    ctx.beginPath();
    ctx.moveTo(-115, -30);
    ctx.lineTo(-75, -30);
    ctx.lineTo(-95, 25);
    ctx.lineTo(-115, 25);
    ctx.closePath();
    ctx.fill();

    // Right sheen diagonal
    ctx.beginPath();
    ctx.moveTo(55, -30);
    ctx.lineTo(95, -30);
    ctx.lineTo(75, 25);
    ctx.lineTo(55, 25);
    ctx.closePath();
    ctx.fill();
  } else {
    // Cracked glass pattern for Tier 3
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(85, -20);
    ctx.lineTo(95, -5);
    ctx.lineTo(110, 10);
    ctx.moveTo(95, -5);
    ctx.lineTo(75, 12);
    ctx.stroke();
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
