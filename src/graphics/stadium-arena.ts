import * as THREE from 'three';
import { SlotIndex } from '../types.js';

export interface SlotCoordinate {
  slotIndex: SlotIndex;
  isEnemy: boolean;
  x: number;
  y: number;
  z: number;
}

/**
 * Calculates world 3D position for a grid slot in the 3x3 Arena.
 * Optimized for VR/AR table or floor vantage point.
 */
export function getSlotPosition(slotIndex: SlotIndex, isEnemy: boolean): THREE.Vector3 {
  const col = slotIndex % 3; // 0 (left), 1 (center), 2 (right)
  const row = Math.floor(slotIndex / 3); // 0 (frontline), 1 (midline), 2 (backline)

  const xSpacing = 0.65;
  const zSpacing = 0.45;
  const x = (col - 1) * xSpacing;
  
  // Center the battle arena at Z = -2.4m, comfortably in front of user (camera is at Z = 0)
  const baseZ = -2.4;
  let z: number;
  if (isEnemy) {
    // Enemy units arrayed in front: frontline at -2.7m, midline at -3.15m, backline at -3.6m
    z = baseZ - (0.30 + row * zSpacing);
  } else {
    // Player units arrayed toward user: frontline at -2.1m, midline at -1.65m, backline at -1.2m
    z = baseZ + (0.30 + row * zSpacing);
  }

  const y = 0.45; // Table/ground elevation in meters
  return new THREE.Vector3(x, y, z);
}

export class StadiumArena {
  public readonly group = new THREE.Group();
  public readonly slotHitboxes: THREE.Mesh[] = [];
  private readonly slotGlowMeshes: Map<string, THREE.Mesh> = new Map();
  private selectedSlotGlow: THREE.Mesh | null = null;

  constructor() {
    this.buildFloor();
    this.buildSlots();
    this.buildDividers();
  }

  private buildFloor(): void {
    // 1. Dark reflective stadium floor
    const floorGeo = new THREE.PlaneGeometry(6.0, 7.0);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050814,
      roughness: 0.2,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.43, -2.4);
    this.group.add(floor);

    // 2. Neon Grid Lines
    const gridHelper = new THREE.GridHelper(6.0, 16, 0x00f0ff, 0x112244);
    gridHelper.position.set(0, 0.435, -2.4);
    this.group.add(gridHelper);

    // 3. Ambient Corner Hologram Pillars
    const pillarPositions = [
      [-2.8, -4.8],
      [2.8, -4.8],
      [-2.8, 0.8],
      [2.8, 0.8],
    ];
    for (const [px, pz] of pillarPositions) {
      const pGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.8, 16);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.4,
        metalness: 0.9,
        roughness: 0.1,
      });
      const pillar = new THREE.Mesh(pGeo, pMat);
      pillar.position.set(px, 1.33, pz);
      this.group.add(pillar);

      // Light beam on top of pillar
      const beamGeo = new THREE.ConeGeometry(0.12, 0.4, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(px, 2.3, pz);
      beam.rotation.x = Math.PI;
      this.group.add(beam);
    }
  }

  private buildSlots(): void {
    // Build 9 player slots and 9 enemy slots
    for (let slot = 0; slot < 9; slot++) {
      const slotIndex = slot as SlotIndex;

      // Player Slot
      this.createSlotPlatform(slotIndex, false);

      // Enemy Slot
      this.createSlotPlatform(slotIndex, true);
    }
  }

  private createSlotPlatform(slotIndex: SlotIndex, isEnemy: boolean): void {
    const pos = getSlotPosition(slotIndex, isEnemy);
    const key = `${isEnemy ? 'enemy' : 'player'}_${slotIndex}`;
    const primaryColor = isEnemy ? 0xff2255 : 0x00f0ff;

    // Platform Base Hexagon / Cylinder
    const platformGeo = new THREE.CylinderGeometry(0.36, 0.38, 0.03, 6);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0c1224,
      metalness: 0.8,
      roughness: 0.3,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.copy(pos);
    platform.position.y += 0.015;
    this.group.add(platform);

    // Glowing Rim
    const rimGeo = new THREE.RingGeometry(0.34, 0.38, 6);
    const rimMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = -Math.PI / 2;
    rim.position.copy(pos);
    rim.position.y += 0.032;
    this.group.add(rim);
    this.slotGlowMeshes.set(key, rim);

    // Interactive Invisible Hitbox for XR Raycasting
    const hitboxGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.4, 16);
    const hitboxMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
    hitbox.position.copy(pos);
    hitbox.position.y += 0.2;
    hitbox.name = `Slot_${slotIndex}_${isEnemy ? 'Enemy' : 'Player'}`;
    hitbox.userData = { slotIndex, isEnemy };
    this.group.add(hitbox);
    this.slotHitboxes.push(hitbox);
  }

  private buildDividers(): void {
    // Center laser clash divider line between Player and Opponent
    const laserGeo = new THREE.PlaneGeometry(4.8, 0.04);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.rotation.x = -Math.PI / 2;
    laser.position.set(0, 0.445, -2.4);
    this.group.add(laser);

    // Midfield pulsing energy barrier line
    const barrierGeo = new THREE.PlaneGeometry(4.8, 0.15);
    const barrierMat = new THREE.MeshBasicMaterial({
      color: 0xff00aa,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(0, 0.52, -2.0);
    this.group.add(barrier);
  }

  private hoveredSlotGlow: THREE.Mesh | null = null;

  public setHoveredSlot(slotIndex: SlotIndex | null): void {
    if (this.hoveredSlotGlow && this.hoveredSlotGlow !== this.selectedSlotGlow) {
      this.hoveredSlotGlow.scale.set(1, 1, 1);
      (this.hoveredSlotGlow.material as THREE.MeshBasicMaterial).color.set(0x00f0ff);
      this.hoveredSlotGlow = null;
    }

    if (slotIndex !== null) {
      const key = `player_${slotIndex}`;
      const glow = this.slotGlowMeshes.get(key);
      if (glow && glow !== this.selectedSlotGlow) {
        glow.scale.set(1.22, 1.22, 1.22);
        (glow.material as THREE.MeshBasicMaterial).color.set(0x00ffff);
        this.hoveredSlotGlow = glow;
      }
    }
  }

  public setSelectedSlot(slotIndex: SlotIndex | null): void {
    if (this.selectedSlotGlow) {
      this.selectedSlotGlow.scale.set(1, 1, 1);
      (this.selectedSlotGlow.material as THREE.MeshBasicMaterial).color.set(0x00f0ff);
      this.selectedSlotGlow = null;
    }

    if (slotIndex !== null) {
      const key = `player_${slotIndex}`;
      const glow = this.slotGlowMeshes.get(key);
      if (glow) {
        glow.scale.set(1.15, 1.15, 1.15);
        (glow.material as THREE.MeshBasicMaterial).color.set(0xfff000);
        this.selectedSlotGlow = glow;
      }
    }
  }

  public updateAnimation(timeSeconds: number): void {
    // Pulse slot glow intensities slightly
    const pulse = 0.6 + Math.sin(timeSeconds * 3) * 0.2;
    for (const [key, mesh] of this.slotGlowMeshes.entries()) {
      if (mesh === this.selectedSlotGlow) continue;
      const isEnemy = key.startsWith('enemy');
      (mesh.material as THREE.MeshBasicMaterial).opacity = isEnemy ? pulse * 0.9 : pulse;
    }
  }
}
