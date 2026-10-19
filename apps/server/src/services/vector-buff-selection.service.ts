import fs from 'node:fs';
import path from 'node:path';
import {
  BuffDefinition,
  calculateCounterScore12D,
  cosineSimilarity12D,
  magnitude12D,
  normalize12D,
  Vector12D
} from '@valkyrie/shared-domain';

/**
 * Service providing history-dependent 12D Vector kNN Buff Selection for BO3 and BO5 matches.
 * Dịch vụ tuyển chọn 9 Buff theo vector 12 chiều dựa trên lịch sử chiến đấu cho thể thức BO3/BO5.
 */
export class VectorBuffSelectionService {
  private readonly allBuffs: readonly BuffDefinition[];

  public constructor(catalogPath?: string) {
    const resolvedPath = catalogPath ?? path.resolve(process.cwd(), '../../deliverables/phase-3-buff-system/buffs-catalog.json');
    if (fs.existsSync(resolvedPath)) {
      const rawData = fs.readFileSync(resolvedPath, 'utf-8');
      this.allBuffs = JSON.parse(rawData) as BuffDefinition[];
    } else {
      // Fallback empty catalog if running in isolated container without deliverables
      this.allBuffs = [];
    }
  }

  public getAllBuffs(): readonly BuffDefinition[] {
    return this.allBuffs;
  }

  public getBuffById(id: string): BuffDefinition | undefined {
    return this.allBuffs.find((b) => b.id === id);
  }

  /**
   * Calculates accumulated 12D vector from a list of selected buff IDs.
   * Tính toán vector 12 chiều tích lũy từ danh sách ID các buff đã chọn.
   */
  public calculateAccumulatedVector(buffIds: readonly string[]): Vector12D {
    const acc: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (const buffId of buffIds) {
      const buff = this.getBuffById(buffId);
      if (!buff) continue;

      for (let i = 0; i < 12; i += 1) {
        acc[i] = (acc[i] ?? 0) + (buff.weights[i] ?? 0);
      }
    }

    return normalize12D(acc as unknown as Vector12D);
  }

  /**
   * Selects exactly 9 personalized buffs for a player based on history (3 Synergy, 3 Counter, 3 Decisive/Pivot).
   * Tuyển chọn 9 Buffs cá nhân hóa (3 Củng cố - 3 Khắc chế - 3 Đột phá) dựa trên vector lịch sử.
   *
   * @param playerBuffIds - Player accumulated buff IDs / Danh sách buff đã chọn của người chơi
   * @param opponentBuffIds - Opponent accumulated buff IDs / Danh sách buff đã chọn của đối thủ
   * @param roundNumber - Current round number (1..5) / Số thứ tự round hiện tại
   * @returns Array of exactly 9 unique BuffDefinitions / Danh sách chính xác 9 Buff hợp lệ
   */
  public selectDraftBuffs(
    playerBuffIds: readonly string[],
    opponentBuffIds: readonly string[],
    roundNumber: number
  ): readonly BuffDefinition[] {
    const playerVec = this.calculateAccumulatedVector(playerBuffIds);
    const opponentVec = this.calculateAccumulatedVector(opponentBuffIds);
    const chosenSet = new Set(playerBuffIds);

    // Filter available candidates not already owned by player
    const candidates = this.allBuffs.filter((b) => !chosenSet.has(b.id));

    // Target depth progresses with round: round 1 -> depth 1; round 2 -> depth 2; etc.
    const targetDepth = Math.min(5, Math.max(1, roundNumber));
    const depthCandidates = candidates.filter((b) => Math.abs(b.depth - targetDepth) <= 1);
    const pool = depthCandidates.length >= 18 ? depthCandidates : candidates;

    // 1. Top 3 Synergy Buffs (Align with playerVec)
    const synergyCandidates = pool
      .map((buff) => ({
        buff,
        score: cosineSimilarity12D(playerVec, buff.weights)
      }))
      .sort((a, b) => b.score - a.score);

    const selectedSynergy: BuffDefinition[] = [];
    const usedIds = new Set<string>();

    for (const item of synergyCandidates) {
      if (selectedSynergy.length >= 3) break;
      if (!usedIds.has(item.buff.id)) {
        selectedSynergy.push(item.buff);
        usedIds.add(item.buff.id);
      }
    }

    // 2. Top 3 Counter Buffs (Counter opponentVec)
    const counterCandidates = pool
      .map((buff) => ({
        buff,
        score: calculateCounterScore12D(opponentVec, buff.weights)
      }))
      .sort((a, b) => b.score - a.score);

    const selectedCounter: BuffDefinition[] = [];
    for (const item of counterCandidates) {
      if (selectedCounter.length >= 3) break;
      if (!usedIds.has(item.buff.id)) {
        selectedCounter.push(item.buff);
        usedIds.add(item.buff.id);
      }
    }

    // 3. Top 3 Decisive/Pivot Buffs (Orthogonal, high magnitude in unexploited dimensions)
    const pivotCandidates = pool
      .map((buff) => {
        const simPlayer = Math.abs(cosineSimilarity12D(playerVec, buff.weights));
        // High magnitude, low correlation to current build
        const score = magnitude12D(buff.weights) * (1.0 - simPlayer);
        return { buff, score };
      })
      .sort((a, b) => b.score - a.score);

    const selectedPivot: BuffDefinition[] = [];
    for (const item of pivotCandidates) {
      if (selectedPivot.length >= 3) break;
      if (!usedIds.has(item.buff.id)) {
        selectedPivot.push(item.buff);
        usedIds.add(item.buff.id);
      }
    }

    // Combine 3-3-3: 9 Buffs
    const result = [...selectedSynergy, ...selectedCounter, ...selectedPivot];

    // Ensure exactly 9 items even if catalog has edge cases
    if (result.length < 9) {
      for (const buff of candidates) {
        if (result.length >= 9) break;
        if (!usedIds.has(buff.id)) {
          result.push(buff);
          usedIds.add(buff.id);
        }
      }
    }

    return result.slice(0, 9);
  }
}
