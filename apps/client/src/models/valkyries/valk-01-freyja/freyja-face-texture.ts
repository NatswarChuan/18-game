import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';

/**
 * Generates an ultra-detailed, high-resolution anime face texture for Freyja (VALK-01).
 * Tạo texture khuôn mặt anime 1024x1024 phong cách Waifu cao cấp (Genshin / Honkai Star Rail / Nikke):
 * - Đôi mắt hổ phách chiến thần lấp lánh ánh sao (Starry Amber Iris), đa tầng specular highlight
 * - Lông mi cánh bướm sắc sảo, hàng mi cong vút kiêu sa
 * - Gò má ửng hồng phấn đào ngọt ngào với hiệu ứng airbrush và hash marks (///)
 * - Sống mũi nhỏ xinh và bờ môi son mọng nước
 * - Lớp chuyển tiếp viền mềm mại hòa quyện 100% vào làn da sứ của đầu 3D không để lại vệt cắt.
 */
export function createFreyjaFaceTexture(tier: ClothDamageTier = 1): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Warm Radiant Porcelain Skin Base (Prevents dark/gray hollow shadows)
  const faceSkinGrad = ctx.createRadialGradient(512, 540, 40, 512, 540, 500);
  faceSkinGrad.addColorStop(0.00, '#fff5ee');
  faceSkinGrad.addColorStop(0.35, '#ffded2');
  faceSkinGrad.addColorStop(0.75, '#f8bca8');
  faceSkinGrad.addColorStop(1.00, '#e89c86');
  ctx.fillStyle = faceSkinGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft forehead shadow cast by hair bangs
  const foreheadShadow = ctx.createLinearGradient(0, 60, 0, 240);
  foreheadShadow.addColorStop(0, 'rgba(160, 30, 60, 0.18)');
  foreheadShadow.addColorStop(1, 'rgba(160, 30, 60, 0)');
  ctx.fillStyle = foreheadShadow;
  ctx.fillRect(0, 60, 1024, 180);

  // 2. Airbrushed Sensual Cheeks (Luminous petal-pink peach blush)
  const blushOpacity = tier === 3 ? 0.90 : tier === 2 ? 0.75 : 0.60;
  const drawBlush = (centerX: number, centerY: number): void => {
    const grad = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, 120);
    grad.addColorStop(0, `rgba(255, 70, 115, ${blushOpacity})`);
    grad.addColorStop(0.40, `rgba(255, 120, 155, ${blushOpacity * 0.70})`);
    grad.addColorStop(0.75, `rgba(255, 185, 195, ${blushOpacity * 0.35})`);
    grad.addColorStop(1, 'rgba(255, 235, 225, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
    ctx.fill();

    // Subtle specular sheen on high cheekbone
    const sheenGrad = ctx.createRadialGradient(centerX - 15, centerY - 25, 2, centerX - 15, centerY - 25, 45);
    sheenGrad.addColorStop(0, `rgba(255, 255, 255, ${blushOpacity * 0.40})`);
    sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.arc(centerX - 15, centerY - 25, 45, 0, Math.PI * 2);
    ctx.fill();

    // Seductive Anime Blush Hash Marks (///) for flustered/climax expression
    if (tier >= 2) {
      ctx.strokeStyle = `rgba(225, 30, 75, ${tier === 3 ? 0.80 : 0.55})`;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      const hashX = [centerX - 24, centerX - 8, centerX + 8, centerX + 24];
      hashX.forEach((hx) => {
        ctx.beginPath();
        ctx.moveTo(hx - 7, centerY - 12);
        ctx.lineTo(hx + 7, centerY + 12);
        ctx.stroke();
      });
    }
  };

  drawBlush(415, 510); // Character's right cheek (aligned with refined eye center)
  drawBlush(609, 510); // Character's left cheek (aligned with refined eye center)

  // 3. Sweat drops / Tears for Tier 2 and Tier 3
  if (tier >= 2) {
    ctx.fillStyle = 'rgba(180, 235, 255, 0.85)';
    ctx.beginPath();
    ctx.ellipse(750, 485, 7, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(750, 471);
    ctx.lineTo(756, 457);
    ctx.lineTo(744, 457);
    ctx.closePath();
    ctx.fill();
  }
  if (tier === 3) {
    // Teardrops glistening under eyes
    ctx.fillStyle = 'rgba(200, 242, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(355, 535, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(669, 535, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Fierce, Alluring Anime Amber-Ruby Eyes (Golden Anime Waifu Proportions)
  // Local Coordinates:
  // +X: ALWAYS TOWARDS THE TEMPLE (outer eye)
  // -X: ALWAYS TOWARDS THE NOSE (inner eye)
  const drawAnimeEye = (centerX: number, centerY: number, isRight: boolean): void => {
    ctx.save();
    ctx.translate(centerX, centerY);
    if (!isRight) {
      ctx.scale(-1, 1);
    }
    // Seductive anime almond cat-eye tilt (-0.06 rad)
    ctx.rotate(-0.06);

    // Sclera: Refined anime almond eye (width 184px, height 128px)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 92, 64, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft celestial ambient eyelid shadow
    const scleraShadow = ctx.createLinearGradient(0, -64, 0, 0);
    scleraShadow.addColorStop(0, '#8898b2');
    scleraShadow.addColorStop(0.55, '#c8d4e2');
    scleraShadow.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = scleraShadow;
    ctx.beginPath();
    ctx.ellipse(0, 0, 92, 64, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris Gradient: Deep Crimson Wine -> Radiant Blazing Amber -> Honey Gold -> Sunlit Highlight
    const irisGrad = ctx.createLinearGradient(0, -62, 0, 62);
    irisGrad.addColorStop(0.00, '#0e0103');
    irisGrad.addColorStop(0.20, '#580613');
    irisGrad.addColorStop(0.48, '#e63d00');
    irisGrad.addColorStop(0.75, '#ffaa00');
    irisGrad.addColorStop(1.00, '#fff490');

    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(2, 4, 64, 66, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep Upper Iris Cast Shadow
    const upperIrisShadow = ctx.createLinearGradient(0, -62, 0, 10);
    upperIrisShadow.addColorStop(0.0, 'rgba(10, 1, 3, 0.98)');
    upperIrisShadow.addColorStop(0.5, 'rgba(45, 4, 12, 0.88)');
    upperIrisShadow.addColorStop(1.0, 'rgba(80, 8, 22, 0)');
    ctx.fillStyle = upperIrisShadow;
    ctx.beginPath();
    ctx.ellipse(2, 4, 64, 66, 0, 0, Math.PI * 2);
    ctx.fill();

    // Radiant Sunburst Rays inside Iris
    ctx.strokeStyle = 'rgba(255, 248, 180, 0.85)';
    ctx.lineWidth = 2.0;
    for (let a = 0; a < 16; a++) {
      const angle = (a * Math.PI) / 8;
      ctx.beginPath();
      ctx.moveTo(2 + Math.cos(angle) * 18, 4 + Math.sin(angle) * 20);
      ctx.lineTo(2 + Math.cos(angle) * 48, 4 + Math.sin(angle) * 50);
      ctx.stroke();
    }

    // Deep Dark Pupil (or Heart Pupil for Tier 3 Climax)
    if (tier === 3) {
      ctx.fillStyle = '#6a0418';
      ctx.beginPath();
      ctx.moveTo(2, 10);
      ctx.bezierCurveTo(-20, -8, -18, -24, 2, -12);
      ctx.bezierCurveTo(20, -24, 22, -8, 2, 10);
      ctx.fill();
    } else {
      ctx.fillStyle = '#060102';
      ctx.beginPath();
      ctx.ellipse(2, 0, 24, 34, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing Golden Inner Ring
    ctx.strokeStyle = 'rgba(255, 220, 50, 0.92)';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(2, 4, 34, 38, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Primary Crisp Specular Highlight (Upper-outer temple corner)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(24, -20, 18, 22, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Specular Sparkle (Bottom-inner)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(-20, 24, 10, 0, Math.PI * 2);
    ctx.fill();

    // Tertiary Micro Sparkle
    ctx.beginPath();
    ctx.arc(16, 28, 6, 0, Math.PI * 2);
    ctx.fill();

    // Luxurious Bold Winged Eyeliner (Deep Obsidian Wine #0c0208)
    ctx.fillStyle = '#0c0208';
    ctx.beginPath();
    ctx.moveTo(-82, -30); // Inner tear duct
    ctx.bezierCurveTo(-38, -68, 42, -72, 96, -34); // Dramatic arch to temple
    ctx.bezierCurveTo(55, -56, -24, -52, -74, -26);
    ctx.closePath();
    ctx.fill();

    // Seductive Winged Cat-Eye Flick
    ctx.beginPath();
    ctx.moveTo(94, -34);
    ctx.lineTo(128, -52);
    ctx.lineTo(100, -28);
    ctx.closePath();
    ctx.fill();

    // Secondary Temple Eyelash
    ctx.beginPath();
    ctx.moveTo(88, -22);
    ctx.lineTo(114, -38);
    ctx.lineTo(94, -18);
    ctx.closePath();
    ctx.fill();

    // Lower Eyelid Rim Accent
    ctx.strokeStyle = 'rgba(20, 4, 10, 0.88)';
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.arc(2, 16, 50, Math.PI * 0.24, Math.PI * 0.76);
    ctx.stroke();

    // Lower Outer Feathered Lash
    ctx.beginPath();
    ctx.moveTo(42, 38);
    ctx.lineTo(58, 52);
    ctx.lineTo(38, 42);
    ctx.closePath();
    ctx.fill();

    // Double Eyelid Crease
    ctx.strokeStyle = 'rgba(150, 30, 55, 0.75)';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(5, -50, 52, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();

    // Determined Heroic Crimson Eyebrow (Angled down for confident warrior focus)
    ctx.fillStyle = '#9c102c';
    ctx.beginPath();
    ctx.moveTo(-62, -74); // Inner brow
    ctx.bezierCurveTo(-20, -94, 40, -90, 84, -66); // Determined arch & sharp tail
    ctx.bezierCurveTo(42, -82, -16, -84, -54, -70);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  drawAnimeEye(415, 475, false); // Character's right eye (viewer's left)
  drawAnimeEye(609, 475, true);  // Character's left eye (viewer's right)

  // 4b. Signature Glowing Cyan Cyber Scouter HUD Targeting Reticle (Over left eye matching VALK-01.jpg)
  const drawCyberScouterHUD = (cx: number, cy: number): void => {
    ctx.save();
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.4;

    // Outer Target Bracket
    const r = 80;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI - 0.6, Math.PI + 0.6);
    ctx.stroke();

    // Corner brackets
    const bLen = 18;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy - 60 + bLen);
    ctx.lineTo(cx - 70, cy - 60);
    ctx.lineTo(cx - 70 + bLen, cy - 60);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(cx + 70 - bLen, cy - 60);
    ctx.lineTo(cx + 70, cy - 60);
    ctx.lineTo(cx + 70, cy - 60 + bLen);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(cx + 70, cy + 60 - bLen);
    ctx.lineTo(cx + 70, cy + 60);
    ctx.lineTo(cx + 70 - bLen, cy + 60);
    ctx.stroke();

    // Rangefinder ticks
    ctx.fillStyle = '#00f0ff';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(cx + 74, cy - 25 + i * 14, 8, 2);
    }

    ctx.restore();
  };
  drawCyberScouterHUD(609, 475);

  // 5. Delicate Anime Nose Bridge & Defined Tip (Matching VALK-01.jpg)
  // Subtle vertical bridge shadow
  ctx.strokeStyle = 'rgba(195, 65, 90, 0.32)';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(509, 516);
  ctx.lineTo(509, 538);
  ctx.stroke();

  // Dainty nose tip highlight & shadow
  ctx.fillStyle = '#e8788a';
  ctx.beginPath();
  ctx.ellipse(512, 544, 4.5, 4.0, 0, 0, Math.PI * 2);
  ctx.fill();

  const noseShadow = ctx.createRadialGradient(514, 546, 2, 514, 546, 14);
  noseShadow.addColorStop(0, 'rgba(190, 55, 80, 0.42)');
  noseShadow.addColorStop(1, 'rgba(255, 235, 225, 0)');
  ctx.fillStyle = noseShadow;
  ctx.beginPath();
  ctx.arc(514, 546, 14, 0, Math.PI * 2);
  ctx.fill();

  // 6. Expressive Anime Lips (Centered at Y = 605 for youthful golden anime proportions)
  if (tier === 3) {
    // Climax Panting Lip: Parted lips with tongue/teeth gap
    ctx.strokeStyle = '#c4284d';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(470, 605);
    ctx.quadraticCurveTo(512, 626, 554, 605);
    ctx.stroke();

    ctx.fillStyle = '#820e26';
    ctx.beginPath();
    ctx.ellipse(512, 612, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.ellipse(512, 618, 12, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (tier === 2) {
    // Flustered Wavy Pout
    ctx.strokeStyle = '#d63458';
    ctx.lineWidth = 4.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(474, 605);
    ctx.quadraticCurveTo(494, 598, 512, 605);
    ctx.quadraticCurveTo(530, 612, 550, 605);
    ctx.stroke();
  } else {
    // Confident Heroic Anime Lip Contour with defined cupid's bow and cherry gloss
    ctx.strokeStyle = '#b8123c';
    ctx.lineWidth = 5.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(462, 603);
    ctx.quadraticCurveTo(490, 599, 512, 604);
    ctx.quadraticCurveTo(534, 599, 562, 603);
    ctx.stroke();

    // Soft Lip Tint & Glossy Lower Lip highlight
    ctx.fillStyle = 'rgba(255, 90, 135, 0.92)';
    ctx.beginPath();
    ctx.ellipse(512, 613, 26, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(512, 615, 12, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 7. Subtle Chin Specular Highlight (Centered at Y = 665)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.ellipse(512, 665, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
