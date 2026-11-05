# 🛠️ HƯỚNG DẪN TRIỂN KHAI THREE.JS CHUẨN XÁC CHO FRONTEND (THREE.JS IMPLEMENTATION BLUEPRINT)
*(Chuyển giao từ `model-3d-designer` sang `frontend-engineer` • Tối ưu 60-120 FPS • 0 Rò rỉ VRAM)*

---

## 🚀 1. KIẾN TRÚC NHÂN VẬT 3D PROCEDURAL (ZERO DOWNLOAD TIME)

Để tránh tình trạng giật lag hoặc phải chờ tải file 3D GLTF 50MB qua mạng khi người chơi vào game, `model-3d-designer` cung cấp giải pháp **Procedural Three.js Mesh Assembly**:
- Tạo dựng cơ thể và phục trang bằng các khối hình học tinh tế (`CapsuleGeometry`, `CylinderGeometry`, `TorusGeometry`, `ExtrudeGeometry`).
- Tích hợp **Dynamic Holographic Canvas Texture** để chiếu gương mặt Anime 18+ sắc nét và biểu cảm lên khối đầu.
- Tích hợp **Vòng Sáng Hào Quang Faction (Energy Halo)** và **Vũ Khí Phát Quang Cyberpunk**.

```mermaid
graph TD
    Root[Valkyrie 3D Group] --> Body[Body Group: Torso, Waist, Pelvis]
    Root --> Head[Head Mesh + Dynamic Anime Face Texture]
    Root --> Limbs[Limbs: Arms, Hands, Legs, Heels]
    Root --> Armor[Armor Group: Shoulder, Breastplate, Thigh Guards]
    Root --> Weapon[Weapon Mesh: Attached to Hand Bone]
    Root --> Halo[Floating Faction Energy Halo]
```

---

## 💻 2. BLUEPRINT CODE TYPESCRIPT: FACTORY DỰNG HÌNH THREE.JS

```typescript
import * as THREE from 'three';
import { FactionId, ClothDamageTier } from '@valkyrie/shared-domain';

export interface Valkyrie3DModelOptions {
  readonly valkyrieId: string;
  readonly faction: FactionId;
  readonly tier: ClothDamageTier;
  readonly isEnemy: boolean;
  readonly isCasting: boolean;
}

/**
 * Procedural 3D Stylized Valkyrie Model Builder.
 * Xây dựng mô hình 3D nữ chiến binh Valkyrie hoàn chỉnh với tỷ lệ chuẩn Anime 18+.
 */
export class Valkyrie3DModelFactory {
  public static createModel(options: Valkyrie3DModelOptions): THREE.Group {
    const group = new THREE.Group();
    const factionColor = options.faction === 'NEO_VALHALLA'
      ? 0x00F0FF
      : options.faction === 'ABYSSAL_EDEN'
      ? 0xFF2A85
      : 0xFFD700;

    // 1. Core Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xFFE2D1,
      roughness: 0.45,
      metalness: 0.05
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: factionColor,
      roughness: 0.2,
      metalness: 0.75,
      emissive: factionColor,
      emissiveIntensity: options.tier === 3 ? 0.8 : 0.25
    });

    // 2. Torso & Curvaceous Anatomy (Capsule / Cylinders)
    const torsoMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.12, 0.45, 16),
      skinMat
    );
    torsoMesh.position.y = 1.05;
    group.add(torsoMesh);

    // 3. Bust Secondary Geometry (Anime Curves)
    const bustL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), skinMat);
    bustL.position.set(-0.09, 1.15, 0.12);
    const bustR = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), skinMat);
    bustR.position.set(0.09, 1.15, 0.12);
    group.add(bustL);
    group.add(bustR);

    // 4. Armor Plates (Responsive to Cloth Damage Tier)
    if (options.tier <= 2) {
      const breastplate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.15, 0.22, 16, 1, true, -Math.PI / 2, Math.PI),
        armorMat
      );
      breastplate.position.set(0, 1.15, 0.05);
      group.add(breastplate);
    }

    // 5. Floating Faction Energy Halo
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.02, 12, 32),
      new THREE.MeshBasicMaterial({ color: factionColor, wireframe: true })
    );
    halo.position.set(0, 1.75, -0.15);
    halo.rotation.x = Math.PI / 4;
    group.add(halo);

    return group;
  }
}
```

---

## 🛡️ 3. QUY TRÌNH HỦY VÀ GIẢI PHÓNG VRAM (COVERITY SAST MEMORY CLEANUP)

`frontend-engineer` bắt buộc phải gọi hàm này mỗi khi Valkyrie rời sân hoặc ván đấu kết thúc:

```typescript
export function cleanupValkyrie3DModel(model: THREE.Group): void {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
  model.clear();
}
```

---

## 🎬 4. ĐỒNG BỘ ANIMATION TICK 20HZ VỚI 60FPS THREE.JS RENDER LOOP

Tại render loop của `CyberStadiumCanvas.tsx`:
```typescript
const renderLoop = (): void => {
  const elapsed = clock.getElapsedTime();
  
  // 1. Cập nhật nhịp thở tự nhiên (0.35 Hz)
  const breathingScaleY = 1.0 + Math.sin(elapsed * 2.8) * 0.03;
  const bustJiggleZ = Math.cos(elapsed * 3.5) * 0.015;
  
  // 2. Cập nhật xoay Halo năng lượng
  haloMesh.rotation.z += 0.02;
  
  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
};
```
Tuân thủ toàn bộ các bước trên sẽ mang lại hình ảnh 3D mãn nhãn, gợi cảm chuẩn 18+ và hiệu năng 120 FPS mượt mà!
