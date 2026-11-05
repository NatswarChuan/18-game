import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  CombatEntitySnapshot,
  CombatEventItem,
  FactionId,
  SlotIndex,
  UnitPlacement,
  getValkyrieById
} from '@valkyrie/shared-domain';
import {
  createArenaFloor,
  createSlotPedestal,
  getSlotWorldPosition,
  setupStadiumLighting
} from '../utils/cyber-stadium-scene.js';
import { createStandingValkyrieFigure } from '../utils/cyber-stadium-units.js';
import { disposeThreeScene } from '../utils/three-valkyrie-builder.js';
import { disposeHologramTextures } from '../utils/valkyrie-hologram-texture.js';
import { CombatVfxEngine, FloatingDamageNumber } from '../utils/combat-vfx-engine.js';
import { CyberStadiumSlotOverlay, ScreenSlotPos } from './CyberStadiumSlotOverlay.js';

export interface CyberStadiumCanvasProps {
  readonly playerFormation: readonly UnitPlacement[];
  readonly opponentFormation: readonly UnitPlacement[];
  readonly combatEntities: readonly CombatEntitySnapshot[];
  readonly combatEvents?: readonly CombatEventItem[] | undefined;
  readonly isCombatActive: boolean;
  readonly combatSpeed?: 1 | 2 | undefined;
  readonly selectedSlotIndex?: SlotIndex | null | undefined;
  readonly hasBenchSelection?: boolean | undefined;
  readonly hoveredFaction?: FactionId | null | undefined;
  readonly onSlotClick?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly onDropValkyrie?: ((valkyrieId: string, targetSlot: SlotIndex, sourceSlot?: SlotIndex | null) => void) | undefined;
  readonly onRemoveUnit?: ((slotIndex: SlotIndex) => void) | undefined;
  readonly onInspect?: ((valkyrieId: string) => void) | undefined;
  readonly onHoverUnit?: ((valkyrieId: string | null, x: number, y: number) => void) | undefined;
  readonly onClearBoard?: (() => void) | undefined;
  readonly onAutoFill?: (() => void) | undefined;
  readonly onToggleSpeed?: (() => void) | undefined;
  readonly onLockFormation?: (() => void) | undefined;
}

interface ProjectedDamageItem {
  readonly id: string;
  readonly text: string;
  readonly color: string;
  readonly screenX: number;
  readonly screenY: number;
  readonly opacity: number;
}

const STADIUM_WIDTH = 960;
const STADIUM_HEIGHT = 520;

/**
 * AAA 3D Cyberpunk Battlefield Stadium Canvas with Gamer-Friendly Behaviors.
 * Đấu trường Sân Đấu Không Gian 3D Cyberpunk tích hợp trọn vẹn hành vi thân thiện:
 * Kéo thả hoán đổi quân trực tiếp (Board-to-Board Drag/Swap), Chuột phải thu hồi,
 * Số sát thương nảy lên 3D (Damage Popups), và Thanh lệnh thao tác nhanh (Quick Bar).
 */
export const CyberStadiumCanvas: React.FC<CyberStadiumCanvasProps> = (props) => {
  const {
    playerFormation, opponentFormation, combatEntities, combatEvents = [],
    isCombatActive, combatSpeed = 1, selectedSlotIndex, hasBenchSelection,
    hoveredFaction, onSlotClick, onDropValkyrie, onRemoveUnit,
    onInspect, onHoverUnit, onClearBoard, onAutoFill, onToggleSpeed
  } = props;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const vfxRef = useRef<CombatVfxEngine | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [screenSlots, setScreenSlots] = useState<readonly ScreenSlotPos[]>([]);
  const [projectedDamages, setProjectedDamages] = useState<readonly ProjectedDamageItem[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    // 1. Scene & Golden Isometric Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, STADIUM_WIDTH / STADIUM_HEIGHT, 0.1, 100);
    camera.position.set(0, 7.2, 5.8);
    camera.lookAt(0, -0.1, 0.3);
    cameraRef.current = camera;

    const vfxEngine = new CombatVfxEngine(scene);
    vfxRef.current = vfxEngine;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(STADIUM_WIDTH, STADIUM_HEIGHT);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Build 3D Arena Floor & Stadium Lighting
    scene.add(createArenaFloor());
    setupStadiumLighting(scene);

    // 3. Build 18 3D Hologram Pedestals (9 Player + 9 Enemy)
    const allSlots: SlotIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const pedestalGroup = new THREE.Group();
    const calculatedScreenSlots: ScreenSlotPos[] = [];

    allSlots.forEach((slot) => {
      const pCoord = getSlotWorldPosition(slot, false);
      const eCoord = getSlotWorldPosition(slot, true);
      pedestalGroup.add(createSlotPedestal(pCoord));
      pedestalGroup.add(createSlotPedestal(eCoord));

      const proj = new THREE.Vector3(pCoord.x, 0, pCoord.z);
      proj.project(camera);
      calculatedScreenSlots.push({
        slotIndex: slot,
        x: (proj.x * 0.5 + 0.5) * STADIUM_WIDTH,
        y: (-proj.y * 0.5 + 0.5) * STADIUM_HEIGHT
      });
    });
    scene.add(pedestalGroup);
    setScreenSlots(calculatedScreenSlots);

    // 4. Build Standing Valkyrie Figures on occupied pedestals
    const unitsGroup = new THREE.Group();
    const unitMeshes: { group: THREE.Group; baseY: number; isCasting: boolean }[] = [];

    const getEntity = (slot: SlotIndex, isEnemy: boolean): CombatEntitySnapshot | undefined => {
      return combatEntities.find(
        (e) => e.slotIndex === slot && (isEnemy ? e.ownerId !== 'player_me' : e.ownerId === 'player_me')
      );
    };

    // Render Player Units
    const addFigures = (formation: readonly UnitPlacement[], isEnemy: boolean): void => {
      formation.forEach((p) => {
        const valk = getValkyrieById(p.valkyrieId);
        if (!valk) return;
        const entity = getEntity(p.slotIndex, isEnemy);
        const coord = getSlotWorldPosition(p.slotIndex, isEnemy);
        const figure = createStandingValkyrieFigure({
          valkyrieId: valk.id,
          faction: valk.faction,
          currentHp: entity ? entity.currentHp : valk.stats.maxHp,
          maxHp: valk.stats.maxHp,
          currentMana: entity ? entity.currentMana : 0,
          maxMana: 100,
          tier: entity ? entity.clothDamageTier : 1,
          isEnemy,
          isCasting: entity?.isCastingUltimate ?? false,
          isAlive: entity ? entity.isAlive : true
        });
        figure.position.set(coord.x, coord.y, coord.z);
        unitsGroup.add(figure);
        unitMeshes.push({ group: figure, baseY: coord.y, isCasting: entity?.isCastingUltimate ?? false });
      });
    };

    addFigures(playerFormation, false);
    addFigures(opponentFormation, true);

    scene.add(unitsGroup);

    // 5. 60 FPS Render Loop with Breathing Idle & Floating Damage Projection
    let animId: number;
    const clock = new THREE.Clock();

    const renderLoop = (): void => {
      const elapsed = clock.getElapsedTime();

      unitMeshes.forEach((u, idx) => {
        const phase = idx * 0.45;
        const breath = Math.sin((elapsed + phase) * 1.8) * 0.020;
        // Keep unit pedestal firmly anchored to arena floor (zero bobbing of foot rings)
        u.group.position.y = u.baseY;
        u.group.rotation.y = Math.sin((elapsed + phase) * 0.9) * 0.035;
        u.group.rotation.z = Math.cos((elapsed + phase) * 0.7) * 0.015;

        // Subtle living 2.5D portrait respiration
        const portrait = u.group.getObjectByName('Prismatic_Portrait');
        if (portrait) {
          portrait.scale.set(1.0 + Math.sin((elapsed + phase) * 1.8) * 0.010, 1.0 + breath * 0.75, 1.0);
        }

        const weapon = u.group.getObjectByName('Prismatic_Weapon');
        if (weapon) {
          weapon.position.y = 0.96 + Math.cos((elapsed + phase) * 1.8) * 0.035;
          weapon.rotation.z = -0.05 + Math.sin((elapsed + phase) * 1.2) * 0.045;
        }
        const halo = u.group.getObjectByName('Prismatic_Halo');
        if (halo) {
          halo.rotation.z = (elapsed + phase) * 0.9;
        }

        if (u.isCasting) {
          u.group.scale.setScalar(1.15 + Math.sin(elapsed * 12) * 0.04);
        }
      });

      // Update 3D VFX & Project active damage numbers to 2D
      const activeDamages = vfxEngine.update();
      if (activeDamages.length > 0) {
        const now = performance.now();
        setProjectedDamages(
          activeDamages.map((dmg: FloatingDamageNumber): ProjectedDamageItem => {
            const progress = Math.min(1, (now - dmg.createdAt) / dmg.durationMs);
            const v = dmg.worldPos.clone();
            v.y += progress * 0.8;
            v.project(camera);
            return {
              id: dmg.id,
              text: dmg.text,
              color: dmg.color,
              screenX: (v.x * 0.5 + 0.5) * STADIUM_WIDTH,
              screenY: (-v.y * 0.5 + 0.5) * STADIUM_HEIGHT,
              opacity: 1 - progress
            };
          })
        );
      } else {
        setProjectedDamages([]);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // 6. Memory Cleanup on Unmount (Zero Leak)
    return () => {
      cancelAnimationFrame(animId);
      vfxEngine.dispose();
      disposeThreeScene(scene, renderer);
      disposeHologramTextures();
      renderer.domElement.remove();
    };
  }, [playerFormation, opponentFormation, combatEntities, isCombatActive]);

  // Feed combat events into 3D VFX engine on update
  useEffect(() => {
    if (!vfxRef.current || combatEvents.length === 0) return;
    const slotMap = new Map<string, { slotIndex: SlotIndex; isEnemy: boolean }>();
    combatEntities.forEach((e) => slotMap.set(e.id, { slotIndex: e.slotIndex, isEnemy: e.ownerId !== 'player_me' }));
    vfxRef.current.processCombatEvents(combatEvents, slotMap);
  }, [combatEvents, combatEntities]);

  return (
    <div
      className="relative flex items-center justify-center select-none overflow-hidden rounded-3xl border border-white/10 bg-[#070912]/80 shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,240,255,0.05)] backdrop-blur-md"
      style={{
        width: `${STADIUM_WIDTH}px`,
        height: `${STADIUM_HEIGHT}px`,
        minWidth: `${STADIUM_WIDTH}px`,
        minHeight: `${STADIUM_HEIGHT}px`,
        position: 'relative'
      }}
    >
      {/* 1. Underlying Three.js WebGL 3D Stadium Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 2. Top Sector Indicator & Quick Gamer Tactical Action Bar */}
      <div className="absolute top-2 inset-x-4 flex items-center justify-between pointer-events-auto z-30 text-[9px] font-mono">
        <span className="text-red-400 font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/40 border border-red-500/30">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          🔴 ĐỐI THỦ (SECTOR ĐỎ)
        </span>

        {/* Gamer Quick Action Bar */}
        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-white/10 shadow-sm">
          {!isCombatActive && (
            <>
              {/* Team Capacity Indicator with 6 Pips */}
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono"
                title={`Đội hình: ${playerFormation.length}/6 Valkyries (Bàn cờ 3x3 tối đa 6 quân)`}
              >
                <span className="text-gray-400">ĐỘI:</span>
                <span className={`font-bold ${playerFormation.length === 6 ? 'text-[#00F0FF]' : 'text-[#FFD700]'}`}>
                  {playerFormation.length}/6
                </span>
                <div className="flex items-center gap-0.5 ml-0.5">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`w-1 h-1 rounded-full transition-all ${
                        i < playerFormation.length
                          ? 'bg-[#00F0FF] shadow-[0_0_4px_#00F0FF]'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={onAutoFill}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#00F0FF]/20 border border-white/15 hover:border-[#00F0FF] text-gray-300 hover:text-[#00F0FF] transition-all flex items-center gap-1"
                title="Tự động bố trí 6 quân tối ưu [Phím F]"
              >
                <span>⚡</span> Tự Xếp [F]
              </button>
              <button
                onClick={onClearBoard}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-red-500/20 border border-white/15 hover:border-red-400 text-gray-300 hover:text-red-400 transition-all flex items-center gap-1"
                title="Thu hồi toàn bộ quân về hàng chờ [Phím R]"
              >
                <span>🗑️</span> Thu Hồi [R]
              </button>
            </>
          )}

          <button
            onClick={onToggleSpeed}
            className={`px-2 py-0.5 rounded border font-bold transition-all flex items-center gap-1 ${
              combatSpeed === 2
                ? 'bg-[#FFD700]/25 text-[#FFD700] border-[#FFD700]'
                : 'bg-white/10 text-gray-300 border-white/15 hover:text-white'
            }`}
            title="Đổi tốc độ giao tranh [Phím 1/2]"
          >
            <span>⏩</span> {combatSpeed}x Tốc Độ
          </button>
        </div>

        <span className="text-gray-400 font-mono text-[9px]">
          {isCombatActive ? '⚡ 20HZ DETERMINISTIC CLASH' : '🔒 FOG-OF-WAR ACTIVE'}
        </span>
      </div>

      {/* 3. Floating 3D Combat Damage Popups (Projected to 2D) */}
      {projectedDamages.map((dmg) => (
        <div
          key={dmg.id}
          className="absolute z-40 pointer-events-none font-display font-black text-sm tracking-wider select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          style={{
            left: `${dmg.screenX}px`,
            top: `${dmg.screenY}px`,
            transform: 'translate(-50%, -50%)',
            color: dmg.color,
            opacity: dmg.opacity
          }}
        >
          {dmg.text}
        </div>
      ))}

      {/* 4. Interactive Drop & Swap Zones Aligned with 3D Pedestals */}
      <CyberStadiumSlotOverlay
        screenSlots={screenSlots}
        playerFormation={playerFormation}
        selectedSlotIndex={selectedSlotIndex}
        hasSelection={(selectedSlotIndex !== null && selectedSlotIndex !== undefined) || !!hasBenchSelection}
        hoveredFaction={hoveredFaction}
        isCombatActive={isCombatActive}
        onSlotClick={onSlotClick}
        onDropValkyrie={onDropValkyrie}
        onRemoveUnit={onRemoveUnit}
        onInspect={onInspect}
        onHoverUnit={onHoverUnit}
      />

      {/* 5. Bottom Sector Indicator (Gamer Instructions) */}
      <div className="absolute bottom-2 inset-x-6 flex items-center justify-between pointer-events-none z-10 text-[9px] font-mono text-[#00F0FF]/80">
        <span className="font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30">
          <span>🛡️</span> 🔵 ĐỘI HÌNH CỦA BẠN (SECTOR XANH 3x3)
        </span>
        <span className="text-gray-400">
          🖱️ Nhấp chọn để di chuyển/đổi • Kéo thả • Chuột phải thu hồi • Phím Space chiến đấu
        </span>
      </div>
    </div>
  );
};
