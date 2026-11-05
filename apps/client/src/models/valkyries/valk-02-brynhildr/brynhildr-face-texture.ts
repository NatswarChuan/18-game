import * as THREE from 'three';

/**
 * Procedurally generates a high-resolution, noble anime face texture for Brynhildr (VALK-02).
 * Sinh texture khuôn mặt phong cách anime nữ hiệp sĩ băng giá: mắt ngọc lam sâu thẳm, mi bạch kim, má hồng e thẹn.
 */
export function createBrynhildrFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Transparent background (Allows 3D skin sphere to seamlessly render underneath)
  ctx.clearRect(0, 0, 512, 512);

  // 2. Sensual Cool-Pink Cheek Blush
  const drawBlush = (centerX: number, centerY: number): void => {
    const gradient = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 52);
    gradient.addColorStop(0, 'rgba(255, 115, 150, 0.6)');
    gradient.addColorStop(0.55, 'rgba(255, 140, 175, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 235, 240, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 52, 0, Math.PI * 2);
    ctx.fill();

    // Cute blush marks (///)
    ctx.strokeStyle = 'rgba(240, 80, 120, 0.7)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(centerX - 14, centerY - 5);
    ctx.lineTo(centerX - 9, centerY + 10);
    ctx.moveTo(centerX - 5, centerY - 7);
    ctx.lineTo(centerX, centerY + 8);
    ctx.moveTo(centerX + 4, centerY - 5);
    ctx.lineTo(centerX + 9, centerY + 10);
    ctx.stroke();
  };

  drawBlush(158, 275);
  drawBlush(354, 275);

  // 3. Noble Ice-Sapphire Anime Eyes
  const drawAnimeEye = (centerX: number, centerY: number, isRight: boolean): void => {
    ctx.save();
    ctx.translate(centerX, centerY);
    if (isRight) ctx.scale(-1, 1);

    // Eye Sclera (White)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 46, 54, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris Gradient (Deep Navy Ice -> Sapphire Cyan -> Radiant Glacial Glow)
    const irisGradient = ctx.createLinearGradient(0, -46, 0, 46);
    irisGradient.addColorStop(0, '#001A33');
    irisGradient.addColorStop(0.3, '#004488');
    irisGradient.addColorStop(0.65, '#00A2E8');
    irisGradient.addColorStop(0.9, '#00F0FF');
    irisGradient.addColorStop(1, '#D8F8FF');

    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.ellipse(0, 2, 35, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep Pupil
    ctx.fillStyle = '#000D1A';
    ctx.beginPath();
    ctx.ellipse(0, -2, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glacial Ring Highlight
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(0, 4, 17, 0, Math.PI * 2);
    ctx.stroke();

    // Diamond Specular Sparkle Highlight (Top-left)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-13, -15, 11, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Soft Highlight (Bottom-right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.ellipse(11, 17, 5, 8, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Upper Anime Eyelashes (Noble Platinum Silver / Dark Charcoal Outline)
    ctx.fillStyle = '#101624';
    ctx.beginPath();
    ctx.moveTo(-50, -30);
    ctx.bezierCurveTo(-28, -58, 28, -58, 52, -28);
    ctx.lineTo(42, -34);
    ctx.bezierCurveTo(22, -50, -22, -50, -42, -28);
    ctx.closePath();
    ctx.fill();

    // Paladin Wing Tip Eyelash
    ctx.beginPath();
    ctx.moveTo(50, -30);
    ctx.lineTo(64, -42);
    ctx.lineTo(52, -26);
    ctx.closePath();
    ctx.fill();

    // Eyebrow (Noble refined silver-blue arch)
    ctx.fillStyle = '#6888A8';
    ctx.beginPath();
    ctx.moveTo(-44, -76);
    ctx.bezierCurveTo(-14, -88, 24, -86, 46, -72);
    ctx.lineTo(40, -68);
    ctx.bezierCurveTo(18, -80, -14, -81, -39, -70);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  drawAnimeEye(172, 212, false);
  drawAnimeEye(340, 212, true);

  // 4. Dainty Anime Nose
  ctx.fillStyle = 'rgba(180, 100, 125, 0.65)';
  ctx.beginPath();
  ctx.ellipse(256, 290, 2.5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Sweet Glossy Lips
  ctx.fillStyle = '#FF5C88';
  ctx.beginPath();
  ctx.moveTo(238, 344);
  ctx.bezierCurveTo(248, 340, 264, 340, 274, 344);
  ctx.bezierCurveTo(264, 354, 248, 354, 238, 344);
  ctx.fill();

  // Lip Gloss Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.ellipse(254, 343, 4, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
