import * as THREE from 'three';

/**
 * Procedurally generates a high-resolution anime face texture for Kara (VALK-04).
 * Sinh texture khuôn mặt phong cách anime nữ pháo thủ tsundere:
 * Mắt ngọc lục bảo (Emerald Green) sắc sảo, má ửng hồng giận dỗi đáng yêu,
 * làn môi san hô căng bóng, và kính ngắm CyberHUD ngắm bắn một bên mắt phải.
 */
export function createKaraFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Transparent background
  ctx.clearRect(0, 0, 512, 512);

  // 2. Tsundere Blush on cheeks (Intense cute flushed cheeks)
  const drawBlush = (centerX: number, centerY: number): void => {
    const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 55);
    gradient.addColorStop(0, 'rgba(255, 95, 140, 0.75)');
    gradient.addColorStop(0.55, 'rgba(255, 130, 170, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 230, 240, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fill();

    // Cute blush stripes (///)
    ctx.strokeStyle = 'rgba(240, 60, 110, 0.85)';
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

  drawBlush(152, 270);
  drawBlush(360, 270);

  // 3. Striking Emerald Green Anime Eyes
  const drawAnimeEye = (centerX: number, centerY: number, isRight: boolean): void => {
    ctx.save();
    ctx.translate(centerX, centerY);
    if (isRight) ctx.scale(-1, 1);

    // Eye Sclera (White)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 54, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sclera soft inner shadow
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    // Iris Gradient (Deep Forest Spruce -> Vibrant Emerald -> Bright Mint Radiance)
    const irisGradient = ctx.createLinearGradient(0, -54, 0, 54);
    irisGradient.addColorStop(0, '#064E3B');
    irisGradient.addColorStop(0.25, '#047857');
    irisGradient.addColorStop(0.60, '#10B981');
    irisGradient.addColorStop(0.85, '#6EE7B7');
    irisGradient.addColorStop(1, '#ECFDF5');

    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.ellipse(0, 2, 42, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep Pupil (High concentration sniper focus)
    ctx.fillStyle = '#022C22';
    ctx.beginPath();
    ctx.ellipse(0, -2, 17, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Concentric Targeting Rune inside iris
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.95)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 4, 18, 0, Math.PI * 2);
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

    // Upper Anime Eyelash (Sharp confident artillery tsundere wing)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(-60, -32);
    ctx.bezierCurveTo(-32, -68, 32, -68, 62, -30);
    ctx.lineTo(52, -36);
    ctx.bezierCurveTo(28, -56, -28, -56, -52, -30);
    ctx.closePath();
    ctx.fill();

    // Cat-Eye Eyelash Wing Tip
    ctx.beginPath();
    ctx.moveTo(60, -32);
    ctx.lineTo(78, -48);
    ctx.lineTo(62, -28);
    ctx.closePath();
    ctx.fill();

    // Eyebrow (Slightly furrowed tsundere arch)
    ctx.fillStyle = '#B45309'; // Golden Amber Eyebrows
    ctx.beginPath();
    ctx.moveTo(-50, -84);
    ctx.bezierCurveTo(-18, -96, 28, -94, 54, -78);
    ctx.lineTo(48, -74);
    ctx.bezierCurveTo(24, -88, -18, -90, -45, -78);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // Left Eye
  drawAnimeEye(168, 218, false);

  // Right Eye (Partially covered by glowing Holographic HUD)
  drawAnimeEye(344, 218, true);

  // 4. CyberHUD Holographic Targeting Monocle (Over Right Eye)
  ctx.save();
  ctx.translate(344, 218);

  // Outer HUD Ring
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.arc(0, 0, 64, -0.6 * Math.PI, 0.7 * Math.PI);
  ctx.stroke();

  // Targeting Crosshairs
  ctx.strokeStyle = '#39FF14'; // Cyber Neon Green
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-36, 0);
  ctx.lineTo(-14, 0);
  ctx.moveTo(14, 0);
  ctx.lineTo(36, 0);
  ctx.moveTo(0, -36);
  ctx.lineTo(0, -14);
  ctx.moveTo(0, 14);
  ctx.lineTo(0, 36);
  ctx.stroke();

  // Lock-on brackets
  ctx.strokeStyle = '#FF0055';
  ctx.lineWidth = 2.6;
  ctx.strokeRect(-18, -18, 36, 36);

  // HUD digital range readout text
  ctx.fillStyle = '#00F0FF';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('LCK: 99%', 24, -30);
  ctx.fillText('RNG: 850m', 24, 40);

  ctx.restore();

  // 5. Dainty Anime Nose
  ctx.fillStyle = 'rgba(217, 119, 6, 0.75)';
  ctx.beginPath();
  ctx.ellipse(256, 290, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6. Cute Pouting Tsundere Lips
  ctx.fillStyle = '#F43F5E';
  ctx.beginPath();
  ctx.moveTo(238, 338);
  ctx.bezierCurveTo(248, 332, 264, 332, 274, 338);
  ctx.bezierCurveTo(264, 350, 248, 350, 238, 338);
  ctx.fill();

  // Lip Gloss Sparkle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.ellipse(254, 336, 4.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
