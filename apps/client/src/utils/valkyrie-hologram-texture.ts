import * as THREE from 'three';
import { ClothDamageTier, FactionId, getValkyrieById } from '@valkyrie/shared-domain';

const hologramTextureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Returns the CSS hex color code for a faction.
 * Trả về mã màu CSS Hex tương ứng với từng Tộc/Hệ.
 *
 * @param faction - Faction identifier.
 * @returns Hex string color.
 */
function getFactionColorString(faction: FactionId): string {
  if (faction === 'NEO_VALHALLA') return '#00F0FF';
  if (faction === 'ABYSSAL_EDEN') return '#FF2A85';
  return '#FFD700';
}

/**
 * Builds a chamfered sci-fi hexagonal crystal path on a 2D canvas context.
 * Vẽ đường bao lăng kính pha lê công nghệ vát góc lục giác trên Canvas 2D.
 *
 * @param ctx - Target 2D rendering context.
 * @param width - Canvas width.
 * @param height - Canvas height.
 */
function drawCrystalPath(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const padX = 28;
  const padY = 28;
  const w = width - padX * 2;
  const h = height - padY * 2;
  const chamfer = 60;
  const taper = 95;

  ctx.beginPath();
  ctx.moveTo(padX + chamfer, padY);
  ctx.lineTo(padX + w - chamfer, padY);
  ctx.lineTo(padX + w, padY + chamfer);
  ctx.lineTo(padX + w, padY + h - taper);
  ctx.lineTo(padX + w / 2, padY + h);
  ctx.lineTo(padX, padY + h - taper);
  ctx.lineTo(padX, padY + chamfer);
  ctx.closePath();
}

/**
 * Draws the feathered anime avatar image smoothly inside the crystal frame.
 * Vẽ ảnh nhân vật Anime được làm mịn viền mờ (feathered) hòa tan vào nền không gian.
 *
 * @param ctx - Target 2D rendering context.
 * @param img - Loaded HTMLImageElement.
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @param factionColor - Faction neon color string.
 */
function renderFeatheredAvatar(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  factionColor: string
): void {
  // 1. Dark cosmic backdrop inside crystal
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2 - 30, 60, width / 2, height / 2, 320);
  bgGrad.addColorStop(0, '#12172c');
  bgGrad.addColorStop(0.7, '#0a0d1c');
  bgGrad.addColorStop(1, '#050711');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Faction ambient aura behind character
  const auraGrad = ctx.createRadialGradient(width / 2, height / 2 - 30, 30, width / 2, height / 2 - 30, 220);
  auraGrad.addColorStop(0, factionColor + '66');
  auraGrad.addColorStop(0.75, factionColor + '18');
  auraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Draw Avatar Image centered and large (470px)
  const avatarSize = 470;
  const avatarX = (width - avatarSize) / 2;
  const avatarY = (height - avatarSize) / 2 - 22;
  ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);

  // 4. Subtle feathered edge vignette strictly at outer frame boundary (Leaves character 100% crisp & un-darkened)
  const vignette = ctx.createRadialGradient(width / 2, height / 2 - 20, 240, width / 2, height / 2 - 20, 290);
  vignette.addColorStop(0, 'rgba(7, 9, 18, 0)');
  vignette.addColorStop(0.75, 'rgba(7, 9, 18, 0.35)');
  vignette.addColorStop(1, 'rgba(5, 7, 15, 0.90)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Renders holographic decorations, frame borders, and role badges on the canvas.
 * Vẽ các lớp viền phát quang Neon, khung lăng kính và huy hiệu tên nhân vật.
 *
 * @param ctx - Canvas 2D context.
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @param color - Faction neon color.
 * @param valkyrieName - Name of the Valkyrie.
 * @param roleText - Role identifier.
 * @param tier - Current cloth damage tier.
 */
/**
 * Renders holographic decorations, frame borders, and role badges on the canvas.
 * Vẽ các lớp viền phát quang Neon, khung lăng kính và huy hiệu tên nhân vật.
 *
 * @param ctx - Canvas 2D context.
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @param color - Faction neon color.
 * @param valkyrieName - Name of the Valkyrie.
 * @param roleText - Role identifier.
 * @param tier - Current cloth damage tier.
 */
function renderHologramDecorations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  valkyrieName: string,
  roleText: string,
  tier: ClothDamageTier
): void {
  // Character artwork remains 100% sharp, pristine and unblocked (Zero blur, zero stickers, zero scanlines)

  // 3. Glowing Outer Border
  ctx.save();
  drawCrystalPath(ctx, width, height);
  const borderColor = tier === 3 ? '#FF2A85' : tier === 2 ? '#FFD700' : color;
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = 32;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 9;
  ctx.stroke();

  // 4. Sharp Inner Border
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 5. Floating Nameplate Tag at Bottom
  const tagY = height - 105;
  ctx.fillStyle = 'rgba(7, 10, 20, 0.94)';
  ctx.fillRect(44, tagY, width - 88, 48);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(44, tagY, width - 88, 48);

  // Valkyrie Name Text
  ctx.font = 'bold 24px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(valkyrieName.toUpperCase(), width / 2, tagY + 24);

  // Top Role Icon Tag
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillStyle = borderColor;
  ctx.fillText(tier === 3 ? '⚡ CLIMAX EXTREME' : tier === 2 ? '⚔️ BATTLE TORN' : roleText, width / 2, 54);

}

/**
 * Draws immediate fallback tech visual inside crystal frame if image is loading or unavailable.
 * Vẽ hình bóng công nghệ phát quang tức thì đảm bảo nhân vật không bao giờ bị vô hình.
 */
function renderFallbackAvatar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  factionColor: string,
  valkyrieName: string
): void {
  // 1. Dark tech backdrop inside crystal
  ctx.fillStyle = '#0c1022';
  ctx.fillRect(0, 0, width, height);

  // 2. Faction ambient aura
  const auraGrad = ctx.createRadialGradient(width / 2, height / 2 - 30, 20, width / 2, height / 2 - 30, 200);
  auraGrad.addColorStop(0, factionColor + '77');
  auraGrad.addColorStop(0.6, factionColor + '22');
  auraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Central initial monogram
  ctx.font = '900 130px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = factionColor;
  ctx.shadowBlur = 30;
  ctx.fillText(valkyrieName[0] ?? 'V', width / 2, height / 2 - 40);
  ctx.shadowBlur = 0;
}

/**
 * Generates and caches an ultra-luxurious 2.5D Holographic Valkyrie Standee texture.
 * Khởi tạo và lưu bộ nhớ đệm texture lăng kính Hologram 2.5D cho nữ chiến binh Valkyrie:
 * Cắt gọt viền lăng kính pha lê, làm mờ viền ảnh (feathered), quét Hologram và viền phát quang.
 *
 * @param valkyrieId - Valkyrie identifier string.
 * @param faction - Valkyrie faction identifier.
 * @param tier - Current cloth damage tier.
 * @returns Cached or newly generated THREE.CanvasTexture.
 */
export function getHologramValkyrieTexture(
  valkyrieId: string,
  faction: FactionId,
  tier: ClothDamageTier
): THREE.CanvasTexture {
  const cacheKey = `${valkyrieId}_${tier}`;
  const cached = hologramTextureCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.colorSpace = THREE.SRGBColorSpace;
  canvasTexture.generateMipmaps = true;
  canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;
  hologramTextureCache.set(cacheKey, canvasTexture);

  if (!ctx) return canvasTexture;

  const valk = getValkyrieById(valkyrieId);
  const valkName = valk ? valk.name : valkyrieId;
  const roleText = valk ? valk.role.replace('_', ' ') : 'VALKYRIE';
  const color = getFactionColorString(faction);

  const drawFullCard = (imgElement?: HTMLImageElement): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    drawCrystalPath(ctx, canvas.width, canvas.height);
    ctx.clip();
    if (imgElement && imgElement.naturalWidth > 0) {
      renderFeatheredAvatar(ctx, imgElement, canvas.width, canvas.height, color);
    } else {
      renderFallbackAvatar(ctx, canvas.width, canvas.height, color, valkName);
    }
    ctx.restore();
    renderHologramDecorations(ctx, canvas.width, canvas.height, color, valkName, roleText, tier);
    canvasTexture.needsUpdate = true;
  };

  // 1. Render immediate fallback visual so characters are NEVER invisible
  drawFullCard();

  // 2. Asynchronously load avatar image and repaint
  const img = new Image();
  img.onload = () => drawFullCard(img);
  img.onerror = () => drawFullCard();
  img.src = `/avatars/${valkyrieId}.jpg`;

  if (img.complete && img.naturalWidth > 0) {
    drawFullCard(img);
  }

  return canvasTexture;
}

/**
 * Safely disposes all cached canvas textures to prevent WebGL memory leaks.
 * Giải phóng toàn bộ bộ nhớ đệm texture Hologram đảm bảo 0 rò rỉ GPU.
 */
export function disposeHologramTextures(): void {
  hologramTextureCache.forEach((texture) => {
    texture.dispose();
  });
  hologramTextureCache.clear();
}
