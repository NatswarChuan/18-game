import {
  ClothDamageTier,
  CombatEventItem,
  CombatUnitState,
  SlotIndex,
  UltimateCutInData,
  UnitPlacement,
  ValkyrieDefinition,
} from '../types.js';
import { getValkyrieById } from '../data/roster.js';
import { soundManager } from '../utils/sound.js';

export interface CombatTickResult {
  events: CombatEventItem[];
  cutIn: UltimateCutInData | null;
  isCombatEnded: boolean;
  winner: 'player' | 'opponent' | null;
}

export class CombatEngine {
  public units: CombatUnitState[] = [];
  public currentTick = 0;
  public isEnded = false;
  public winner: 'player' | 'opponent' | null = null;

  constructor(
    playerFormation: readonly UnitPlacement[],
    opponentFormation: readonly UnitPlacement[],
    playerBuffModifiers?: { attackMult?: number; hpMult?: number; armorAdd?: number }
  ) {
    this.initTeam(playerFormation, 'player', playerBuffModifiers);
    this.initTeam(opponentFormation, 'opponent');
  }

  private initTeam(
    formation: readonly UnitPlacement[],
    ownerId: 'player' | 'opponent',
    buffs?: { attackMult?: number; hpMult?: number; armorAdd?: number }
  ): void {
    const atkMult = buffs?.attackMult ?? 1.0;
    const hpMult = buffs?.hpMult ?? 1.0;
    const armorAdd = buffs?.armorAdd ?? 0;

    formation.forEach((placement, idx) => {
      const valk = getValkyrieById(placement.valkyrieId);
      if (!valk) return;

      const maxHp = Math.round(valk.stats.maxHp * hpMult);
      const attack = Math.round(valk.stats.attack * atkMult);
      const armor = valk.stats.armor + armorAdd;

      const unit: CombatUnitState = {
        id: `${ownerId}_${placement.slotIndex}_${valk.id}`,
        ownerId,
        valkyrie: {
          ...valk,
          stats: {
            ...valk.stats,
            maxHp,
            attack,
            armor,
          },
        },
        slotIndex: placement.slotIndex,
        hp: maxHp,
        mana: 10 + Math.floor(Math.random() * 20),
        clothDamageTier: 1,
        attackCooldownTicks: Math.floor(20 / valk.stats.attackSpeed) + (idx % 5),
        isAlive: true,
        isCastingUltimate: false,
        targetUnitId: null,
        lungeOffset: 0,
        hitReaction: 0,
      };

      this.units.push(unit);
    });
  }

  public tick(): CombatTickResult {
    if (this.isEnded) {
      return { events: [], cutIn: null, isCombatEnded: true, winner: this.winner };
    }

    this.currentTick++;
    const events: CombatEventItem[] = [];
    let cutIn: UltimateCutInData | null = null;

    // Decay animation offsets
    for (const u of this.units) {
      if (u.lungeOffset > 0) u.lungeOffset = Math.max(0, u.lungeOffset - 0.15);
      if (u.hitReaction > 0) u.hitReaction = Math.max(0, u.hitReaction - 0.2);
    }

    const aliveUnits = this.units.filter((u) => u.isAlive);
    const alivePlayers = aliveUnits.filter((u) => u.ownerId === 'player');
    const aliveOpponents = aliveUnits.filter((u) => u.ownerId === 'opponent');

    if (alivePlayers.length === 0 || aliveOpponents.length === 0) {
      this.isEnded = true;
      this.winner = alivePlayers.length > 0 ? 'player' : 'opponent';
      return { events, cutIn, isCombatEnded: true, winner: this.winner };
    }

    // Process unit turns
    for (const unit of aliveUnits) {
      if (!unit.isAlive) continue;

      // 1. Check for Climax Ultimate
      if (unit.mana >= unit.valkyrie.ultimate.energyCost && !unit.isCastingUltimate) {
        unit.mana = 0;
        unit.isCastingUltimate = true;

        const enemies = unit.ownerId === 'player' ? aliveOpponents : alivePlayers;
        if (enemies.length > 0) {
          const ultDamage = Math.round(unit.valkyrie.stats.attack * 2.8);

          // AoE or Primary target
          enemies.forEach((enemy) => {
            const mitigation = 100 / (100 + Math.max(0, enemy.valkyrie.stats.armor));
            const dmg = Math.max(30, Math.round(ultDamage * mitigation));
            this.applyDamage(enemy, dmg, events);
          });

          events.push({
            eventType: 'ULTIMATE',
            sourceEntityId: unit.id,
            description: `${unit.valkyrie.name} phóng Tuyệt Kỹ: [${unit.valkyrie.ultimate.name}]!`,
          });

          cutIn = {
            valkyrie: unit.valkyrie,
            voiceLine: unit.valkyrie.battleDamage.battleVoiceLine,
            tier: unit.clothDamageTier,
            timestamp: Date.now(),
          };

          unit.lungeOffset = 0.4;
          soundManager.playUltimate();
        }

        unit.isCastingUltimate = false;
        continue;
      }

      // 2. Decrement attack cooldown
      unit.attackCooldownTicks--;
      if (unit.attackCooldownTicks <= 0) {
        // Reset cooldown: 20 ticks / attackSpeed
        unit.attackCooldownTicks = Math.max(12, Math.round(20 / unit.valkyrie.stats.attackSpeed));

        // Find best target
        const enemies = (unit.ownerId === 'player' ? aliveOpponents : alivePlayers).filter((e) => e.isAlive);
        if (enemies.length === 0) continue;

        const target = this.selectTarget(unit, enemies);
        if (!target) continue;

        unit.targetUnitId = target.id;
        unit.lungeOffset = 0.25;

        // Calculate damage
        const isCrit = Math.random() < 0.22;
        const rawDamage = unit.valkyrie.stats.attack * (isCrit ? 1.75 : 1.0);
        const mitigation = 100 / (100 + Math.max(0, target.valkyrie.stats.armor));
        const netDmg = Math.max(15, Math.round(rawDamage * mitigation));

        events.push({
          eventType: 'ATTACK',
          sourceEntityId: unit.id,
          targetEntityId: target.id,
          value: netDmg,
        });

        this.applyDamage(target, netDmg, events);

        // Attacker gains mana
        unit.mana = Math.min(100, unit.mana + 15);

        if (isCrit) {
          soundManager.playCrit();
        } else {
          soundManager.playHit();
        }
      }
    }

    // Check end condition again
    const remainingPlayers = this.units.filter((u) => u.isAlive && u.ownerId === 'player');
    const remainingOpponents = this.units.filter((u) => u.isAlive && u.ownerId === 'opponent');

    if (remainingPlayers.length === 0 || remainingOpponents.length === 0) {
      this.isEnded = true;
      this.winner = remainingPlayers.length > 0 ? 'player' : 'opponent';
    }

    return {
      events,
      cutIn,
      isCombatEnded: this.isEnded,
      winner: this.winner,
    };
  }

  private selectTarget(attacker: CombatUnitState, enemies: CombatUnitState[]): CombatUnitState | null {
    if (enemies.length === 0) return null;

    // Infiltrators target lowest HP
    if (attacker.valkyrie.role === 'MIDLINE_INFILTRATOR') {
      return enemies.slice().sort((a, b) => a.hp - b.hp)[0];
    }

    // Standard targeting: lowest row index (frontline first), closest column
    const attackerCol = attacker.slotIndex % 3;
    const sorted = enemies.slice().sort((a, b) => {
      const rowA = Math.floor(a.slotIndex / 3);
      const rowB = Math.floor(b.slotIndex / 3);
      if (rowA !== rowB) return rowA - rowB;
      const colDiffA = Math.abs((a.slotIndex % 3) - attackerCol);
      const colDiffB = Math.abs((b.slotIndex % 3) - attackerCol);
      return colDiffA - colDiffB;
    });

    return sorted[0];
  }

  private applyDamage(target: CombatUnitState, amount: number, events: CombatEventItem[]): void {
    target.hp = Math.max(0, target.hp - amount);
    target.hitReaction = 0.3;

    // Defender gains mana when struck
    target.mana = Math.min(100, target.mana + 10);

    events.push({
      eventType: 'DAMAGE',
      targetEntityId: target.id,
      value: amount,
    });

    // Check cloth damage thresholds
    const hpRatio = target.hp / target.valkyrie.stats.maxHp;
    if (hpRatio < 0.30 && target.clothDamageTier < 3) {
      target.clothDamageTier = 3;
      events.push({
        eventType: 'CLOTH_TORN',
        targetEntityId: target.id,
        clothTier: 3,
        description: `⚠️ [CẢNH BÁO CLIMAX] ${target.valkyrie.name} rách giáp tầng 3 (Overdrive Burst)!`,
      });
      soundManager.playClothTorn();
    } else if (hpRatio < 0.70 && target.clothDamageTier < 2) {
      target.clothDamageTier = 2;
      events.push({
        eventType: 'CLOTH_TORN',
        targetEntityId: target.id,
        clothTier: 2,
        description: `⚡ ${target.valkyrie.name} rách giáp tầng 2 (Battle-Torn)!`,
      });
      soundManager.playClothTorn();
    }

    // Check death
    if (target.hp <= 0 && target.isAlive) {
      target.isAlive = false;
      events.push({
        eventType: 'DEATH',
        targetEntityId: target.id,
        description: `💀 ${target.valkyrie.name} đã ngã xuống!`,
      });
    }
  }
}
