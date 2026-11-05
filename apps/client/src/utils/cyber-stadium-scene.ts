import * as THREE from 'three';
import { SlotIndex } from '@valkyrie/shared-domain';

export interface Slot3DCoordinate {
  readonly slotIndex: SlotIndex;
  readonly isEnemy: boolean;
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/**
 * Calculates world 3D position for a grid slot in the Cyber Stadium.
 * Tính toán tọa độ thế giới 3D cho từng ô cờ trên Đấu Trường Không Gian:
 * Khoảng cách thoáng đãng (xSpacing: 2.45, zSpacing: 1.65) tối ưu cho góc nhìn Isometric vàng.
 *
 * @param slotIndex - Slot index from 0 to 8.
 * @param isEnemy - True if opponent sector, false if player sector.
 * @returns Slot3DCoordinate containing exact XYZ in 3D space.
 */
export function getSlotWorldPosition(slotIndex: SlotIndex, isEnemy: boolean): Slot3DCoordinate {
  const col = slotIndex % 3; // 0 (left), 1 (center), 2 (right)
  const row = Math.floor(slotIndex / 3); // 0 (frontline), 1 (midline), 2 (backline)

  const xSpacing = 2.45;
  const zSpacing = 1.65;
  const x = (col - 1) * xSpacing;

  let z: number;
  if (isEnemy) {
    z = -(1.0 + row * zSpacing);
  } else {
    z = 1.0 + row * zSpacing;
  }

  return { slotIndex, isEnemy, x, y: 0, z };
}

/**
 * Builds the illuminated Cyberpunk Stadium arena floor and laser clash divide.
 * Xây dựng mặt sàn đấu trường Cyberpunk không gian đa tầng và chiến tuyến laser phân tách.
 *
 * @returns THREE.Group containing the arena floor and ambient elements.
 */
export function createArenaFloor(): THREE.Group {
  const floorGroup = new THREE.Group();

  // 1. Deep Cosmic Arena Ground Floor Plane
  const floorGeo = new THREE.PlaneGeometry(28, 22);
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x05070f, side: THREE.DoubleSide });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.04;
  floorGroup.add(floorMesh);

  // 2. High-Tech Dual Grid Floor (Cyan Primary + Violet Secondary)
  const gridHelper = new THREE.GridHelper(18, 24, 0x00f0ff, 0x16182c);
  gridHelper.position.y = -0.02;
  floorGroup.add(gridHelper);

  // 3. Central Clash Laser Beam (Hot White Core + Dual-Tone Additive Aura)
  const beamCore = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 0.08),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  beamCore.rotation.x = -Math.PI / 2;
  beamCore.position.set(0, 0.02, 0);

  const beamAuraCyan = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 0.3),
    new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  beamAuraCyan.rotation.x = -Math.PI / 2;
  beamAuraCyan.position.set(0, 0.015, 0.15);

  const beamAuraPink = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 0.3),
    new THREE.MeshBasicMaterial({
      color: 0xff2a85,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  beamAuraPink.rotation.x = -Math.PI / 2;
  beamAuraPink.position.set(0, 0.015, -0.15);

  floorGroup.add(beamCore, beamAuraCyan, beamAuraPink);

  // 4. Perimeter Laser Boundary Rails (X: [-5.6, 5.6], Z: [-5.0, 5.0])
  const railMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const railFront = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.04, 0.04), railMat);
  railFront.position.set(0, 0.06, 5.0);
  const railBack = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.04, 0.04), railMat);
  railBack.position.set(0, 0.06, -5.0);
  const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 10.0), railMat);
  railLeft.position.set(-5.6, 0.06, 0);
  const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 10.0), railMat);
  railRight.position.set(5.6, 0.06, 0);
  floorGroup.add(railFront, railBack, railLeft, railRight);

  // 5. 4 Corner Energy Pylons
  const pylonPositions: readonly [number, number][] = [
    [-5.6, -5.0], [5.6, -5.0], [-5.6, 5.0], [5.6, 5.0]
  ];
  pylonPositions.forEach(([px, pz]) => {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x161a2e, metalness: 0.8, roughness: 0.2 })
    );
    post.position.set(px, 0.3, pz);
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({
        color: pz > 0 ? 0x00f0ff : 0xff2a85,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      })
    );
    node.position.set(px, 0.62, pz);
    floorGroup.add(post, node);
  });

  // 6. Ambient Cyber Spark Particles (250 floating energy sparks)
  const particleCount = 250;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    positions[idx] = (Math.random() - 0.5) * 16;
    positions[idx + 1] = Math.random() * 4.2;
    positions[idx + 2] = (Math.random() - 0.5) * 14;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.055,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  floorGroup.add(particles);

  return floorGroup;
}

/**
 * Creates an ultra-luxurious 3D Hologram Pedestal for a specific battlefield slot.
 * Tạo bệ đài Hologram 3D phát sáng cho từng vị trí ô cờ trên sàn đấu:
 * Đĩa kim loại tối màu, vòng beveled Neon phát quang, vòng rune công nghệ và cột sáng Hologram.
 *
 * @param coord - 3D world coordinates for the slot.
 * @returns THREE.Group representing the slot platform.
 */
export function createSlotPedestal(coord: Slot3DCoordinate): THREE.Group {
  const group = new THREE.Group();
  group.position.set(coord.x, coord.y, coord.z);

  const color = coord.isEnemy ? 0xff3344 : 0x00f0ff;

  // 1. Solid Dark Metallic Disc Base Plate
  const discGeo = new THREE.CircleGeometry(0.85, 36);
  const discMat = new THREE.MeshBasicMaterial({
    color: 0x0a0d18,
    side: THREE.DoubleSide
  });
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.rotation.x = -Math.PI / 2;
  discMesh.position.y = 0.005;
  group.add(discMesh);

  // 2. Outer Beveled Glowing Neon Ring
  const ringGeo = new THREE.TorusGeometry(0.86, 0.035, 12, 36);
  const ringMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 0.02;
  group.add(ringMesh);

  // 3. Inner Tech Rune Concentric Ring
  const innerRingGeo = new THREE.RingGeometry(0.56, 0.60, 32);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRingMesh.rotation.x = -Math.PI / 2;
  innerRingMesh.position.y = 0.025;
  group.add(innerRingMesh);

  // 4. Holographic Light Column (Vertical Cylinder)
  const beamGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.35, 32, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.y = 0.175;
  group.add(beamMesh);

  return group;
}

/**
 * Sets up 3D scene lighting tailored for anime cyberpunk aesthetics.
 * Thiết lập hệ thống chiếu sáng chuẩn Anime Cyberpunk (Bloom, Rim-light, Spotlight).
 *
 * @param scene - Target THREE.Scene.
 */
export function setupStadiumLighting(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight(0xffffff, 1.3);
  scene.add(ambient);

  // Overhead key light for 3D character specular highlights
  const overheadLight = new THREE.DirectionalLight(0xffffff, 2.0);
  overheadLight.position.set(0, 10, 4);
  scene.add(overheadLight);

  // Player key spotlight (Cyan)
  const playerLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
  playerLight.position.set(4, 8, 7);
  scene.add(playerLight);

  // Opponent key spotlight (Crimson/Pink)
  const enemyLight = new THREE.DirectionalLight(0xff2a85, 2.0);
  enemyLight.position.set(-4, 8, -7);
  scene.add(enemyLight);

  // Central clash pointlight
  const centerLight = new THREE.PointLight(0x00f0ff, 1.8, 12);
  centerLight.position.set(0, 1.5, 0);
  scene.add(centerLight);
}
