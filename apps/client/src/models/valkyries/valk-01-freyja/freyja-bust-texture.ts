import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';

/**
 * Creates ultra-detailed 512x512 procedural Anime 18+ Bust Texture for Freyja (VALK-01).
 * Sinh texture 512x512 chuyên biệt cho đôi gò bồng đảo cúp G quyến rũ của Freyja:
 * - Chuẩn tọa độ 3D SphereGeometry:
 *   + (256, 220) là đỉnh ngực (+Z Apex / Nipple) hướng thẳng về phía camera
 *   + innerCleavageX: Hướng vào rãnh ngực giữa cơ thể (Left: X=377, Right: X=135)
 *   + outerSideboobX: Hướng ra sườn ngực nách (Left: X=135, Right: X=377)
 *   + Y < 220: Dốc ngực trên hướng lên xương quai xanh (Decolletage)
 *   + Y > 220: Bầu ngực dưới căng tròn (Underboob)
 * - Quầng hồng cánh sen (Petal-pink Areola) quyến rũ và đỉnh nhũ hoa đỏ hồng mọng nước có điểm sáng phản chiếu
 * - Tier 1: Cúp giáp nâng ngực Demi-cup xẻ sâu sweetheart ôm nâng từ dưới, để lộ bờ ngực căng mọng
 * - Tier 2: Giáp nứt vỡ lộ quầng hồng và mồ hôi đẫm rãnh ngực
 * - Tier 3: Climax Extreme - 100% phô trọn bầu ngực trần ửng hồng với dây đai ren đen micro-harness nâng đỡ underboob, quầng hồng và nhũ hoa căng tràn khiêu gợi.
 */
export function createFreyjaBustTexture(
  tier: ClothDamageTier = 1,
  isRight = false
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const cx = 256;
  const cy = 220; // Anatomical forward apex (+Z)

  // Medial cleavage and lateral sideboob coordinates for 3D SphereGeometry
  const innerCleavageX = isRight ? 135 : 377;
  const outerSideboobX = isRight ? 377 : 135;
  const innerSign = isRight ? -1 : 1;

  // 1. Base Layer: Silky, Warm Anime Porcelain Skin tone
  const skinGrad = ctx.createRadialGradient(cx, cy, 15, cx, cy, 270);
  skinGrad.addColorStop(0.00, '#fff0e8'); // Soft specular peak
  skinGrad.addColorStop(0.35, '#ffdcce'); // Warm creamy peach anime skin
  skinGrad.addColorStop(0.70, '#f9beaa'); // Rosy warm undertone
  skinGrad.addColorStop(1.00, '#e89e88'); // Ambient contour shadow
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Medial Cleavage Valley Shadow & Warm Skin-on-Skin Blush
  const cleavageGrad = ctx.createRadialGradient(
    innerCleavageX, cy + 10, 10,
    innerCleavageX, cy + 10, 170
  );
  cleavageGrad.addColorStop(0.00, 'rgba(175, 40, 70, 0.45)');
  cleavageGrad.addColorStop(0.50, 'rgba(215, 85, 115, 0.22)');
  cleavageGrad.addColorStop(1.00, 'rgba(255, 200, 190, 0)');
  ctx.fillStyle = cleavageGrad;
  ctx.beginPath();
  ctx.arc(innerCleavageX, cy + 10, 170, 0, Math.PI * 2);
  ctx.fill();

  // 3. Smooth Underboob Curvature Ambient Occlusion (Y: 300 - 512)
  const underboobGrad = ctx.createLinearGradient(0, 290, 0, 512);
  underboobGrad.addColorStop(0.0, 'rgba(165, 35, 60, 0)');
  underboobGrad.addColorStop(0.5, 'rgba(165, 35, 60, 0.25)');
  underboobGrad.addColorStop(1.0, 'rgba(135, 25, 45, 0.50)');
  ctx.fillStyle = underboobGrad;
  ctx.fillRect(0, 290, 512, 222);

  // 4. Soft Decolletage Sheen on Upper Breast Slope (Y: 60 - 180)
  const sheenGrad = ctx.createRadialGradient(cx, cy - 65, 10, cx, cy - 65, 110);
  sheenGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.40)');
  sheenGrad.addColorStop(0.4, 'rgba(255, 240, 235, 0.18)');
  sheenGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.arc(cx, cy - 65, 110, 0, Math.PI * 2);
  ctx.fill();

  // Helper: Draws luscious anime areola and perky central nipple
  const drawAnimeAreola = (radius: number, alphaMultiplier = 1.0): void => {
    // Soft petal-pink areola halo
    const areolaGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius);
    areolaGrad.addColorStop(0.00, `rgba(235, 45, 95, ${0.95 * alphaMultiplier})`);
    areolaGrad.addColorStop(0.35, `rgba(245, 75, 120, ${0.85 * alphaMultiplier})`);
    areolaGrad.addColorStop(0.68, `rgba(255, 130, 165, ${0.55 * alphaMultiplier})`);
    areolaGrad.addColorStop(0.90, `rgba(255, 185, 205, ${0.22 * alphaMultiplier})`);
    areolaGrad.addColorStop(1.00, 'rgba(255, 225, 235, 0)');
    ctx.fillStyle = areolaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Dainty central perky nipple
    ctx.fillStyle = `rgba(215, 25, 75, ${0.95 * alphaMultiplier})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Moist pearl specular highlight reflection dot
    ctx.fillStyle = `rgba(255, 255, 255, ${0.88 * alphaMultiplier})`;
    ctx.beginPath();
    ctx.arc(cx - 2.5, cy - 2.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
  };

  // Helper: Demi-cup upper boundary curve cradling underbust
  const traceDemiCupPath = (dipY: number): void => {
    // Curve sweeps from outer sideboob, cups deeply underneath apex, then lifts into inner cleavage
    const outerX = outerSideboobX > innerCleavageX ? 512 : 0;
    const innerX = outerSideboobX > innerCleavageX ? 0 : 512;
    ctx.moveTo(outerX, dipY - 65);
    ctx.quadraticCurveTo(outerSideboobX, dipY - 15, cx, dipY);
    ctx.quadraticCurveTo(innerCleavageX, dipY + 15, innerX, dipY - 35);
  };

  // 5. Tier-Specific 18+ Details
  if (tier === 1) {
    // TIER 1: Pristine Sweetheart Push-up Demi-Cup Cuirass
    // Form-fitting Valkyrie cuirass cups the lower bust up to Y = 210, exposing seductive upper decolletage & cleavage valley
    ctx.save();
    ctx.beginPath();
    traceDemiCupPath(210);
    ctx.lineTo(512, 512);
    ctx.lineTo(0, 512);
    ctx.closePath();
    ctx.clip();

    // Brushed Silver & Crimson Cyber Cuirass Armor
    const cuirassGrad = ctx.createLinearGradient(0, 180, 0, 512);
    cuirassGrad.addColorStop(0.00, '#4a5674');
    cuirassGrad.addColorStop(0.18, '#a8b6d8');
    cuirassGrad.addColorStop(0.35, '#f4f8ff'); // Radiant metallic shine
    cuirassGrad.addColorStop(0.60, '#981832'); // Vivid crimson inlay
    cuirassGrad.addColorStop(0.85, '#5c0e1e');
    cuirassGrad.addColorStop(1.00, '#26040c');
    ctx.fillStyle = cuirassGrad;
    ctx.fillRect(0, 170, 512, 342);
    ctx.restore();

    // Radiant Golden Scalloped Demi-Cup Rim Framing the bust
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.beginPath();
    traceDemiCupPath(210);
    ctx.stroke();

    // Glowing Cyan Energy Line along the underwire
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    traceDemiCupPath(218);
    ctx.stroke();

  } else if (tier === 2) {
    // TIER 2: Torn & Battle-Damaged Demi-Cup Cuirass
    // Draw full areola with perspiration as armor cracks and slips down
    drawAnimeAreola(40, 0.95);

    // Cracked, lowered torn armor plate dipping deeply to Y = 280 (revealing areola and bust)
    ctx.save();
    ctx.beginPath();
    traceDemiCupPath(280);
    ctx.lineTo(512, 512);
    ctx.lineTo(0, 512);
    ctx.closePath();
    ctx.clip();

    const tornGrad = ctx.createLinearGradient(0, 260, 0, 512);
    tornGrad.addColorStop(0.00, 'rgba(74, 86, 116, 0.85)');
    tornGrad.addColorStop(0.35, 'rgba(152, 24, 50, 0.88)');
    tornGrad.addColorStop(1.00, 'rgba(38, 4, 12, 0.95)');
    ctx.fillStyle = tornGrad;
    ctx.fillRect(0, 260, 512, 252);
    ctx.restore();

    // Jagged crimson tear rim
    ctx.strokeStyle = '#d41836';
    ctx.lineWidth = 4;
    ctx.beginPath();
    traceDemiCupPath(280);
    ctx.stroke();

    // Glistening beads of battle sweat dripping down the cleavage
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    const sweatBeads = [
      { x: cx + innerSign * 35, y: cy + 45, r: 3.5 },
      { x: cx + innerSign * 50, y: cy - 25, r: 3.0 },
      { x: cx - innerSign * 40, y: cy + 30, r: 3.2 }
    ];
    sweatBeads.forEach((sb) => {
      ctx.beginPath();
      ctx.arc(sb.x, sb.y, sb.r, 0, Math.PI * 2);
      ctx.fill();
    });

  } else {
    // TIER 3: Climax Extreme (Rách Toạc Cực Hạn)
    // 100% BARE VOLUPTUOUS BUST IN SEDUCTIVE CYBER MICRO-HARNESS LINGERIE!
    
    // Intensely aroused, flushed rosy petal-pink areola (radius = 48px)
    drawAnimeAreola(48, 1.0);

    // Erotic breast flush across the entire mound
    const flushGrad = ctx.createRadialGradient(cx, cy, 25, cx, cy, 180);
    flushGrad.addColorStop(0.00, 'rgba(255, 90, 135, 0.40)');
    flushGrad.addColorStop(0.50, 'rgba(255, 130, 165, 0.20)');
    flushGrad.addColorStop(1.00, 'rgba(255, 210, 220, 0)');
    ctx.fillStyle = flushGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fill();

    // Seductive Midnight-Black Micro-Harness Underbust Sling (Y = 320)
    // Cradles the heavy lower breast curve WITHOUT touching the areola/nipple!
    ctx.strokeStyle = '#160814';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(outerSideboobX > innerCleavageX ? 512 : 0, 310);
    ctx.quadraticCurveTo(cx, 335, outerSideboobX > innerCleavageX ? 0 : 512, 305);
    ctx.stroke();

    // Radiant Gold Stitching along harness sling
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(outerSideboobX > innerCleavageX ? 512 : 0, 310);
    ctx.quadraticCurveTo(cx, 335, outerSideboobX > innerCleavageX ? 0 : 512, 305);
    ctx.stroke();

    // Golden O-ring Underbust Clasp directly below apex
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, 335, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx, 335, 4, 0, Math.PI * 2);
    ctx.fill();

    // Sensual Perspiration Trails trickling down the cleavage
    ctx.strokeStyle = 'rgba(230, 248, 255, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(innerCleavageX, cy - 80);
    ctx.quadraticCurveTo(innerCleavageX + innerSign * 15, cy, innerCleavageX, cy + 90);
    ctx.stroke();

    // Glistening beads of sweat reflecting battle light
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    const sweatTrails = [
      { x: innerCleavageX, y: cy - 40, r: 3.5 },
      { x: innerCleavageX + innerSign * 10, y: cy + 15, r: 4.0 },
      { x: innerCleavageX - innerSign * 8, y: cy + 70, r: 3.2 },
      { x: cx - innerSign * 55, y: cy - 25, r: 3.2 },
      { x: cx - innerSign * 65, y: cy + 45, r: 3.6 }
    ];
    sweatTrails.forEach((st) => {
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
