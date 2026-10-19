import { describe, expect, it } from 'vitest';
import {
  calculateDamageMultiplier,
  calculateNetDamage,
  getClothDamageTier,
  cosineSimilarity12D,
  dotProduct12D,
  magnitude12D,
  normalize12D,
  ZERO_VECTOR_12D,
  Vector12D,
  GRID_SLOT_BEHAVIORS,
  validateFormation,
  VALKYRIE_ROSTER,
  getValkyrieById,
  TOTAL_SLOTS,
  MAX_UNITS_PER_TEAM
} from '../index.js';

describe('12D Vector Mathematical Operations', () => {
  it('correctly calculates dot product for identical and orthogonal vectors', () => {
    const vecA: Vector12D = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const vecB: Vector12D = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const vecC: Vector12D = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    expect(dotProduct12D(vecA, vecB)).toBe(0);
    expect(dotProduct12D(vecA, vecC)).toBe(2);
  });

  it('safely handles zero vectors and prevents division by zero in cosine similarity', () => {
    const testVec: Vector12D = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const similarity = cosineSimilarity12D(ZERO_VECTOR_12D, testVec);

    expect(similarity).toBe(0);
    expect(Number.isNaN(similarity)).toBe(false);
  });

  it('normalizes vector to unit length', () => {
    const rawVec: Vector12D = [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const norm = normalize12D(rawVec);

    expect(magnitude12D(norm)).toBeCloseTo(1.0, 5);
  });
});

describe('Hyperbolic Armor & Combat Math', () => {
  it('calculates damage multiplier with defense clamp at -80', () => {
    // Normal armor = 100 => 100 / (100 + 100) = 0.5
    expect(calculateDamageMultiplier(100)).toBe(0.5);

    // Armor = 0 => 100 / 100 = 1.0
    expect(calculateDamageMultiplier(0)).toBe(1.0);

    // Negative armor clamped at -80 => 100 / (100 - 80) = 5.0
    expect(calculateDamageMultiplier(-80)).toBe(5.0);
    expect(calculateDamageMultiplier(-200)).toBe(5.0);
  });

  it('calculates net damage with defense and critical hit', () => {
    const baseAtk = 100;
    const defense = 100; // 50% reduction
    const normalDmg = calculateNetDamage(baseAtk, defense, false);
    const critDmg = calculateNetDamage(baseAtk, defense, true, 1.5);

    expect(normalDmg).toBe(50);
    expect(critDmg).toBe(75);
  });

  it('evaluates Cloth / Battle Damage Tiers correctly', () => {
    expect(getClothDamageTier(800, 1000)).toBe(1); // 80% >= 70% => Tier 1: Pristine
    expect(getClothDamageTier(500, 1000)).toBe(2); // 50% => Tier 2: Battle-Torn
    expect(getClothDamageTier(200, 1000)).toBe(3); // 20% < 30% => Tier 3: Critical Burst
    expect(getClothDamageTier(0, 1000)).toBe(3);   // 0% => Tier 3
  });
});

describe('3x3 Grid & Tactical Formation Rules', () => {
  it('contains exactly 9 slots with appropriate row behaviors', () => {
    expect(Object.keys(GRID_SLOT_BEHAVIORS).length).toBe(TOTAL_SLOTS);

    // Frontline: Slots 0, 1, 2 have manaGainOnDamageBonus = 0.15
    expect(GRID_SLOT_BEHAVIORS[0].rowType).toBe('FRONTLINE');
    expect(GRID_SLOT_BEHAVIORS[1].manaGainOnDamageBonus).toBe(0.15);

    // Backline: Slots 6, 7, 8 have rangeBonus = 1
    expect(GRID_SLOT_BEHAVIORS[6].rowType).toBe('BACKLINE');
    expect(GRID_SLOT_BEHAVIORS[7].rangeBonus).toBe(1);
  });

  it('validates formation rejecting over 6 units or duplicate slots', () => {
    const validFormation = [
      { valkyrieId: 'VALK-01', slotIndex: 0 as const },
      { valkyrieId: 'VALK-02', slotIndex: 1 as const },
      { valkyrieId: 'VALK-03', slotIndex: 4 as const }
    ];
    expect(validateFormation(validFormation).isValid).toBe(true);

    const duplicateSlotFormation = [
      { valkyrieId: 'VALK-01', slotIndex: 0 as const },
      { valkyrieId: 'VALK-02', slotIndex: 0 as const }
    ];
    expect(validateFormation(duplicateSlotFormation).isValid).toBe(false);

    // 7 units (over MAX_UNITS_PER_TEAM = 6)
    const overLimitFormation = [
      { valkyrieId: 'VALK-01', slotIndex: 0 as const },
      { valkyrieId: 'VALK-02', slotIndex: 1 as const },
      { valkyrieId: 'VALK-03', slotIndex: 2 as const },
      { valkyrieId: 'VALK-04', slotIndex: 3 as const },
      { valkyrieId: 'VALK-05', slotIndex: 4 as const },
      { valkyrieId: 'VALK-06', slotIndex: 5 as const },
      { valkyrieId: 'VALK-07', slotIndex: 6 as const }
    ];
    expect(validateFormation(overLimitFormation).isValid).toBe(false);
  });
});

describe('27 Valkyries Roster Specs', () => {
  it('contains exactly 27 unique Valkyries across 3 factions', () => {
    expect(VALKYRIE_ROSTER.length).toBe(27);

    const uniqueIds = new Set(VALKYRIE_ROSTER.map((v) => v.id));
    expect(uniqueIds.size).toBe(27);

    const neoValhalla = VALKYRIE_ROSTER.filter((v) => v.faction === 'NEO_VALHALLA');
    const abyssalEden = VALKYRIE_ROSTER.filter((v) => v.faction === 'ABYSSAL_EDEN');
    const solDynasty = VALKYRIE_ROSTER.filter((v) => v.faction === 'SOL_DYNASTY');

    expect(neoValhalla.length).toBe(9);
    expect(abyssalEden.length).toBe(9);
    expect(solDynasty.length).toBe(9);
  });

  it('retrieves Valkyrie by ID with valid stats and battle damage meta', () => {
    const valk01 = getValkyrieById('VALK-01');
    expect(valk01).toBeDefined();
    expect(valk01?.name).toBe('Freyja');
    expect(valk01?.stats.maxHp).toBe(1200);
    expect(valk01?.battleDamage.tier1Description).toBeDefined();
    expect(valk01?.battleDamage.tier3Description).toBeDefined();
  });
});
