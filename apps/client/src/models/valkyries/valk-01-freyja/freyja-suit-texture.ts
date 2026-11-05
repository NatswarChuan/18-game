import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';

/**
 * Creates ultra-detailed 1024x1024 procedural anime cyber-valkyrie plugsuit texture for Freyja.
 * Sinh texture trang phục chiến đấu 1024x1024 phong cách Cyber-Valkyrie 18+ đỉnh cao:
 * - Xương quai xanh (Collarbones) thanh mảnh, gợi cảm
 * - Vùng khoét ngực sâu quyến rũ (Plunging Cleavage Window) đón đầu rãnh ngực đẫm đà
 * - Vòng eo con kiến & rốn hạt tiêu gợi cảm (Sensual Bare Midriff Cutout & 11-line Abs)
 * - Mảng ren lưới vi tính xuyên thấu (Translucent Cyber-Mesh Side Panels)
 * - Đường xẻ đùi cao chót vót kiểu Pháp (High-Cut French Leotard / V-Cut Pelvis) phô trọn hông quả đào và đùi trắng nõn
 * - Cấp độ rách giáp Tier 2 (Torn) & Tier 3 (Climax Extreme) xé toạc vải lộ trọn vẹn đường cong đẫm mồ hôi.
 */
export function createFreyjaSuitTexture(tier: ClothDamageTier = 1): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const frontX = 512;

  // Helper to paint porcelain anime skin with peach blush
  const drawPorcelainSkin = (
    drawFn: () => void,
    blushCenterX: number,
    blushCenterY: number,
    blushR: number,
    blushAlpha = 0.40
  ): void => {
    ctx.save();
    ctx.beginPath();
    drawFn();
    ctx.clip();

    // Silky porcelain skin base gradient
    const skinGrad = ctx.createLinearGradient(0, blushCenterY - blushR, 0, blushCenterY + blushR);
    skinGrad.addColorStop(0.0, '#fff4ed');
    skinGrad.addColorStop(0.4, '#ffe6dc');
    skinGrad.addColorStop(0.8, '#ffd8ca');
    skinGrad.addColorStop(1.0, '#f8c8b6');
    ctx.fillStyle = skinGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Warm rosy peach flush
    const blush = ctx.createRadialGradient(
      blushCenterX, blushCenterY, 8,
      blushCenterX, blushCenterY, blushR
    );
    blush.addColorStop(0.0, `rgba(255, 90, 135, ${blushAlpha})`);
    blush.addColorStop(0.5, `rgba(255, 140, 175, ${blushAlpha * 0.6})`);
    blush.addColorStop(1.0, 'rgba(255, 220, 210, 0)');
    ctx.fillStyle = blush;
    ctx.beginPath();
    ctx.arc(blushCenterX, blushCenterY, blushR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // 1. Base Layer: Midnight Obsidian Latex Bodysuit (#141928)
  ctx.fillStyle = '#141928';
  ctx.fillRect(0, 0, 1024, 1024);

  // Anisotropic Sheen Gradient for realistic 3D latex highlights
  const depthGrad = ctx.createLinearGradient(0, 0, 1024, 0);
  depthGrad.addColorStop(0.00, 'rgba(8, 10, 18, 0.85)');
  depthGrad.addColorStop(0.20, 'rgba(40, 52, 85, 0.40)');
  depthGrad.addColorStop(0.50, 'rgba(8, 10, 18, 0.80)');
  depthGrad.addColorStop(0.80, 'rgba(40, 52, 85, 0.40)');
  depthGrad.addColorStop(1.00, 'rgba(8, 10, 18, 0.85)');
  ctx.fillStyle = depthGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. High-Cut French Pelvis & Exposed Hip Curves (Y: 680 - 1024)
  // Replaces bulky skirt with sensual high-cut leotard exposing bare hip flanks & upper thighs
  drawPorcelainSkin(
    () => {
      // Left outer hip & upper thigh
      ctx.moveTo(frontX - 220, 680);
      ctx.lineTo(frontX - 95, 730);
      ctx.quadraticCurveTo(frontX - 55, 840, frontX - 45, 1024);
      ctx.lineTo(0, 1024);
      ctx.lineTo(0, 680);
      ctx.closePath();
    },
    frontX - 140, 840, 150,
    0.35
  );

  drawPorcelainSkin(
    () => {
      // Right outer hip & upper thigh
      ctx.moveTo(frontX + 220, 680);
      ctx.lineTo(frontX + 95, 730);
      ctx.quadraticCurveTo(frontX + 55, 840, frontX + 45, 1024);
      ctx.lineTo(1024, 1024);
      ctx.lineTo(1024, 680);
      ctx.closePath();
    },
    frontX + 140, 840, 150,
    0.35
  );

  // High-cut leotard leg opening trim: Golden piping & Cyan LED conduit
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 7;
  ctx.beginPath();
  // Left high-cut arch
  ctx.moveTo(frontX - 100, 720);
  ctx.quadraticCurveTo(frontX - 58, 840, frontX - 45, 1024);
  ctx.stroke();

  // Right high-cut arch
  ctx.beginPath();
  ctx.moveTo(frontX + 100, 720);
  ctx.quadraticCurveTo(frontX + 58, 840, frontX + 45, 1024);
  ctx.stroke();

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(frontX - 96, 724);
  ctx.quadraticCurveTo(frontX - 55, 840, frontX - 42, 1024);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(frontX + 96, 724);
  ctx.quadraticCurveTo(frontX + 55, 840, frontX + 42, 1024);
  ctx.stroke();

  // Seductive Cyber Garter Clips at High-Cut Apex
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(frontX - 112, 715, 24, 14);
  ctx.fillRect(frontX + 88, 715, 24, 14);
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(frontX - 106, 720, 12, 4);
  ctx.fillRect(frontX + 94, 720, 12, 4);

  // 3. Collarbone & Upper Decolletage Shading (Y: 60 - 150)
  // Delicate anime clavicles framing the throat
  ctx.strokeStyle = 'rgba(160, 45, 65, 0.28)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  // Left collarbone
  ctx.beginPath();
  ctx.moveTo(frontX - 18, 92);
  ctx.quadraticCurveTo(frontX - 70, 88, frontX - 145, 96);
  ctx.stroke();
  // Right collarbone
  ctx.beginPath();
  ctx.moveTo(frontX + 18, 92);
  ctx.quadraticCurveTo(frontX + 70, 88, frontX + 145, 96);
  ctx.stroke();

  // Collarbone light highlights
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(frontX - 22, 88);
  ctx.quadraticCurveTo(frontX - 70, 84, frontX - 140, 92);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(frontX + 22, 88);
  ctx.quadraticCurveTo(frontX + 70, 84, frontX + 140, 92);
  ctx.stroke();

  // 4. Plunging Sweetheart Cleavage Opening (Y: 150 - 340)
  drawPorcelainSkin(
    () => {
      ctx.moveTo(frontX, 150);
      ctx.bezierCurveTo(frontX - 75, 180, frontX - 65, 270, frontX - 35, 340);
      ctx.lineTo(frontX + 35, 340);
      ctx.bezierCurveTo(frontX + 65, 270, frontX + 75, 180, frontX, 150);
      ctx.closePath();
    },
    frontX, 245, 85,
    tier === 3 ? 0.70 : tier === 2 ? 0.55 : 0.40
  );

  // Cleavage valley depth contour shadow
  ctx.strokeStyle = 'rgba(140, 22, 50, 0.45)';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(frontX, 180);
  ctx.lineTo(frontX, 335);
  ctx.stroke();

  // Gold sweetheart rim framing cleavage
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(frontX, 150);
  ctx.bezierCurveTo(frontX - 75, 180, frontX - 65, 270, frontX - 35, 340);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(frontX, 150);
  ctx.bezierCurveTo(frontX + 75, 180, frontX + 65, 270, frontX + 35, 340);
  ctx.stroke();

  // 5. Sensual Bare Midriff Cutout & 11-Line Abs (Y: 410 - 640)
  drawPorcelainSkin(
    () => {
      ctx.moveTo(frontX, 410);
      ctx.bezierCurveTo(frontX - 95, 450, frontX - 90, 580, frontX, 640);
      ctx.bezierCurveTo(frontX + 90, 580, frontX + 95, 450, frontX, 410);
      ctx.closePath();
    },
    frontX, 525, 110,
    tier === 3 ? 0.75 : tier === 2 ? 0.60 : 0.45
  );

  // Toned 11-Line Anime Abs (Soft rectus abdominis contours)
  ctx.strokeStyle = 'rgba(160, 40, 65, 0.22)';
  ctx.lineWidth = 3.5;
  // Left 11-line
  ctx.beginPath();
  ctx.moveTo(frontX - 28, 440);
  ctx.quadraticCurveTo(frontX - 32, 510, frontX - 25, 570);
  ctx.stroke();
  // Right 11-line
  ctx.beginPath();
  ctx.moveTo(frontX + 28, 440);
  ctx.quadraticCurveTo(frontX + 32, 510, frontX + 25, 570);
  ctx.stroke();

  // Vertical Linea Alba
  ctx.strokeStyle = 'rgba(150, 35, 60, 0.26)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(frontX, 430);
  ctx.lineTo(frontX, 615);
  ctx.stroke();

  // Cute Detailed Blushing Navel (Rốn hạt tiêu)
  ctx.fillStyle = 'rgba(140, 20, 50, 0.70)';
  ctx.beginPath();
  ctx.ellipse(frontX, 580, 5.5, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Navel pearl highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.60)';
  ctx.beginPath();
  ctx.ellipse(frontX - 1.5, 577, 2, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Golden corset piping framing the midriff keyhole
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(frontX, 410);
  ctx.bezierCurveTo(frontX - 95, 450, frontX - 90, 580, frontX, 640);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(frontX, 410);
  ctx.bezierCurveTo(frontX + 95, 450, frontX + 90, 580, frontX, 640);
  ctx.stroke();

  // 6. Translucent Cyber-Mesh Side Panels on Hourglass Waist (Y: 380 - 660)
  const drawSheerMesh = (xStart: number, xEnd: number): void => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 180, 170, 0.28)'; // Warm skin glow
    ctx.fillRect(xStart, 380, xEnd - xStart, 280);

    ctx.strokeStyle = 'rgba(20, 26, 45, 0.65)';
    ctx.lineWidth = 1.2;
    for (let x = xStart; x <= xEnd; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 380);
      ctx.lineTo(x, 660);
      ctx.stroke();
    }
    for (let y = 380; y <= 660; y += 10) {
      ctx.beginPath();
      ctx.moveTo(xStart, y);
      ctx.lineTo(xEnd, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawSheerMesh(frontX - 180, frontX - 110);
  drawSheerMesh(frontX + 110, frontX + 180);

  // Outer hourglass corset boning
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(frontX - 110, 360);
  ctx.quadraticCurveTo(frontX - 75, 510, frontX - 110, 680);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(frontX + 110, 360);
  ctx.quadraticCurveTo(frontX + 75, 510, frontX + 110, 680);
  ctx.stroke();

  // 7. Cloth Damage Tears for Tier 2 and Tier 3
  if (tier >= 2) {
    // Slashed battle tears exposing ribs and hips
    ctx.strokeStyle = '#d61a38';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(frontX - 100 + i * 50, 430 + i * 25);
      ctx.lineTo(frontX + 50 + i * 50, 510 + i * 25);
      ctx.stroke();
    }

    // Exposed torn skin opening across waist
    drawPorcelainSkin(
      () => {
        ctx.ellipse(frontX, 520, 120, 70, 0.20, 0, Math.PI * 2);
      },
      frontX, 520, 130,
      0.65
    );

    // Perspiration droplets glistening on the bare skin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    const sweatDrops = [
      { x: frontX - 45, y: 490, r: 4 },
      { x: frontX + 35, y: 515, r: 4.5 },
      { x: frontX - 15, y: 595, r: 4 },
      { x: frontX + 50, y: 570, r: 3.5 }
    ];
    sweatDrops.forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (tier === 3) {
    // Climax Extreme: Plugsuit shredded into micro-harness ribbons!
    drawPorcelainSkin(
      () => {
        ctx.ellipse(frontX, 540, 210, 200, 0, 0, Math.PI * 2);
      },
      frontX, 540, 230,
      0.80
    );

    // Deep flushed erotic blush across entire midriff and pelvis
    const climaxFlush = ctx.createRadialGradient(frontX, 550, 20, frontX, 550, 190);
    climaxFlush.addColorStop(0.0, 'rgba(255, 60, 110, 0.65)');
    climaxFlush.addColorStop(0.5, 'rgba(255, 110, 150, 0.40)');
    climaxFlush.addColorStop(1.0, 'rgba(255, 200, 190, 0)');
    ctx.fillStyle = climaxFlush;
    ctx.beginPath();
    ctx.arc(frontX, 550, 190, 0, Math.PI * 2);
    ctx.fill();

    // Redraw cute navel with erotic blush ring
    ctx.fillStyle = 'rgba(180, 20, 55, 0.75)';
    ctx.beginPath();
    ctx.ellipse(frontX, 580, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Plentiful glistening sweat trails down toned belly
    ctx.strokeStyle = 'rgba(230, 248, 255, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(frontX, 450);
    ctx.quadraticCurveTo(frontX + 12, 510, frontX - 4, 570);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(frontX - 25, 480);
    ctx.quadraticCurveTo(frontX - 30, 530, frontX - 22, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(frontX + 28, 490);
    ctx.quadraticCurveTo(frontX + 22, 545, frontX + 26, 610);
    ctx.stroke();

    // Seductive delicate golden hip chains framing waist flanks (leaving belly completely bare!)
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(frontX - 180, 520);
    ctx.quadraticCurveTo(frontX - 110, 570, frontX - 60, 680);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(frontX + 180, 520);
    ctx.quadraticCurveTo(frontX + 110, 570, frontX + 60, 680);
    ctx.stroke();

    // Glistening sweat beads across midriff
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    const climaxDrops = [
      { x: frontX - 35, y: 470, r: 3.5 },
      { x: frontX + 15, y: 505, r: 4.0 },
      { x: frontX - 10, y: 550, r: 3.8 },
      { x: frontX + 38, y: 580, r: 3.2 },
      { x: frontX, y: 620, r: 3.6 }
    ];
    climaxDrops.forEach((cd) => {
      ctx.beginPath();
      ctx.arc(cd.x, cd.y, cd.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
