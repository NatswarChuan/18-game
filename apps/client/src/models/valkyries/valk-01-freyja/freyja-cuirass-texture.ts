import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';

/**
 * Creates high-resolution 512x512 procedural metallic cyber-cuirass texture for Freyja's armor cups.
 * Sinh texture giáp ngực Titan 512x512 cho áo giáp ngực Valkyrie của Freyja:
 * - Nền kim loại Titanium chải xước với độ bóng phản xạ cao
 * - Rãnh năng lượng Neon Cyan (#00f0ff) phát sáng rực rỡ uốn lượn viền cúp ngực
 * - Đường vân giáp cánh Valkyrie mạ vàng kim tinh xảo
 * - Cấp độ Tier 2 hiển thị các vết nứt vỡ rỉ sét plasma năng lượng.
 *
 * @param tier - Current cloth damage tier (1: Pristine, 2: Torn, 3: Climax).
 * @returns THREE.CanvasTexture configured for cyber-armor mapping.
 */
export function createFreyjaCuirassTexture(tier: ClothDamageTier = 1): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Sleek Midnight Titanium Cyber Armor Base matching VALK-01 cyber-exosuit
  const baseGrad = ctx.createLinearGradient(0, 0, 512, 512);
  baseGrad.addColorStop(0.00, '#141824'); // Deep metallic crevice
  baseGrad.addColorStop(0.25, '#222a3a'); // Dark brushed titanium
  baseGrad.addColorStop(0.50, '#364256'); // Specular steel highlight ridge
  baseGrad.addColorStop(0.75, '#283244'); // Secondary dark metallic reflection
  baseGrad.addColorStop(1.00, '#181e2b'); // Outer ambient shadow
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Fine brushed metal anisotropic horizontal micro-scratches
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 1);
  }
  ctx.fillStyle = 'rgba(20, 25, 40, 0.08)';
  for (let y = 2; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 1);
  }

  // 2. High-Tech Hexagonal Nano-Weave Texture Pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  const hexSize = 24;
  for (let x = 0; x < 512; x += hexSize * 1.5) {
    for (let y = 0; y < 512; y += hexSize * Math.sqrt(3)) {
      ctx.beginPath();
      for (let side = 0; side < 6; side++) {
        const angle = (Math.PI / 3) * side;
        const hx = x + hexSize * Math.cos(angle);
        const hy = y + hexSize * Math.sin(angle);
        if (side === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // 3. Glowing Neon Cyan Valkyrie Energy Conduits (#00f0ff)
  ctx.save();
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 14;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Upper sweetheart energy contour (runs along the plunging cleavage rim)
  ctx.beginPath();
  ctx.moveTo(30, 140);
  ctx.bezierCurveTo(120, 90, 240, 110, 320, 180);
  ctx.bezierCurveTo(390, 240, 440, 330, 480, 420);
  ctx.stroke();

  // Secondary cyber power conduit
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, 200);
  ctx.bezierCurveTo(140, 160, 220, 190, 280, 260);
  ctx.bezierCurveTo(330, 320, 370, 410, 410, 490);
  ctx.stroke();
  ctx.restore();

  // 4. Radiant Gold Filigree Valkyrie Wing Trim (#ffd700)
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(20, 120);
  ctx.bezierCurveTo(100, 70, 230, 90, 310, 160);
  ctx.bezierCurveTo(380, 220, 430, 310, 470, 400);
  ctx.stroke();

  // 5. Tier-specific Battle Damage & Plasma Fissures
  if (tier >= 2) {
    // Cracked cyber armor: plasma fissures leaking energy
    ctx.save();
    ctx.shadowColor = '#ff2255';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 4;

    // Fissure 1
    ctx.beginPath();
    ctx.moveTo(180, 120);
    ctx.lineTo(210, 190);
    ctx.lineTo(195, 260);
    ctx.lineTo(240, 340);
    ctx.stroke();

    // Fissure 2
    ctx.beginPath();
    ctx.moveTo(280, 240);
    ctx.lineTo(330, 290);
    ctx.lineTo(320, 380);
    ctx.stroke();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
