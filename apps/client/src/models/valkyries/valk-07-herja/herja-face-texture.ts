import * as THREE from 'three';

/**
 * Generates an anime-style face texture for VALK-07: Herja (Frontline Berserker).
 * Tạo texture khuôn mặt phong cách anime chiến binh hoang dã cho Herja:
 * - Đôi mắt hổ phách rực lửa cuồng chiến (Fiery Amber-Gold Berserker Eyes).
 * - Nụ cười ngạo nghễ, tự tin thách thức (Fierce warrior smirk/grin).
 * - Vết sẹo chiến binh nhỏ sắc sảo trên má phải (Warrior cheek scar).
 * - Má ửng hồng hưng phấn say máu (Bloodlust warrior blush).
 * - Hình xăm chiến binh phương Bắc (Norse cyber-warrior warpaint).
 *
 * @returns THREE.CanvasTexture configured for PBR material mapping.
 */
export function createHerjaFaceTexture(): THREE.CanvasTexture {
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

  // 1. Làn da bánh mật sáng khỏe khoắn (Sun-kissed warrior skin tone)
  const skinGrad = ctx.createRadialGradient(256, 240, 50, 256, 256, 250);
  skinGrad.addColorStop(0, '#fde3d4');
  skinGrad.addColorStop(0.7, '#f7d3be');
  skinGrad.addColorStop(1, '#e8be9e');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Sơn chiến binh phương Bắc trên trán và thái dương (Norse Cyber Warpaint)
  ctx.fillStyle = '#ff6b35';
  ctx.beginPath();
  // Vệt sơn chéo bên mắt trái
  ctx.moveTo(90, 180);
  ctx.lineTo(130, 240);
  ctx.lineTo(105, 255);
  ctx.lineTo(75, 195);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(115, 170);
  ctx.lineTo(145, 220);
  ctx.lineTo(135, 230);
  ctx.lineTo(105, 180);
  ctx.fill();

  // 3. Vết sẹo chiến binh trên má phải (Warrior Battle Scar)
  ctx.strokeStyle = '#c95d52';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(330, 280);
  ctx.lineTo(380, 320);
  ctx.stroke();

  // Vết chỉ khâu vết sẹo nhỏ
  ctx.strokeStyle = '#e07a6f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(342, 285);
  ctx.lineTo(338, 298);
  ctx.moveTo(355, 296);
  ctx.lineTo(351, 309);
  ctx.moveTo(368, 307);
  ctx.lineTo(364, 320);
  ctx.stroke();

  // 4. Má ửng hồng hưng phấn chiến trận (Bloodlust Blush)
  const drawBlush = (centerX: number, centerY: number): void => {
    const blushGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 42);
    blushGrad.addColorStop(0, 'rgba(255, 90, 80, 0.45)');
    blushGrad.addColorStop(0.6, 'rgba(255, 120, 100, 0.20)');
    blushGrad.addColorStop(1, 'rgba(247, 211, 190, 0)');
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
    ctx.fill();
  };
  drawBlush(155, 295);
  drawBlush(355, 295);

  // 5. Cặp mắt hổ phách rực lửa cuồng chiến (Fiery Amber Berserker Eyes)
  const drawBerserkerEye = (centerX: number, centerY: number, isLeft: boolean): void => {
    ctx.save();

    // Hốc mắt / Lòng trắng
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 38, 48, isLeft ? 0.08 : -0.08, 0, Math.PI * 2);
    ctx.fill();

    // Tròng mắt hổ phách rực lửa Gradient (Vàng cam rực lửa -> Đỏ hổ phách -> Nâu đậm)
    const irisGrad = ctx.createRadialGradient(
      centerX,
      centerY + 8,
      4,
      centerX,
      centerY,
      34
    );
    irisGrad.addColorStop(0, '#fff176'); // Vàng sáng rực lửa
    irisGrad.addColorStop(0.35, '#ff9800'); // Cam hổ phách
    irisGrad.addColorStop(0.75, '#e65100'); // Đỏ cam sâu
    irisGrad.addColorStop(1, '#4e1400'); // Viền tối
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 2, 28, 40, isLeft ? 0.08 : -0.08, 0, Math.PI * 2);
    ctx.fill();

    // Đồng tử sắc nhọn cuồng nộ (Slit-like fierce pupil)
    ctx.fillStyle = '#1a0000';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 2, 9, 22, isLeft ? 0.08 : -0.08, 0, Math.PI * 2);
    ctx.fill();

    // Điểm sáng bắt sáng mãnh liệt (Sharp Catchlight)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX - 8, centerY - 12, 7.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX + 8, centerY + 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Viền mí mắt trên dày, sắc lẹm, xếch lên đầy khiêu khích
    ctx.strokeStyle = '#2d1505';
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const eyeTilt = isLeft ? 0.12 : -0.12;
    ctx.arc(centerX, centerY - 2, 40, Math.PI * 1.18 + eyeTilt, Math.PI * 1.88 + eyeTilt);
    ctx.stroke();

    // Đuôi mắt xếch hoang dã
    ctx.lineWidth = 3.5;
    const tailX = isLeft ? centerX - 36 : centerX + 36;
    ctx.beginPath();
    ctx.moveTo(tailX, centerY - 14);
    ctx.lineTo(tailX + (isLeft ? -14 : 14), centerY - 24);
    ctx.stroke();

    // Mí mắt dưới
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(70, 30, 10, 0.7)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 12, 34, Math.PI * 0.25, Math.PI * 0.75);
    ctx.stroke();

    ctx.restore();
  };

  drawBerserkerEye(165, 255, true);
  drawBerserkerEye(345, 255, false);

  // 6. Lông mày sắc nhọn, chếch lên cuồng chiến (Fierce arched eyebrows)
  ctx.strokeStyle = '#7c4308';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';

  // Lông mày trái
  ctx.beginPath();
  ctx.moveTo(125, 205);
  ctx.quadraticCurveTo(168, 182, 215, 196);
  ctx.stroke();

  // Lông mày phải
  ctx.beginPath();
  ctx.moveTo(387, 205);
  ctx.quadraticCurveTo(344, 182, 297, 196);
  ctx.stroke();

  // 7. Sống mũi cao, thẳng tắp kiêu hãnh (Straight proud nose)
  ctx.fillStyle = 'rgba(195, 120, 95, 0.7)';
  ctx.beginPath();
  ctx.ellipse(256, 305, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 8. Nụ cười ngạo nghễ nhe răng nanh chiến binh (Warrior toothy smirk)
  ctx.strokeStyle = '#8a2318';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Khóe miệng bên phải nhếch cao ngạo nghễ
  ctx.moveTo(235, 362);
  ctx.quadraticCurveTo(256, 375, 282, 354);
  ctx.stroke();

  // Răng nanh trắng bóng lấp ló (Little white canine tooth)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(268, 360);
  ctx.lineTo(276, 360);
  ctx.lineTo(272, 368);
  ctx.closePath();
  ctx.fill();

  // Điểm bóng môi tự nhiên
  ctx.fillStyle = 'rgba(235, 95, 80, 0.65)';
  ctx.beginPath();
  ctx.ellipse(256, 372, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
