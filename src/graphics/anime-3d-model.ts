import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '../types.js';

export interface AnimeModelOptions {
  valkyrieId: string;
  name: string;
  faction: FactionId;
  tier: ClothDamageTier;
  isEnemy: boolean;
  hpPercent?: number;
  manaPercent?: number;
}

/**
 * Visual styling, colors, and faction identity
 */
export function getFactionVisuals(faction: FactionId) {
  switch (faction) {
    case 'NEO_VALHALLA':
      return {
        primary: 0x00f0ff,     // Cyber Cyan
        primaryHex: '#00f0ff',
        secondary: 0x0c162c,   // Deep Cobalt
        accent: 0x9d4edd,      // Neon Violet
        accentHex: '#9d4edd',
        pedestal: 0x0a1428,
        weapon: 0x00f0ff,
        wings: 0x00f0ff,
      };
    case 'ABYSSAL_EDEN':
      return {
        primary: 0x00ff88,     // Bio Emerald
        primaryHex: '#00ff88',
        secondary: 0x082418,   // Abyss Teal
        accent: 0x00e5ff,      // Electric Turquoise
        accentHex: '#00e5ff',
        pedestal: 0x061c14,
        weapon: 0x00ff88,
        wings: 0x00ffaa,
      };
    case 'SOL_DYNASTY':
      return {
        primary: 0xffb700,     // Solar Gold
        primaryHex: '#ffb700',
        secondary: 0x2b1804,   // Royal Obsidian Gold
        accent: 0xff3b30,      // Imperial Vermilion
        accentHex: '#ff3b30',
        pedestal: 0x221305,
        weapon: 0xffb700,
        wings: 0xffcc33,
      };
    default:
      return {
        primary: 0x00f0ff,
        primaryHex: '#00f0ff',
        secondary: 0x0c162c,
        accent: 0x9d4edd,
        accentHex: '#9d4edd',
        pedestal: 0x0a1428,
        weapon: 0x00f0ff,
        wings: 0x00f0ff,
      };
  }
}

const textureCache = new Map<string, THREE.Texture>();
const textureLoader = new THREE.TextureLoader();

export function getValkyrieTexture(valkyrieId: string): THREE.Texture {
  if (textureCache.has(valkyrieId)) {
    return textureCache.get(valkyrieId)!;
  }
  const tex = textureLoader.load(`/avatars/${valkyrieId}.jpg`);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(valkyrieId, tex);
  return tex;
}

/**
 * Creates 3D Cyber Wings that emanate from the Valkyrie's back.
 * Gives the figure an angelic, breathtaking anime silhouette.
 */
function create3DCyberWings(primaryColor: number, tier: ClothDamageTier): THREE.Group {
  const wingsGroup = new THREE.Group();
  wingsGroup.name = 'CyberWings';
  wingsGroup.position.set(0, 0.70, -0.06);

  const wingColor = tier === 3 ? 0xff0066 : primaryColor;
  const wingOpacity = tier === 3 ? 0.9 : 0.65;

  const wingMat = new THREE.MeshBasicMaterial({
    color: wingColor,
    transparent: true,
    opacity: wingOpacity,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: wingColor,
    emissiveIntensity: 0.9,
    metalness: 0.9,
    roughness: 0.1,
  });

  // Construct feathered feather-vanes for left and right wings
  const vaneScales = [
    { length: 0.55, width: 0.08, angle: 0.45, yOff: 0.15 },
    { length: 0.70, width: 0.09, angle: 0.75, yOff: 0.10 },
    { length: 0.58, width: 0.07, angle: 1.05, yOff: 0.00 },
    { length: 0.42, width: 0.06, angle: 1.35, yOff: -0.10 },
  ];

  const buildWingHalf = (isRight: boolean) => {
    const half = new THREE.Group();
    const sign = isRight ? 1 : -1;

    for (let i = 0; i < vaneScales.length; i++) {
      const v = vaneScales[i];
      const vane = new THREE.Group();

      // Energy feather plane
      const planeGeo = new THREE.PlaneGeometry(v.width, v.length);
      const planeMesh = new THREE.Mesh(planeGeo, wingMat);
      planeMesh.position.y = v.length / 2;
      vane.add(planeMesh);

      // Spine edge wire
      const spineGeo = new THREE.CylinderGeometry(0.006, 0.003, v.length, 8);
      const spineMesh = new THREE.Mesh(spineGeo, edgeMat);
      spineMesh.position.y = v.length / 2;
      vane.add(spineMesh);

      // Position and orient feather vane
      vane.rotation.z = sign * v.angle;
      vane.rotation.y = sign * 0.2;
      vane.position.set(sign * 0.06, v.yOff, -0.02 * i);
      half.add(vane);
    }
    return half;
  };

  wingsGroup.add(buildWingHalf(false));
  wingsGroup.add(buildWingHalf(true));

  return wingsGroup;
}

/**
 * Creates sacred concentric 3D holographic halo with rotating runes.
 */
function createSacredHalo(primaryColor: number, tier: ClothDamageTier): THREE.Group {
  const haloGroup = new THREE.Group();
  haloGroup.name = 'Halo';
  haloGroup.position.set(0, 1.05, -0.08);
  haloGroup.rotation.x = Math.PI / 9;

  const color = tier === 3 ? 0xff0077 : primaryColor;

  // 1. Outer Torus Ring
  const outerGeo = new THREE.TorusGeometry(0.26, 0.009, 12, 48);
  const outerMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  haloGroup.add(new THREE.Mesh(outerGeo, outerMat));

  // 2. Middle Star Ring / Rune Disc
  const middleGeo = new THREE.RingGeometry(0.18, 0.23, 32);
  const middleMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    wireframe: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  haloGroup.add(new THREE.Mesh(middleGeo, middleMat));

  // 3. Central Hex Star
  const starGeo = new THREE.CircleGeometry(0.08, 6);
  const starMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  haloGroup.add(new THREE.Mesh(starGeo, starMat));

  return haloGroup;
}

/**
 * Creates ornate 3D Signature Weapon with metallic hilt and glowing energy blade.
 */
function createSignature3DWeapon(
  faction: FactionId,
  visuals: ReturnType<typeof getFactionVisuals>
): THREE.Group {
  const weapon = new THREE.Group();
  weapon.name = 'SignatureWeapon';
  weapon.position.set(0.42, 0.55, 0.08);
  weapon.rotation.z = -Math.PI / 10;
  weapon.rotation.y = -Math.PI / 12;

  if (faction === 'NEO_VALHALLA') {
    // Cyber Beam Katana / Odachi
    const bladeGeo = new THREE.BoxGeometry(0.035, 0.85, 0.015);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: visuals.primary,
      emissive: visuals.primary,
      emissiveIntensity: 0.9,
      metalness: 0.95,
      roughness: 0.1,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.28;
    weapon.add(blade);

    // Pure light blade core
    const coreGeo = new THREE.BoxGeometry(0.015, 0.82, 0.02);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.28;
    weapon.add(core);

    // Tsuba / Guard
    const tsubaGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.018, 16);
    const tsubaMat = new THREE.MeshStandardMaterial({ color: 0x111728, metalness: 0.9, roughness: 0.2 });
    const tsuba = new THREE.Mesh(tsubaGeo, tsubaMat);
    tsuba.position.y = -0.15;
    weapon.add(tsuba);

    // Hilt
    const hiltGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12);
    const hilt = new THREE.Mesh(hiltGeo, tsubaMat);
    hilt.position.y = -0.27;
    weapon.add(hilt);
  } else if (faction === 'ABYSSAL_EDEN') {
    // Dual Bio-Plasma Curved Scythes / Daggers
    const daggerGeo = new THREE.ConeGeometry(0.045, 0.55, 6);
    const daggerMat = new THREE.MeshStandardMaterial({
      color: visuals.primary,
      emissive: visuals.primary,
      emissiveIntensity: 0.95,
      metalness: 0.7,
      roughness: 0.15,
    });
    const d1 = new THREE.Mesh(daggerGeo, daggerMat);
    d1.position.y = 0.15;
    weapon.add(d1);

    const d2 = d1.clone();
    d2.position.set(-0.84, -0.10, 0);
    d2.rotation.z = Math.PI / 2.5;
    weapon.add(d2);
  } else {
    // Sol Dynasty: Royal Solar Spear with Radiance Rings
    const shaftGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.25, 12);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x3d2406, metalness: 0.85, roughness: 0.25 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    weapon.add(shaft);

    const tipGeo = new THREE.ConeGeometry(0.065, 0.38, 6);
    const tipMat = new THREE.MeshStandardMaterial({
      color: visuals.primary,
      emissive: visuals.primary,
      emissiveIntensity: 0.85,
      metalness: 0.95,
      roughness: 0.1,
    });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.y = 0.72;
    weapon.add(tip);

    // Rotating Sun Halo on spearhead
    const sunGeo = new THREE.TorusGeometry(0.12, 0.01, 8, 24);
    const sunMesh = new THREE.Mesh(sunGeo, tipMat);
    sunMesh.position.y = 0.52;
    weapon.add(sunMesh);
  }

  return weapon;
}

/**
 * Creates luxury multi-tier Cyber Dais / Pedestal
 * with laser-etched rune disc and orbiting energy nodes.
 */
function createLuxuryPedestal(
  visuals: ReturnType<typeof getFactionVisuals>,
  isEnemy: boolean
): THREE.Group {
  const pedestal = new THREE.Group();
  pedestal.name = 'Pedestal';

  const baseColor = isEnemy ? 0xcc1133 : visuals.primary;

  // 1. Lower Plinth (Beveled Hexagon)
  const lowerGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.04, 6);
  const lowerMat = new THREE.MeshStandardMaterial({
    color: visuals.secondary,
    metalness: 0.85,
    roughness: 0.25,
  });
  const lowerMesh = new THREE.Mesh(lowerGeo, lowerMat);
  lowerMesh.position.y = 0.02;
  pedestal.add(lowerMesh);

  // 2. Middle Crystal Tier
  const midGeo = new THREE.CylinderGeometry(0.38, 0.40, 0.02, 6);
  const midMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    emissive: baseColor,
    emissiveIntensity: 0.4,
    metalness: 0.9,
    roughness: 0.15,
  });
  const midMesh = new THREE.Mesh(midGeo, midMat);
  midMesh.position.y = 0.045;
  pedestal.add(midMesh);

  // 3. Glowing Floor Rune Ring
  const runeGeo = new THREE.RingGeometry(0.32, 0.37, 32);
  const runeMat = new THREE.MeshBasicMaterial({
    color: baseColor,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const runeMesh = new THREE.Mesh(runeGeo, runeMat);
  runeMesh.rotation.x = -Math.PI / 2;
  runeMesh.position.y = 0.058;
  pedestal.add(runeMesh);

  // 4. Orbiting Energy Pylons (3 Floating Nodes)
  const pylonGroup = new THREE.Group();
  pylonGroup.name = 'OrbitNodes';
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const px = Math.cos(angle) * 0.42;
    const pz = Math.sin(angle) * 0.42;

    const nodeGeo = new THREE.OctahedronGeometry(0.025, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: baseColor,
      wireframe: true,
    });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.position.set(px, 0.12, pz);
    pylonGroup.add(nodeMesh);
  }
  pedestal.add(pylonGroup);

  return pedestal;
}

/**
 * Creates the high-end 3D Acrylic Prismatic Anime Figurine:
 * Combines high-resolution character illustration, refractive diamond-cut crystal glass housing,
 * metallic border casing, 3D cyber wings, glowing sacred halo, and floating signature weapon.
 */
export function createValkyrieAnime3DModel(options: AnimeModelOptions): THREE.Group {
  const model = new THREE.Group();
  model.name = `Valkyrie_Anime_${options.valkyrieId}`;

  const visuals = getFactionVisuals(options.faction);
  const primaryColor = options.isEnemy ? 0xff2255 : visuals.primary;

  // 1. Luxury Cyber Pedestal
  const pedestal = createLuxuryPedestal(visuals, options.isEnemy);
  model.add(pedestal);

  // 2. Main Character Display Group (Elevated on pedestal)
  const characterGroup = new THREE.Group();
  characterGroup.name = 'CharacterDisplay';
  characterGroup.position.set(0, 0.65, 0);

  // A. Heavy Diamond-Cut Crystal Glass Block (Prismatic Acrylic Housing)
  const glassGeo = new THREE.BoxGeometry(0.78, 1.12, 0.045);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: primaryColor,
    emissive: primaryColor,
    emissiveIntensity: 0.15,
    metalness: 0.2,
    roughness: 0.05,
    transmission: 0.65,
    transparent: true,
    opacity: 0.45,
    ior: 1.52,
    reflectivity: 0.8,
    depthWrite: false,
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  characterGroup.add(glassMesh);

  // B. High-Resolution Anime Waifu Character Portrait
  const avatarTex = getValkyrieTexture(options.valkyrieId);
  const portraitGeo = new THREE.PlaneGeometry(0.72, 1.05);
  const portraitMat = new THREE.MeshStandardMaterial({
    map: avatarTex,
    side: THREE.DoubleSide,
    transparent: true,
    roughness: 0.4,
    metalness: 0.1,
  });
  const portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
  portraitMesh.name = 'Portrait';
  portraitMesh.position.set(0, 0, 0.026);
  characterGroup.add(portraitMesh);

  // C. High-Gloss Metallic Beveled Bezel Frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    emissive: primaryColor,
    emissiveIntensity: options.tier === 3 ? 0.8 : 0.4,
    metalness: 0.95,
    roughness: 0.1,
  });

  // Top Frame Bar
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.03, 0.05), frameMat);
  topBar.position.set(0, 0.56, 0.005);
  characterGroup.add(topBar);

  // Bottom Frame Bar with Faction Crest
  const btmBar = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.04, 0.05), frameMat);
  btmBar.position.set(0, -0.56, 0.005);
  characterGroup.add(btmBar);

  // Left & Right Edge Trims
  const sideGeo = new THREE.BoxGeometry(0.025, 1.12, 0.05);
  const leftTrim = new THREE.Mesh(sideGeo, frameMat);
  leftTrim.position.set(-0.39, 0, 0.005);
  characterGroup.add(leftTrim);

  const rightTrim = new THREE.Mesh(sideGeo, frameMat);
  rightTrim.position.set(0.39, 0, 0.005);
  characterGroup.add(rightTrim);

  // 3. 3D Cyber Wings (Angelic Anime Silhouette)
  const wings = create3DCyberWings(primaryColor, options.tier);
  model.add(wings);

  // 4. Sacred Holographic Halo
  const halo = createSacredHalo(primaryColor, options.tier);
  model.add(halo);

  // 5. Signature 3D Weapon
  const weapon = createSignature3DWeapon(options.faction, visuals);
  model.add(weapon);

  // 6. Tier-Specific Battle Damage Effects
  if (options.tier === 2) {
    // Battle-Torn: Fractured Crystal Lattice
    const fractureGeo = new THREE.BufferGeometry();
    const points = new Float32Array([
      -0.2, 0.4, 0.03,  0.1, 0.1, 0.03,
      0.1, 0.1, 0.03,   0.25, -0.2, 0.03,
      0.1, 0.1, 0.03,   -0.15, -0.15, 0.03,
    ]);
    fractureGeo.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const fractureMat = new THREE.LineBasicMaterial({ color: 0xffcc00, linewidth: 2 });
    const fractures = new THREE.LineSegments(fractureGeo, fractureMat);
    characterGroup.add(fractures);
  } else if (options.tier === 3) {
    // Climax / Overdrive: Intense Multi-Layer Magenta Aurora
    const auraGeo = new THREE.RingGeometry(0.45, 0.65, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xff0066,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.name = 'ClimaxAura';
    aura.position.set(0, 0.65, -0.04);
    model.add(aura);

    // Glowing Heart Crystal Core
    const heartGeo = new THREE.OctahedronGeometry(0.045, 0);
    const heartMat = new THREE.MeshBasicMaterial({
      color: 0xff0088,
      wireframe: true,
    });
    const heart = new THREE.Mesh(heartGeo, heartMat);
    heart.name = 'HeartCore';
    heart.position.set(0, 0.70, 0.05);
    characterGroup.add(heart);
  }

  model.add(characterGroup);
  return model;
}
