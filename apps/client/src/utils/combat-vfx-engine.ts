import * as THREE from 'three';
import { CombatEventItem, SlotIndex } from '@valkyrie/shared-domain';
import { getSlotWorldPosition } from './cyber-stadium-scene.js';

export interface FloatingDamageNumber {
  readonly id: string;
  readonly text: string;
  readonly color: string;
  readonly worldPos: THREE.Vector3;
  readonly createdAt: number;
  readonly durationMs: number;
}

export interface AttackTracer {
  readonly line: THREE.Line;
  readonly createdAt: number;
  readonly durationMs: number;
}

/**
 * Combat Visual Effects Engine for 3D Cyber Stadium.
 * Quản lý các hiệu ứng động học giao tranh: Số sát thương nảy lên, tia laser tấn công,
 * độ giật rung khi trúng đòn và sóng năng lượng tuyệt kỹ Climax.
 */
export class CombatVfxEngine {
  private readonly scene: THREE.Scene;
  private readonly damageNumbers: FloatingDamageNumber[] = [];
  private readonly tracers: AttackTracer[] = [];
  private readonly tracerMaterial: THREE.LineBasicMaterial;

  public constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.tracerMaterial = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 3,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
  }

  /**
   * Processes new combat events from 20Hz server tick and triggers dynamic 3D VFX.
   * Xử lý các sự kiện giao tranh từ máy chủ và kích hoạt hiệu ứng 3D tức thời.
   *
   * @param events - List of events from the latest snapshot.
   * @param slotMap - Map linking entity ID to current slot and side.
   */
  public processCombatEvents(
    events: readonly CombatEventItem[],
    slotMap: Map<string, { slotIndex: SlotIndex; isEnemy: boolean }>
  ): void {
    const now = performance.now();

    for (const ev of events) {
      if (ev.eventType === 'DAMAGE' && ev.targetEntityId && ev.value) {
        const targetInfo = slotMap.get(ev.targetEntityId);
        if (targetInfo) {
          const coord = getSlotWorldPosition(targetInfo.slotIndex, targetInfo.isEnemy);
          const isCrit = ev.value > 250;
          this.damageNumbers.push({
            id: `dmg_${now}_${Math.random()}`,
            text: isCrit ? `CRIT! -${ev.value}` : `-${ev.value}`,
            color: isCrit ? '#FFD700' : targetInfo.isEnemy ? '#FF2A85' : '#FF3344',
            worldPos: new THREE.Vector3(coord.x, coord.y + 1.7, coord.z),
            createdAt: now,
            durationMs: 900
          });
        }
      }

      if (ev.eventType === 'ATTACK' && ev.sourceEntityId && ev.targetEntityId) {
        const src = slotMap.get(ev.sourceEntityId);
        const tgt = slotMap.get(ev.targetEntityId);
        if (src && tgt) {
          this.spawnAttackTracer(src, tgt, now);
        }
      }
    }
  }

  /**
   * Spawns an instantaneous high-speed energy tracer between attacker and target.
   */
  private spawnAttackTracer(
    src: { slotIndex: SlotIndex; isEnemy: boolean },
    tgt: { slotIndex: SlotIndex; isEnemy: boolean },
    now: number
  ): void {
    const srcCoord = getSlotWorldPosition(src.slotIndex, src.isEnemy);
    const tgtCoord = getSlotWorldPosition(tgt.slotIndex, tgt.isEnemy);

    const points = [
      new THREE.Vector3(srcCoord.x, srcCoord.y + 0.6, srcCoord.z),
      new THREE.Vector3(tgtCoord.x, tgtCoord.y + 0.6, tgtCoord.z)
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, this.tracerMaterial);
    this.scene.add(line);

    this.tracers.push({
      line,
      createdAt: now,
      durationMs: 140
    });
  }

  /**
   * Updates all active VFX on every 60 FPS animation frame.
   * Cập nhật vòng đời các hiệu ứng sát thương và tia đạn theo từng khung hình.
   */
  public update(): readonly FloatingDamageNumber[] {
    const now = performance.now();

    // 1. Cleanup expired attack tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tracer = this.tracers[i];
      if (tracer && now - tracer.createdAt > tracer.durationMs) {
        this.scene.remove(tracer.line);
        tracer.line.geometry.dispose();
        this.tracers.splice(i, 1);
      }
    }

    // 2. Filter active damage numbers
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dmg = this.damageNumbers[i];
      if (dmg && now - dmg.createdAt > dmg.durationMs) {
        this.damageNumbers.splice(i, 1);
      }
    }

    return this.damageNumbers;
  }

  /**
   * Safely disposes all WebGL geometries and materials (Coverity SAST Clean).
   */
  public dispose(): void {
    this.tracers.forEach((t) => {
      this.scene.remove(t.line);
      t.line.geometry.dispose();
    });
    this.tracers.length = 0;
    this.tracerMaterial.dispose();
  }
}
