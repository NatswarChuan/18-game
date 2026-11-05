import * as THREE from 'three';

/**
 * Generates an anime-style face texture for VALK-06: Mist (Holy Saint / Support).
 * Tạo texture khuôn mặt phong cách anime cho Mist:
 * - Đôi mắt xanh ngọc bích dịu dàng (Gentle Aquamarine/Emerald gradient eyes).
 * - Biểu cảm thánh thiện, e thẹn (Shy & Gentle Expression).
 * - Má ửng hồng dịu ngọt (Soft Peach Blush).
 * - Đôi môi hồng tự nhiên chúm chím (Delicate pink lips).
 * - Dải băng trán thánh nữ tu sĩ (Cyber-Nun headband motif).
 *
 * @returns THREE.CanvasTexture configured for PBR material mapping.
 */
export function createMistFaceTexture(): THREE.CanvasTexture {
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

  // 1. Làn da trắng hồng mịn màng thánh nữ (Fair porcelain skin tone)
  const skinGrad = ctx.createRadialGradient(256, 240, 50, 256, 256, 250);
  skinGrad.addColorStop(0, '#fff6f4');
  skinGrad.addColorStop(0.7, '#ffedea');
  skinGrad.addColorStop(1, '#fadcd7');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Dải băng thánh nữ tu sĩ trên trán (Nun Veil Forehead Band)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(80, 40, 352, 28);
  ctx.strokeStyle = '#e6c860';
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 40, 352, 28);

  // Biểu tượng thánh giá hoàng kim ở giữa trán
  ctx.fillStyle = '#f0d060';
  ctx.fillRect(253, 44, 6, 20);
  ctx.fillRect(247, 50, 18, 6);

  // 3. Đôi má ửng hồng e thẹn (Soft Peach/Blush)
  const drawBlush = (centerX: number, centerY: number): void => {
    const blushGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 46);
    blushGrad.addColorStop(0, 'rgba(255, 150, 165, 0.45)');
    blushGrad.addColorStop(0.55, 'rgba(255, 175, 190, 0.22)');
    blushGrad.addColorStop(1, 'rgba(255, 237, 234, 0)');
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 46, 0, Math.PI * 2);
    ctx.fill();

    // Vạch e thẹn anime (blush slash lines)
    ctx.strokeStyle = 'rgba(255, 105, 140, 0.40)';
    ctx.lineWidth = 2;
    for (let i = -14; i <= 14; i += 7) {
      ctx.beginPath();
      ctx.moveTo(centerX + i - 4, centerY - 6);
      ctx.lineTo(centerX + i + 4, centerY + 6);
      ctx.stroke();
    }
  };
  drawBlush(150, 290);
  drawBlush(362, 290);

  // 4. Cặp mắt anime xanh ngọc bích dịu dàng (Gentle Aquamarine Anime Eyes)
  const drawGentleEye = (centerX: number, centerY: number, isLeft: boolean): void => {
    ctx.save();

    // Hốc mắt / Lòng trắng mềm mại
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 38, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bóng đổ mi mắt trên
    ctx.fillStyle = 'rgba(160, 200, 200, 0.25)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 20, 36, 22, 0, 0, Math.PI);
    ctx.fill();

    // Tròng mắt xanh ngọc bích Gradient 3 tầng (Aquamarine -> Cyan -> Mint)
    const irisGrad = ctx.createRadialGradient(
      centerX,
      centerY + 10,
      4,
      centerX,
      centerY,
      36
    );
    irisGrad.addColorStop(0, '#b8fff4'); // Mint sáng
    irisGrad.addColorStop(0.45, '#38d5b8'); // Aquamarine
    irisGrad.addColorStop(0.85, '#127870'); // Ngọc bích đậm
    irisGrad.addColorStop(1, '#063e3a'); // Viền sâu
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 2, 30, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Đồng tử thánh thiện dịu dàng
    ctx.fillStyle = '#062c28';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 4, 11, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hào quang hoa văn thánh quang trong mắt (Saint star reflections)
    ctx.fillStyle = 'rgba(200, 255, 245, 0.65)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 18, 9, 0, Math.PI * 2);
    ctx.fill();

    // Điểm sáng bắt sáng lớn (Main Catchlight)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const catchlightOffset = isLeft ? -7 : -7;
    ctx.arc(centerX + catchlightOffset, centerY - 14, 9, 0, Math.PI * 2);
    ctx.fill();

    // Điểm sáng phụ nhỏ (Secondary Catchlight)
    ctx.beginPath();
    ctx.arc(centerX + (isLeft ? 10 : 10), centerY + 10, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Viền mí mắt trên cong dịu dàng (Gentle anime eyelid)
    ctx.strokeStyle = '#263d3a';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 4, 42, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Lông mi cong thánh thiện
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#2d4b47';
    const lashDir = isLeft ? -1 : 1;
    ctx.beginPath();
    ctx.moveTo(centerX + 32 * lashDir, centerY - 28);
    ctx.quadraticCurveTo(centerX + 42 * lashDir, centerY - 38, centerX + 48 * lashDir, centerY - 32);
    ctx.stroke();

    // Mí mắt dưới thanh mảnh
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(80, 120, 115, 0.65)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 10, 36, Math.PI * 0.22, Math.PI * 0.78);
    ctx.stroke();

    ctx.restore();
  };

  drawGentleEye(170, 255, true);
  drawGentleEye(342, 255, false);

  // 5. Lông mày thanh tú, rủ nhẹ hiền hậu (Gentle drooped saintly eyebrows)
  ctx.strokeStyle = '#367870';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';

  // Lông mày trái
  ctx.beginPath();
  ctx.moveTo(136, 188);
  ctx.quadraticCurveTo(174, 180, 212, 192);
  ctx.stroke();

  // Lông mày phải
  ctx.beginPath();
  ctx.moveTo(376, 188);
  ctx.quadraticCurveTo(338, 180, 300, 192);
  ctx.stroke();

  // 6. Sống mũi nhỏ thanh thoát (Delicate button nose)
  ctx.fillStyle = 'rgba(215, 140, 135, 0.65)';
  ctx.beginPath();
  ctx.ellipse(256, 305, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 7. Khuôn miệng nhỏ chúm chím dịu dàng (Gentle sweet smile)
  ctx.strokeStyle = '#cf5a75';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(242, 355);
  ctx.quadraticCurveTo(256, 363, 270, 355);
  ctx.stroke();

  // Điểm bóng môi căng mọng (Glossy lips)
  ctx.fillStyle = 'rgba(255, 160, 185, 0.85)';
  ctx.beginPath();
  ctx.ellipse(256, 364, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.arc(254, 363, 2, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
