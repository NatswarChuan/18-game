import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ClothDamageTier, VALKYRIE_ROSTER, getValkyrieById } from '@valkyrie/shared-domain';
import { createValkyrie3DModel } from '../models/valkyries/valkyrie-model-registry.js';
import { createPrismaticValkyrieInstance } from '../models/valkyries/prismatic/prismatic-model-instance.js';
import { loadValkyrieGLTFModel } from '../models/valkyries/loaders/valkyrie-gltf-loader.js';
import { loadZaneAtegaDeniaModel, DeniaPoseMode, DeniaFBXModelInstance } from '../models/valkyries/loaders/valkyrie-fbx-loader.js';
import { applyZaneAtegaShadersToModel } from '../models/valkyries/anime-shader/zane-atega-anime-shader.js';
import { Valkyrie3DModelInstance } from '../models/valkyries/valkyrie-3d-types.js';
import { soundManager } from '../utils/sound.js';

export type StudioDisplayMode = 'DENIA_3D_AAA' | 'PRISMATIC_AAA' | 'GLTF_CUSTOM' | 'PROCEDURAL';

export interface Valkyrie3DStudioProps {
  readonly initialValkyrieId?: string | undefined;
  readonly onBackToGame?: (() => void) | undefined;
}

/**
 * Dedicated 3D Inspection Studio & Evaluation Suite for 27 Valkyries.
 * Phòng Lab Trực Quan 3D & Soi Chi Tiết Từng Nữ Chiến Binh:
 * Hỗ trợ xoay 360 độ, zoom cận cảnh khuôn mặt/ngực/vũ khí, đổi cấp độ rách giáp Tier 1-3,
 * và kích hoạt hoạt ảnh tuyệt kỹ để thẩm định trước khi đưa vào trận đấu.
 */
export const Valkyrie3DStudio: React.FC<Valkyrie3DStudioProps> = ({
  initialValkyrieId = 'VALK-01',
  onBackToGame
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedValkId, setSelectedValkId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('valk') ?? initialValkyrieId;
    }
    return initialValkyrieId;
  });
  const [displayMode, setDisplayMode] = useState<StudioDisplayMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const disp = params.get('display');
      if (disp === 'zane') return 'DENIA_3D_AAA';
      if (disp === 'prismatic') return 'PRISMATIC_AAA';
      if (disp === 'gltf') return 'GLTF_CUSTOM';
      if (disp === 'procedural') return 'PROCEDURAL';
    }
    return 'DENIA_3D_AAA';
  });
  const [deniaPose, setDeniaPose] = useState<DeniaPoseMode>('STAND');
  const [customModelFileName, setCustomModelFileName] = useState<string | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const customGltfInstanceRef = useRef<Valkyrie3DModelInstance | null>(null);

  const [clothTier, setClothTier] = useState<ClothDamageTier>(1);
  const clothTierRef = useRef<ClothDamageTier>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const isAutoRotatingRef = useRef<boolean>(false);
  isAutoRotatingRef.current = isAutoRotating;
  const [activeAnim, setActiveAnim] = useState<string>('IDLE');
  const [isLoopingAnim, setIsLoopingAnim] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const handleSelectDeniaPose = (pose: DeniaPoseMode): void => {
    setDeniaPose(pose);
    if (modelInstanceRef.current && 'setPose' in modelInstanceRef.current) {
      void (modelInstanceRef.current as DeniaFBXModelInstance).setPose(pose);
    }
  };

  const handleSelectTier = (tier: ClothDamageTier): void => {
    setClothTier(tier);
    clothTierRef.current = tier;
    if (modelInstanceRef.current) {
      modelInstanceRef.current.setClothTier(tier);
    }
    soundManager.playClothDamageTier(tier);
    screenShakeRef.current = tier === 3 ? 0.35 : tier === 2 ? 0.16 : 0.0;
    if (flashLightRef.current) {
      flashLightRef.current.color.setHex(tier === 3 ? 0xff0055 : tier === 2 ? 0xffd700 : 0x00f0ff);
      flashLightRef.current.intensity = tier === 3 ? 8.5 : tier === 2 ? 4.5 : 1.0;
    }
  };

  const activeAnimRef = useRef<string>('IDLE');
  activeAnimRef.current = activeAnim;
  const isLoopingAnimRef = useRef<boolean>(false);
  isLoopingAnimRef.current = isLoopingAnim;
  const loopTimerRef = useRef<number>(0);

  const modelInstanceRef = useRef<Valkyrie3DModelInstance | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orbitRef = useRef({ theta: 0.05, phi: 1.35, radius: 2.85, targetY: 0.88 });
  const currentOrbitRef = useRef({ theta: 0.05, phi: 1.35, radius: 2.85, targetY: 0.88 });
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const mouseDownPosRef = useRef({ x: 0, y: 0 });
  const cursorPosRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const screenShakeRef = useRef<number>(0);
  const flashLightRef = useRef<THREE.PointLight | null>(null);

  const currentValk = getValkyrieById(selectedValkId) ?? VALKYRIE_ROSTER[0];

  const handleSelectValk = (valkId: string): void => {
    setSelectedValkId(valkId);
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?mode=model-viewer&valk=${valkId}`;
      window.history.replaceState(null, '', newUrl);
    }
  };

  const handleCopyDirectUrl = (): void => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}?mode=model-viewer&valk=${selectedValkId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }).catch(() => {
      // Fallback
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060810);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // 2. Post-Processing Pipeline (Balanced Celestial Anime Unreal Bloom)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.70, // strength - gentle ethereal anime radiance
      0.32, // radius - smooth halo falloff
      1.04  // threshold - only emissive lasers, photon wings & energy cores bloom (preserves crisp face & skin)
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // Ambient Floating Cyber Dust & Stardust Embers (120 particles)
    const stardustCount = 120;
    const stardustPositions = new Float32Array(stardustCount * 3);
    const stardustColors = new Float32Array(stardustCount * 3);
    for (let i = 0; i < stardustCount; i++) {
      stardustPositions[i * 3] = (Math.random() - 0.5) * 5.0;
      stardustPositions[i * 3 + 1] = Math.random() * 3.5;
      stardustPositions[i * 3 + 2] = (Math.random() - 0.5) * 5.0;

      const isCyan = Math.random() > 0.45;
      stardustColors[i * 3] = isCyan ? 0.0 : 1.0;
      stardustColors[i * 3 + 1] = isCyan ? 0.94 : 0.05;
      stardustColors[i * 3 + 2] = isCyan ? 1.0 : 0.55;
    }
    const stardustGeo = new THREE.BufferGeometry();
    stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPositions, 3));
    stardustGeo.setAttribute('color', new THREE.BufferAttribute(stardustColors, 3));

    const stardustCanvas = document.createElement('canvas');
    stardustCanvas.width = 32;
    stardustCanvas.height = 32;
    const sCtx = stardustCanvas.getContext('2d');
    if (sCtx) {
      const g = sCtx.createRadialGradient(16, 16, 1, 16, 16, 15);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.35, 'rgba(255, 255, 255, 0.7)');
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sCtx.fillStyle = g;
      sCtx.beginPath();
      sCtx.arc(16, 16, 15, 0, Math.PI * 2);
      sCtx.fill();
    }
    const stardustTex = new THREE.CanvasTexture(stardustCanvas);
    const stardustMat = new THREE.PointsMaterial({
      size: 0.065,
      map: stardustTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const stardustPoints = new THREE.Points(stardustGeo, stardustMat);
    scene.add(stardustPoints);

    // 3. Balanced Anime Studio Lighting Setup (Rich cel-shading depth, eliminates washed-out faces)
    const ambientLight = new THREE.AmbientLight(0x383042, 0.35);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff2ec, 0x181220, 0.30);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf2, 0.85);
    keyLight.position.set(1.8, 3.2, 2.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe4e0fa, 0.30);
    fillLight.position.set(-2.2, 1.8, 1.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff1855, 0.85);
    rimLight.position.set(2.0, 2.8, -2.6);
    scene.add(rimLight);

    // Electric Cyan Back-Left Rim Light for Cyberpunk Anime dual-tone silhouette glow
    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 0.90);
    cyanRimLight.position.set(-2.4, 2.4, -2.6);
    scene.add(cyanRimLight);

    // Soft Anime Decolletage & Chin Bounce Light to soften harsh under-chin/under-breast shadows
    const bounceLight = new THREE.DirectionalLight(0xffded4, 0.15);
    bounceLight.position.set(0, 0.2, 2.2);
    scene.add(bounceLight);

    // Dedicated Anime Face & Beauty Ring-Light for glowing porcelain complexion without harsh gloomy shadows
    const faceBeautyLight = new THREE.DirectionalLight(0xfff8f2, 0.25);
    faceBeautyLight.position.set(0, 1.55, 1.8);
    scene.add(faceBeautyLight);

    // Combat Flash Point Light for dynamic impact illumination
    const flashLight = new THREE.PointLight(0xff0066, 0, 10);
    flashLight.position.set(0, 1.4, 0.6);
    scene.add(flashLight);
    flashLightRef.current = flashLight;

    // 3. Studio Stage Floor (Reflective mirror podium with faction neon ring & contact shadow)
    const faction = currentValk?.faction ?? 'NEO_VALHALLA';
    const primaryColor = faction === 'NEO_VALHALLA' ? 0x00f0ff : faction === 'ABYSSAL_EDEN' ? 0xff2a85 : 0xffd700;

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const floorGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090c18,
      metalness: 0.85,
      roughness: 0.25
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.04;
    stageGroup.add(floorMesh);

    // Glowing Faction Rune Ring
    const ringGeo = new THREE.RingGeometry(1.35, 1.55, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.005;
    stageGroup.add(ringMesh);

    // Soft Contact Ground Shadow directly under feet for grounded presence
    const shadowGeo = new THREE.RingGeometry(0.01, 0.48, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x02040a,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.003;
    stageGroup.add(shadowMesh);

    // 4 Perimeter Hologram Projector Emitters
    const emitterAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    emitterAngles.forEach((ang) => {
      const ex = Math.cos(ang) * 1.45;
      const ez = Math.sin(ang) * 1.45;
      const eMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.07, 0.03, 16),
        new THREE.MeshStandardMaterial({
          color: 0x1a2236,
          metalness: 0.9,
          roughness: 0.2,
          emissive: primaryColor,
          emissiveIntensity: 0.4
        })
      );
      eMesh.position.set(ex, -0.015, ez);
      stageGroup.add(eMesh);
    });

    const gridHelper = new THREE.GridHelper(6, 24, primaryColor, 0x162035);
    gridHelper.position.y = -0.042;
    scene.add(gridHelper);

    // 4. Dedicated Character Container (Ensures ONLY ONE model is ever rendered, 0 overlap)
    let isDisposed = false;
    const characterContainer = new THREE.Group();
    characterContainer.name = 'Studio_Character_Container';
    scene.add(characterContainer);

    (window as any).__studio = {
      scene,
      camera,
      renderer,
      characterContainer,
      getModel: () => modelInstanceRef.current
    };

    let activeModelInstance: Valkyrie3DModelInstance | null = null;

    const setLoadedModel = (instance: Valkyrie3DModelInstance): void => {
      if (isDisposed) {
        instance.dispose();
        return;
      }
      characterContainer.clear();
      if (activeModelInstance && activeModelInstance !== customGltfInstanceRef.current) {
        activeModelInstance.dispose();
      }
      activeModelInstance = instance;
      modelInstanceRef.current = instance;
      characterContainer.add(instance.rootGroup);
      setIsLoadingModel(false);
      console.log('>>> Studio: Successfully attached model to scene:', instance.rootGroup.name);
    };

    if (displayMode === 'GLTF_CUSTOM' && customGltfInstanceRef.current) {
      setLoadedModel(customGltfInstanceRef.current);
    } else if (displayMode === 'PROCEDURAL') {
      const procedural = createValkyrie3DModel({
        valkyrieId: selectedValkId,
        faction,
        tier: clothTier,
        isEnemy: false,
        primaryColor
      });
      setLoadedModel(procedural);
    } else if (displayMode === 'DENIA_3D_AAA') {
      setIsLoadingModel(true);
      void loadZaneAtegaDeniaModel({
        valkyrieId: selectedValkId,
        faction,
        tier: clothTier,
        isEnemy: false,
        primaryColor
      }, deniaPose).then((deniaInstance) => {
        setLoadedModel(deniaInstance);
      }).catch((err) => {
        console.error('Failed to load ZaneAtega Denia model, falling back to Prismatic AAA:', err);
        setIsLoadingModel(false);
        const prismatic = createPrismaticValkyrieInstance({
          valkyrieId: selectedValkId,
          faction,
          tier: clothTier,
          isEnemy: false,
          primaryColor
        });
        setLoadedModel(prismatic);
      });
    } else {
      // Default PRISMATIC_AAA (Visual Anime 18+ cực phẩm từ Artwork chuẩn với lăng kính 3D)
      const prismatic = createPrismaticValkyrieInstance({
        valkyrieId: selectedValkId,
        faction,
        tier: clothTier,
        isEnemy: false,
        primaryColor
      });
      setLoadedModel(prismatic);
    }

    // 5. Render & Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = (): void => {
      animationFrameId = requestAnimationFrame(animate);
      // Cap delta time to 1/20s (50ms) to prevent animation jerk/stutter during frame spikes
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05);
      const elapsedTime = clock.getElapsedTime();

      if (isAutoRotatingRef.current && !isDraggingRef.current) {
        orbitRef.current.theta += delta * 0.45;
      }

      // Cinematic Camera Damping (Smooth Gliding for Turntable, Preset Switching & Zooming)
      const camSmooth = 1.0 - Math.exp(-9.5 * delta);
      currentOrbitRef.current.theta = THREE.MathUtils.lerp(currentOrbitRef.current.theta, orbitRef.current.theta, camSmooth);
      currentOrbitRef.current.phi = THREE.MathUtils.lerp(currentOrbitRef.current.phi, orbitRef.current.phi, camSmooth);
      currentOrbitRef.current.radius = THREE.MathUtils.lerp(currentOrbitRef.current.radius, orbitRef.current.radius, camSmooth);
      currentOrbitRef.current.targetY = THREE.MathUtils.lerp(currentOrbitRef.current.targetY, orbitRef.current.targetY, camSmooth);

      const { theta, phi, radius, targetY } = currentOrbitRef.current;
      const camX = radius * Math.sin(phi) * Math.sin(theta);
      const camY = targetY + radius * Math.cos(phi);
      const camZ = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.set(camX, camY, camZ);

      // Dynamic Camera Screen Shake for combat feedback (Smooth harmonic damped impulse)
      if (screenShakeRef.current > 0.001) {
        screenShakeRef.current = Math.max(0, screenShakeRef.current - delta * 3.6);
        const shakePhase = elapsedTime * 32.0;
        const shakeMag = screenShakeRef.current * 0.12;
        const shakeX = Math.sin(shakePhase) * shakeMag;
        const shakeY = Math.cos(shakePhase * 1.3) * shakeMag * 0.75;
        camera.position.x += shakeX;
        camera.position.y += shakeY;
      }

      camera.lookAt(0, targetY, 0);

      // Combat flash light intensity decay with exponential optical damping
      if (flashLight.intensity > 0.01) {
        flashLight.intensity = THREE.MathUtils.damp(flashLight.intensity, 0, 5.0, delta);
      } else {
        flashLight.intensity = 0;
      }

      // Pulse Stage Rune Ring
      ringMesh.rotation.z = elapsedTime * 0.2;

      // Update Valkyrie animations (breathing, hair sway, combat gestures)
      if (activeModelInstance) {
        activeModelInstance.update(delta, elapsedTime, {
          currentHp: 1000,
          maxHp: 1000,
          currentMana: 100,
          maxMana: 100,
          tier: clothTierRef.current,
          isEnemy: false,
          isCasting: false,
          isAlive: true,
          cameraPosition: camera.position,
          cursorPosition: cursorPosRef.current
        });
      }

      // Continuous Animation Looping if enabled
      const currentActive = activeAnimRef.current;
      if (isLoopingAnimRef.current && currentActive !== 'IDLE' && activeModelInstance) {
        loopTimerRef.current += delta;
        const cycleDuration = currentActive === 'ULTIMATE' ? 2.40 : currentActive === 'POKE' ? 1.80 : 1.40;
        if (loopTimerRef.current >= cycleDuration) {
          loopTimerRef.current = 0;
          if (currentActive === 'ATTACK') {
            activeModelInstance.triggerAttack();
            screenShakeRef.current = 0.16;
            if (flashLightRef.current) {
              flashLightRef.current.color.setHex(0xff0055);
              flashLightRef.current.intensity = 5.0;
            }
          } else if (currentActive === 'ULTIMATE') {
            activeModelInstance.triggerUltimate();
            screenShakeRef.current = 0.45;
            if (flashLightRef.current) {
              flashLightRef.current.color.setHex(0x00f0ff);
              flashLightRef.current.intensity = 8.5;
            }
          } else if (currentActive === 'HIT') {
            activeModelInstance.triggerHit();
          } else if (currentActive === 'POKE') {
            activeModelInstance.triggerPoke?.();
            screenShakeRef.current = 0.05;
            if (flashLightRef.current) {
              flashLightRef.current.color.setHex(0xff77aa);
              flashLightRef.current.intensity = 4.0;
            }
          }
        }
      }

      // Drift ambient stardust gently upward
      const sdPos = stardustGeo.attributes.position;
      if (sdPos) {
        for (let i = 0; i < stardustCount; i++) {
          const idx = i * 3;
          stardustPositions[idx + 1] = (stardustPositions[idx + 1] ?? 0) + delta * 0.14;
          stardustPositions[idx] = (stardustPositions[idx] ?? 0) + Math.sin(elapsedTime * 0.8 + i) * (delta * 0.035);
          if ((stardustPositions[idx + 1] ?? 0) > 3.5) {
            stardustPositions[idx + 1] = 0.02;
          }
        }
        sdPos.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Listener
    const handleResize = (): void => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (activeModelInstance && activeModelInstance !== customGltfInstanceRef.current) {
        activeModelInstance.dispose();
      }
      characterContainer.clear();
      composer.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      const gl = renderer.getContext();
      if (gl && gl.getExtension('WEBGL_lose_context')) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      stardustGeo.dispose();
      stardustMat.dispose();
      stardustTex.dispose();
      stageGroup.clear();
      scene.clear();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [selectedValkId, displayMode]);

  const handleFileUpload = async (file: File): Promise<void> => {
    try {
      setIsLoadingModel(true);
      const faction = currentValk?.faction ?? 'NEO_VALHALLA';
      const primaryColor = faction === 'NEO_VALHALLA' ? 0x00f0ff : faction === 'ABYSSAL_EDEN' ? 0xff2a85 : 0xffd700;
      const result = await loadValkyrieGLTFModel(file, {
        valkyrieId: selectedValkId,
        faction,
        tier: clothTierRef.current,
        isEnemy: false,
        primaryColor
      });
      applyZaneAtegaShadersToModel(result.instance.rootGroup);
      if (customGltfInstanceRef.current) {
        customGltfInstanceRef.current.dispose();
      }
      customGltfInstanceRef.current = result.instance;
      setCustomModelFileName(file.name);
      setDisplayMode('GLTF_CUSTOM');
    } catch (err) {
      console.error('Lỗi khi nạp file 3D:', err);
    } finally {
      setIsLoadingModel(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  // Handle Mouse Drag for 360 Degree Orbit Camera
  const handleMouseDown = (e: React.MouseEvent): void => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    cursorPosRef.current.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    orbitRef.current.theta -= deltaX * 0.008;
    orbitRef.current.phi = Math.max(0.2, Math.min(Math.PI - 0.2, orbitRef.current.phi - deltaY * 0.008));
  };

  const handleMouseUp = (e: React.MouseEvent): void => {
    isDraggingRef.current = false;
    const distSq = (e.clientX - mouseDownPosRef.current.x) ** 2 + (e.clientY - mouseDownPosRef.current.y) ** 2;
    if (distSq < 36 && modelInstanceRef.current?.triggerPoke) {
      modelInstanceRef.current.triggerPoke();
      soundManager.playClothDamageTier(clothTierRef.current);
      screenShakeRef.current = 0.06;
      if (flashLightRef.current) {
        flashLightRef.current.color.setHex(0xff77aa);
        flashLightRef.current.intensity = 4.0;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent): void => {
    orbitRef.current.radius = Math.max(1.1, Math.min(5.5, orbitRef.current.radius + e.deltaY * 0.003));
  };

  const setCameraPreset = (preset: 'FULL' | 'FACE' | 'BUST' | 'WEAPON'): void => {
    const isDenia = displayMode === 'DENIA_3D_AAA';
    const isKara = selectedValkId === 'VALK-04';
    const isAlvitr = selectedValkId === 'VALK-05';
    const isMist = selectedValkId === 'VALK-06';
    const isHerja = selectedValkId === 'VALK-07';
    const isRota = selectedValkId === 'VALK-08';
    const isGondul = selectedValkId === 'VALK-09';
    const setShortestOrbitTarget = (targetTheta: number, phi: number, radius: number, targetY: number): void => {
      const curTheta = currentOrbitRef.current.theta;
      const angleDiff = ((targetTheta - curTheta) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      orbitRef.current = {
        theta: curTheta + angleDiff,
        phi,
        radius,
        targetY
      };
    };

    if (preset === 'FULL') {
      setShortestOrbitTarget(
        isDenia ? 0.05 : 0.35,
        isDenia ? 1.34 : 1.25,
        isDenia ? 2.85 : 2.8,
        isDenia ? 0.88 : isAlvitr ? 1.15 : 1.05
      );
    } else if (preset === 'FACE') {
      setIsAutoRotating(false);
      setShortestOrbitTarget(
        isDenia ? 0.0 : isGondul ? 0.05 : isRota ? 0.08 : isHerja ? -0.1 : isMist ? 0.05 : isAlvitr ? 0.05 : isKara ? -0.15 : 0.02,
        isDenia ? 1.50 : 1.48,
        isDenia ? 0.72 : 0.95,
        isDenia ? 1.48 : isGondul ? 1.48 : isRota ? 1.50 : isHerja ? 1.54 : isMist ? 1.48 : isAlvitr ? 1.62 : isKara ? 1.48 : 1.64
      );
    } else if (preset === 'BUST') {
      setIsAutoRotating(false);
      setShortestOrbitTarget(
        isDenia ? 0.05 : isGondul ? 0.08 : isRota ? 0.12 : isHerja ? 0.15 : isMist ? 0.15 : isAlvitr ? 0.1 : isKara ? -0.35 : 0.05,
        isDenia ? 1.42 : 1.38,
        isDenia ? 1.05 : 1.15,
        isDenia ? 1.18 : isGondul ? 1.22 : isRota ? 1.24 : isHerja ? 1.28 : isMist ? 1.23 : isAlvitr ? 1.26 : isKara ? 1.14 : 1.26
      );
    } else if (preset === 'WEAPON') {
      setIsAutoRotating(false);
      setShortestOrbitTarget(
        isDenia ? 0.35 : isGondul ? -0.45 : isRota ? 0.85 : isHerja ? -0.55 : isMist ? 0.65 : isAlvitr ? -0.65 : isKara ? 1.45 : 0.45,
        1.30,
        isDenia ? 1.75 : isGondul ? 1.6 : isRota ? 1.85 : isHerja ? 2.1 : isMist ? 1.65 : isAlvitr ? 1.45 : 1.8,
        isDenia ? 1.05 : isGondul ? 1.35 : isRota ? 1.24 : isHerja ? 1.55 : isMist ? 1.35 : isAlvitr ? 1.12 : isKara ? 1.05 : 1.10
      );
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#060810',
        color: '#ffffff',
        userSelect: 'none',
        fontFamily: "'Rajdhani', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf') || file.name.endsWith('.vrm'))) {
          void handleFileUpload(file);
        }
      }}
    >
      {/* Hidden File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".glb,.gltf,.vrm"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      <style>{`
        @keyframes climaxPulse {
          0% { opacity: 0.65; }
          50% { opacity: 1.0; }
          100% { opacity: 0.75; }
        }
      `}</style>

      {/* 18+ Climax & Torn Battle-Damage Screen Edge Vignette */}
      {clothTier === 3 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 4,
            boxShadow: 'inset 0 0 130px rgba(255, 0, 85, 0.45), inset 0 0 45px rgba(255, 50, 130, 0.70)',
            animation: 'climaxPulse 1.1s ease-in-out infinite alternate'
          }}
        />
      )}
      {clothTier === 2 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 4,
            boxShadow: 'inset 0 0 85px rgba(255, 170, 0, 0.32), inset 0 0 30px rgba(255, 200, 50, 0.40)',
            transition: 'box-shadow 0.6s ease'
          }}
        />
      )}

      {/* Drag & Drop Overlay */}
      {isDraggingFile && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 240, 255, 0.22)',
            border: '3px dashed #00F0FF',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span style={{ fontSize: '54px' }}>📥</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00F0FF', marginTop: '12px', fontFamily: "'Orbitron', sans-serif" }}>
            THẢ FILE MODEL 3D VÀO ĐÂY (.GLB / .GLTF / .VRM)
          </div>
          <div style={{ fontSize: '12px', color: '#ffffff', opacity: 0.85, marginTop: '6px', fontFamily: 'monospace' }}>
            Tự động tích hợp ZaneAtega Anime Cel-Shading & Tỷ lệ chuẩn 1.72m
          </div>
        </div>
      )}

      {/* Model Loading Spinner */}
      {isLoadingModel && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '16px 28px',
            backgroundColor: 'rgba(9, 12, 24, 0.96)',
            border: '1px solid #00F0FF',
            borderRadius: '14px',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 0 32px rgba(0, 240, 255, 0.5)'
          }}
        >
          <div style={{ width: '22px', height: '22px', border: '3px solid #00F0FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '13px', color: '#00F0FF', fontWeight: 'bold', fontFamily: 'monospace' }}>
            Đang nạp Model 3D & Nâng Cấp ZaneAtega Anime Shader...
          </span>
        </div>
      )}
      {/* Three.js 3D Viewport */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: isDraggingRef.current ? 'grabbing' : 'grab'
        }}
      />

      {/* Top Header Bar */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '52px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(6, 8, 16, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>💃</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: '13px',
                  letterSpacing: '0.08em',
                  color: '#00F0FF',
                  margin: 0,
                  textTransform: 'uppercase'
                }}
              >
                VALKYRIE 3D STUDIO • SOI CHI TIẾT MODEL
              </h1>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255, 42, 133, 0.18)',
                  border: '1px solid #FF2A85',
                  color: '#FF2A85',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
              >
                18+ ANIME READY
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '10px', color: '#949bb3', fontFamily: 'monospace' }}>
              Chuột trái xoay 360° • Cuộn chuột zoom • Thẩm định tỷ lệ cơ thể, rách giáp 3 cấp độ & động tác
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCopyDirectUrl}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: copiedUrl ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: copiedUrl ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              color: copiedUrl ? '#00F0FF' : '#ffffff',
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {copiedUrl ? '✓ ĐÃ SAO CHÉP URL!' : '🔗 SAO CHÉP URL MODEL'}
          </button>

          {onBackToGame && (
            <button
              onClick={onBackToGame}
              style={{
                padding: '6px 16px',
                borderRadius: '10px',
                border: '1px solid #00F0FF',
                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                color: '#00F0FF',
                fontSize: '11px',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ⚔️ VỀ ĐẤU TRƯỜNG
            </button>
          )}
        </div>
      </header>

      {/* Left Control Wing: Model Switcher & Camera Focus */}
      <aside
        style={{
          position: 'absolute',
          top: '64px',
          left: '16px',
          bottom: '16px',
          width: '290px',
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: 'rgba(9, 12, 24, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          zIndex: 30,
          overflowY: 'auto',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)'
        }}
      >
        {/* Display Mode Selector (4 Chế Độ Thị Giác) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#00F0FF' }}>
              CHẾ ĐỘ THỊ GIÁC (DISPLAY MODE):
            </label>
            <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#FF2A85', fontWeight: 'bold' }}>
              {displayMode === 'DENIA_3D_AAA'
                ? '★ 3D ANIME (DENIA / ZANE)'
                : displayMode === 'PRISMATIC_AAA'
                ? '★ AAA HOLOGRAM'
                : displayMode === 'GLTF_CUSTOM'
                ? '⚡ GLTF/CUSTOM'
                : '⚙️ PROCEDURAL'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>


            {/* Mode 2: ZaneAtega Denia FBX */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setDisplayMode('DENIA_3D_AAA')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: displayMode === 'DENIA_3D_AAA' ? '1px solid #FF2A85' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: displayMode === 'DENIA_3D_AAA' ? 'rgba(255, 42, 133, 0.24)' : 'rgba(255, 255, 255, 0.05)',
                  color: displayMode === 'DENIA_3D_AAA' ? '#FF2A85' : '#cccccc',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: displayMode === 'DENIA_3D_AAA' ? 'bold' : 'normal',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: displayMode === 'DENIA_3D_AAA' ? '0 0 14px rgba(255, 42, 133, 0.45)' : 'none'
                }}
              >
                <span>🔥</span>
                <div>
                  <div>ZANE ATEGA 3D (Denia • WuWa)</div>
                  <div style={{ fontSize: '9px', color: '#949bb3', fontWeight: 'normal' }}>
                    Điêu khắc 226k đa giác • Poses & ZaneAtega Shader
                  </div>
                </div>
              </button>

              {displayMode === 'DENIA_3D_AAA' && (
                <div style={{ display: 'flex', gap: '4px', paddingLeft: '12px' }}>
                  <button
                    onClick={() => handleSelectDeniaPose('ARMS_CROSSED')}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      borderRadius: '6px',
                      border: deniaPose === 'ARMS_CROSSED' ? '1px solid #FF2A85' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: deniaPose === 'ARMS_CROSSED' ? 'rgba(255,42,133,0.35)' : 'rgba(0,0,0,0.3)',
                      color: deniaPose === 'ARMS_CROSSED' ? '#FFFFFF' : '#888888',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Khoanh Tay
                  </button>
                  <button
                    onClick={() => handleSelectDeniaPose('STAND')}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      borderRadius: '6px',
                      border: deniaPose === 'STAND' ? '1px solid #00F0FF' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: deniaPose === 'STAND' ? 'rgba(0,240,255,0.35)' : 'rgba(0,0,0,0.3)',
                      color: deniaPose === 'STAND' ? '#FFFFFF' : '#888888',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      cursor: 'pointer'
                    }}
                  >
                    🌸 Đứng Dáng
                  </button>
                  <button
                    onClick={() => handleSelectDeniaPose('HAND_ON_HIP')}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      borderRadius: '6px',
                      border: deniaPose === 'HAND_ON_HIP' ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: deniaPose === 'HAND_ON_HIP' ? 'rgba(255,215,0,0.35)' : 'rgba(0,0,0,0.3)',
                      color: deniaPose === 'HAND_ON_HIP' ? '#FFFFFF' : '#888888',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      cursor: 'pointer'
                    }}
                  >
                    👑 Tự Tin
                  </button>
                </div>
              )}
            </div>

            {/* Mode 3: Prismatic Hologram AAA */}
            <button
              onClick={() => setDisplayMode('PRISMATIC_AAA')}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: displayMode === 'PRISMATIC_AAA' ? '1px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: displayMode === 'PRISMATIC_AAA' ? 'rgba(255, 215, 0, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                color: displayMode === 'PRISMATIC_AAA' ? '#FFD700' : '#cccccc',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: displayMode === 'PRISMATIC_AAA' ? 'bold' : 'normal',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: displayMode === 'PRISMATIC_AAA' ? '0 0 12px rgba(255, 215, 0, 0.35)' : 'none'
              }}
            >
              <span>💎</span>
              <div>
                <div>LĂNG KÍNH 3D (Hologram AAA)</div>
                <div style={{ fontSize: '9px', color: '#949bb3', fontWeight: 'normal' }}>Visual cực phẩm 18+ • 27 Valkyries • Vũ khí 3D</div>
              </div>
            </button>

            {/* Mode 4: Custom 3D Model Upload */}
            <button
              onClick={() => {
                setDisplayMode('GLTF_CUSTOM');
                if (!customModelFileName) {
                  fileInputRef.current?.click();
                }
              }}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: displayMode === 'GLTF_CUSTOM' ? '1px solid #38EF7D' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: displayMode === 'GLTF_CUSTOM' ? 'rgba(56, 239, 125, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: displayMode === 'GLTF_CUSTOM' ? '#38EF7D' : '#cccccc',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: displayMode === 'GLTF_CUSTOM' ? 'bold' : 'normal',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: displayMode === 'GLTF_CUSTOM' ? '0 0 12px rgba(56, 239, 125, 0.35)' : 'none'
              }}
            >
              <span>✨</span>
              <div>
                <div>TẢI MODEL 3D (.VRM / .GLB / FBX)</div>
                <div style={{ fontSize: '9px', color: '#949bb3', fontWeight: 'normal' }}>
                  {customModelFileName ? `Đã nạp: ${customModelFileName}` : 'ZaneAtega Cel-Shader • Nạp file 3D'}
                </div>
              </div>
            </button>

            <button
              onClick={() => setDisplayMode('PROCEDURAL')}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: displayMode === 'PROCEDURAL' ? '1px solid #FF2A85' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: displayMode === 'PROCEDURAL' ? 'rgba(255, 42, 133, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: displayMode === 'PROCEDURAL' ? '#FF2A85' : '#888888',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: displayMode === 'PROCEDURAL' ? 'bold' : 'normal',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⚙️</span>
              <div>
                <div>Khung Khối 3D Thể Nghiệm</div>
                <div style={{ fontSize: '8px', color: '#777777', fontWeight: 'normal' }}>Dựng hình học thủ công (Spheres/Lathe)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Model Picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#949bb3' }}>
              CHỌN NỮ CHIẾN BINH:
            </label>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#00F0FF' }}>
              {['VALK-01', 'VALK-02', 'VALK-03', 'VALK-04', 'VALK-05', 'VALK-06', 'VALK-07', 'VALK-08', 'VALK-09'].includes(selectedValkId) ? '★ 3D BESPOKE' : '⚡ 3D BASE'}
            </span>
          </div>
          <select
            value={selectedValkId}
            onChange={(e) => handleSelectValk(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              color: '#ffffff',
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {VALKYRIE_ROSTER.map((v) => (
              <option key={v.id} value={v.id} style={{ backgroundColor: '#0e1220', color: '#ffffff' }}>
                {v.id}: {v.name} ({v.faction.replace('NEO_', '')}) {['VALK-01', 'VALK-02', 'VALK-03', 'VALK-04', 'VALK-05', 'VALK-06', 'VALK-07', 'VALK-08', 'VALK-09'].includes(v.id) ? '★ BESPOKE' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Camera Angles Preset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#949bb3' }}>
            GÓC SOI CẬN CẢNH (CAMERA PRESETS):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => setCameraPreset('FULL')}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '11px',
                fontFamily: 'monospace',
                cursor: 'pointer'
              }}
            >
              🔍 Toàn Thân
            </button>
            <button
              onClick={() => setCameraPreset('FACE')}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid #00F0FF',
                color: '#00F0FF',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🌸 Khuôn Mặt
            </button>
            <button
              onClick={() => setCameraPreset('BUST')}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 42, 133, 0.15)',
                border: '1px solid #FF2A85',
                color: '#FF2A85',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              💋 Vòng 1 & Giáp
            </button>
            <button
              onClick={() => setCameraPreset('WEAPON')}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                border: '1px solid #FFD700',
                color: '#FFD700',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {selectedValkId === 'VALK-02'
                ? '🛡️ Khiên Băng'
                : selectedValkId === 'VALK-03'
                ? '🗡️ Song Đoản Kiếm'
                : selectedValkId === 'VALK-04'
                ? '💥 Trọng Pháo'
                : selectedValkId === 'VALK-05'
                ? '⚡ Cầu Lôi Điện'
                : selectedValkId === 'VALK-06'
                ? '✨ Trượng Nano'
                : selectedValkId === 'VALK-07'
                ? '⚡ Thương Sấm'
                : selectedValkId === 'VALK-08'
                ? '⚔️ Tứ Kiếm Bay'
                : selectedValkId === 'VALK-09'
                ? '🛰️ Drone & Hologram'
                : '⚔️ Đại Kiếm'}
            </button>
          </div>
        </div>

        {/* Cloth Damage Tiers (Rách Giáp 18+) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#FF2A85' }}>
              CẤP ĐỘ RÁCH GIÁP (CLOTH DAMAGE):
            </label>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 900, color: '#FF2A85' }}>
              TIER {clothTier}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button
              onClick={() => handleSelectTier(1)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: clothTier === 1 ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: clothTier === 1 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: clothTier === 1 ? '#00F0FF' : '#cccccc',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: clothTier === 1 ? 'bold' : 'normal',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: clothTier === 1 ? '0 0 10px rgba(0, 240, 255, 0.3)' : 'none'
              }}
            >
              Tier 1: Giáp Thánh Nguyên Bản (Pristine)
            </button>
            <button
              onClick={() => handleSelectTier(2)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: clothTier === 2 ? '1px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: clothTier === 2 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: clothTier === 2 ? '#FFD700' : '#cccccc',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: clothTier === 2 ? 'bold' : 'normal',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: clothTier === 2 ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
              }}
            >
              Tier 2: Nứt Vỡ Giáp Ngực (Torn Armor)
            </button>
            <button
              onClick={() => handleSelectTier(3)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: clothTier === 3 ? '1px solid #FF2A85' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: clothTier === 3 ? 'rgba(255, 42, 133, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: clothTier === 3 ? '#FF2A85' : '#cccccc',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: clothTier === 3 ? 'bold' : 'normal',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: clothTier === 3 ? '0 0 14px rgba(255, 42, 133, 0.5)' : 'none'
              }}
            >
              Tier 3: Climax Extreme (Rách Toạc Cực Hạn)
            </button>
          </div>
        </div>

        {/* Animation Triggers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#949bb3' }}>
            KÍCH HOẠT ĐỘNG TÁC (ANIMATION TEST):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => setActiveAnim('IDLE')}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '10px',
                fontFamily: 'monospace',
                cursor: 'pointer'
              }}
            >
              🌸 Nhịp Thở Idle
            </button>
            <button
              onClick={() => {
                setActiveAnim('ATTACK');
                modelInstanceRef.current?.triggerAttack();
                screenShakeRef.current = 0.16;
                if (flashLightRef.current) {
                  flashLightRef.current.color.setHex(0xff0055);
                  flashLightRef.current.intensity = 5.0;
                }
              }}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                border: '1px solid #FFD700',
                color: '#FFD700',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ⚔️ Trảm Kích
            </button>
            <button
              onClick={() => {
                setActiveAnim('ULTIMATE');
                modelInstanceRef.current?.triggerUltimate();
                screenShakeRef.current = 0.45;
                if (flashLightRef.current) {
                  flashLightRef.current.color.setHex(0x00f0ff);
                  flashLightRef.current.intensity = 8.5;
                }
              }}
              style={{
                gridColumn: 'span 2',
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 42, 133, 0.2)',
                border: '1px solid #FF2A85',
                color: '#FF2A85',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {selectedValkId === 'VALK-02'
                ? '❄️ Tuyệt Kỹ: Khiên Băng Nổ Tuyết'
                : selectedValkId === 'VALK-03'
                ? '💜 Tuyệt Kỹ: Vũ Điệu Tử Thần (Shadow Decapitate)'
                : selectedValkId === 'VALK-04'
                ? '💥 Tuyệt Kỹ: Trọng Pháo Hạt Nhân (Annihilation Shell)'
                : selectedValkId === 'VALK-05'
                ? '⚡ Tuyệt Kỹ: Bão Lôi Điện Tử (Chain Lightning Tempest)'
                : selectedValkId === 'VALK-06'
                ? '🕊️ Tuyệt Kỹ: Thánh Địa Valkyrie (Sanctuary of Valkyries)'
                : selectedValkId === 'VALK-07'
                ? '⚡ Tuyệt Kỹ: Xung Kích Thương Sấm (Thunder Spear Blitz)'
                : selectedValkId === 'VALK-08'
                ? '🌪️ Tuyệt Kỹ: Vũ Điệu Lốc Kiếm (Whirlwind Blade Waltz)'
                : selectedValkId === 'VALK-09'
                ? '🛡️ Tuyệt Kỹ: Quá Tải Trường Lực (Overclock Forcefield)'
                : '⚡ Tuyệt Kỹ: Nhảy Bổ Giáng Lôi'}
            </button>
            <button
              onClick={() => {
                setActiveAnim('HIT');
                modelInstanceRef.current?.triggerHit();
                screenShakeRef.current = 0.09;
                if (flashLightRef.current) {
                  flashLightRef.current.color.setHex(0xff2244);
                  flashLightRef.current.intensity = 3.5;
                }
              }}
              style={{
                gridColumn: 'span 2',
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 68, 68, 0.15)',
                border: '1px solid #ff4444',
                color: '#ff4444',
                fontSize: '10px',
                fontFamily: 'monospace',
                cursor: 'pointer'
              }}
            >
              💔 Phản Ứng Trúng Đòn (Flinch)
            </button>
            <button
              onClick={() => {
                setActiveAnim('POKE');
                modelInstanceRef.current?.triggerPoke?.();
                screenShakeRef.current = 0.05;
                if (flashLightRef.current) {
                  flashLightRef.current.color.setHex(0xff77aa);
                  flashLightRef.current.intensity = 4.5;
                }
              }}
              style={{
                gridColumn: 'span 2',
                padding: '7px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 119, 170, 0.22)',
                border: '1px solid #FF77AA',
                color: '#FF77AA',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(255, 119, 170, 0.35)'
              }}
            >
              <span>💋</span> Tương Tác Cưng Nựng (Waifu Poke)
            </button>
          </div>
        </div>

        {/* Animation Loop Toggle */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'monospace'
          }}
        >
          <span style={{ color: '#FFD700' }}>🔁 Lặp động tác:</span>
          <button
            onClick={() => setIsLoopingAnim(!isLoopingAnim)}
            style={{
              padding: '4px 12px',
              borderRadius: '8px',
              border: isLoopingAnim ? '1px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: isLoopingAnim ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              color: isLoopingAnim ? '#FFD700' : '#949bb3',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isLoopingAnim ? 'BẬT' : 'TẮT'}
          </button>
        </div>

        {/* Auto Rotate Switch */}
        <div
          style={{
            paddingTop: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'monospace'
          }}
        >
          <span style={{ color: '#949bb3' }}>Tự xoay 360°:</span>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            style={{
              padding: '4px 12px',
              borderRadius: '8px',
              border: isAutoRotating ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: isAutoRotating ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: isAutoRotating ? '#00F0FF' : '#949bb3',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isAutoRotating ? 'BẬT' : 'TẮT'}
          </button>
        </div>
      </aside>

      {/* Right Spec & Evaluation Scorecard */}
      <aside
        style={{
          position: 'absolute',
          top: '64px',
          right: '16px',
          bottom: '16px',
          width: '320px',
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: 'rgba(9, 12, 24, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 30,
          overflowY: 'auto',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '8px'
            }}
          >
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#949bb3' }}>HỒ SƠ THẨM ĐỊNH 3D</span>
              <h2
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: '16px',
                  color: '#FFD700',
                  margin: '2px 0 0 0'
                }}
              >
                {currentValk?.name}
              </h2>
            </div>
            <span
              style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                color: '#00F0FF',
                fontFamily: 'monospace'
              }}
            >
              {currentValk?.role}
            </span>
          </div>

          {/* 3D Anatomical Metrics */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '11px',
              fontFamily: 'monospace'
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00F0FF', textTransform: 'uppercase' }}>
              📐 THÔNG SỐ HÌNH HỌC 3D (ANIME PROPORTIONS):
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#949bb3' }}>
              <span>• Chiều cao model:</span>
              <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                {selectedValkId === 'VALK-02'
                  ? '1.76m (1.76 Three.js units)'
                  : selectedValkId === 'VALK-03'
                  ? '1.68m (1.68 Three.js units)'
                  : selectedValkId === 'VALK-04'
                  ? '1.62m (1.62 Three.js units)'
                  : selectedValkId === 'VALK-05'
                  ? '1.70m (Bay lơ lửng +0.15m)'
                  : selectedValkId === 'VALK-06'
                  ? '1.68m (1.68 Three.js units)'
                  : selectedValkId === 'VALK-07'
                  ? '1.74m (1.74 Three.js units)'
                  : selectedValkId === 'VALK-08'
                  ? '1.70m (1.70 Three.js units)'
                  : selectedValkId === 'VALK-09'
                  ? '1.68m (1.68 Three.js units)'
                  : '1.72m (1.72 Three.js units)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#949bb3' }}>
              <span>• Số đo Vòng 1 (Bust):</span>
              <span style={{ color: '#FF2A85', fontWeight: 'bold' }}>
                {selectedValkId === 'VALK-02'
                  ? 'Cúp ngực F (0.36m)'
                  : selectedValkId === 'VALK-03'
                  ? 'Cúp ngực E (0.34m)'
                  : selectedValkId === 'VALK-04'
                  ? 'Cúp ngực D (0.31m)'
                  : selectedValkId === 'VALK-05'
                  ? 'Cúp ngực F (0.36m - Khe sâu gợi cảm)'
                  : selectedValkId === 'VALK-06'
                  ? 'Cúp ngực H (0.42m - Lớn nhất Neo-Valhalla)'
                  : selectedValkId === 'VALK-07'
                  ? 'Cúp ngực E (0.34m - Săn chắc nở nang)'
                  : selectedValkId === 'VALK-08'
                  ? 'Cúp ngực D (0.32m - Săn chắc đàn hồi vũ công)'
                  : selectedValkId === 'VALK-09'
                  ? 'Cúp ngực F (0.36m - Tròn trịa đẫy đà học giả anime)'
                  : 'Cúp ngực G (0.38m)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#949bb3' }}>
              <span>• Eo (Waist) / Hông (Hips):</span>
              <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                {selectedValkId === 'VALK-02'
                  ? '0.22m / 0.40m (Đồng hồ cát)'
                  : selectedValkId === 'VALK-03'
                  ? '0.20m / 0.38m (Eo con kiến sát thủ)'
                  : selectedValkId === 'VALK-04'
                  ? '0.20m / 0.34m (Vóc dáng nhỏ nhắn tsundere)'
                  : selectedValkId === 'VALK-05'
                  ? '0.21m / 0.39m (Váy xẻ tà đùi quyến rũ)'
                  : selectedValkId === 'VALK-06'
                  ? '0.20m / 0.40m (Đồng hồ cát thánh nữ)'
                  : selectedValkId === 'VALK-07'
                  ? '0.19m / 0.38m (Cơ bụng số 11 & rốn gợi cảm)'
                  : selectedValkId === 'VALK-08'
                  ? '0.19m / 0.38m (Hông quả đào & đôi chân dài)'
                  : selectedValkId === 'VALK-09'
                  ? '0.20m / 0.38m (Đồng hồ cát mềm mại & tất đùi công nghệ)'
                  : '0.21m / 0.39m (Đồng hồ cát)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#949bb3' }}>
              <span>• Vũ khí đặc trưng:</span>
              <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                {selectedValkId === 'VALK-02'
                  ? 'Băng Tinh Trọng Khiên (1.45m) & Kiếm (0.95m)'
                  : selectedValkId === 'VALK-03'
                  ? 'Song Đoản Kiếm Plasma Tử Điện (0.65m x 2)'
                  : selectedValkId === 'VALK-04'
                  ? 'Heavy Railgun Plasma Cannon (1.85m)'
                  : selectedValkId === 'VALK-05'
                  ? 'Quả Cầu Lôi Điện Tử Gimbal 3 Vòng (0.32m)'
                  : selectedValkId === 'VALK-06'
                  ? 'Nano Holy Scepter (1.55m) & Đôi Cánh Ánh Sáng'
                  : selectedValkId === 'VALK-07'
                  ? 'Gungnir Replica Thunder Spear (2.10m)'
                  : selectedValkId === 'VALK-08'
                  ? '4 Lưỡi Kiếm Bay Lơ Lửng (0.85m x 4)'
                  : selectedValkId === 'VALK-09'
                  ? 'Hologram Tablet Pad & 2 Drone Hộ Vệ Ma Trận Khiên'
                  : 'Plasma Buster (1.65m)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#949bb3' }}>
              <span>• Công nghệ dựng hình:</span>
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                {displayMode === 'DENIA_3D_AAA'
                  ? 'ZaneAtega Denia FBX (High-Poly Rigged 3D Anime Model)'
                  : displayMode === 'PRISMATIC_AAA'
                  ? '3D Prismatic Diorama (AAA Artwork + 3D Weapons)'
                  : displayMode === 'GLTF_CUSTOM'
                  ? 'ZaneAtega Cel-Shading 3D Model (.GLB/.VRM)'
                  : '100% 3D Procedural Mesh'}
              </span>
            </div>
          </div>

          {/* Rách Giáp Review Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              border: '1px solid rgba(255, 42, 133, 0.25)',
              fontSize: '10px',
              fontFamily: 'monospace'
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#FF2A85', textTransform: 'uppercase' }}>
              👙 TRẠNG THÁI RÁCH GIÁP HIỆN TẠI (TIER {clothTier}):
            </span>
            <p style={{ margin: 0, color: '#cccccc', lineHeight: 1.5, fontSize: '10px' }}>
              {selectedValkId === 'VALK-02'
                ? clothTier === 1
                  ? 'Giáp Hiệp Sĩ Băng Giá toàn thân kiêu sa, bạch kim viền lam ngọc, trường khiên tinh thể vững như thái sơn.'
                  : clothTier === 2
                  ? 'Giáp vai phải vỡ vụn do va chấn xung lực, yếm ngực nứt vỡ để lộ khe ngực quyến rũ, sương băng tỏa quanh vết rách.'
                  : 'Khiên băng rạn nứt phát sáng cực độ, giáp ngực tan vỡ kích hoạt trường lực tinh thể băng bao bọc toàn thân!'
                : selectedValkId === 'VALK-03'
                ? clothTier === 1
                  ? 'Áo giáp da bó sát nanoweave đen tuyền điểm chỉ tím neon, kín đáo che giấu vũ khí và ám sát trong bóng đêm.'
                  : clothTier === 2
                  ? 'Giáp lưng và vai rách toạc để lộ làn da trắng nõn, xẻ tà đùi cao táo bạo, song đoản kiếm chuyển sang xung tần plasma cực đại.'
                  : 'Toàn bộ trang phục rách tả tơi chỉ còn dải băng quấn ngực mỏng manh, luồng tử điện bao bọc cơ thể trong vũ điệu tử thần!'
                : selectedValkId === 'VALK-04'
                ? clothTier === 1
                  ? 'Áo khoác quân phục Cyberpunk ngắn màu xanh đen viền vàng kim, áo sơ mi trắng thắt cà vạt đỏ, váy xếp ly công nghệ cao, vớ đùi đen Zettai Ryouiki.'
                  : clothTier === 2
                  ? 'Sóng xung kích xé toạc váy ngắn để lộ ren nội y trắng muốt, bung cúc áo ngực để lộ khe ngực cúp D căng tròn, đai tất da quyến rũ.'
                  : 'Mất kính ngắm, áo sơ mi bung hết cúc để lộ bầu ngực trần chỉ còn dải ren mỏng manh, trọng pháo quá nhiệt đỏ rực khi quỳ gối xả đạn!'
                : selectedValkId === 'VALK-05'
                ? clothTier === 1
                  ? 'Váy dạ hội nhung tím hoàng gia ôm sát cơ thể, xẻ tà đùi cao táo bạo, trang sức vàng kim và đá lam ngọc vương giả, tất lụa mỏng xuyên thấu.'
                  : clothTier === 2
                  ? 'Tà váy dạ hội bị xé toạc để lộ trọn vẹn cặp đùi thon dài và đai tất ren tím, cúp ngực nứt vỡ để lộ khe ngực cúp F đẫy đà với viên ngọc phát sáng.'
                  : 'Váy dạ hội nát vụn chỉ còn các dải vải mỏng tang che hờ hững điểm nhạy cảm, bầu ngực cúp F gần như phơi trần, dòng điện tử tím lam bao bọc toàn thân trong cực khoái ma pháp!'
                : selectedValkId === 'VALK-06'
                ? clothTier === 1
                  ? 'Trang phục nữ tu công nghệ tương lai trắng tinh khiết viền vàng kim, mũ trùm tu sĩ che tóc, kín đáo uy nghiêm nhưng căng tràn cúp ngực H đồ sộ, đôi cánh thiên sứ ánh sáng xòe rộng.'
                  : clothTier === 2
                  ? 'Áo choàng tu sĩ rách toạc để lộ toàn bộ vai trần nõn nà, yếm ngực nứt bung để lộ khe ngực Cup H sâu thẳm rung rinh theo nhịp tim, xé tà váy để lộ cặp đùi trắng và vớ lụa.'
                  : 'Đôi cánh thiên thần gãy cụp rụng lông vũ ánh sáng, trang phục nát vụn chỉ còn dải ruy băng thánh mỏng manh che hờ hững nhũ hoa Cup H đẫy đà đang ửng hồng vì xấu hổ và sung sướng trong cực khoái cứu rỗi!'
                : selectedValkId === 'VALK-07'
                ? clothTier === 1
                  ? 'Giáp da chiến binh phương Bắc kết hợp kim loại titan, khoe trọn vòng eo săn chắc và cơ bụng số 11 sắc nét, ngọn thương Gungnir Replica sấm sét rực rỡ.'
                  : clothTier === 2
                  ? 'Giáp ngực vỡ một bên để lộ bầu ngực căng tròn với 3 vết cào rớm máu đầy khiêu khích, giáp đùi trầy xước, ngọn thương sấm sét chuyển sang xung tần plasma cực đại.'
                  : 'Áo giáp da rách vụn hoàn toàn, cơ bụng và làn da bóng nhẫy mồ hôi chiến trận, chỉ còn sợi dây đai da quấn quanh bầu ngực trần, ánh mắt cuồng loạn khát khao va chạm thể xác trong cơn say máu!'
                : selectedValkId === 'VALK-08'
                ? clothTier === 1
                  ? 'Bộ đồ múa kiếm leotard bó sát gợi cảm ôm trọn đường cong, khoét hông cao để lộ đôi chân dài miên man, 4 lưỡi kiếm bay lơ lửng xoay tròn trường lực sapphire.'
                  : clothTier === 2
                  ? 'Vải leotard rách toạc hai bên hông để lộ xương chậu gợi cảm và đường cong mông săn chắc, ngực áo nứt bung để lộ khe ngực cúp D căng nảy, 4 thanh kiếm xoay kích tốc.'
                  : 'Bộ leotard nát vụn chỉ còn lại vài sợi dây đan chéo mỏng manh che hờ hững điểm nhạy cảm, đôi chân dài miên man và cặp đùi non run rẩy sau bài vũ điệu cuồng nhiệt, 4 thanh kiếm cắm xuống đất tạo trận địa giam cầm đầy kích thích!'
                : selectedValkId === 'VALK-09'
                ? clothTier === 1
                  ? 'Áo khoác blouse trắng phòng thí nghiệm cách điệu bên ngoài bodysuit công nghệ cao khoét ngực sâu, kính cận tri thức gọng vàng, 2 drone bay nhịp nhàng quanh vai.'
                  : clothTier === 2
                  ? 'Áo khoác blouse bị xé rách tả tơi để lộ vai trần nõn nà, mắt kính lệch một bên bối rối, áo bó ngực nứt toác để lộ khe ngực Cúp F ngồn ngộn, drone chập điện tóe lửa.'
                  : 'Kính mắt rơi tuột, áo blouse nát vụn chỉ còn nội y ren dính chặt vào da thịt ửng đỏ mồ hôi và bầu ngực Cúp F trĩu nặng đẫm lệ cầu cứu trong cực khoái trường lực quá tải!'
                : clothTier === 1
                ? 'Giáp ngực Titan đỏ-bạc bóng bẩy, yếm bảo vệ vai đôi và xà cạp thép kín đáo oai nghiêm.'
                : clothTier === 2
                ? 'Yếm giáp ngực nứt vỡ để lộ rãnh ngực sâu quyến rũ, xé toạc ống giáp đùi, lưỡi kiếm plasma tăng nhiệt.'
                : 'Giáp ngực tan rã chỉ còn 2 dải dây đai chữ X quấn quanh ngực, toàn bộ đại kiếm bùng cháy ngọn lửa Plasma đỏ hồng rực rỡ!'}
            </p>
          </div>

          {/* Direct URL Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '8px 10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 240, 255, 0.05)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              fontSize: '10px',
              fontFamily: 'monospace'
            }}
          >
            <span style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '9px' }}>DIRECT INSPECTION URL:</span>
            <span style={{ color: '#ffffff', wordBreak: 'break-all', fontSize: '10px' }}>
              {typeof window !== 'undefined' ? `${window.location.origin}/?mode=model-viewer&valk=${selectedValkId}` : `http://localhost:5173/?mode=model-viewer&valk=${selectedValkId}`}
            </span>
          </div>
        </div>

        {/* Evaluation Summary Footer */}
        <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>
            <span style={{ color: '#949bb3' }}>Đánh giá 3D Designer:</span>
            <span style={{ color: '#00ff88', fontWeight: 900 }}>9.6 / 10 (READY FOR REVIEW)</span>
          </div>
          <p style={{ margin: 0, fontSize: '9px', color: '#949bb3', fontStyle: 'italic', textAlign: 'center' }}>
            {displayMode === 'PRISMATIC_AAA'
              ? 'Lăng kính 3D Hologram Anime 18+ cực phẩm, xoay 360 độ, vũ khí 3D và hào quang thiên thần.'
              : displayMode === 'GLTF_CUSTOM'
              ? 'Mô hình 3D cao cấp GLTF/VRM tích hợp Shader Cel-shading ZaneAtega.'
              : 'Mô hình hình khối Three.js thử nghiệm tham số.'}
          </p>
        </div>
      </aside>
    </div>
  );
};
