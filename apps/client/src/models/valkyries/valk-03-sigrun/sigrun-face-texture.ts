import * as THREE from 'three';

/**
 * Procedurally generates a high-resolution anime face texture for Sigrun (VALK-03).
 * Sinh texture khuôn mặt phong cách anime nữ sát thủ bóng đêm: mắt tím thạch anh kiêu kỳ, kẻ mắt cat-eye sắc lẹm, má hồng e thẹn.
 */
export function createSigrunFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Transparent background
  ctx.clearRect(0, 0, 512, 512);

  // 2. Sensual Blush (Cheeks)
  const drawBlush = (centerX: number, centerY: number): void => {
    const gradient = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 50);
    gradient.addColorStop(0, 'rgba(255, 110, 160, 0.65)');
    gradient.addColorStop(0.6, 'rgba(255, 130, 180, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 230, 240, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.fill();

    // Cute blush stripes (///)
    ctx.strokeStyle = 'rgba(235, 70, 130, 0.75)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(centerX - 13, centerY - 5);
    ctx.lineTo(centerX - 8, centerY + 10);
    ctx.moveTo(centerX - 5, centerY - 7);
    ctx.lineTo(centerX, centerY + 8);
    ctx.moveTo(centerX + 3, centerY - 5);
    ctx.lineTo(centerX + 8, centerY + 10);
    ctx.stroke();
  };

  drawBlush(154, 285);
  drawBlush(358, 285);

  // 3. Mysterious Amethyst Violet Anime Eyes
  const drawAnimeEye = (centerX: number, centerY: number, isRight: boolean): void => {
    ctx.save();
    ctx.translate(centerX, centerY);
    if (isRight) ctx.scale(-1, 1);

    // Eye Sclera (White)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 52, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sclera soft inner shadow
    ctx.strokeStyle = 'rgba(147, 112, 219, 0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Iris Gradient (Dark Obsidian Plum -> Deep Amethyst -> Radiant Lavender Glow)
    const irisGradient = ctx.createLinearGradient(0, -52, 0, 52);
    irisGradient.addColorStop(0, '#1E0528');
    irisGradient.addColorStop(0.28, '#4A0E66');
    irisGradient.addColorStop(0.60, '#8A2BE2');
    irisGradient.addColorStop(0.85, '#C084FC');
    irisGradient.addColorStop(1, '#F3E8FF');

    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.ellipse(0, 2, 40, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep Slit Pupil (Lethal assassin cat gaze)
    ctx.fillStyle = '#0B0110';
    ctx.beginPath();
    ctx.ellipse(0, -2, 16, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Rune Ring Highlight
    ctx.strokeStyle = 'rgba(216, 180, 254, 0.95)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 5, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Primary Diamond Highlight (Top-left)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-14, -16, 13, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Soft Highlight (Bottom-right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.ellipse(12, 18, 6, 10, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Upper Anime Eyelash (Sharp Cat-Eye Wing)
    ctx.fillStyle = '#0F0B14';
    ctx.beginPath();
    ctx.moveTo(-58, -32);
    ctx.bezierCurveTo(-32, -66, 32, -66, 60, -30);
    ctx.lineTo(50, -36);
    ctx.bezierCurveTo(28, -54, -28, -54, -50, -30);
    ctx.closePath();
    ctx.fill();

    // Cat-Eye Eyelash Wing Tip (Sharp assassin wing)
    ctx.beginPath();
    ctx.moveTo(58, -32);
    ctx.lineTo(76, -48);
    ctx.lineTo(60, -28);
    ctx.closePath();
    ctx.fill();

    // Eyebrow (Sharp confident arch)
    ctx.fillStyle = '#581C87';
    ctx.beginPath();
    ctx.moveTo(-50, -82);
    ctx.bezierCurveTo(-18, -96, 28, -94, 54, -76);
    ctx.lineTo(48, -72);
    ctx.bezierCurveTo(24, -86, -18, -88, -45, -76);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  drawAnimeEye(168, 232, false);
  drawAnimeEye(344, 232, true);

  // 4. Dainty Anime Nose
  ctx.fillStyle = 'rgba(175, 85, 120, 0.7)';
  ctx.beginPath();
  ctx.ellipse(256, 304, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Sultry Glossy Lips
  ctx.fillStyle = '#E83E70';
  ctx.beginPath();
  ctx.moveTo(236, 354);
  ctx.bezierCurveTo(248, 348, 264, 348, 276, 354);
  ctx.bezierCurveTo(264, 366, 248, 366, 236, 354);
  ctx.fill();

  // Lip Gloss Sparkle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.ellipse(254, 353, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
