import * as THREE from 'three';
import * as xb from 'xrblocks';
import {
  BuffDefinition,
  ClothDamageTier,
  GamePhase,
  MatchFormat,
  SlotIndex,
  UnitPlacement,
  ValkyrieDefinition,
} from './types.js';
import { VALKYRIE_ROSTER, getValkyrieById } from './data/roster.js';
import { getRandomDraftBuffs } from './data/buffs.js';
import { soundManager } from './utils/sound.js';
import { TACTICAL_PRESETS, TacticalPresetType } from './utils/tactical-presets.js';
import { StadiumArena, getSlotPosition } from './graphics/stadium-arena.js';
import { FigureConfig, createValkyrie3DFullFigure, createFloatingBars } from './graphics/valkyrie-figure.js';
import { CombatEngine, CombatTickResult } from './engine/combat-engine.js';
import { SpatialHud } from './ui/spatial-hud.js';
import { Arena } from './components/Arena.js';

class ValkyrieScene extends xb.Script {
  private arena!: StadiumArena;
  private arenaBoard!: Arena;
  private hud!: SpatialHud;

  // Match State
  private phase: GamePhase = 'FORMATION_PLACEMENT';
  private matchFormat: MatchFormat = 'BO3';
  private playerWins = 0;
  private opponentWins = 0;
  private timerSeconds = 30;
  private lastTimerTick = 0;

  // Formations
  private playerFormation: UnitPlacement[] = [
    { valkyrieId: 'VALK-01', slotIndex: 1 }, // Freyja Front Center
    { valkyrieId: 'VALK-02', slotIndex: 0 }, // Brynhildr Front Left
    { valkyrieId: 'VALK-07', slotIndex: 2 }, // Herja Front Right
    { valkyrieId: 'VALK-03', slotIndex: 4 }, // Sigrun Mid Center
    { valkyrieId: 'VALK-06', slotIndex: 7 }, // Mist Back Center
    { valkyrieId: 'VALK-09', slotIndex: 8 }, // Gondul Back Right
  ];

  private opponentFormation: UnitPlacement[] = [
    { valkyrieId: 'VALK-11', slotIndex: 1 }, // Geiravor Front Center
    { valkyrieId: 'VALK-13', slotIndex: 0 }, // Herfjotur Front Left
    { valkyrieId: 'VALK-18', slotIndex: 2 }, // Svipul Front Right
    { valkyrieId: 'VALK-12', slotIndex: 3 }, // Hlokk Mid Left
    { valkyrieId: 'VALK-15', slotIndex: 6 }, // Geirahod Back Left
    { valkyrieId: 'VALK-17', slotIndex: 7 }, // Radgrid Back Center
  ];

  private selectedSlotIndex: SlotIndex | null = null;
  private activeBuffModifiers = { attackMult: 1.0, hpMult: 1.0, armorAdd: 0 };

  // 3D Unit Models Map: unitKey -> THREE.Group
  private unitFigures: Map<string, THREE.Group> = new Map();
  private combatEngine: CombatEngine | null = null;
  private lastCombatTickTime = 0;

  // 3D Studio Inspection
  private studioFigure: THREE.Group | null = null;
  private studioValkyrieId = 'VALK-01';
  private studioTier: ClothDamageTier = 1;
  private isStudioWireframe = false;

  init(): void {
    // 1. Lights (Studio & Arena Lighting with Anime Cel-Shading Highlights)
    this.add(new THREE.HemisphereLight(0xfff0fa, 0x1a1626, 2.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(2, 5, 2);
    this.add(dirLight);

    // Front fill light for anime character faces & costumes
    const frontFillLight = new THREE.DirectionalLight(0xfff8f0, 1.5);
    frontFillLight.position.set(0, 2, 4);
    this.add(frontFillLight);

    // Rim light for anime hair & devil wing silhouette highlights
    const rimLight = new THREE.DirectionalLight(0xff0055, 1.0);
    rimLight.position.set(0, 3, -4);
    this.add(rimLight);

    // 2. 3D Stadium Arena & 3x3 Battleground
    this.arena = new StadiumArena();
    this.add(this.arena.group);

    // 3. Spatial HUD Cards
    this.hud = new SpatialHud({
      onStartBattle: () => this.startCombat(),
      onOpenDraft: () => this.openDraft(),
      onOpenStudio: () => this.openStudio(),
      onCloseStudio: () => this.closeStudio(),
      onResetMatch: () => this.resetMatch(),
      onSelectPreset: (preset) => this.applyPreset(preset),
      onClearFormation: () => this.clearFormation(),
      onSelectValkyrieForSlot: (valkId) => this.placeValkyrieAtSelectedSlot(valkId),
      onSelectBuff: (buff) => this.applyBuff(buff),
      onNextRound: () => this.nextRound(),
      onStudioSelectValkyrie: (valkId) => this.updateStudioFigure(valkId, this.studioTier),
      onStudioSetTier: (tier) => this.updateStudioFigure(this.studioValkyrieId, tier),
      onStudioToggleWireframe: () => {
        this.isStudioWireframe = !this.isStudioWireframe;
        if (this.studioFigure && typeof this.studioFigure.userData.setWireframe === 'function') {
          this.studioFigure.userData.setWireframe(this.isStudioWireframe);
        }
      },
    });

    this.add(this.hud.esportsCard);
    this.add(this.hud.dockCard);
    this.add(this.hud.draftCard);
    this.add(this.hud.cutInCard);
    this.add(this.hud.studioCard);
    this.add(this.hud.resultCard);

    // 4. 3x3 Tactical Grid UI Component
    this.arenaBoard = new Arena({
      onSlotClick: (slot) => this.handlePlayerSlotClick(slot),
      onSlotHover: (slot) => this.arena.setHoveredSlot(slot),
    });
    this.add(this.arenaBoard.card);

    // 4. Render Initial 3D Figures on 3x3 Grid
    this.renderFormations();

    // 5. Update HUD Display
    this.updateHudState();
  }

  private renderFormations(): void {
    // Clear old unit figures
    for (const fig of this.unitFigures.values()) {
      fig.removeFromParent();
    }
    this.unitFigures.clear();

    // Render Player Squad
    for (const p of this.playerFormation) {
      const valk = getValkyrieById(p.valkyrieId);
      if (!valk) continue;

      const fig = createValkyrie3DFullFigure({
        valkyrieId: valk.id,
        faction: valk.faction,
        tier: 1,
        isEnemy: false,
        hpPercent: 1.0,
        manaPercent: 0.1,
      });

      const pos = getSlotPosition(p.slotIndex, false);
      fig.position.copy(pos);
      // Tactical scale to fit hexagonal platform perfectly (0.65m height)
      fig.scale.set(0.48, 0.48, 0.48);
      // Dynamic 3/4 heroic angle so player can see their face and uniform
      fig.rotation.y = Math.PI * 0.18;
      this.add(fig);
      this.unitFigures.set(`player_${p.slotIndex}`, fig);
    }

    // Render Opponent Squad
    for (const p of this.opponentFormation) {
      const valk = getValkyrieById(p.valkyrieId);
      if (!valk) continue;

      const fig = createValkyrie3DFullFigure({
        valkyrieId: valk.id,
        faction: valk.faction,
        tier: 1,
        isEnemy: true,
        hpPercent: 1.0,
        manaPercent: 0.1,
      });

      const pos = getSlotPosition(p.slotIndex, true);
      fig.position.copy(pos);
      fig.scale.set(0.48, 0.48, 0.48);
      // Face towards player side
      fig.rotation.y = Math.PI;
      this.add(fig);
      this.unitFigures.set(`enemy_${p.slotIndex}`, fig);
    }

    if (this.arenaBoard) {
      this.arenaBoard.updateFormation(this.playerFormation);
    }
  }

  update(): void {
    const now = performance.now();
    const timeSec = now / 1000;

    // Update Arena glowing animations
    this.arena.updateAnimation(timeSec);

    // Countdown Timer in Preparation Phase
    if (this.phase === 'FORMATION_PLACEMENT' || this.phase === 'DRAFT_BUFFS') {
      if (now - this.lastTimerTick >= 1000) {
        this.lastTimerTick = now;
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
          this.updateHudState();
        } else if (this.phase === 'FORMATION_PLACEMENT') {
          // Auto-start battle when timer hits 0
          this.startCombat();
        }
      }
    }

    // Organic 3D Anime Character Idle Animation (Breathing, hair physics, wing flutter, weapon hover)
    for (const [key, fig] of this.unitFigures.entries()) {
      const isEnemy = key.startsWith('enemy');
      const offset = (fig.position.x + fig.position.z) * 2;
      const basePos = getSlotPosition(
        parseInt(key.split('_')[1], 10) as SlotIndex,
        isEnemy
      );

      // 1. Organic Anime Breathing & Subtle Spine Levitation
      const humanoid = fig.getObjectByName('HumanoidBody');
      if (humanoid) {
        humanoid.position.y = Math.sin(timeSec * 2.2 + offset) * 0.012;
      }

      const torso = fig.getObjectByName('Torso');
      if (torso) {
        const breath = 1.0 + Math.sin(timeSec * 2.5 + offset) * 0.016;
        torso.scale.set(breath, 1.0, breath);
      }

      // 2. Dynamic Anime Hair Sway (Twintails swaying in air current)
      const leftTail = fig.getObjectByName('LeftTwintail');
      const rightTail = fig.getObjectByName('RightTwintail');
      if (leftTail) leftTail.rotation.z = Math.sin(timeSec * 2.8 + offset) * 0.08;
      if (rightTail) rightTail.rotation.z = -Math.sin(timeSec * 2.8 + offset) * 0.08;

      // 3. 3D Cyber Wings Flutter
      const wings = fig.getObjectByName('CyberWings');
      if (wings) {
        wings.rotation.y = Math.sin(timeSec * 2.0 + offset) * 0.08;
      }

      // 4. Floating Signature 3D Weapon Bobbing & Gentle Angle
      const weapon = fig.getObjectByName('SignatureWeapon');
      if (weapon) {
        weapon.position.y = 0.55 + Math.sin(timeSec * 2.0 + offset) * 0.025;
        weapon.rotation.y = Math.sin(timeSec * 1.6 + offset) * 0.22;
      }

      // 5. Floating Faction Halo Rotation
      const halo = fig.getObjectByName('Halo');
      if (halo) {
        halo.rotation.z = timeSec * 0.5;
      }

      // 6. Tier 3 Climax Aura Rotation
      const climaxAura = fig.getObjectByName('ClimaxAura');
      if (climaxAura) {
        climaxAura.rotation.z = -timeSec * 1.5;
      }

      // 7. Pedestal Orbiting Nodes Spin
      const orbitNodes = fig.getObjectByName('OrbitNodes');
      if (orbitNodes) {
        orbitNodes.rotation.y = timeSec * 1.2;
      }
    }

    // Studio 3D Anime Figure Animation (Full 360 showcase, breathing & hair physics)
    if (this.studioFigure && this.studioFigure.visible) {
      this.studioFigure.rotation.y += 0.008;

      const studioHumanoid = this.studioFigure.getObjectByName('HumanoidBody');
      if (studioHumanoid) {
        studioHumanoid.position.y = Math.sin(timeSec * 2.5) * 0.015;
      }

      const studioTorso = this.studioFigure.getObjectByName('Torso');
      if (studioTorso) {
        const breath = 1.0 + Math.sin(timeSec * 2.8) * 0.018;
        studioTorso.scale.set(breath, 1.0, breath);
      }

      const studioLeftTail = this.studioFigure.getObjectByName('LeftTwintail');
      const studioRightTail = this.studioFigure.getObjectByName('RightTwintail');
      if (studioLeftTail) studioLeftTail.rotation.z = Math.sin(timeSec * 3.0) * 0.1;
      if (studioRightTail) studioRightTail.rotation.z = -Math.sin(timeSec * 3.0) * 0.1;

      const studioWings = this.studioFigure.getObjectByName('CyberWings');
      if (studioWings) {
        studioWings.rotation.y = Math.sin(timeSec * 2.0) * 0.12;
      }

      const studioHalo = this.studioFigure.getObjectByName('Halo');
      if (studioHalo) studioHalo.rotation.z = timeSec * 0.6;

      const studioWeapon = this.studioFigure.getObjectByName('SignatureWeapon');
      if (studioWeapon) {
        studioWeapon.position.y = 0.55 + Math.sin(timeSec * 2.2) * 0.035;
        studioWeapon.rotation.y = Math.sin(timeSec * 1.8) * 0.3;
      }

      const studioAura = this.studioFigure.getObjectByName('ClimaxAura');
      if (studioAura) studioAura.rotation.z = -timeSec * 1.5;

      const studioNodes = this.studioFigure.getObjectByName('OrbitNodes');
      if (studioNodes) studioNodes.rotation.y = timeSec * 1.5;
    }

    // Process Combat Engine Ticks (20Hz = 50ms)
    if (this.phase === 'COMBAT_SIMULATION' && this.combatEngine && !this.combatEngine.isEnded) {
      if (now - this.lastCombatTickTime >= 50) {
        this.lastCombatTickTime = now;
        const tickResult = this.combatEngine.tick();
        this.processCombatTick(tickResult);
      }
    }
  }

  private processCombatTick(result: CombatTickResult): void {
    if (!this.combatEngine) return;

    // Show Ultimate Cut-In Banner if triggered
    if (result.cutIn) {
      this.hud.showClimaxCutIn(result.cutIn);
    }

    // Update 3D unit representations based on combat engine state
    for (const unit of this.combatEngine.units) {
      const figKey = `${unit.ownerId === 'player' ? 'player' : 'enemy'}_${unit.slotIndex}`;
      const fig = this.unitFigures.get(figKey);
      if (!fig) continue;

      if (!unit.isAlive) {
        fig.visible = false;
        continue;
      }

      // Lunging attack animation offset
      const isEnemy = unit.ownerId === 'opponent';
      const basePos = getSlotPosition(unit.slotIndex, isEnemy);
      const lungeDir = isEnemy ? 1 : -1;
      fig.position.z = basePos.z + unit.lungeOffset * lungeDir;

      // Hit reaction shake
      if (unit.hitReaction > 0) {
        fig.position.x = basePos.x + (Math.random() - 0.5) * unit.hitReaction * 0.1;
      } else {
        fig.position.x = basePos.x;
      }

      // Update Floating Health & Mana Bars
      const hudBars = fig.getObjectByName('HudBars');
      if (hudBars) {
        hudBars.removeFromParent();
        const nextBars = createFloatingBars(
          unit.hp / unit.valkyrie.stats.maxHp,
          unit.mana / 100,
          isEnemy
        );
        nextBars.name = 'HudBars';
        fig.add(nextBars);
      }
    }

    // Handle Combat End
    if (result.isCombatEnded && result.winner) {
      this.phase = 'ROUND_RESULT';
      if (result.winner === 'player') {
        this.playerWins++;
      } else {
        this.opponentWins++;
      }

      const targetWins = this.matchFormat === 'BO5' ? 3 : 2;
      const isFinal = this.playerWins >= targetWins || this.opponentWins >= targetWins;
      this.hud.showRoundResult(result.winner, isFinal);
      this.updateHudState();
    }
  }

  onSelectStart(event: any): void {
    const intersection = event.intersection;
    if (!intersection) return;

    // Check if player clicked one of the 3x3 slot hitboxes
    for (const hitbox of this.arena.slotHitboxes) {
      if (event.target === hitbox || intersection.object === hitbox) {
        const { slotIndex, isEnemy } = hitbox.userData as { slotIndex: SlotIndex; isEnemy: boolean };
        if (!isEnemy) {
          this.handlePlayerSlotClick(slotIndex);
        }
        return;
      }
    }
  }

  private handlePlayerSlotClick(slotIndex: SlotIndex): void {
    if (this.phase !== 'FORMATION_PLACEMENT') return;

    soundManager.playSelectUnit();
    this.selectedSlotIndex = slotIndex;
    this.arena.setSelectedSlot(slotIndex);
    if (this.arenaBoard) {
      this.arenaBoard.setSelectedSlot(slotIndex);
    }

    const occupant = this.playerFormation.find((p) => p.slotIndex === slotIndex);
    const valk = occupant ? getValkyrieById(occupant.valkyrieId) : undefined;
    this.hud.setSelectedSlotDisplay(slotIndex, valk?.name);
  }

  private placeValkyrieAtSelectedSlot(valkyrieId: string): void {
    if (this.phase !== 'FORMATION_PLACEMENT') return;

    if (this.selectedSlotIndex === null) {
      // Find first empty slot or default to slot 0
      const occupied = new Set(this.playerFormation.map((p) => p.slotIndex));
      for (let s = 0; s < 9; s++) {
        if (!occupied.has(s as SlotIndex)) {
          this.selectedSlotIndex = s as SlotIndex;
          break;
        }
      }
      if (this.selectedSlotIndex === null) this.selectedSlotIndex = 0;
      this.arena.setSelectedSlot(this.selectedSlotIndex);
    }

    const slot = this.selectedSlotIndex;
    // Remove if this valkyrie was in another slot
    let next = this.playerFormation.filter((p) => p.valkyrieId !== valkyrieId);
    // Replace slot occupant
    next = next.filter((p) => p.slotIndex !== slot);
    next.push({ valkyrieId, slotIndex: slot });

    this.playerFormation = next;
    soundManager.playPlaceUnit();
    this.renderFormations();

    const valk = getValkyrieById(valkyrieId);
    this.hud.setSelectedSlotDisplay(slot, valk?.name);
  }

  private startCombat(): void {
    if (this.playerFormation.length === 0) return;

    this.phase = 'COMBAT_SIMULATION';
    this.arena.setSelectedSlot(null);
    if (this.arenaBoard) {
      this.arenaBoard.setSelectedSlot(null);
    }
    this.selectedSlotIndex = null;
    this.hud.setSelectedSlotDisplay(null);
    this.updateHudState();

    soundManager.playClick();
    this.combatEngine = new CombatEngine(
      this.playerFormation,
      this.opponentFormation,
      this.activeBuffModifiers
    );
    this.lastCombatTickTime = performance.now();
  }

  private openDraft(): void {
    this.phase = 'DRAFT_BUFFS';
    this.updateHudState();
    const buffs = getRandomDraftBuffs(3);
    this.hud.showDraftBuffs(buffs);
  }

  private applyBuff(buff: BuffDefinition): void {
    if (buff.statBoost?.attackPercent) {
      this.activeBuffModifiers.attackMult += buff.statBoost.attackPercent / 100;
    }
    if (buff.statBoost?.hpPercent) {
      this.activeBuffModifiers.hpMult += buff.statBoost.hpPercent / 100;
    }
    if (buff.statBoost?.armorFlat) {
      this.activeBuffModifiers.armorAdd += buff.statBoost.armorFlat;
    }

    this.phase = 'FORMATION_PLACEMENT';
    this.updateHudState();
    this.renderFormations();
  }

  private openStudio(): void {
    const valk = getValkyrieById(this.studioValkyrieId) ?? VALKYRIE_ROSTER[0];
    this.hud.showStudioValkyrie(valk);
    this.updateStudioFigure(valk.id, this.studioTier);
  }

  private closeStudio(): void {
    if (this.studioFigure) {
      this.studioFigure.visible = false;
    }
  }

  private updateStudioFigure(valkyrieId: string, tier: ClothDamageTier): void {
    this.studioValkyrieId = valkyrieId;
    this.studioTier = tier;

    if (this.studioFigure) {
      this.studioFigure.removeFromParent();
      this.studioFigure = null;
    }

    const valk = getValkyrieById(valkyrieId);
    if (!valk) return;

    this.studioFigure = createValkyrie3DFullFigure({
      valkyrieId: valk.id,
      faction: valk.faction,
      tier,
      isEnemy: false,
      hpPercent: tier === 1 ? 1.0 : tier === 2 ? 0.5 : 0.2,
      manaPercent: tier === 3 ? 1.0 : 0.4,
    });

    // Position in front of the studio card
    this.studioFigure.position.set(-0.25, 1.15, -1.35);
    this.studioFigure.scale.set(0.85, 0.85, 0.85);
    if (this.isStudioWireframe && typeof this.studioFigure.userData.setWireframe === 'function') {
      this.studioFigure.userData.setWireframe(true);
    }
    this.add(this.studioFigure);
  }

  private applyPreset(presetType: TacticalPresetType): void {
    if (this.phase !== 'FORMATION_PLACEMENT') return;
    const preset = TACTICAL_PRESETS[presetType];
    if (preset) {
      this.playerFormation = [...preset];
      this.renderFormations();
      this.arena.setSelectedSlot(null);
      if (this.arenaBoard) {
        this.arenaBoard.setSelectedSlot(null);
      }
      this.selectedSlotIndex = null;
      this.hud.setSelectedSlotDisplay(null);
    }
  }

  private clearFormation(): void {
    if (this.phase !== 'FORMATION_PLACEMENT') return;
    this.playerFormation = [];
    this.renderFormations();
    this.arena.setSelectedSlot(null);
    if (this.arenaBoard) {
      this.arenaBoard.setSelectedSlot(null);
    }
    this.selectedSlotIndex = null;
    this.hud.setSelectedSlotDisplay(null);
  }

  private nextRound(): void {
    const targetWins = this.matchFormat === 'BO5' ? 3 : 2;
    if (this.playerWins >= targetWins || this.opponentWins >= targetWins) {
      this.resetMatch();
      return;
    }

    this.phase = 'FORMATION_PLACEMENT';
    this.timerSeconds = 30;
    this.combatEngine = null;
    this.renderFormations();
    this.updateHudState();
  }

  private resetMatch(): void {
    this.playerWins = 0;
    this.opponentWins = 0;
    this.phase = 'FORMATION_PLACEMENT';
    this.timerSeconds = 30;
    this.combatEngine = null;
    this.activeBuffModifiers = { attackMult: 1.0, hpMult: 1.0, armorAdd: 0 };
    this.applyPreset('VANGUARD');
    this.updateHudState();
  }

  private updateHudState(): void {
    this.hud.updateMatchState(
      this.phase,
      this.playerWins,
      this.opponentWins,
      this.matchFormat,
      this.timerSeconds
    );
  }
}

// XR Blocks Options & Bootstrapping
const options = new xb.Options();
options.setAppTitle('Valkyrie Protocol: Zero');
options.setAppDescription(
  'Tactical 3x3 Anime Cyberpunk Auto-Battler with 27 Valkyries, 12D Dynamic Buffs, and 3D Arena in XR Blocks.'
);
options.enableHands();
options.enableReticles();
options.hands.visualization = true;

xb.add(new ValkyrieScene());
xb.init(options);
