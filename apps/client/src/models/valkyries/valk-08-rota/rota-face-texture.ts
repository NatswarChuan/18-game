import * as THREE from 'three';

/**
 * Generates an anime-style face texture for VALK-08: Rota (Midline Skirmisher / Blade Dancer).
 * Tạo texture khuôn mặt phong cách anime cho Rota:
 * - Đôi mắt xanh lam sapphire trong trẻo sắc sảo (Sapphire Blue anime eyes).
 * - Biểu cảm kiêu hãnh của vũ công kiếm thuật bậc thầy (Proud blade dancer gaze).
 * - Đôi má ửng hồng thanh tú (Subtle dancer blush).
 * - Nụ cười nửa miệng quyến rũ, tự tin (Seductive half-smirk).
 * - Dấu ấn hoa văn kiếm vũ trang trí thái dương (Cyber-Dancer temple mark).
 *
 * @returns THREE.CanvasTexture configured for PBR material mapping.
 */
export function createRotaFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 16;
    fallbackCanvas.height = 16;
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // 1. Làn da trắng hồng thanh thoát của vũ công (Fair dancer skin tone)
  const skinGrad = ctx.createRadialGradient(256, 240, 50, 256, 256, 250);
  skinGrad.addColorStop(0, '#fff5f0');
  skinGrad.addColorStop(0.7, '#fdebe4');
  skinGrad.addColorStop(1, '#fadcd2');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Hoa văn kiếm vũ cánh én màu xanh cobalt bên thái dương phải (Swallow blade mark)
  ctx.fillStyle = '#1a56cc';
  ctx.beginPath();
  ctx.moveTo(395, 210);
  ctx.quadraticCurveTo(420, 200, 440, 185);
  ctx.quadraticCurveTo(425, 215, 400, 225);
  ctx.fill();

  ctx.fillStyle = '#4facfe';
  ctx.beginPath();
  ctx.moveTo(402, 228);
  ctx.quadraticCurveTo(422, 222, 435, 210);
  ctx.quadraticCurveTo(420, 232, 405, 238);
  ctx.fill();

  // 3. Đôi má ửng hồng dịu nhẹ của vũ công sau màn biểu diễn
  const drawBlush = (centerX: number, centerY: number): void => {
    const blushGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
    blushGrad.addColorStop(0, 'rgba(255, 120, 145, 0.38)');
    blushGrad.addColorStop(0.6, 'rgba(255, 160, 180, 0.18)');
    blushGrad.addColorStop(1, 'rgba(253, 235, 228, 0)');
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fill();
  };
  drawBlush(155, 290);
  drawBlush(355, 290);

  // 4. Cặp mắt xanh lam sapphire sắc sảo, kiêu hãnh (Sapphire Blue Eyes)
  const drawDancerEye = (centerX: number, centerY: number, isLeft: boolean): void => {
    ctx.save();

    // Hốc mắt / Lòng trắng
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 36, 46, isLeft ? 0.05 : -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Bóng đổ mí mắt trên
    ctx.fillStyle = 'rgba(120, 160, 220, 0.22)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 18, 34, 20, 0, 0, Math.PI);
    ctx.fill();

    // Tròng mắt xanh lam sapphire Gradient 3 tầng (Cyan sáng -> Cobalt -> Sapphire sâu)
    const irisGrad = ctx.createRadialGradient(
      centerX,
      centerY + 10,
      4,
      centerX,
      centerY,
      32
    );
    irisGrad.addColorStop(0, '#a0f0ff'); // Cyan sáng lấp lánh
    irisGrad.addColorStop(0.4, '#0099ff'); // Xanh da trời rực rỡ
    irisGrad.addColorStop(0.8, '#0b3c99'); // Xanh cobalt đậm
    irisGrad.addColorStop(1, '#031744'); // Viền sâu thẳm
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 2, 28, 38, isLeft ? 0.05 : -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Đồng tử sắc bén
    ctx.fillStyle = '#020b24';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 2, 10, 18, isLeft ? 0.05 : -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Điểm sáng bắt sáng hình thoi cánh kiếm (Diamond Catchlight)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX - 8, centerY - 10, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX + 8, centerY + 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Viền mí mắt trên vuốt dài sắc sảo (Eyeliner wing)
    ctx.strokeStyle = '#101d36';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 2, 38, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Đuôi mắt vuốt mèo kiêu hãnh (Cat-eye wing)
    ctx.lineWidth = 3.5;
    const wingX = isLeft ? centerX - 34 : centerX + 34;
    ctx.beginPath();
    ctx.moveTo(wingX, centerY - 12);
    ctx.lineTo(wingX + (isLeft ? -15 : 15), centerY - 22);
    ctx.stroke();

    // Mí mắt dưới
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(30, 60, 120, 0.65)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 12, 32, Math.PI * 0.22, Math.PI * 0.78);
    ctx.stroke();

    ctx.restore();
  };

  drawDancerEye(165, 255, true);
  drawDancerEye(345, 255, false);

  // 5. Lông mày mảnh mai, thanh tú vuốt cong kiêu hãnh (Arched elegant eyebrows)
  ctx.strokeStyle = '#1d488f';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';

  // Lông mày trái
  ctx.beginPath();
  ctx.moveTo(130, 195);
  ctx.quadraticCurveTo(168, 178, 208, 190);
  ctx.stroke();

  // Lông mày phải (nhướn nhẹ tự tin)
  ctx.beginPath();
  ctx.moveTo(382, 190);
  ctx.quadraticCurveTo(344, 174, 304, 188);
  ctx.stroke();

  // 6. Sống mũi nhỏ thon gọn (Slender anime nose)
  ctx.fillStyle = 'rgba(210, 135, 125, 0.65)';
  ctx.beginPath();
  ctx.ellipse(256, 305, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 7. Nụ cười nửa miệng tự tin, quyến rũ (Seductive confident smirk)
  ctx.strokeStyle = '#c44265';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(238, 360);
  ctx.quadraticCurveTo(256, 368, 278, 354);
  ctx.stroke();

  // Điểm bóng môi hồng đào căng mọng (Glossy peach lips)
  ctx.fillStyle = 'rgba(255, 120, 150, 0.75)';
  ctx.beginPath();
  ctx.ellipse(256, 366, 8, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(254, 365, 1.8, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
