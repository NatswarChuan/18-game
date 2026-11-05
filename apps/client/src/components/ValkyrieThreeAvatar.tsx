import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '@valkyrie/shared-domain';
import {
  createHologramPedestal,
  createParallaxCharacterRig,
  createValkyrieLighting,
  disposeThreeScene,
  getFactionHexColor,
  loadCachedAvatarTexture
} from '../utils/three-valkyrie-builder.js';

export interface ValkyrieThreeAvatarProps {
  readonly valkyrieId: string;
  readonly faction: FactionId;
  readonly tier?: ClothDamageTier | undefined;
  readonly isEnemy?: boolean | undefined;
  readonly isCasting?: boolean | undefined;
  readonly isHit?: boolean | undefined;
  readonly isDead?: boolean | undefined;
  readonly size?: number | undefined;
  readonly interactive?: boolean | undefined;
}

/**
 * 2.5D WebGL Multi-Layer Character Hologram powered by Three.js.
 * Thành phần hiển thị nhân vật 2.5D đa tầng chạy trên nền Three.js WebGL:
 * Bệ xoay 3D, mặt phẳng thị sai chiều sâu (Parallax), ánh sáng động và phản ứng giao tranh.
 */
export const ValkyrieThreeAvatar: React.FC<ValkyrieThreeAvatarProps> = ({
  valkyrieId,
  faction,
  tier = 1,
  isEnemy = false,
  isCasting = false,
  isHit = false,
  isDead = false,
  size = 48,
  interactive = false
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = size;
    const height = size;

    // 1. Initialize Scene, Camera & WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0.1, 2.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Build 3D Hologram Stage & 2.5D Character Rig
    const factionColor = getFactionHexColor(faction);
    const primaryColor = isEnemy ? 0xff3344 : factionColor;

    const pedestal = createHologramPedestal(primaryColor);
    scene.add(pedestal);

    const texture = loadCachedAvatarTexture(valkyrieId);
    const charRig = createParallaxCharacterRig(texture, primaryColor, tier);
    scene.add(charRig);

    const { ambient, directional, underglow } = createValkyrieLighting(primaryColor);
    scene.add(ambient);
    scene.add(directional);
    scene.add(underglow);

    // 3. Animation Loop (60 FPS)
    let animFrameId: number;
    const clock = new THREE.Clock();

    const renderLoop = (): void => {
      const elapsed = clock.getElapsedTime();

      // Pedestal rotation (spins faster when casting ultimate)
      const rotSpeed = isCasting ? 0.08 : 0.015;
      pedestal.rotation.y += rotSpeed;

      // Idle breathing bobbing
      if (!isDead) {
        charRig.position.y = Math.sin(elapsed * 2.8) * 0.04;
      } else {
        charRig.position.y = -0.15;
      }

      // Hit recoil reaction
      if (isHit) {
        charRig.position.x = (Math.random() - 0.5) * 0.08;
      } else {
        charRig.position.x = 0;
      }

      // Interactive mouse tilt parallax
      if (interactive) {
        const targetRotY = mouseRef.current.x * 0.45;
        const targetRotX = -mouseRef.current.y * 0.35;
        charRig.rotation.y += (targetRotY - charRig.rotation.y) * 0.1;
        charRig.rotation.x += (targetRotX - charRig.rotation.x) * 0.1;
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // 4. Cleanup on unmount (Zero Memory Leaks)
    return () => {
      cancelAnimationFrame(animFrameId);
      disposeThreeScene(scene, renderer);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [valkyrieId, faction, tier, isEnemy, isCasting, isHit, isDead, size, interactive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current = { x, y };
  };

  const handleMouseLeave = (): void => {
    mouseRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={mountRef}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      className="relative flex items-center justify-center overflow-hidden rounded-lg pointer-events-auto"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }}
    />
  );
};
