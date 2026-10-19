import { describe, expect, it } from 'vitest';
import { CombatEngine } from '../engine/combat-engine.js';
import { VectorBuffSelectionService } from '../services/vector-buff-selection.service.js';

describe('VectorBuffSelectionService 12D Engine', () => {
  it('loads catalog and selects 9 personalized buffs based on history', () => {
    const service = new VectorBuffSelectionService();
    const allBuffs = service.getAllBuffs();

    expect(allBuffs.length).toBeGreaterThan(0);

    const playerBuffIds = ['BUFF-001'];
    const opponentBuffIds = ['BUFF-002'];
    const selected = service.selectDraftBuffs(playerBuffIds, opponentBuffIds, 1);

    expect(selected.length).toBe(9);

    // Verify all selected IDs are unique
    const uniqueIds = new Set(selected.map((b) => b.id));
    expect(uniqueIds.size).toBe(9);
  });
});

describe('20Hz Combat Engine Simulation', () => {
  it('runs deterministic combat between two teams until victory', () => {
    const p1Formation = [
      { valkyrieId: 'VALK-01', slotIndex: 1 as const },
      { valkyrieId: 'VALK-02', slotIndex: 0 as const }
    ];
    const p2Formation = [
      { valkyrieId: 'VALK-10', slotIndex: 1 as const },
      { valkyrieId: 'VALK-11', slotIndex: 0 as const }
    ];

    const engine = new CombatEngine('player_1', p1Formation, 'player_2', p2Formation);

    let isFinished = false;
    let winnerId: string | null = null;
    let ticks = 0;

    while (!isFinished && ticks < 1200) {
      const step = engine.stepTick();
      isFinished = step.isFinished;
      winnerId = step.winnerId;
      ticks += 1;
    }

    expect(isFinished).toBe(true);
    expect(winnerId).toBeDefined();
    expect(ticks).toBeGreaterThan(0);

    const summary = engine.getSummary(winnerId);
    expect(summary.totalDamageDealt).toBeGreaterThan(0);
  });
});
