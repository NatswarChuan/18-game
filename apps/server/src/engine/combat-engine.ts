import {
  calculateNetDamage,
  ClothDamageTier,
  CombatEntitySnapshot,
  CombatEventItem,
  getClothDamageTier,
  getValkyrieById,
  GRID_SLOT_BEHAVIORS,
  MAX_MANA,
  SlotIndex,
  TICK_RATE_HZ,
  UnitPlacement,
  ValkyrieDefinition
} from '@valkyrie/shared-domain';

export interface CombatUnitState {
  readonly id: string;
  readonly ownerId: string;
  readonly valkyrie: ValkyrieDefinition;
  readonly slotIndex: SlotIndex;
  hp: number;
  mana: number;
  clothDamageTier: ClothDamageTier;
  attackCooldownTicks: number;
  isAlive: boolean;
  isCastingUltimate: boolean;
}

export interface CombatSimulationResult {
  readonly winnerPlayerId: string | null;
  readonly totalTicks: number;
  readonly finalEntities: readonly CombatEntitySnapshot[];
  readonly totalDamageDealt: number;
  readonly totalClothTearTriggers: number;
  readonly totalUltimateCasts: number;
}

export class CombatEngine {
  private readonly units: CombatUnitState[] = [];
  private currentTick = 0;
  private totalDamage = 0;
  private totalClothTears = 0;
  private totalUltimates = 0;

  public constructor(
    private readonly player1Id: string,
    private readonly player1Formation: readonly UnitPlacement[],
    private readonly player2Id: string,
    private readonly player2Formation: readonly UnitPlacement[],
    private readonly onSnapshot?: (
      tick: number,
      entities: readonly CombatEntitySnapshot[],
      events: readonly CombatEventItem[]
    ) => void
  ) {
    this.initializeTeam(this.player1Id, this.player1Formation, 'p1');
    this.initializeTeam(this.player2Id, this.player2Formation, 'p2');
  }

  private initializeTeam(ownerId: string, formation: readonly UnitPlacement[], prefix: string): void {
    formation.forEach((placement, idx) => {
      const valk = getValkyrieById(placement.valkyrieId);
      if (!valk) return;

      const initialHp = valk.stats.maxHp;
      const initialTier = getClothDamageTier(initialHp, initialHp);

      this.units.push({
        id: `${prefix}_${valk.id}_${idx}`,
        ownerId,
        valkyrie: valk,
        slotIndex: placement.slotIndex,
        hp: initialHp,
        mana: 0,
        clothDamageTier: initialTier,
        attackCooldownTicks: Math.floor(TICK_RATE_HZ / valk.stats.attackSpeed),
        isAlive: true,
        isCastingUltimate: false
      });
    });
  }

  /**
   * Runs single tick (50ms step) of the simulation.
   */
  public stepTick(): { isFinished: boolean; winnerId: string | null; events: CombatEventItem[] } {
    this.currentTick += 1;
    const events: CombatEventItem[] = [];

    // Process actions for living units
    const livingUnits = this.units.filter((u) => u.isAlive);

    for (const unit of livingUnits) {
      if (!unit.isAlive) continue;

      // 1. Check if Ultimate ready
      if (unit.mana >= MAX_MANA) {
        this.castUltimate(unit, events);
        continue;
      }

      // 2. Regular auto-attack cooldown
      if (unit.attackCooldownTicks > 0) {
        unit.attackCooldownTicks -= 1;
        continue;
      }

      // 3. Perform attack
      this.performAttack(unit, events);
      // Reset attack cooldown based on attack speed + slot speed bonus
      const slotBonus = GRID_SLOT_BEHAVIORS[unit.slotIndex].attackSpeedBonus;
      const effectiveSpeed = unit.valkyrie.stats.attackSpeed * (1 + slotBonus);
      unit.attackCooldownTicks = Math.max(1, Math.round(TICK_RATE_HZ / effectiveSpeed));
    }

    // Check victory condition
    const p1Living = this.units.filter((u) => u.ownerId === this.player1Id && u.isAlive);
    const p2Living = this.units.filter((u) => u.ownerId === this.player2Id && u.isAlive);

    let isFinished = false;
    let winnerId: string | null = null;

    if (p1Living.length === 0 && p2Living.length === 0) {
      isFinished = true;
      winnerId = null; // Draw
    } else if (p1Living.length === 0) {
      isFinished = true;
      winnerId = this.player2Id;
    } else if (p2Living.length === 0) {
      isFinished = true;
      winnerId = this.player1Id;
    } else if (this.currentTick >= 1200) {
      // Timeout 60s
      isFinished = true;
      // Winner by highest total remaining HP
      const p1Hp = p1Living.reduce((sum, u) => sum + u.hp, 0);
      const p2Hp = p2Living.reduce((sum, u) => sum + u.hp, 0);
      winnerId = p1Hp > p2Hp ? this.player1Id : this.player2Id;
    }

    // Emit snapshot if callback provided
    if (this.onSnapshot) {
      const snapshots = this.createSnapshots();
      this.onSnapshot(this.currentTick, snapshots, events);
    }

    return { isFinished, winnerId, events };
  }

  private performAttack(attacker: CombatUnitState, events: CombatEventItem[]): void {
    const enemyTeam = this.units.filter((u) => u.ownerId !== attacker.ownerId && u.isAlive);
    if (enemyTeam.length === 0) return;

    // Pick target: prioritized by targetPriorityWeight in slot behavior
    const target = this.selectTarget(enemyTeam);
    if (!target) return;

    // Damage calculation
    const baseAtk = attacker.valkyrie.stats.attack;
    const isCrit = Math.random() < 0.2; // 20% crit chance
    const damage = calculateNetDamage(baseAtk, target.valkyrie.stats.armor, isCrit, 1.5);

    this.applyDamage(target, damage, attacker.id, events);

    // Mana gain: Attacker gets 15 mana
    attacker.mana = Math.min(MAX_MANA, attacker.mana + 15);

    events.push({
      tick: this.currentTick,
      eventType: 'ATTACK',
      sourceEntityId: attacker.id,
      targetEntityId: target.id,
      value: damage,
      message: `${attacker.valkyrie.name} tấn công ${target.valkyrie.name} gây ${damage} sát thương!`
    });
  }

  private selectTarget(enemies: CombatUnitState[]): CombatUnitState | undefined {
    // Sort by target priority (frontline first, then center, then lowest HP)
    return [...enemies].sort((a, b) => {
      const weightA = GRID_SLOT_BEHAVIORS[a.slotIndex].targetPriorityWeight;
      const weightB = GRID_SLOT_BEHAVIORS[b.slotIndex].targetPriorityWeight;
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return a.hp - b.hp;
    })[0];
  }

  private applyDamage(target: CombatUnitState, damage: number, sourceId: string, events: CombatEventItem[]): void {
    target.hp = Math.max(0, target.hp - damage);
    this.totalDamage += damage;

    // Frontline mana bonus on taking damage
    const manaBonus = GRID_SLOT_BEHAVIORS[target.slotIndex].manaGainOnDamageBonus;
    const gainedMana = Math.round(10 * (1 + manaBonus));
    target.mana = Math.min(MAX_MANA, target.mana + gainedMana);

    // Check cloth / battle damage tier progression
    const newTier = getClothDamageTier(target.hp, target.valkyrie.stats.maxHp);
    if (newTier !== target.clothDamageTier) {
      target.clothDamageTier = newTier;
      this.totalClothTears += 1;
      events.push({
        tick: this.currentTick,
        eventType: 'CLOTH_TIER_CHANGED',
        targetEntityId: target.id,
        tier: newTier,
        message: `${target.valkyrie.name} giáp phục chuyển sang trạng thái Tier ${newTier}!`
      });
    }

    // Check defeat
    if (target.hp <= 0) {
      target.isAlive = false;
      events.push({
        tick: this.currentTick,
        eventType: 'UNIT_DEFEATED',
        targetEntityId: target.id,
        sourceEntityId: sourceId,
        message: `${target.valkyrie.name} đã ngã xuống trên chiến trường!`
      });
    }
  }

  private castUltimate(caster: CombatUnitState, events: CombatEventItem[]): void {
    caster.mana = 0;
    caster.isCastingUltimate = true;
    this.totalUltimates += 1;

    const enemyTeam = this.units.filter((u) => u.ownerId !== caster.ownerId && u.isAlive);
    const allyTeam = this.units.filter((u) => u.ownerId === caster.ownerId && u.isAlive);

    // Ultimate effect calculation
    const ultDamage = Math.round(caster.valkyrie.stats.attack * 2.2);

    if (caster.valkyrie.role.includes('SUPPORT') || caster.valkyrie.role.includes('TACTICIAN') || caster.valkyrie.role.includes('ENCHANTER')) {
      // Heal / buff allies
      for (const ally of allyTeam) {
        const healAmt = Math.round(ally.valkyrie.stats.maxHp * 0.35);
        ally.hp = Math.min(ally.valkyrie.stats.maxHp, ally.hp + healAmt);
        ally.clothDamageTier = getClothDamageTier(ally.hp, ally.valkyrie.stats.maxHp);
      }
      events.push({
        tick: this.currentTick,
        eventType: 'ULTIMATE_CAST',
        sourceEntityId: caster.id,
        message: `${caster.valkyrie.name} kích hoạt Tuyệt Kỹ: ${caster.valkyrie.ultimate.name}! Toàn đội hồi phục sinh lực!`
      });
    } else {
      // AOE / Single target attack
      const targets = enemyTeam.slice(0, 3);
      for (const target of targets) {
        this.applyDamage(target, ultDamage, caster.id, events);
      }
      events.push({
        tick: this.currentTick,
        eventType: 'ULTIMATE_CAST',
        sourceEntityId: caster.id,
        value: ultDamage,
        message: `${caster.valkyrie.name} bùng nổ Tuyệt Kỹ: ${caster.valkyrie.ultimate.name}! Gây ${ultDamage} sát thương diện rộng!`
      });
    }

    setTimeout(() => {
      caster.isCastingUltimate = false;
    }, 500);
  }

  public createSnapshots(): CombatEntitySnapshot[] {
    return this.units.map((u) => ({
      id: u.id,
      ownerId: u.ownerId,
      valkyrieId: u.valkyrie.id,
      currentHp: u.hp,
      maxHp: u.valkyrie.stats.maxHp,
      currentMana: u.mana,
      maxMana: MAX_MANA,
      clothDamageTier: u.clothDamageTier,
      slotIndex: u.slotIndex,
      isAlive: u.isAlive,
      isCastingUltimate: u.isCastingUltimate
    }));
  }

  public getSummary(winnerPlayerId: string | null): CombatSimulationResult {
    return {
      winnerPlayerId,
      totalTicks: this.currentTick,
      finalEntities: this.createSnapshots(),
      totalDamageDealt: this.totalDamage,
      totalClothTearTriggers: this.totalClothTears,
      totalUltimateCasts: this.totalUltimates
    };
  }
}
