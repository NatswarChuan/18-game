import * as xb from 'xrblocks';
import { BuffDefinition, FactionId, GamePhase, MatchFormat, SlotIndex, UltimateCutInData, ValkyrieDefinition } from '../types.js';
import { VALKYRIE_ROSTER, getValkyrieById } from '../data/roster.js';
import { soundManager } from '../utils/sound.js';

export interface HudCallbacks {
  onStartBattle: () => void;
  onOpenDraft: () => void;
  onOpenStudio: () => void;
  onCloseStudio: () => void;
  onResetMatch: () => void;
  onSelectPreset: (preset: 'VANGUARD' | 'FLANK' | 'BUNKER') => void;
  onClearFormation: () => void;
  onSelectValkyrieForSlot: (valkyrieId: string) => void;
  onSelectBuff: (buff: BuffDefinition) => void;
  onNextRound: () => void;
  onStudioSelectValkyrie: (valkyrieId: string) => void;
  onStudioSetTier: (tier: 1 | 2 | 3) => void;
  onStudioToggleWireframe?: () => void;
}

export class SpatialHud {
  public readonly esportsCard: xb.UICard;
  public readonly dockCard: xb.UICard;
  public readonly draftCard: xb.UICard;
  public readonly cutInCard: xb.UICard;
  public readonly studioCard: xb.UICard;
  public readonly resultCard: xb.UICard;

  // Dynamic elements
  private phaseText: xb.UIText;
  private scoreText: xb.UIText;
  private timerText: xb.UIText;
  private battleButton: xb.UIButton;
  private soundButton: xb.UIButton;

  // Dock elements
  private selectedSlotText: xb.UIText;
  private currentFaction: FactionId | 'ALL' = 'ALL';
  private valkyrieListPanel: xb.UIPanel;
  private callbacks: HudCallbacks;

  // Draft elements
  private draftOptionsPanel: xb.UIPanel;

  // Cut-in elements
  private cutInName: xb.UIText;
  private cutInSkill: xb.UIText;
  private cutInVoice: xb.UIText;
  private cutInAvatar: xb.UIImage;

  // Studio elements
  private studioTitle: xb.UIText;
  private studioMeshDensity: xb.UIText;
  private studioStats: xb.UIText;
  private studioLore: xb.UIText;
  private studioVoice: xb.UIText;
  private studioAvatar: xb.UIImage;
  private currentStudioIndex: number = 0;

  // Result elements
  private resultTitle: xb.UIText;
  private resultSubtitle: xb.UIText;
  private resultButton: xb.UIButton;

  constructor(callbacks: HudCallbacks) {
    this.callbacks = callbacks;

    // 1. TOP ESPORTS HUD CARD
    this.phaseText = new xb.UIText({
      text: 'PHASE: BỐ TRÍ TRẬN ĐỊA (FORMATION)',
      style: { fontSize: 18, fontWeight: 'bold', color: '#00f0ff', textAlign: 'center' },
    });
    this.scoreText = new xb.UIText({
      text: 'BO3 MATCH | 🏆 CHỈ HUY: 0  -  0 ĐỐI THỦ',
      style: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
    });
    this.timerText = new xb.UIText({
      text: '⏱️ 30s',
      style: { fontSize: 16, color: '#ffd700', textAlign: 'center' },
    });

    this.battleButton = new xb.UIButton({
      label: 'XUẤT TRẬN ⚔️',
      icon: 'swords',
      style: { flexGrow: 1, backgroundColor: '#00cc88', color: '#ffffff' },
      onClick: () => {
        soundManager.playClick();
        this.callbacks.onStartBattle();
      },
    });

    this.soundButton = new xb.UIButton({
      label: 'Âm thanh: BẬT',
      icon: 'volume_up',
      style: { flexGrow: 1 },
      onClick: () => {
        const next = !soundManager.getMuted();
        soundManager.setMuted(next);
        this.soundButton.label = next ? 'Âm thanh: TẮT' : 'Âm thanh: BẬT';
        this.soundButton.icon = next ? 'volume_off' : 'volume_up';
        if (!next) soundManager.playClick();
      },
    });

    const hudButtons = new xb.UIPanel({
      style: { width: '100%', flexDirection: 'row', gap: 8, justifyContent: 'center' },
      children: [
        this.battleButton,
        new xb.UIButton({
          label: 'Rút Buff ⚡',
          icon: 'bolt',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playClick();
            this.callbacks.onOpenDraft();
          },
        }),
        new xb.UIButton({
          label: 'Phòng 3D Studio ✨',
          icon: 'view_in_ar',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playClick();
            this.callbacks.onOpenStudio();
          },
        }),
        this.soundButton,
        new xb.UIButton({
          label: 'Đặt lại 🔄',
          icon: 'restart_alt',
          style: { flexGrow: 0.8 },
          onClick: () => {
            soundManager.playClick();
            this.callbacks.onResetMatch();
          },
        }),
      ],
    });

    this.esportsCard = new xb.UICard({
      size: { width: 0.96, height: 'auto' },
      manipulation: true,
      edge: true,
      style: { flexDirection: 'column', gap: 10, padding: 14, backgroundColor: 'rgba(8, 12, 28, 0.92)' },
      children: [
        new xb.UIText({
          text: 'VALKYRIE PROTOCOL: ZERO',
          style: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#00f0ff' },
        }),
        this.scoreText,
        new xb.UIPanel({
          style: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
          children: [this.phaseText, this.timerText],
        }),
        hudButtons,
      ],
    });
    this.esportsCard.position.set(0, 1.62, -1.6);

    // 2. TACTICAL DOCK CARD (VALKYRIE SELECTOR & PRESETS)
    this.selectedSlotText = new xb.UIText({
      text: '📍 Chọn 1 ô cờ trên bàn 3x3, sau đó bấm Valkyrie bên dưới để xuất chiến!',
      style: { fontSize: 15, color: '#00f0ff', textAlign: 'center' },
    });

    this.valkyrieListPanel = new xb.UIPanel({
      style: { width: '100%', flexDirection: 'column', gap: 6, justifyContent: 'center' },
      children: [],
    });

    const factionTabs = new xb.UIPanel({
      style: { width: '100%', flexDirection: 'row', gap: 6, justifyContent: 'center' },
      children: [
        new xb.UIButton({
          label: 'TẤT CẢ (27)',
          style: { flexGrow: 1 },
          onClick: () => this.filterFaction('ALL'),
        }),
        new xb.UIButton({
          label: 'VALHALLA (9)',
          style: { flexGrow: 1 },
          onClick: () => this.filterFaction('NEO_VALHALLA'),
        }),
        new xb.UIButton({
          label: 'EDEN (9)',
          style: { flexGrow: 1 },
          onClick: () => this.filterFaction('ABYSSAL_EDEN'),
        }),
        new xb.UIButton({
          label: 'SOL (9)',
          style: { flexGrow: 1 },
          onClick: () => this.filterFaction('SOL_DYNASTY'),
        }),
      ],
    });

    const presetRow = new xb.UIPanel({
      style: { width: '100%', flexDirection: 'row', gap: 6, justifyContent: 'center' },
      children: [
        new xb.UIButton({
          label: '🛡️ Tiên Phong',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playPlaceUnit();
            this.callbacks.onSelectPreset('VANGUARD');
          },
        }),
        new xb.UIButton({
          label: '⚡ Đột Kích',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playPlaceUnit();
            this.callbacks.onSelectPreset('FLANK');
          },
        }),
        new xb.UIButton({
          label: '🏰 Boongke',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playPlaceUnit();
            this.callbacks.onSelectPreset('BUNKER');
          },
        }),
        new xb.UIButton({
          label: '❌ Thu hồi hết',
          style: { flexGrow: 0.8 },
          onClick: () => {
            soundManager.playClick();
            this.callbacks.onClearFormation();
          },
        }),
      ],
    });

    this.dockCard = new xb.UICard({
      size: { width: 0.96, height: 'auto' },
      manipulation: true,
      edge: true,
      style: { flexDirection: 'column', gap: 10, padding: 12, backgroundColor: 'rgba(10, 14, 30, 0.94)' },
      children: [
        this.selectedSlotText,
        factionTabs,
        presetRow,
        this.valkyrieListPanel,
      ],
    });
    this.dockCard.position.set(0, 0.92, -1.45);
    this.refreshValkyrieList();

    // 3. BUFF DRAFT CARD
    this.draftOptionsPanel = new xb.UIPanel({
      style: { width: '100%', flexDirection: 'column', gap: 8 },
      children: [],
    });

    this.draftCard = new xb.UICard({
      size: { width: 0.72, height: 'auto' },
      manipulation: true,
      edge: true,
      style: { flexDirection: 'column', gap: 12, padding: 16, backgroundColor: 'rgba(12, 16, 38, 0.96)' },
      children: [
        new xb.UIText({
          text: '⚡ TUYỂN CHỌN BUFF CHIẾN THUẬT (DRAFT)',
          style: { fontSize: 22, fontWeight: 'bold', color: '#ffd700', textAlign: 'center' },
        }),
        new xb.UIText({
          text: 'Chọn 1 buff tăng cường chỉ số để tối ưu hóa đội hình trước giao tranh:',
          style: { fontSize: 15, opacity: 0.85, textAlign: 'center' },
        }),
        this.draftOptionsPanel,
        new xb.UIButton({
          label: 'Đóng & Vào Trận Đấu ❯',
          style: { width: '100%' },
          onClick: () => {
            soundManager.playClick();
            this.draftCard.visible = false;
          },
        }),
      ],
    });
    this.draftCard.position.set(0, 1.45, -1.35);
    this.draftCard.visible = false;

    // 4. CLIMAX ULTIMATE CUT-IN BANNER
    this.cutInAvatar = new xb.UIImage({
      src: '/avatars/VALK-01.jpg',
      style: { width: 110, height: 140, objectFit: 'cover', borderRadius: 10 },
    });
    this.cutInName = new xb.UIText({
      text: 'Freyja',
      style: { fontSize: 28, fontWeight: 'bold', color: '#ff2a85' },
    });
    this.cutInSkill = new xb.UIText({
      text: '⚔️ Infernal Rupture',
      style: { fontSize: 20, color: '#ffd700' },
    });
    this.cutInVoice = new xb.UIText({
      text: '“Toàn bộ nhiệt lượng đã tập trung vào lưỡi kiếm này!”',
      style: { fontSize: 16, opacity: 0.9, color: '#ffb700' },
    });

    const cutInRight = new xb.UIPanel({
      style: { flexGrow: 1, flexDirection: 'column', gap: 6, justifyContent: 'center' },
      children: [this.cutInName, this.cutInSkill, this.cutInVoice],
    });

    this.cutInCard = new xb.UICard({
      size: { width: 0.78, height: 'auto' },
      style: {
        flexDirection: 'row',
        gap: 16,
        padding: 14,
        backgroundColor: 'rgba(30, 5, 20, 0.95)',
        borderColor: '#ff2a85',
        borderWidth: 2,
      },
      children: [this.cutInAvatar, cutInRight],
    });
    this.cutInCard.position.set(0, 1.82, -1.5);
    this.cutInCard.visible = false;

    // 5. 3D VALKYRIE STUDIO CARD
    this.studioTitle = new xb.UIText({
      text: 'Freyja — Ngọn Lửa Tiên Phong',
      style: { fontSize: 24, fontWeight: 'bold', color: '#00f0ff', textAlign: 'center' },
    });
    this.studioStats = new xb.UIText({
      text: 'HP: 1200 | ATK: 65 | GIÁP: 30 | TỐC ĐỘ: 1.0 | TẦM: 1',
      style: { fontSize: 16, color: '#ffffff', textAlign: 'center' },
    });
    this.studioLore = new xb.UIText({
      text: '',
      style: { fontSize: 14, opacity: 0.85, lineHeight: 1.35, textAlign: 'center' },
    });
    this.studioVoice = new xb.UIText({
      text: '',
      style: { fontSize: 15, color: '#ff2a85', textAlign: 'center' },
    });
    this.studioMeshDensity = new xb.UIText({
      text: '💎 MÔ HÌNH 3D HIGH SCHOOL DxD (RIAS GREMORY) — CEL-SHADING & MANGA OUTLINES',
      style: { fontSize: 13, fontWeight: 'bold', color: '#ff2a85', textAlign: 'center' },
    });
    this.studioAvatar = new xb.UIImage({
      src: '/avatars/VALK-01.jpg',
      style: { width: 90, height: 110, objectFit: 'cover', borderRadius: 8, alignSelf: 'center' },
    });

    const tierSwitchRow = new xb.UIPanel({
      style: { width: '100%', flexDirection: 'row', gap: 6, justifyContent: 'center' },
      children: [
        new xb.UIButton({
          label: 'Tier 1: Nguyên vẹn',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playClick();
            this.callbacks.onStudioSetTier(1);
          },
        }),
        new xb.UIButton({
          label: 'Tier 2: Rách giáp',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playClothTorn();
            this.callbacks.onStudioSetTier(2);
          },
        }),
        new xb.UIButton({
          label: 'Tier 3: Climax 🔥',
          style: { flexGrow: 1, backgroundColor: '#ff0055', color: '#ffffff' },
          onClick: () => {
            soundManager.playUltimate();
            this.callbacks.onStudioSetTier(3);
          },
        }),
        new xb.UIButton({
          label: '🌐 Lưới Điểm (Wireframe)',
          style: { flexGrow: 1, backgroundColor: '#005588' },
          onClick: () => {
            soundManager.playClick();
            this.callbacks.onStudioToggleWireframe?.();
          },
        }),
      ],
    });


    const cycleRow = new xb.UIPanel({
      style: { width: '100%', flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
      children: [
        new xb.UIButton({
          label: '❮ Valkyrie trước',
          style: { flexGrow: 1 },
          onClick: () => this.cycleStudioValkyrie(-1),
        }),
        new xb.UIButton({
          label: 'Đóng Studio ✕',
          style: { flexGrow: 1 },
          onClick: () => {
            soundManager.playClick();
            this.studioCard.visible = false;
            this.callbacks.onCloseStudio();
          },
        }),
        new xb.UIButton({
          label: 'Valkyrie kế ❯',
          style: { flexGrow: 1 },
          onClick: () => this.cycleStudioValkyrie(1),
        }),
      ],
    });

    this.studioCard = new xb.UICard({
      size: { width: 0.75, height: 'auto' },
      manipulation: true,
      edge: true,
      style: { flexDirection: 'column', gap: 10, padding: 16, backgroundColor: 'rgba(8, 12, 28, 0.95)' },
      children: [
        this.studioTitle,
        this.studioMeshDensity,
        this.studioAvatar,
        this.studioStats,
        this.studioLore,
        this.studioVoice,
        tierSwitchRow,
        cycleRow,
      ],
    });
    this.studioCard.position.set(-0.85, 1.45, -1.6);
    this.studioCard.rotation.y = 0.25;
    this.studioCard.visible = false;

    // 6. MATCH RESULT CARD
    this.resultTitle = new xb.UIText({
      text: 'CHIẾN THẮNG TUYỆT ĐỐI! 🏆',
      style: { fontSize: 32, fontWeight: 'bold', color: '#00ff88', textAlign: 'center' },
    });
    this.resultSubtitle = new xb.UIText({
      text: 'Đội hình Valkyrie của bạn đã đè bẹp hoàn toàn đối thủ!',
      style: { fontSize: 18, textAlign: 'center', opacity: 0.9 },
    });
    this.resultButton = new xb.UIButton({
      label: 'Hiệp Đấu Kế Tiếp ❯',
      style: { width: '100%', backgroundColor: '#00cc88' },
      onClick: () => {
        soundManager.playClick();
        this.resultCard.visible = false;
        this.callbacks.onNextRound();
      },
    });

    this.resultCard = new xb.UICard({
      size: { width: 0.65, height: 'auto' },
      manipulation: true,
      edge: true,
      style: { flexDirection: 'column', gap: 14, padding: 20, backgroundColor: 'rgba(6, 10, 24, 0.96)' },
      children: [
        this.resultTitle,
        this.resultSubtitle,
        this.resultButton,
      ],
    });
    this.resultCard.position.set(0, 1.48, -1.35);
    this.resultCard.visible = false;
  }

  public updateMatchState(
    phase: GamePhase,
    playerWins: number,
    opponentWins: number,
    format: MatchFormat,
    timerSeconds: number
  ): void {
    const targetWins = format === 'BO5' ? 3 : 2;
    this.scoreText.text = `${format} MATCH | 🏆 CHỈ HUY: ${playerWins}  -  ${opponentWins} ĐỐI THỦ (Cần ${targetWins} thắng)`;
    this.timerText.text = `⏱️ ${timerSeconds}s`;

    switch (phase) {
      case 'FORMATION_PLACEMENT':
        this.phaseText.text = 'PHASE: BỐ TRÍ TRẬN ĐỊA (FORMATION)';
        this.phaseText.style.color = '#00f0ff';
        this.battleButton.label = 'XUẤT TRẬN ⚔️';
        this.battleButton.disabled = false;
        break;
      case 'DRAFT_BUFFS':
        this.phaseText.text = 'PHASE: RÚT THẺ BUFF (DRAFT)';
        this.phaseText.style.color = '#ffd700';
        break;
      case 'COMBAT_SIMULATION':
        this.phaseText.text = 'PHASE: GIAO TRANH 3D AUTO-BATTLE ⚔️';
        this.phaseText.style.color = '#ff3344';
        this.battleButton.label = 'ĐANG ĐỐI ĐẦU...';
        this.battleButton.disabled = true;
        break;
      case 'ROUND_RESULT':
      case 'MATCH_RESULT':
        this.phaseText.text = 'PHASE: TỔNG KẾT VÒNG ĐẤU';
        this.phaseText.style.color = '#00ff88';
        break;
      default:
        break;
    }
  }

  public setSelectedSlotDisplay(slotIndex: SlotIndex | null, valkyrieName?: string): void {
    if (slotIndex === null) {
      this.selectedSlotText.text = '📍 Nhấp chọn 1 ô cờ trên bàn 3x3, sau đó bấm Valkyrie bên dưới để xuất chiến!';
    } else {
      const occupant = valkyrieName ? ` (Đang có: ${valkyrieName})` : ' (Đang trống)';
      this.selectedSlotText.text = `📍 Đã chọn ô #${slotIndex + 1}${occupant}. Bấm 1 Valkyrie bên dưới để bố trí!`;
    }
  }

  public showDraftBuffs(buffs: BuffDefinition[]): void {
    this.draftOptionsPanel.children = buffs.map((buff) => {
      return new xb.UIPanel({
        style: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          gap: 10,
        },
        children: [
          new xb.UIPanel({
            style: { flexGrow: 1, flexDirection: 'column', gap: 2 },
            children: [
              new xb.UIText({
                text: `${buff.name} (Tầng ${buff.depth})`,
                style: { fontSize: 16, fontWeight: 'bold', color: '#ffd700' },
              }),
              new xb.UIText({
                text: buff.description,
                style: { fontSize: 13, opacity: 0.85 },
              }),
            ],
          }),
          new xb.UIButton({
            label: 'Chọn ⚡',
            style: { backgroundColor: '#00cc88' },
            onClick: () => {
              soundManager.playDraftSelect();
              this.callbacks.onSelectBuff(buff);
              this.draftCard.visible = false;
            },
          }),
        ],
      });
    });
    this.draftCard.visible = true;
  }

  public showClimaxCutIn(data: UltimateCutInData): void {
    this.cutInAvatar.src = `/avatars/${data.valkyrie.id}.jpg`;
    this.cutInName.text = data.valkyrie.name;
    this.cutInSkill.text = `⚔️ ${data.valkyrie.ultimate.name}`;
    this.cutInVoice.text = `“${data.voiceLine}”`;
    this.cutInCard.visible = true;

    setTimeout(() => {
      this.cutInCard.visible = false;
    }, 2800);
  }

  public showStudioValkyrie(valkyrie: ValkyrieDefinition): void {
    this.currentStudioIndex = VALKYRIE_ROSTER.findIndex((v) => v.id === valkyrie.id);
    if (this.currentStudioIndex < 0) this.currentStudioIndex = 0;

    this.studioTitle.text = `${valkyrie.name} — ${valkyrie.title}`;
    this.studioMeshDensity.text = '💎 MÔ HÌNH 3D HIGH SCHOOL DxD: 200.000+ ĐIỂM ĐỈNH LIÊN KẾT';
    this.studioAvatar.src = `/avatars/${valkyrie.id}.jpg`;
    this.studioStats.text = `HP: ${valkyrie.stats.maxHp} | ATK: ${valkyrie.stats.attack} | GIÁP: ${valkyrie.stats.armor} | TỐC ĐỘ: ${valkyrie.stats.attackSpeed} | TẦM: ${valkyrie.stats.attackRange}`;
    this.studioLore.text = valkyrie.ultimate.description;
    this.studioVoice.text = `“${valkyrie.battleDamage.battleVoiceLine}”`;
    this.studioCard.visible = true;
  }

  private cycleStudioValkyrie(offset: number): void {
    this.currentStudioIndex = (this.currentStudioIndex + offset + VALKYRIE_ROSTER.length) % VALKYRIE_ROSTER.length;
    const nextValk = VALKYRIE_ROSTER[this.currentStudioIndex];
    this.showStudioValkyrie(nextValk);
    this.callbacks.onStudioSelectValkyrie(nextValk.id);
  }

  public showRoundResult(winner: 'player' | 'opponent', isFinalMatch: boolean): void {
    const isWin = winner === 'player';
    if (isWin) {
      soundManager.playVictory();
      this.resultTitle.text = isFinalMatch ? '👑 QUÁN QUÂN CHUNG CUỘC! 👑' : 'CHIẾN THẮNG HIỆP ĐẤU! 🏆';
      this.resultTitle.style.color = '#00ff88';
      this.resultSubtitle.text = isFinalMatch
        ? 'Bạn đã đánh bại hoàn toàn đối thủ và bảo vệ thành công giao thức Valkyrie!'
        : 'Chiến thuật chuẩn xác đã mang lại chiến thắng quan trọng cho bạn!';
    } else {
      soundManager.playDefeat();
      this.resultTitle.text = isFinalMatch ? 'THẤT BẠI CHUNG CUỘC... 💀' : 'THẤT THỦ HIỆP ĐẤU... ⚠️';
      this.resultTitle.style.color = '#ff3344';
      this.resultSubtitle.text = 'Hãy điều chỉnh lại đội hình và buff chiến thuật để lật ngược tình thế!';
    }
    this.resultButton.label = isFinalMatch ? 'Đấu Trận Mới 🔄' : 'Vòng Đấu Kế Tiếp ❯';
    this.resultCard.visible = true;
  }

  private filterFaction(faction: FactionId | 'ALL'): void {
    soundManager.playClick();
    this.currentFaction = faction;
    this.refreshValkyrieList();
  }

  private refreshValkyrieList(): void {
    const filtered = this.currentFaction === 'ALL'
      ? VALKYRIE_ROSTER
      : VALKYRIE_ROSTER.filter((v) => v.faction === this.currentFaction);

    // Group into 3 rows of 3 buttons for 3x3 roster deck
    const buttons = filtered.slice(0, 9).map((valk) => {
      return new xb.UIButton({
        label: `${valk.name} [${valk.role.split('_')[1] || valk.role}]`,
        style: { flexGrow: 1, padding: 6, fontSize: 13 },
        onClick: () => {
          soundManager.playPlaceUnit();
          this.callbacks.onSelectValkyrieForSlot(valk.id);
        },
      });
    });

    const rows: xb.UIPanel[] = [];
    for (let i = 0; i < buttons.length; i += 3) {
      rows.push(
        new xb.UIPanel({
          style: { width: '100%', flexDirection: 'row', gap: 6, justifyContent: 'center' },
          children: buttons.slice(i, i + 3),
        })
      );
    }
    this.valkyrieListPanel.children = rows;
  }
}
