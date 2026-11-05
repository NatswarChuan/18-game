import * as THREE from 'three';

/**
 * Evaluates a cubic Bézier curve at parameter t in [0, 1].
 * Tính toán tọa độ điểm trên đường cong Bézier bậc 3.
 */
export function evaluateCubicBezier2D(
  p0: THREE.Vector2,
  p1: THREE.Vector2,
  p2: THREE.Vector2,
  p3: THREE.Vector2,
  t: number
): THREE.Vector2 {
  const oneMinusT = 1 - t;
  const t2 = t * t;
  const oneMinusT2 = oneMinusT * oneMinusT;

  const a = oneMinusT2 * oneMinusT;
  const b = 3 * oneMinusT2 * t;
  const c = 3 * oneMinusT * t2;
  const d = t2 * t;

  return new THREE.Vector2(
    a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    a * p0.y + b * p1.y + c * p2.y + d * p3.y
  );
}

/**
 * Samples a sequence of connected Bézier control points into a smooth dense 2D profile curve.
 * Lấy mẫu chuỗi đường cong Bézier thành danh sách các điểm mặt cắt 2D mượt mà.
 */
export function sampleBezierProfile(segments: Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]>, samplesPerSegment = 12): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    if (!seg) continue;
    const startIdx = s === 0 ? 0 : 1;
    for (let i = startIdx; i <= samplesPerSegment; i++) {
      const t = i / samplesPerSegment;
      points.push(evaluateCubicBezier2D(seg[0], seg[1], seg[2], seg[3], t));
    }
  }
  return points;
}

export interface OrganicTorsoMetrics {
  readonly totalHeight?: number;       // Default ~0.72m
  readonly clavicleRadius?: number;    // Neck/shoulder base radius (~0.16m)
  readonly chestRibRadius?: number;    // Under-bust ribcage radius (~0.19m)
  readonly waistRadius?: number;       // Slender hourglass waist radius (~0.15m)
  readonly hipRadius?: number;         // Curved feminine hip flare radius (~0.25m)
  readonly pelvisRadius?: number;      // Pelvic base radius (~0.18m)
}

/**
 * Builds a continuous, seamless organic 3D female torso and hip mesh with graceful hourglass contours.
 * Xây dựng cấu trúc thân trên và vòng hông liền khối hữu cơ mượt mà (không chắp vá hình trụ thô sơ):
 * - Xương quai xanh (Clavicle)
 * - Rãnh chân ngực (Under-bust ribcage transition)
 * - Vòng eo con kiến thắt đáy lưng ong (Hourglass waist)
 * - Đường cong hông quả đào và xương chậu nữ tính (Feminine hip flare & glute curve)
 */
export function buildOrganicTorsoHipsGeometry(
  metrics: OrganicTorsoMetrics = {},
  radialSegments = 64
): THREE.BufferGeometry {
  const clavicleR = metrics.clavicleRadius ?? 0.112;
  const chestR = metrics.chestRibRadius ?? 0.118;
  const waistR = metrics.waistRadius ?? 0.092;
  const hipR = metrics.hipRadius ?? 0.148;
  const pelvisR = metrics.pelvisRadius ?? 0.122;

  // Complete continuous Bézier profile from pelvis base (Y = 0) up to clavicle/neck base (Y = 0.54)
  const segments: Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]> = [
    // 1. Slender Pelvis to Flared Hip Crest (Vòng chậu nở cong mềm mại lên đỉnh hông quả đào)
    [
      new THREE.Vector2(pelvisR, 0.0),
      new THREE.Vector2(pelvisR * 1.04, 0.04),
      new THREE.Vector2(hipR * 0.96, 0.10),
      new THREE.Vector2(hipR, 0.15)
    ],
    // 2. Hip Crest to Seductive Wasp Waist (Đỉnh hông lượn mượt mà vào eo con kiến)
    [
      new THREE.Vector2(hipR, 0.15),
      new THREE.Vector2(hipR * 0.95, 0.20),
      new THREE.Vector2(waistR * 1.05, 0.25),
      new THREE.Vector2(waistR, 0.29)
    ],
    // 3. Waist to Under-bust Ribcage (Eo nở nhẹ ra khung sườn chân ngực)
    [
      new THREE.Vector2(waistR, 0.29),
      new THREE.Vector2(waistR * 1.03, 0.33),
      new THREE.Vector2(chestR * 0.97, 0.37),
      new THREE.Vector2(chestR, 0.40)
    ],
    // 4. Ribcage to Upper Chest Pectoralis (Lồng ngực nâng đỡ bầu ngực quyến rũ)
    [
      new THREE.Vector2(chestR, 0.40),
      new THREE.Vector2(chestR * 1.02, 0.44),
      new THREE.Vector2(clavicleR * 1.04, 0.47),
      new THREE.Vector2(clavicleR, 0.50)
    ],
    // 5. Upper Chest to Clavicle / Neck Socket (Nối mượt lên bờ vai thon và cổ)
    [
      new THREE.Vector2(clavicleR, 0.50),
      new THREE.Vector2(clavicleR * 0.92, 0.52),
      new THREE.Vector2(0.068, 0.535),
      new THREE.Vector2(0.052, 0.54)
    ]
  ];

  const profilePoints = sampleBezierProfile(segments, 16);
  const latheGeo = new THREE.LatheGeometry(profilePoints, radialSegments);

  // Rotate by PI so that phi = PI (u = 0.5, canvas center X = 512) maps directly onto the FRONT (+Z)
  latheGeo.rotateY(Math.PI);

  // Seductive feminine lateral flare (Exaggerates hourglass hip curve smoothly in X)
  const pos = latheGeo.attributes.position;
  if (pos) {
    const posArr = pos.array as Float32Array;
    const vertexCount = pos.count;

    for (let i = 0; i < vertexCount; i++) {
      const idx = i * 3;
      const x = posArr[idx] ?? 0;
      const y = posArr[idx + 1] ?? 0;
      const z = posArr[idx + 2] ?? 0;

      const isHipRegion = y < 0.24;
      const xStretch = isHipRegion ? 1.14 : (y < 0.35 ? 1.02 : 1.06);
      const zSquash = isHipRegion ? 0.94 : 0.90;

      posArr[idx] = x * xStretch;
      posArr[idx + 2] = z * zSquash;
    }
    pos.needsUpdate = true;
    latheGeo.computeVertexNormals();
  }

  return latheGeo;
}

export interface TeardropBustOptions {
  readonly cupRadius?: number;     // Sphere equivalent radius (0.09 - 0.11m for Cup G anime scale)
  readonly projection?: number;    // Forward depth projection (1.15 - 1.25)
  readonly sagFactor?: number;     // Natural gravitational droop (0.08 - 0.12)
  readonly isRight?: boolean;
  readonly isArmoredCup?: boolean; // If true, generates form-fitting armored demi-cup cuirass plate
}

/**
 * Builds a natural teardrop-shaped voluptuous anime breast geometry or matching armored demi-cup.
 * Xây dựng hình khối bầu ngực giọt nước tự nhiên chuẩn tỷ lệ Anime Waifu Cup G hoặc giáp ngực đúc khuôn:
 * - Dốc ngực trên thoải mềm mại nối liền từ xương quai xanh
 * - Độ trĩu trọng lực tự nhiên nhẹ nhàng, căng tròn đầy đặn
 * - Vòm ngực dưới tròn trịa, rãnh ngực sâu tự nhiên
 * - Lưới đa giác mịn màng 40x32 không bị gãy khúc đa giác thô sơ.
 */
export function buildOrganicTeardropBreastGeometry(
  options: TeardropBustOptions = {},
  widthSegments = 40,
  heightSegments = 32
): THREE.BufferGeometry {
  const r = options.cupRadius ?? 0.096;
  const proj = options.projection ?? 1.20;
  const sag = options.sagFactor ?? 0.09;
  const isRight = options.isRight ?? false;
  const isArmoredCup = options.isArmoredCup ?? false;

  // For armored demi-cups, cup the lower & outer contours like an underwire push-up corset bra
  const thetaStart = isArmoredCup ? Math.PI * 0.48 : 0;
  const thetaLength = isArmoredCup ? Math.PI * 0.52 : Math.PI;
  // phiStart = -PI/2 aligns u = 0.50 directly with the forward (+Z) nipple/areola apex
  const geo = new THREE.SphereGeometry(r, widthSegments, heightSegments, -Math.PI * 0.5, Math.PI * 2, thetaStart, thetaLength);
  const pos = geo.attributes.position;

  if (pos) {
    const posArr = pos.array as Float32Array;
    const count = pos.count;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = posArr[idx] ?? 0;
      let y = posArr[idx + 1] ?? 0;
      let z = posArr[idx + 2] ?? 0;

      // Deform front hemisphere smoothly
      if (z > -0.01) {
        // 1. Forward projection scaling
        z *= proj;

        // 2. Perky, lifted Anime G-Cup curvature (firm, round upper decolletage slope)
        const normZ = Math.max(0, z / (r * proj));
        // Gentle lower fullness curve without harsh flattening
        if (y < 0) {
          y -= sag * 0.15 * normZ;
        } else {
          y -= (y / r) * (sag * 0.20) * normZ;
        }

        // 3. Voluptuous cleavage shaping (breasts curve inward towards center cleavage valley)
        if (isRight) {
          x -= normZ * 0.018;
        } else {
          x += normZ * 0.018;
        }

        // 4. Form-fitting armored shell offset
        if (isArmoredCup) {
          z += 0.006; // 6mm protective shell offset for flush armor fit
        }
      }

      posArr[idx] = x;
      posArr[idx + 1] = y;
      posArr[idx + 2] = z;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  return geo;
}

export interface OrganicLegMetrics {
  readonly length?: number;          // Total leg length (~0.84m)
  readonly thighUpperRadius?: number;// Upper thigh root (~0.105m)
  readonly thighMidRadius?: number;  // Mid thigh curve (~0.092m)
  readonly kneeRadius?: number;      // Inward knee taper (~0.065m)
  readonly calfMaxRadius?: number;   // Full calf bulge (~0.072m)
  readonly ankleRadius?: number;     // Slender ankle taper (~0.042m)
  readonly part?: 'full' | 'upperThigh' | 'stocking';
}

/**
 * Builds an organic continuous anime leg with feminine curves or separate Zettai Ryouiki parts.
 * Dựng cấu trúc chân Anime liền khối hoặc tách mảng Tuyệt Đối Lĩnh Vực (Zettai Ryouiki Grade S):
 * - Đùi trên để lộ làn da sứ mềm mại quyến rũ
 * - Quai nịt bít tất garter belt mạ vàng gợi cảm
 * - Tất chân mỏng đen ôm khít bắp chân và mắt cá chân.
 */
export function buildOrganicLegGeometry(
  metrics: OrganicLegMetrics = {},
  radialSegments = 24
): THREE.BufferGeometry {
  const upperR = metrics.thighUpperRadius ?? 0.116;
  const midR = metrics.thighMidRadius ?? 0.098;
  const kneeR = metrics.kneeRadius ?? 0.062;
  const calfR = metrics.calfMaxRadius ?? 0.074;
  const ankleR = metrics.ankleRadius ?? 0.038;
  const part = metrics.part ?? 'full';

  let segments: Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]> = [];

  if (part === 'upperThigh') {
    // Upper thigh bare porcelain skin with sensual puchi-niku flesh squeeze above stocking band
    segments = [
      [
        new THREE.Vector2(midR * 0.95, 0.64),
        new THREE.Vector2(midR * 1.08, 0.67), // Sensual flesh overflow above stocking band!
        new THREE.Vector2(midR * 1.10, 0.74),
        new THREE.Vector2(upperR * 0.98, 0.80)
      ],
      [
        new THREE.Vector2(upperR * 0.98, 0.80),
        new THREE.Vector2(upperR * 1.01, 0.82),
        new THREE.Vector2(upperR * 1.03, 0.83),
        new THREE.Vector2(upperR, 0.84)
      ]
    ];
  } else if (part === 'stocking') {
    // Thigh-high stocking from ankle (Y = 0) up to thigh cuff (Y = 0.64)
    segments = [
      // 1. Ankle to Calf Bulge
      [
        new THREE.Vector2(ankleR, 0.0),
        new THREE.Vector2(ankleR * 1.05, 0.08),
        new THREE.Vector2(calfR * 0.95, 0.20),
        new THREE.Vector2(calfR, 0.28)
      ],
      // 2. Calf to Knee
      [
        new THREE.Vector2(calfR, 0.28),
        new THREE.Vector2(calfR * 0.9, 0.35),
        new THREE.Vector2(kneeR * 1.08, 0.42),
        new THREE.Vector2(kneeR, 0.46)
      ],
      // 3. Knee to Thigh Stocking Top
      [
        new THREE.Vector2(kneeR, 0.46),
        new THREE.Vector2(kneeR * 1.15, 0.52),
        new THREE.Vector2(midR * 0.95, 0.60),
        new THREE.Vector2(midR * 0.98, 0.64)
      ]
    ];
  } else {
    // Full leg profile from ankle (Y = 0) up to hip joint (Y = 0.84)
    segments = [
      // 1. Ankle to Calf Bulge
      [
        new THREE.Vector2(ankleR, 0.0),
        new THREE.Vector2(ankleR * 1.05, 0.08),
        new THREE.Vector2(calfR * 0.95, 0.20),
        new THREE.Vector2(calfR, 0.28)
      ],
      // 2. Calf to Knee
      [
        new THREE.Vector2(calfR, 0.28),
        new THREE.Vector2(calfR * 0.9, 0.35),
        new THREE.Vector2(kneeR * 1.08, 0.42),
        new THREE.Vector2(kneeR, 0.46)
      ],
      // 3. Knee to Mid Thigh
      [
        new THREE.Vector2(kneeR, 0.46),
        new THREE.Vector2(kneeR * 1.15, 0.52),
        new THREE.Vector2(midR * 0.95, 0.62),
        new THREE.Vector2(midR, 0.68)
      ],
      // 4. Mid Thigh to Upper Thigh Root
      [
        new THREE.Vector2(midR, 0.68),
        new THREE.Vector2(midR * 1.08, 0.74),
        new THREE.Vector2(upperR * 0.96, 0.80),
        new THREE.Vector2(upperR, 0.84)
      ]
    ];
  }

  const profilePoints = sampleBezierProfile(segments, 8);
  const latheGeo = new THREE.LatheGeometry(profilePoints, radialSegments);

  // Offset center so leg hangs down from Y=0 to Y=-0.84
  latheGeo.translate(0, -0.84, 0);

  // Subtle calf back bulge deformation
  const pos = latheGeo.attributes.position;
  if (pos) {
    const posArr = pos.array as Float32Array;
    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const y = posArr[idx + 1] ?? 0;
      const z = posArr[idx + 2] ?? 0;

      // Calf back region (around Y = -0.56, z < 0)
      if (y > -0.65 && y < -0.45 && z < 0) {
        posArr[idx + 2] = z * 1.25; // Push calf backward
      }
    }
    pos.needsUpdate = true;
    latheGeo.computeVertexNormals();
  }

  return latheGeo;
}

export interface OrganicArmMetrics {
  readonly length?: number;        // ~0.54m
  readonly shoulderRadius?: number;// ~0.065m
  readonly bicepRadius?: number;   // ~0.052m
  readonly elbowRadius?: number;   // ~0.044m
  readonly forearmRadius?: number; // ~0.048m
  readonly wristRadius?: number;   // ~0.032m
}

/**
 * Builds an organic continuous anime arm tapering from shoulder to wrist.
 * Dựng cấu trúc cánh tay thon mềm nữ tính nối liền từ vai đến cổ tay.
 */
export function buildOrganicArmGeometry(
  metrics: OrganicArmMetrics = {},
  radialSegments = 20
): THREE.BufferGeometry {
  const shoulderR = metrics.shoulderRadius ?? 0.065;
  const bicepR = metrics.bicepRadius ?? 0.052;
  const elbowR = metrics.elbowRadius ?? 0.042;
  const forearmR = metrics.forearmRadius ?? 0.046;
  const wristR = metrics.wristRadius ?? 0.032;

  // Profile from wrist (Y = 0) up to shoulder (Y = 0.54)
  const segments: Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]> = [
    // 1. Wrist to Mid Forearm
    [
      new THREE.Vector2(wristR, 0.0),
      new THREE.Vector2(wristR * 1.08, 0.06),
      new THREE.Vector2(forearmR * 0.95, 0.15),
      new THREE.Vector2(forearmR, 0.20)
    ],
    // 2. Forearm to Elbow
    [
      new THREE.Vector2(forearmR, 0.20),
      new THREE.Vector2(forearmR * 0.95, 0.25),
      new THREE.Vector2(elbowR * 1.05, 0.28),
      new THREE.Vector2(elbowR, 0.30)
    ],
    // 3. Elbow to Bicep
    [
      new THREE.Vector2(elbowR, 0.30),
      new THREE.Vector2(elbowR * 1.1, 0.35),
      new THREE.Vector2(bicepR * 0.95, 0.42),
      new THREE.Vector2(bicepR, 0.45)
    ],
    // 4. Bicep to Shoulder
    [
      new THREE.Vector2(bicepR, 0.45),
      new THREE.Vector2(bicepR * 1.08, 0.48),
      new THREE.Vector2(shoulderR * 0.95, 0.51),
      new THREE.Vector2(shoulderR, 0.54)
    ]
  ];

  const profilePoints = sampleBezierProfile(segments, 8);
  const latheGeo = new THREE.LatheGeometry(profilePoints, radialSegments);
  latheGeo.translate(0, -0.54, 0);
  latheGeo.computeVertexNormals();
  return latheGeo;
}

/**
 * Builds an organic upper arm (shoulder to elbow) for articulated posing.
 * Dựng bắp tay trên (từ chỏm vai đến khớp khuỷu tay) cho phép khuỷu tay uốn cong tự nhiên.
 */
export function buildUpperArmGeometry(
  metrics: OrganicArmMetrics = {},
  radialSegments = 20
): THREE.BufferGeometry {
  const shoulderR = metrics.shoulderRadius ?? 0.056;
  const bicepR = metrics.bicepRadius ?? 0.046;
  const elbowR = metrics.elbowRadius ?? 0.038;
  const length = 0.26;

  // Profile from elbow (Y = 0) up to shoulder (Y = length)
  const segments: Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]> = [
    [
      new THREE.Vector2(elbowR, 0.0),
      new THREE.Vector2(elbowR * 1.05, length * 0.20),
      new THREE.Vector2(bicepR * 0.98, length * 0.50),
      new THREE.Vector2(bicepR, length * 0.65)
    ],
    [
      new THREE.Vector2(bicepR, length * 0.65),
      new THREE.Vector2(bicepR * 1.04, length * 0.80),
      new THREE.Vector2(shoulderR * 0.96, length * 0.92),
      new THREE.Vector2(shoulderR, length)
    ]
  ];

  const profilePoints = sampleBezierProfile(segments, 8);
  const latheGeo = new THREE.LatheGeometry(profilePoints, radialSegments);
  latheGeo.translate(0, -length, 0);
  latheGeo.computeVertexNormals();
  return latheGeo;
}

/**
 * Builds an organic forearm (elbow to wrist) for articulated posing.
 * Dựng cẳng tay dưới (từ khớp khuỷu tay đến cổ tay) mượt mà thanh thoát.
 */
export function buildForearmGeometry(
  metrics: OrganicArmMetrics = {},
  radialSegments = 20
): THREE.BufferGeometry {
  const elbowR = metrics.elbowRadius ?? 0.038;
  const forearmR = metrics.forearmRadius ?? 0.042;
  const wristR = metrics.wristRadius ?? 0.028;
  const length = 0.25;

  // Profile from wrist (Y = 0) up to elbow (Y = length)
  const segments: Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]> = [
    [
      new THREE.Vector2(wristR, 0.0),
      new THREE.Vector2(wristR * 1.08, length * 0.25),
      new THREE.Vector2(forearmR * 0.95, length * 0.60),
      new THREE.Vector2(forearmR, length * 0.75)
    ],
    [
      new THREE.Vector2(forearmR, length * 0.75),
      new THREE.Vector2(forearmR * 0.98, length * 0.88),
      new THREE.Vector2(elbowR * 1.02, length * 0.95),
      new THREE.Vector2(elbowR, length)
    ]
  ];

  const profilePoints = sampleBezierProfile(segments, 8);
  const latheGeo = new THREE.LatheGeometry(profilePoints, radialSegments);
  latheGeo.translate(0, -length, 0);
  latheGeo.computeVertexNormals();
  return latheGeo;
}

/**
 * Builds an articulated 5-finger sculpted anime hand.
 * Tạo bàn tay anime 5 ngón chi tiết (ngón cái, trỏ, giữa, áp út, út) với độ cong tự nhiên.
 */
export function buildArticulatedAnimeHand(
  isRight = false,
  matSkin: THREE.Material
): THREE.Group {
  const handGroup = new THREE.Group();
  handGroup.name = isRight ? 'Hand_Right' : 'Hand_Left';

  // Palm base (Tapered box with rounded corners)
  const palmGeo = new THREE.BoxGeometry(0.062, 0.075, 0.024);
  const palmMesh = new THREE.Mesh(palmGeo, matSkin);
  palmMesh.position.y = -0.038;
  handGroup.add(palmMesh);

  // 4 Main Fingers (Index, Middle, Ring, Pinky)
  const fingerLengths = [0.052, 0.058, 0.054, 0.044]; // Index, Middle, Ring, Pinky
  const fingerXOffsets = [-0.022, -0.007, 0.008, 0.022];

  for (let f = 0; f < 4; f++) {
    const len = fingerLengths[f] ?? 0.05;
    const xOff = fingerXOffsets[f] ?? 0;

    const fingerGroup = new THREE.Group();
    fingerGroup.position.set(xOff, -0.075, 0);

    // Proximal phalanx
    const p1Geo = new THREE.CylinderGeometry(0.0075, 0.0068, len * 0.55, 8);
    const p1 = new THREE.Mesh(p1Geo, matSkin);
    p1.position.y = -len * 0.275;
    p1.rotation.x = 0.12; // Natural resting curl
    fingerGroup.add(p1);

    // Distal phalanx with curved tip
    const p2Geo = new THREE.CylinderGeometry(0.0065, 0.0048, len * 0.45, 8);
    const p2 = new THREE.Mesh(p2Geo, matSkin);
    p2.position.set(0, -len * 0.72, 0.006);
    p2.rotation.x = 0.22;
    fingerGroup.add(p2);

    handGroup.add(fingerGroup);
  }

  // Thumb (Ngón cái đặt nghiêng góc tự nhiên)
  const thumbGroup = new THREE.Group();
  const thumbDir = isRight ? -1 : 1;
  thumbGroup.position.set(thumbDir * 0.034, -0.032, 0.008);
  thumbGroup.rotation.z = thumbDir * 0.55;
  thumbGroup.rotation.x = 0.35;

  const t1Geo = new THREE.CylinderGeometry(0.008, 0.007, 0.032, 8);
  const t1 = new THREE.Mesh(t1Geo, matSkin);
  t1.position.y = -0.016;
  thumbGroup.add(t1);

  const t2Geo = new THREE.CylinderGeometry(0.0068, 0.005, 0.026, 8);
  const t2 = new THREE.Mesh(t2Geo, matSkin);
  t2.position.set(0, -0.042, 0.004);
  t2.rotation.x = 0.25;
  thumbGroup.add(t2);

  handGroup.add(thumbGroup);

  return handGroup;
}

/**
 * Builds a beautifully sculpted 3D anime head with graceful feminine jawline,
 * soft rounded chin, subtle nose bridge, and gentle orbital recession.
 * Dựng khối đầu Anime 3D điêu khắc chuẩn tỷ lệ Waifu cao cấp (Genshin / Honkai):
 * - Hộp sọ cân đối hình elip thanh thoát (width: 0.150m, depth: 0.165m, height: 0.185m)
 * - Gò má cong mềm nữ tính, cằm V-line thon gọn có chóp bo tròn nhẹ (không nhọn hoắt như gai)
 * - Đường viền hàm cong lượn tự nhiên về phía sau tai tạo gầm cổ vững chãi
 * - Sống mũi và chóp mũi nhỏ nhắn xinh xắn
 * - Hốc mắt hơi lõm nhẹ tạo chiều sâu cho đôi mắt Anime có hồn.
 */
export function buildSculptedAnimeHeadGeometry(
  headRadius = 0.126,
  widthSegments = 64,
  heightSegments = 48
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(headRadius, widthSegments, heightSegments);
  const pos = geo.attributes.position;

  if (pos) {
    const posArr = pos.array as Float32Array;
    const count = pos.count;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = posArr[idx] ?? 0;
      let y = posArr[idx + 1] ?? 0;
      let z = posArr[idx + 2] ?? 0;

      // 1. Anime Cranium Oval Shaping (slender across temples, balanced back-to-front)
      x *= 0.92;
      z *= 1.02;

      // 2. Beautiful Compact Anime V-Line Jaw & Chin Contouring
      // Golden anime ratio: lower face is vertically compact (distance from mouth to chin ~3.5cm)
      if (y < 0.015) {
        // Compress vertical length of lower face so the chin ends at a cute, proportional height
        const lowerCompression = 0.56;
        y = 0.015 + (y - 0.015) * lowerCompression;

        // Normalized progress down from cheekbone to chin tip (0 at cheek, 1 at chin tip)
        const faceT = Math.min(1.0, Math.max(0, (0.015 - y) / (headRadius * lowerCompression * 0.95)));
        const taper = faceT * faceT * (3 - 2 * faceT);

        // Inward cheek-to-chin taper: graceful V-line with a cute rounded chin apex (width 22mm)
        const chinMinX = 0.014;
        const currentAbsX = Math.abs(x);
        if (currentAbsX > chinMinX) {
          const reduction = (currentAbsX - chinMinX) * taper * 0.52;
          x = Math.sign(x) * (currentAbsX - reduction);
        }

        // Cute forward chin projection: tilts subtly forward (+Z) for classic anime side profile
        if (z > 0) {
          z += taper * 0.012;
        }

        // Under-jaw recess (neck shelf behind chin): angles upward towards ears
        if (z < 0.01) {
          const jawAngleFactor = Math.max(0, -z / (headRadius * 0.7));
          y += taper * jawAngleFactor * 0.038;
        }
      }

      // 3. Delicate Anime Nose Bridge & Tip (centered, dainty highlight)
      if (y > -0.014 && y < 0.022 && z > headRadius * 0.60 && Math.abs(x) < 0.020) {
        const noseProximity = (1.0 - Math.abs(x) / 0.020) * (1.0 - Math.abs(y - 0.004) / 0.018);
        z += Math.max(0, noseProximity) * 0.010;
      }

      // 4. Soft Orbital Recession (Eye socket depth for expressive anime gaze)
      if (y > 0.005 && y < 0.065 && z > headRadius * 0.55 && Math.abs(x) > 0.018 && Math.abs(x) < 0.062) {
        const eyeCenterDist = Math.hypot(Math.abs(x) - 0.040, y - 0.035);
        if (eyeCenterDist < 0.030) {
          const eyeIndent = (1.0 - eyeCenterDist / 0.030) * 0.005;
          z -= eyeIndent;
        }
      }

      posArr[idx] = x;
      posArr[idx + 1] = y;
      posArr[idx + 2] = z;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  return geo;
}

/**
 * Builds a seamless curved conformal face plate geometry that hugs the front of the sculpted anime head.
 * Shell bao trùm toàn bộ diện mạo từ trán (dưới tóc mái) qua má (dưới tóc mai) tới gầm cằm,
 * khớp 100% với hộp sọ điêu khắc V-line nhỏ nhắn xinh xắn.
 */
export function buildConformalFaceGeometry(
  headRadius = 0.126,
  widthSegments = 48,
  heightSegments = 36
): THREE.BufferGeometry {
  // Spans from upper forehead, around to temple sides under sidelocks, and tucks under the chin
  const phiSweep = Math.PI * 0.74;
  const phiStart = (Math.PI - phiSweep) / 2;
  const thetaStart = Math.PI * 0.20;
  const thetaSweep = Math.PI * 0.64;

  const geo = new THREE.SphereGeometry(
    headRadius * 1.004,
    widthSegments,
    heightSegments,
    phiStart,
    phiSweep,
    thetaStart,
    thetaSweep
  );

  const pos = geo.attributes.position;
  if (pos) {
    const posArr = pos.array as Float32Array;
    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = posArr[idx] ?? 0;
      let y = posArr[idx + 1] ?? 0;
      let z = posArr[idx + 2] ?? 0;

      // Identical anatomical deformations so the conformal shell hugs the head like a second skin
      x *= 0.92;
      z *= 1.02;

      if (y < 0.015) {
        const lowerCompression = 0.56;
        y = 0.015 + (y - 0.015) * lowerCompression;

        const faceT = Math.min(1.0, Math.max(0, (0.015 - y) / (headRadius * lowerCompression * 0.95)));
        const taper = faceT * faceT * (3 - 2 * faceT);

        const chinMinX = 0.014;
        const currentAbsX = Math.abs(x);
        if (currentAbsX > chinMinX) {
          const reduction = (currentAbsX - chinMinX) * taper * 0.52;
          x = Math.sign(x) * (currentAbsX - reduction);
        }

        if (z > 0) {
          z += taper * 0.012;
        }

        if (z < 0.01) {
          const jawAngleFactor = Math.max(0, -z / (headRadius * 0.7));
          y += taper * jawAngleFactor * 0.038;
        }
      }

      if (y > -0.014 && y < 0.022 && z > headRadius * 0.60 && Math.abs(x) < 0.020) {
        const noseProximity = (1.0 - Math.abs(x) / 0.020) * (1.0 - Math.abs(y - 0.004) / 0.018);
        z += Math.max(0, noseProximity) * 0.010;
      }

      if (y > 0.005 && y < 0.065 && z > headRadius * 0.55 && Math.abs(x) > 0.018 && Math.abs(x) < 0.062) {
        const eyeCenterDist = Math.hypot(Math.abs(x) - 0.040, y - 0.035);
        if (eyeCenterDist < 0.030) {
          const eyeIndent = (1.0 - eyeCenterDist / 0.030) * 0.005;
          z -= eyeIndent;
        }
      }

      posArr[idx] = x;
      posArr[idx + 1] = y;
      posArr[idx + 2] = z;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  return geo;
}

export interface HairLockParams {
  readonly length: number;
  readonly baseWidth: number;
  readonly midWidth: number;
  readonly tipWidth: number;
  readonly thickness: number;
  readonly curveForward: number;
  readonly curveLateral: number;
  readonly steps?: number;
}

/**
 * Builds a smooth, curved 3D volumetric anime hair lock with natural rounded curvature.
 * Dựng lọn tóc anime 3D mượt mà với thiết diện vòm cong tự nhiên (không bị gãy góc nhọn hình tam giác thô sơ).
 */
export function buildStylizedAnimeHairLockGeometry(
  params: HairLockParams
): THREE.BufferGeometry {
  const steps = params.steps ?? 10;
  const vertices: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];

  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const y = -params.length * t;
    const centerZ = params.curveForward * (t * t);
    const centerX = params.curveLateral * (t * t * (3 - 2 * t));

    let w = 0.01;
    if (t < 0.35) {
      const u = t / 0.35;
      w = params.baseWidth * (1 - u) + params.midWidth * u;
    } else {
      const u = (t - 0.35) / 0.65;
      w = params.midWidth * (1 - u) + params.tipWidth * u;
    }
    const d = params.thickness * (1.0 - t * 0.75);
    const halfW = w * 0.5;

    // 6-vertex cross-section for smooth, curved anime hair cylinder:
    // 0: left edge (u = -1)
    // 1: left-mid arch (u = -0.5, z + d*0.75)
    // 2: center crest (u = 0, z + d)
    // 3: right-mid arch (u = 0.5, z + d*0.75)
    // 4: right edge (u = 1)
    // 5: back depth (u = 0, z - d*0.35)
    vertices.push(
      centerX - halfW, y, centerZ,
      centerX - halfW * 0.5, y, centerZ + d * 0.75,
      centerX, y, centerZ + d,
      centerX + halfW * 0.5, y, centerZ + d * 0.75,
      centerX + halfW, y, centerZ,
      centerX, y, centerZ - d * 0.35
    );

    uvs.push(
      0.00, t,
      0.25, t,
      0.50, t,
      0.75, t,
      1.00, t,
      0.50, t
    );

    if (s < steps) {
      const b = s * 6;
      const n = (s + 1) * 6;

      // Front smooth arched faces
      indices.push(b + 0, b + 1, n + 1);
      indices.push(b + 0, n + 1, n + 0);

      indices.push(b + 1, b + 2, n + 2);
      indices.push(b + 1, n + 2, n + 1);

      indices.push(b + 2, b + 3, n + 3);
      indices.push(b + 2, n + 3, n + 2);

      indices.push(b + 3, b + 4, n + 4);
      indices.push(b + 3, n + 4, n + 3);

      // Back volume closure faces
      indices.push(b + 4, b + 5, n + 5);
      indices.push(b + 4, n + 5, n + 4);

      indices.push(b + 5, b + 0, n + 0);
      indices.push(b + 5, n + 0, n + 5);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds an aerodynamic, curved winged pauldron armor plate that hugs the deltoid.
 * Giáp vai cánh chiến thần Valkyrie uốn cong khí động học ôm khít lấy bờ vai thon.
 */
export function buildWingedPauldronGeometry(): THREE.BufferGeometry {
  // Curved anatomical shoulder cap hugging the deltoid smoothly (scaled down to prevent bowl look)
  const geo = new THREE.SphereGeometry(
    0.056,
    24,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.50
  );
  // Scale and flare into an aerodynamic Valkyrie winged shoulder armor plate
  geo.scale(1.08, 0.88, 1.15);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds an aerodynamic, contoured Valkyrie fauld/tasset armor blade for the hips.
 * Giáp hông cánh Valkyrie vát cạnh khí động học, ôm sát tôn vòng eo và hông quả táo.
 */
export function buildWingedTassetGeometry(isRight: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const dir = isRight ? 1 : -1;

  // Sleek, compact Valkyrie hip armor fin hugging the outer thigh
  shape.moveTo(0, 0.08);
  shape.lineTo(dir * 0.075, 0.04);
  shape.lineTo(dir * 0.085, -0.05);
  shape.lineTo(dir * 0.045, -0.12);
  shape.lineTo(0, -0.09);
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.014,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.004,
    bevelThickness: 0.004
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds an elegant, streamlined anime high-heel combat sabaton.
 * Giày bốt chiến đấu cao gót Anime sắc sảo:
 * - Cổ giày ôm khít cổ chân
 * - Mu bàn chân dốc cong mềm mại (High-heel arch)
 * - Mũi giày bọc thép vuốt nhọn kiêu sa
 * - Gót nhọn stiletto thanh thoát chuẩn phong cách Valkyrie.
 */
export function buildAnimeSabatonGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();

  // Side profile of a sleek high-heel boot foot
  // Ankle at top (y = 0.08, z = -0.04 to 0.02)
  shape.moveTo(-0.04, 0.08);  // Back heel collar
  shape.lineTo(-0.05, -0.01); // Back heel counter
  shape.lineTo(-0.03, -0.05); // Heel seat
  shape.lineTo(0.04, -0.05);  // Soles under ball of foot
  shape.lineTo(0.13, -0.04);  // Pointed armored toe
  shape.lineTo(0.11, -0.01);  // Toe cap top
  shape.lineTo(0.03, 0.04);   // Instep arch slope
  shape.lineTo(0.01, 0.08);   // Front ankle cuff
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.068,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.006,
    bevelThickness: 0.006
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  // Rotate so Z points forward and Y points up
  geo.rotateY(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}
