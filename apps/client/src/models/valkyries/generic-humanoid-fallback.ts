import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from './valkyrie-3d-types.js';

/**
 * Procedural 3D humanoid anime figure used as a pure 3D placeholder while individual
 * bespoke Valkyrie models are engineered step-by-step.
 * Mô hình 3D hình người thủ tục thuần túy đảm bảo 100% không dùng ảnh 2D trên sàn đấu 3D.
 */
export function createGenericHumanoid3DModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const rootGroup = new THREE.Group();
  rootGroup.name = `Humanoid_${config.valkyrieId}`;

  const disposables: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const regGeo = <T extends THREE.BufferGeometry>(g: T): T => { disposables.push(g); return g; };
  const regMat = <T extends THREE.Material>(m: T): T => { materials.push(m); return m; };

  const skinMat = regMat(new THREE.MeshStandardMaterial({ color: 0xffebd9, roughness: 0.5 }));
  const armorMat = regMat(new THREE.MeshStandardMaterial({ color: config.primaryColor, roughness: 0.25, metalness: 0.8 }));
  const darkMat = regMat(new THREE.MeshStandardMaterial({ color: 0x141824, roughness: 0.3 }));
  const glowMat = regMat(new THREE.MeshBasicMaterial({ color: config.primaryColor }));

  // 1. Hips (Y = 0.80)
  const hips = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.20, 0.24, 0.16, 12)), darkMat);
  hips.position.y = 0.80;
  rootGroup.add(hips);

  // 2. Torso (Y = 0.16 relative to hips)
  const torso = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.22, 0.18, 0.24, 12)), armorMat);
  torso.position.y = 0.18;
  hips.add(torso);

  // Bust Curves
  const bustL = new THREE.Mesh(regGeo(new THREE.SphereGeometry(0.12, 12, 12)), skinMat);
  bustL.position.set(-0.09, 0.04, 0.12);
  const bustR = new THREE.Mesh(regGeo(new THREE.SphereGeometry(0.12, 12, 12)), skinMat);
  bustR.position.set(0.09, 0.04, 0.12);
  torso.add(bustL, bustR);

  // 3. Head (Y = 0.28 relative to torso)
  const head = new THREE.Mesh(regGeo(new THREE.SphereGeometry(0.16, 14, 14)), skinMat);
  head.position.y = 0.28;
  torso.add(head);

  // Hair Cap & Ponytail
  const hair = new THREE.Mesh(regGeo(new THREE.SphereGeometry(0.17, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7)), armorMat);
  head.add(hair);

  const ponytail = new THREE.Mesh(regGeo(new THREE.ConeGeometry(0.06, 0.38, 8)), armorMat);
  ponytail.position.set(0, -0.15, -0.15);
  ponytail.rotation.x = -0.3;
  head.add(ponytail);

  // 4. Arms
  const armGeo = regGeo(new THREE.CylinderGeometry(0.05, 0.045, 0.38, 8));
  const armL = new THREE.Mesh(armGeo, skinMat);
  armL.position.set(-0.26, 0.02, 0);
  torso.add(armL);
  const armR = new THREE.Mesh(armGeo, skinMat);
  armR.position.set(0.26, 0.02, 0);
  torso.add(armR);

  // Weapon Rod / Blade
  const blade = new THREE.Mesh(regGeo(new THREE.BoxGeometry(0.08, 1.1, 0.02)), glowMat);
  blade.position.set(0.08, 0.4, 0.1);
  armR.add(blade);

  // 5. Legs
  const legGeo = regGeo(new THREE.CylinderGeometry(0.09, 0.07, 0.74, 10));
  const legL = new THREE.Mesh(legGeo, skinMat);
  legL.position.set(-0.12, -0.42, 0);
  hips.add(legL);
  const legR = new THREE.Mesh(legGeo, skinMat);
  legR.position.set(0.12, -0.42, 0);
  hips.add(legR);

  return {
    rootGroup,
    update: (_delta: number, elapsedTime: number, _state: UnitCombatVisualState): void => {
      const breath = Math.sin(elapsedTime * 2.2) * 0.015;
      torso.position.y = 0.18 + breath;
      ponytail.rotation.z = Math.sin(elapsedTime * 2.5) * 0.1;
      armR.rotation.x = Math.sin(elapsedTime * 1.5) * 0.15;
    },
    setClothTier: (tier: ClothDamageTier): void => {
      armorMat.opacity = tier === 3 ? 0.35 : tier === 2 ? 0.7 : 1.0;
      armorMat.transparent = tier > 1;
    },
    triggerAttack: (): void => {
      armR.rotation.x = 1.2;
    },
    triggerUltimate: (): void => {
      armR.rotation.x = 1.8;
    },
    triggerHit: (): void => {
      torso.position.z = -0.1;
    },
    dispose: (): void => {
      disposables.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    }
  };
}
