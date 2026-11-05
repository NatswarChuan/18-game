import * as xb from 'xrblocks';
import * as THREE from 'three';
import { SlotIndex, UnitPlacement, ValkyrieDefinition } from '../types.js';
import { getValkyrieById } from '../data/roster.js';
import { soundManager } from '../utils/sound.js';
import { getFactionHexColor } from '../graphics/valkyrie-figure.js';

export interface ArenaCallbacks {
  onSlotClick: (slotIndex: SlotIndex) => void;
  onSlotHover?: (slotIndex: SlotIndex | null) => void;
  onUnitRemove?: (slotIndex: SlotIndex) => void;
}

export interface SlotMetadata {
  index: SlotIndex;
  rowName: string;
  rowLabel: string;
  colName: string;
  bonusText: string;
  color: string;
}

export const SLOT_METADATA: Record<SlotIndex, SlotMetadata> = {
  0: { index: 0, rowName: 'FRONTLINE', rowLabel: 'Tiên Phong', colName: 'Trái', bonusText: '+15% Mana khi nhận đòn', color: '#00f0ff' },
  1: { index: 1, rowName: 'FRONTLINE', rowLabel: 'Tiên Phong', colName: 'Giữa', bonusText: '+15% Mana (Trọng điểm)', color: '#00f0ff' },
  2: { index: 2, rowName: 'FRONTLINE', rowLabel: 'Tiên Phong', colName: 'Phải', bonusText: '+15% Mana khi nhận đòn', color: '#00f0ff' },
  3: { index: 3, rowName: 'MIDLINE', rowLabel: 'Đột Kích', colName: 'Trái', bonusText: '+10% Tốc đánh', color: '#b026ff' },
  4: { index: 4, rowName: 'MIDLINE', rowLabel: 'Đột Kích', colName: 'Giữa', bonusText: '+10% Tốc đánh', color: '#b026ff' },
  5: { index: 5, rowName: 'MIDLINE', rowLabel: 'Đột Kích', colName: 'Phải', bonusText: '+10% Tốc đánh', color: '#b026ff' },
  6: { index: 6, rowName: 'BACKLINE', rowLabel: 'Hậu Phương', colName: 'Trái', bonusText: '+1 Tầm đánh & An toàn', color: '#ffb700' },
  7: { index: 7, rowName: 'BACKLINE', rowLabel: 'Hậu Phương', colName: 'Giữa', bonusText: '+1 Tầm đánh & An toàn', color: '#ffb700' },
  8: { index: 8, rowName: 'BACKLINE', rowLabel: 'Hậu Phương', colName: 'Phải', bonusText: '+1 Tầm đánh & An toàn', color: '#ffb700' },
};

/**
 * 3x3 Grid UI Component for the Tactical Auto-Battler Board.
 * Thành phần giao diện Không Gian Bàn Cờ 3x3 hiển thị 9 ô chiến thuật đa tầng,
 * với hiệu ứng CSS animations tương tác hover, tia quét laser hologram,
 * khung ngắm mục tiêu corner reticle, và liên kết hai chiều với sàn đấu 3D.
 */
export class Arena {
  // Spatial 3D UI Card (for XR environment)
  public readonly card: xb.UICard;
  private readonly slotButtons: Map<SlotIndex, xb.UIButton> = new Map();
  private readonly slotOccupantTexts: Map<SlotIndex, xb.UIText> = new Map();
  private readonly slotRoleTexts: Map<SlotIndex, xb.UIText> = new Map();
  private readonly slotImages: Map<SlotIndex, xb.UIImage> = new Map();
  private readonly infoBannerText: xb.UIText;
  private readonly countText: xb.UIText;

  // 2D DOM Overlay Tactical 3x3 Grid with CSS Animations
  private domDockElement: HTMLElement | null = null;
  private domCells: Map<SlotIndex, HTMLElement> = new Map();
  private domCountBadge: HTMLElement | null = null;
  private domFooterText: HTMLElement | null = null;

  private selectedSlot: SlotIndex | null = null;
  private hoveredSlot: SlotIndex | null = null;
  private formation: UnitPlacement[] = [];
  private callbacks: ArenaCallbacks;

  constructor(callbacks: ArenaCallbacks) {
    this.callbacks = callbacks;

    // 1. Build Spatial UI Card
    this.infoBannerText = new xb.UIText({
      text: '🛡️ BÀN CỜ CHIẾN THUẬT 3x3 — Rê chuột / chỉ tia để khóa mục tiêu ô',
      style: { fontSize: 16, fontWeight: 'bold', color: '#00f0ff', textAlign: 'center' },
    });

    this.countText = new xb.UIText({
      text: 'Quân số: 0/6 Valkyrie',
      style: { fontSize: 14, color: '#ffd700', textAlign: 'center' },
    });

    const frontlineRow = this.createBoardRow('🛡️ HÀNG ĐẦU — TIÊN PHONG', [0, 1, 2]);
    const midlineRow = this.createBoardRow('⚡ HÀNG GIỮA — ĐỘT KÍCH', [3, 4, 5]);
    const backlineRow = this.createBoardRow('🎯 HÀNG SAU — HẬU PHƯƠNG', [6, 7, 8]);

    this.card = new xb.UICard({
      size: { width: 0.98, height: 'auto' },
      manipulation: true,
      edge: true,
      style: {
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        backgroundColor: 'rgba(6, 10, 24, 0.94)',
        borderColor: '#00f0ff',
        borderWidth: 1.5,
      },
      children: [
        new xb.UIPanel({
          style: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
          children: [this.infoBannerText, this.countText],
        }),
        frontlineRow,
        midlineRow,
        backlineRow,
      ],
    });

    this.card.position.set(0.95, 1.35, -1.55);
    this.card.rotation.y = -0.22;

    // 2. Build 2D DOM Tactical 3x3 Grid with CSS Animations
    this.mountDomOverlay();
  }

  private createBoardRow(rowTitle: string, slots: SlotIndex[]): xb.UIPanel {
    const slotPanels = slots.map((slotIndex) => this.createSlotItem(slotIndex));

    return new xb.UIPanel({
      style: { width: '100%', flexDirection: 'column', gap: 4 },
      children: [
        new xb.UIText({
          text: rowTitle,
          style: { fontSize: 12, fontWeight: 'bold', opacity: 0.75, color: '#94a3b8' },
        }),
        new xb.UIPanel({
          style: { width: '100%', flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
          children: slotPanels,
        }),
      ],
    });
  }

  private createSlotItem(slotIndex: SlotIndex): xb.UIPanel {
    const meta = SLOT_METADATA[slotIndex];

    const occupantText = new xb.UIText({
      text: '[ Ô TRỐNG ]',
      style: { fontSize: 13, fontWeight: 'bold', color: '#94a3b8', textAlign: 'center' },
    });
    this.slotOccupantTexts.set(slotIndex, occupantText);

    const roleText = new xb.UIText({
      text: `#${slotIndex + 1} • ${meta.colName}`,
      style: { fontSize: 11, color: meta.color, textAlign: 'center' },
    });
    this.slotRoleTexts.set(slotIndex, roleText);

    const avatarImage = new xb.UIImage({
      src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
      style: {
        width: 38,
        height: 38,
        borderRadius: 19,
        objectFit: 'cover',
        alignSelf: 'center',
        opacity: 0,
      },
    });
    this.slotImages.set(slotIndex, avatarImage);

    const button = new xb.UIButton({
      label: 'CHỌN Ô',
      style: {
        width: '100%',
        padding: 4,
        fontSize: 11,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        ':hover': {
          backgroundColor: 'rgba(0, 240, 255, 0.45)',
          borderColor: '#00f0ff',
        },
        ':active': {
          backgroundColor: 'rgba(0, 240, 255, 0.8)',
        },
      },
      onClick: () => {
        soundManager.playSelectUnit();
        this.callbacks.onSlotClick(slotIndex);
      },
    });
    this.slotButtons.set(slotIndex, button);

    const slotCard = new xb.UIPanel({
      style: {
        flexGrow: 1,
        flexDirection: 'column',
        gap: 3,
        padding: 6,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        borderRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        alignItems: 'center',
      },
      children: [
        roleText,
        avatarImage,
        occupantText,
        button,
      ],
    });

    return slotCard;
  }

  /**
   * Mounts the 2D Tactical Arena Grid DOM component with full CSS hover animations.
   */
  private mountDomOverlay(): void {
    if (typeof document === 'undefined') return;

    // Check if already exists
    const existing = document.getElementById('arena-hud-dock');
    if (existing) existing.remove();

    const dock = document.createElement('div');
    dock.id = 'arena-hud-dock';
    dock.className = 'arena-hud-dock';

    // Header
    const header = document.createElement('div');
    header.className = 'arena-hud-header';
    header.innerHTML = `
      <div class="arena-hud-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
        </svg>
        3X3 TACTICAL GRID
      </div>
      <div class="arena-hud-count" id="arena-dom-count">0/6 Valkyries</div>
    `;
    dock.appendChild(header);
    this.domCountBadge = header.querySelector('#arena-dom-count');

    // 3x3 Grid Rows Container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'arena-3x3-container';

    const rowConfigs: { title: string; slots: SlotIndex[] }[] = [
      { title: '🛡️ HÀNG ĐẦU — TIÊN PHONG', slots: [0, 1, 2] },
      { title: '⚡ HÀNG GIỮA — ĐỘT KÍCH', slots: [3, 4, 5] },
      { title: '🎯 HÀNG SAU — HẬU PHƯƠNG', slots: [6, 7, 8] },
    ];

    for (const rowConfig of rowConfigs) {
      const rowGroup = document.createElement('div');
      rowGroup.className = 'arena-row-group';

      const label = document.createElement('div');
      label.className = 'arena-row-label';
      label.textContent = rowConfig.title;
      rowGroup.appendChild(label);

      const slotsGrid = document.createElement('div');
      slotsGrid.className = 'arena-row-slots';

      for (const slotIndex of rowConfig.slots) {
        const meta = SLOT_METADATA[slotIndex];
        const col = slotIndex % 3;
        const row = Math.floor(slotIndex / 3);
        const colType = col === 0 ? 'left' : col === 1 ? 'center' : 'right';
        const rowType = row === 0 ? 'front' : row === 1 ? 'mid' : 'back';

        const cell = document.createElement('div');
        cell.className = 'arena-grid-cell';
        cell.dataset.slot = String(slotIndex);
        cell.dataset.col = colType;
        cell.dataset.row = rowType;
        cell.innerHTML = `
          <div class="cell-reticle">
            <span class="tl"></span>
            <span class="tr"></span>
            <span class="bl"></span>
            <span class="br"></span>
          </div>
          <div class="cell-scanline-container">
            <div class="cell-index-badge">#${slotIndex + 1} • ${meta.colName}</div>
            <div class="cell-avatar-wrapper" style="display: none;">
              <img class="cell-avatar" src="" alt="Valkyrie" />
            </div>
            <div class="cell-occupant-name">[ TRỐNG ]</div>
            <div class="cell-bonus-tag">${meta.bonusText}</div>
          </div>
          <div class="cell-stat-tooltip">
            <div class="tooltip-header">
              <span class="tooltip-valk-name">-</span>
              <span class="tooltip-valk-faction">-</span>
            </div>
            <div class="tooltip-valk-title">-</div>
            <div class="tooltip-stats-grid">
              <div class="stat-item"><span class="stat-label">ATK</span><span class="stat-value atk">-</span></div>
              <div class="stat-item"><span class="stat-label">DEF</span><span class="stat-value def">-</span></div>
              <div class="stat-item"><span class="stat-label">SPD</span><span class="stat-value spd">-</span></div>
              <div class="stat-item"><span class="stat-label">HP</span><span class="stat-value hp">-</span></div>
              <div class="stat-item"><span class="stat-label">RNG</span><span class="stat-value rng">-</span></div>
              <div class="stat-item"><span class="stat-label">EN</span><span class="stat-value en">-</span></div>
            </div>
            <div class="tooltip-ultimate">
              <span class="ult-tag">⚔️ Tuyệt kỹ:</span> <span class="ult-desc">-</span>
            </div>
          </div>
        `;

        // Interactive hover effects with CSS animation triggers and sound
        cell.addEventListener('mouseenter', () => {
          this.hoveredSlot = slotIndex;
          soundManager.playSelectUnit();
          this.callbacks.onSlotHover?.(slotIndex);
          if (this.domFooterText) {
            const occupant = this.formation.find((p) => p.slotIndex === slotIndex);
            const valk = occupant ? getValkyrieById(occupant.valkyrieId) : undefined;
            const occupantName = valk ? `[${valk.name}]` : '[Ô trống]';
            this.domFooterText.textContent = `🎯 Khóa mục tiêu ô #${slotIndex + 1} ${occupantName} • ${meta.bonusText}`;
          }
        });

        cell.addEventListener('mouseleave', () => {
          if (this.hoveredSlot === slotIndex) {
            this.hoveredSlot = null;
            this.callbacks.onSlotHover?.(null);
          }
          if (this.domFooterText) {
            if (this.selectedSlot !== null) {
              this.domFooterText.textContent = `📍 Đã chọn ô #${this.selectedSlot + 1} — Sẵn sàng xuất chiến!`;
            } else {
              this.domFooterText.textContent = '💡 Rê chuột để kích hoạt hiệu ứng radar & nhấp để chọn ô xuất trận.';
            }
          }
        });

        cell.addEventListener('click', () => {
          soundManager.playSelectUnit();
          this.callbacks.onSlotClick(slotIndex);
        });

        slotsGrid.appendChild(cell);
        this.domCells.set(slotIndex, cell);
      }

      rowGroup.appendChild(slotsGrid);
      gridContainer.appendChild(rowGroup);
    }

    dock.appendChild(gridContainer);

    // Footer Hint
    const footer = document.createElement('div');
    footer.className = 'arena-hud-footer';
    footer.id = 'arena-dom-footer';
    footer.textContent = '💡 Rê chuột để kích hoạt hiệu ứng radar & nhấp để chọn ô xuất trận.';
    dock.appendChild(footer);
    this.domFooterText = footer;

    document.body.appendChild(dock);
    this.domDockElement = dock;
  }

  /**
   * Updates the 3x3 board UI with the current player formation.
   */
  public updateFormation(formation: readonly UnitPlacement[]): void {
    this.formation = [...formation];
    this.countText.text = `Quân số: ${this.formation.length}/6 Valkyrie`;

    if (this.domCountBadge) {
      this.domCountBadge.textContent = `${this.formation.length}/6 Valkyries`;
    }

    // Reset all 9 slots
    for (let i = 0; i < 9; i++) {
      const slotIndex = i as SlotIndex;
      const occupant = this.formation.find((p) => p.slotIndex === slotIndex);

      // 1. Spatial UI update
      const occupantText = this.slotOccupantTexts.get(slotIndex);
      const avatarImage = this.slotImages.get(slotIndex);
      const button = this.slotButtons.get(slotIndex);

      // 2. DOM UI update
      const domCell = this.domCells.get(slotIndex);
      const domName = domCell?.querySelector('.cell-occupant-name') as HTMLElement | null;
      const domAvatarWrap = domCell?.querySelector('.cell-avatar-wrapper') as HTMLElement | null;
      const domAvatarImg = domCell?.querySelector('.cell-avatar') as HTMLImageElement | null;

      // Tooltip elements
      const tipName = domCell?.querySelector('.tooltip-valk-name') as HTMLElement | null;
      const tipFaction = domCell?.querySelector('.tooltip-valk-faction') as HTMLElement | null;
      const tipTitle = domCell?.querySelector('.tooltip-valk-title') as HTMLElement | null;
      const tipAtk = domCell?.querySelector('.stat-value.atk') as HTMLElement | null;
      const tipDef = domCell?.querySelector('.stat-value.def') as HTMLElement | null;
      const tipSpd = domCell?.querySelector('.stat-value.spd') as HTMLElement | null;
      const tipHp = domCell?.querySelector('.stat-value.hp') as HTMLElement | null;
      const tipRng = domCell?.querySelector('.stat-value.rng') as HTMLElement | null;
      const tipEn = domCell?.querySelector('.stat-value.en') as HTMLElement | null;
      const tipUlt = domCell?.querySelector('.ult-desc') as HTMLElement | null;

      if (occupant) {
        const valk = getValkyrieById(occupant.valkyrieId);
        if (valk) {
          if (occupantText && avatarImage && button) {
            occupantText.text = valk.name;
            occupantText.style.color = '#ffffff';
            avatarImage.src = `/avatars/${valk.id}.jpg`;
            avatarImage.style.opacity = 1;
            button.label = 'ĐỔI / THU';
            button.style.backgroundColor = 'rgba(0, 240, 255, 0.25)';
          }

          if (domCell) {
            domCell.classList.add('has-occupant');
          }

          if (domName && domAvatarWrap && domAvatarImg) {
            domName.textContent = valk.name;
            domName.style.color = '#00f0ff';
            domAvatarImg.src = `/avatars/${valk.id}.jpg`;
            domAvatarWrap.style.display = 'block';
          }

          // Populate tooltip
          if (tipName) tipName.textContent = valk.name;
          if (tipFaction) tipFaction.textContent = valk.faction.replace('_', ' ');
          if (tipTitle) tipTitle.textContent = valk.title;
          if (tipAtk) tipAtk.textContent = String(valk.stats.attack);
          if (tipDef) tipDef.textContent = String(valk.stats.armor);
          if (tipSpd) tipSpd.textContent = `${valk.stats.attackSpeed}/s`;
          if (tipHp) tipHp.textContent = String(valk.stats.maxHp);
          if (tipRng) tipRng.textContent = valk.stats.attackRange === 1 ? 'Cận chiến (1)' : valk.stats.attackRange === 2 ? 'Tầm trung (2)' : 'Tầm xa (3)';
          if (tipEn) tipEn.textContent = String(valk.stats.maxEnergy);
          if (tipUlt) tipUlt.textContent = `${valk.ultimate.name} — ${valk.ultimate.description}`;
        }
      } else {
        if (occupantText && avatarImage && button) {
          occupantText.text = '[ Ô TRỐNG ]';
          occupantText.style.color = '#64748b';
          avatarImage.style.opacity = 0;
          button.label = 'XUẤT QUÂN';
          button.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        }

        if (domCell) {
          domCell.classList.remove('has-occupant');
        }

        if (domName && domAvatarWrap) {
          domName.textContent = '[ TRỐNG ]';
          domName.style.color = '#64748b';
          domAvatarWrap.style.display = 'none';
        }
      }
    }

    this.refreshSelectionHighlight();
  }

  /**
   * Highlights the currently active slot.
   */
  public setSelectedSlot(slotIndex: SlotIndex | null): void {
    this.selectedSlot = slotIndex;
    this.refreshSelectionHighlight();

    if (slotIndex !== null) {
      const meta = SLOT_METADATA[slotIndex];
      const occupant = this.formation.find((p) => p.slotIndex === slotIndex);
      const valk = occupant ? getValkyrieById(occupant.valkyrieId) : undefined;
      const valkName = valk ? `(${valk.name})` : '(Trống)';
      this.infoBannerText.text = `📍 Đã chọn ô #${slotIndex + 1} ${valkName} — ${meta.rowLabel} (${meta.bonusText})`;
      if (this.domFooterText) {
        this.domFooterText.textContent = `📍 Đã chọn ô #${slotIndex + 1} ${valkName} — Nhấp 1 Valkyrie bên dưới để bố trí!`;
      }
    } else {
      this.infoBannerText.text = '🛡️ BÀN CỜ CHIẾN THUẬT 3x3 — Rê chuột / chỉ tia để khóa mục tiêu ô';
      if (this.domFooterText) {
        this.domFooterText.textContent = '💡 Rê chuột để kích hoạt hiệu ứng radar & nhấp để chọn ô xuất trận.';
      }
    }
  }

  private refreshSelectionHighlight(): void {
    for (let i = 0; i < 9; i++) {
      const slotIndex = i as SlotIndex;

      // Spatial UI Button state
      const button = this.slotButtons.get(slotIndex);
      if (button) {
        if (this.selectedSlot === slotIndex) {
          button.style.backgroundColor = '#ffd700';
          button.style.color = '#000000';
          button.label = 'ĐANG CHỌN ★';
        } else {
          const occupant = this.formation.find((p) => p.slotIndex === slotIndex);
          button.style.color = '#ffffff';
          button.label = occupant ? 'ĐỔI / THU' : 'XUẤT QUÂN';
          button.style.backgroundColor = occupant
            ? 'rgba(0, 240, 255, 0.25)'
            : 'rgba(255, 255, 255, 0.08)';
        }
      }

      // DOM Cell Targeted State
      const domCell = this.domCells.get(slotIndex);
      if (domCell) {
        if (this.selectedSlot === slotIndex) {
          domCell.classList.add('targeted');
        } else {
          domCell.classList.remove('targeted');
        }
      }
    }
  }

  /**
   * Cleans up the DOM overlay when the component is destroyed.
   */
  public dispose(): void {
    if (this.domDockElement) {
      this.domDockElement.remove();
      this.domDockElement = null;
    }
    this.domCells.clear();
  }

  /**
   * Returns world 3D position corresponding to slot index for spatial alignment.
   */
  public static getSlot3DVector(slotIndex: SlotIndex, isEnemy: boolean = false): THREE.Vector3 {
    const col = slotIndex % 3;
    const row = Math.floor(slotIndex / 3);
    const xSpacing = 0.85;
    const zSpacing = 0.75;
    const x = (col - 1) * xSpacing;
    const baseZ = -2.0;
    const z = isEnemy ? baseZ - (0.45 + row * zSpacing) : baseZ + (0.45 + row * zSpacing);
    return new THREE.Vector3(x, 0.45, z);
  }
}
