import * as THREE from 'three';

/**
 * Procedurally generates a high-resolution anime face texture for Alvitr (VALK-05).
 * Sinh texture khuôn mặt phong cách anime nữ pháp sư thiên lôi ma mị:
 * Mắt hổ phách ánh điện (Electric Amber Gold) sắc sảo quyến rũ, cánh mi cat-eye kiêu kỳ,
 * nốt ruồi duyên dưới khóe mắt trái, đôi môi mọng màu mận tím (Plum Gloss) và má hồng mê hoặc.
 */
export function createAlvitrFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Transparent background
  ctx.clearRect(0, 0, 512, 512);

  // 2. Seductive Sorceress Blush (Sensual gradient on cheeks)
  const drawBlush = (centerX: number, centerY: number): void => {
    const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 56);
    gradient.addColorStop(0, 'rgba(236, 72, 153, 0.70)');
    gradient.addColorStop(0.55, 'rgba(219, 39, 119, 0.32)');
    gradient.addColorStop(1, 'rgba(255, 230, 240, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 56, 0, Math.PI * 2);
    ctx.fill();

    // Seductive blush stripes (///)
    ctx.strokeStyle = 'rgba(219, 39, 119, 0.80)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(centerX - 14, centerY - 6);
    ctx.lineTo(centerX - 9, centerY + 11);
    ctx.moveTo(centerX - 5, centerY - 8);
    ctx.lineTo(centerX, centerY + 9);
    ctx.moveTo(centerX + 4, centerY - 6);
    ctx.lineTo(centerX + 9, centerY + 11);
    ctx.stroke();
  };

  drawBlush(150, 272);
  drawBlush(362, 272);

  // 3. Electric Amber-Gold Sorceress Eyes
  const drawAnimeEye = (centerX: number, centerY: number, isRight: boolean): void => {
    ctx.save();
    ctx.translate(centerX, centerY);
    if (isRight) ctx.scale(-1, 1);

    // Eye Sclera (White)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 52, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sclera soft inner shadow (Lavender shadow)
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.32)';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    // Iris Gradient (Dark Mahogany Bronze -> Radiant Amber Gold -> Electric Topaz Sparkle)
    const irisGradient = ctx.createLinearGradient(0, -52, 0, 52);
    irisGradient.addColorStop(0, '#451A03');
    irisGradient.addColorStop(0.25, '#78350F');
    irisGradient.addColorStop(0.58, '#D97706');
    irisGradient.addColorStop(0.85, '#FBBF24');
    irisGradient.addColorStop(1, '#FEF3C7');

    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.ellipse(0, 2, 40, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep Pupil (High mystery gaze)
    ctx.fillStyle = '#1C0A00';
    ctx.beginPath();
    ctx.ellipse(0, -2, 16, 23, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lightning Arc Rune Highlight inside Iris
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.95)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 4, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Primary Diamond Highlight (Top-left)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-13, -15, 12, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Soft Highlight (Bottom-right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.ellipse(11, 17, 6, 9, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Upper Anime Eyelash (Seductive winged eyeliner)
    ctx.fillStyle = '#180B26';
    ctx.beginPath();
    ctx.moveTo(-58, -30);
    ctx.bezierCurveTo(-30, -66, 30, -66, 60, -28);
    ctx.lineTo(50, -34);
    ctx.bezierCurveTo(28, -54, -28, -54, -50, -28);
    ctx.closePath();
    ctx.fill();

    // Winged Lash Tip (Sharp seductive flick)
    ctx.beginPath();
    ctx.moveTo(58, -30);
    ctx.lineTo(76, -46);
    ctx.lineTo(60, -26);
    ctx.closePath();
    ctx.fill();

    // Eyebrow (Elegant arched brow matching violet hair)
    ctx.fillStyle = '#6B21A8';
    ctx.beginPath();
    ctx.moveTo(-48, -82);
    ctx.bezierCurveTo(-16, -94, 26, -92, 52, -76);
    ctx.lineTo(46, -72);
    ctx.bezierCurveTo(22, -86, -16, -88, -43, -76);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // Left Eye
  drawAnimeEye(168, 220, false);

  // Right Eye
  drawAnimeEye(344, 220, true);

  // 4. Seductive Beauty Mark Mole (Under Left Eye)
  ctx.fillStyle = '#2E1065';
  ctx.beginPath();
  ctx.arc(135, 280, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // 5. Dainty Anime Nose
  ctx.fillStyle = 'rgba(180, 83, 9, 0.70)';
  ctx.beginPath();
  ctx.ellipse(256, 292, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6. Sultry Glossy Plum Lips
  ctx.fillStyle = '#BE185D'; // Rich Plum Magenta
  ctx.beginPath();
  ctx.moveTo(236, 342);
  ctx.bezierCurveTo(248, 335, 264, 335, 276, 342);
  ctx.bezierCurveTo(264, 355, 248, 355, 236, 342);
  ctx.fill();

  // Lip Gloss Sparkle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.ellipse(254, 340, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
