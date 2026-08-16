import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';
import { CAMERA_KEYS, FINALE, GROUP_WINDOWS, smoothstep, windowAlpha } from './cinematicTimeline';

interface CinematicSceneProps {
  progress: MotionValue<number>;
  onReady: () => void;
  onUnavailable: () => void;
}

/** A material whose opacity is driven by an act's cross-dissolve. */
interface FadeTarget {
  material: THREE.Material;
  base: number;
}

interface CinematicWorld {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  core: THREE.Group;
  security: THREE.Group;
  deploy: THREE.Group;
  starField: THREE.Points;
  scanPlane: THREE.Mesh;
  /** Typed once at construction so the render loop never re-checks. */
  scanMaterial: THREE.MeshBasicMaterial;
  portalMaterial: THREE.MeshBasicMaterial;
  portalBaseColor: THREE.Color;
  fog: THREE.FogExp2;
  background: THREE.Color;
  pulseLights: THREE.PointLight[];
  coreFades: FadeTarget[];
  securityFades: FadeTarget[];
  deployFades: FadeTarget[];
  /** Disposal registries. */
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  instanced: THREE.InstancedMesh[];
}

const BLUE = new THREE.Color('#2f6dff');
const CORAL = new THREE.Color('#ff594d');
const YELLOW = new THREE.Color('#f6d94a');

const DARK_BACKGROUND = '#050711';
const MOBILE_QUERY = '(max-width: 760px)';

/** Single place the mobile budget is decided, so createWorld and resize agree. */
function viewportProfile() {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  return {
    isMobile,
    fov: isMobile ? 66 : 58,
    pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1.15 : 1.5),
  };
}

/**
 * The finale hands off to the site, so it brightens toward the live `--paper`
 * token rather than a hardcoded near-white. In dark mode that keeps the arrival
 * from flashing white and then dropping to near-black.
 */
function readPaperColor() {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
    if (raw) return new THREE.Color(raw);
  } catch {
    /* computed styles unavailable — fall through */
  }
  return new THREE.Color('#dce6ff');
}

function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number,
  position: (index: number, object: THREE.Object3D) => void,
) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const object = new THREE.Object3D();
  for (let index = 0; index < count; index += 1) {
    position(index, object);
    object.updateMatrix();
    mesh.setMatrixAt(index, object.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

function createWorld(canvas: HTMLCanvasElement): CinematicWorld {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  const { isMobile, fov, pixelRatio } = viewportProfile();
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const background = new THREE.Color(DARK_BACKGROUND);
  scene.background = background;
  const fog = new THREE.FogExp2(DARK_BACKGROUND, 0.019);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 180);
  camera.position.set(0, 0, 13);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const instanced: THREE.InstancedMesh[] = [];
  const addGeometry = <T extends THREE.BufferGeometry>(geometry: T) => { geometries.push(geometry); return geometry; };
  const addMaterial = <T extends THREE.Material>(material: T) => { materials.push(material); return material; };

  const ambient = new THREE.AmbientLight('#7790c8', 0.38);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight('#ffffff', 1.6);
  keyLight.position.set(4, 8, 6);
  scene.add(keyLight);

  const pulseLights = [
    new THREE.PointLight(BLUE, 18, 24, 1.6),
    new THREE.PointLight(CORAL, 14, 20, 1.8),
    new THREE.PointLight(YELLOW, 12, 20, 1.8),
  ];
  pulseLights[0].position.set(-3, 1, 2);
  pulseLights[1].position.set(3, -1, -16);
  pulseLights[2].position.set(0, 2, -34);
  scene.add(...pulseLights);

  // Act one — the vision core.
  const core = new THREE.Group();
  core.position.z = 0;
  const knotGeometry = addGeometry(new THREE.IcosahedronGeometry(2.1, isMobile ? 2 : 3));
  const knotMaterial = addMaterial(new THREE.MeshStandardMaterial({ color: '#285fff', emissive: '#10276c', emissiveIntensity: 1.7, roughness: 0.26, metalness: 0.66, wireframe: true, transparent: true }));
  core.add(new THREE.Mesh(knotGeometry, knotMaterial));
  const innerGeometry = addGeometry(new THREE.IcosahedronGeometry(1.35, 2));
  const innerMaterial = addMaterial(new THREE.MeshPhysicalMaterial({ color: '#ff594d', emissive: '#9f1f20', emissiveIntensity: 1.25, roughness: 0.18, metalness: 0.35, transparent: true, opacity: 0.88 }));
  core.add(new THREE.Mesh(innerGeometry, innerMaterial));
  const ringGeometry = addGeometry(new THREE.TorusGeometry(3.25, 0.045, 8, 120));
  const ringMaterial = addMaterial(new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true }));
  for (let index = 0; index < 3; index += 1) {
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.set(index * 0.8, index * 0.55, index * 1.1);
    core.add(ring);
  }
  const nodeCount = isMobile ? 90 : 180;
  const nodeGeometry = addGeometry(new THREE.SphereGeometry(0.065, 5, 5));
  const nodeMaterial = addMaterial(new THREE.MeshBasicMaterial({ color: '#9db9ff', transparent: true }));
  const nodes = createInstancedMesh(nodeGeometry, nodeMaterial, nodeCount, (index, object) => {
    const phi = Math.acos(-1 + (2 * index) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;
    const radius = 4.6 + Math.sin(index * 2.2) * 0.7;
    object.position.set(Math.cos(theta) * Math.sin(phi) * radius, Math.sin(theta) * Math.sin(phi) * radius, Math.cos(phi) * radius);
    object.scale.setScalar(0.65 + (index % 5) * 0.08);
  });
  instanced.push(nodes);
  core.add(nodes);
  scene.add(core);

  // Act two — the security corridor.
  const security = new THREE.Group();
  security.position.z = -18;
  const frameSource = new THREE.BoxGeometry(7.5, 7.5, 0.16);
  const frameEdges = addGeometry(new THREE.EdgesGeometry(frameSource));
  frameSource.dispose();
  const frameMaterial = addMaterial(new THREE.LineBasicMaterial({ color: '#ff6b61', transparent: true, opacity: 0.72 }));
  for (let index = 0; index < 10; index += 1) {
    const frame = new THREE.LineSegments(frameEdges, frameMaterial);
    frame.position.z = -index * 2.3;
    frame.rotation.z = index % 2 ? 0.08 : -0.08;
    frame.scale.setScalar(1 - index * 0.018);
    security.add(frame);
  }
  const shieldGeometry = addGeometry(new THREE.OctahedronGeometry(1.45, 0));
  const shieldMaterial = addMaterial(new THREE.MeshStandardMaterial({ color: '#141d36', emissive: '#ff2f28', emissiveIntensity: 0.75, metalness: 0.8, roughness: 0.2, wireframe: true, transparent: true }));
  const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
  shield.position.z = -10;
  security.add(shield);
  const scanGeometry = addGeometry(new THREE.PlaneGeometry(9, 9));
  const scanMaterial = addMaterial(new THREE.MeshBasicMaterial({ color: '#ff594d', transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  const scanPlane = new THREE.Mesh(scanGeometry, scanMaterial);
  scanPlane.rotation.x = Math.PI / 2;
  scanPlane.position.z = -4;
  security.add(scanPlane);
  scene.add(security);

  // Act three — the GPU floor, and the portal the exit wipe continues out of.
  const deploy = new THREE.Group();
  deploy.position.z = -43;
  const rackGeometry = addGeometry(new THREE.BoxGeometry(1.45, 4.9, 1.3));
  const rackMaterial = addMaterial(new THREE.MeshStandardMaterial({ color: '#111a30', emissive: '#183a88', emissiveIntensity: 0.7, metalness: 0.76, roughness: 0.32, transparent: true }));
  const rackCount = isMobile ? 24 : 42;
  const racks = createInstancedMesh(rackGeometry, rackMaterial, rackCount, (index, object) => {
    const row = Math.floor(index / 2);
    object.position.set(index % 2 ? 4.2 : -4.2, index % 4 < 2 ? -0.25 : 0.25, -row * 2.75);
    object.rotation.y = index % 2 ? -0.11 : 0.11;
  });
  instanced.push(racks);
  deploy.add(racks);
  const stripGeometry = addGeometry(new THREE.BoxGeometry(0.08, 0.13, 1.05));
  const stripMaterial = addMaterial(new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true }));
  const stripCount = isMobile ? 96 : 168;
  const strips = createInstancedMesh(stripGeometry, stripMaterial, stripCount, (index, object) => {
    const rack = index % rackCount;
    const level = Math.floor(index / rackCount);
    const row = Math.floor(rack / 2);
    object.position.set(rack % 2 ? 4.2 : -4.2, -1.65 + level * 0.72, -row * 2.75 + 0.68);
  });
  instanced.push(strips);
  deploy.add(strips);
  const portalGeometry = addGeometry(new THREE.TorusGeometry(5.5, 0.16, 10, 96));
  const portalMaterial = addMaterial(new THREE.MeshBasicMaterial({ color: '#6fa0ff', transparent: true, opacity: 0.9 }));
  const portal = new THREE.Mesh(portalGeometry, portalMaterial);
  portal.position.z = -32;
  deploy.add(portal);
  scene.add(deploy);

  const particleCount = isMobile ? 700 : 1500;
  const positions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 32;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[index * 3 + 2] = 12 - Math.random() * 105;
  }
  const starGeometry = addGeometry(new THREE.BufferGeometry());
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMaterial = addMaterial(new THREE.PointsMaterial({ color: '#98b5ff', size: isMobile ? 0.045 : 0.055, transparent: true, opacity: 0.68, sizeAttenuation: true }));
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);

  return {
    renderer,
    scene,
    camera,
    core,
    security,
    deploy,
    starField,
    scanPlane,
    scanMaterial,
    portalMaterial,
    portalBaseColor: portalMaterial.color.clone(),
    fog,
    background,
    pulseLights,
    coreFades: [
      { material: knotMaterial, base: 1 },
      { material: innerMaterial, base: 0.88 },
      { material: ringMaterial, base: 1 },
      { material: nodeMaterial, base: 1 },
    ],
    securityFades: [
      { material: frameMaterial, base: 0.72 },
      { material: shieldMaterial, base: 1 },
    ],
    deployFades: [
      { material: rackMaterial, base: 1 },
      { material: stripMaterial, base: 1 },
      { material: portalMaterial, base: 0.9 },
    ],
    geometries,
    materials,
    instanced,
  };
}

function applyFades(targets: FadeTarget[], alpha: number) {
  for (let index = 0; index < targets.length; index += 1) {
    targets[index].material.opacity = targets[index].base * alpha;
  }
}

// Scratch vectors, reused every frame so the loop allocates nothing.
const POSE_FROM = new THREE.Vector3();
const POSE_TO = new THREE.Vector3();
const LOOK_FROM = new THREE.Vector3();
const LOOK_TO = new THREE.Vector3();

/** Interpolates the authored camera keys, easing between each pose. */
function samplePose(progress: number, outPosition: THREE.Vector3, outLook: THREE.Vector3) {
  let index = 0;
  while (index < CAMERA_KEYS.length - 2 && progress > CAMERA_KEYS[index + 1].at) index += 1;
  const from = CAMERA_KEYS[index];
  const to = CAMERA_KEYS[index + 1];
  const t = smoothstep(from.at, to.at, progress);
  POSE_FROM.fromArray(from.pos);
  POSE_TO.fromArray(to.pos);
  LOOK_FROM.fromArray(from.look);
  LOOK_TO.fromArray(to.look);
  outPosition.copy(POSE_FROM).lerp(POSE_TO, t);
  outLook.copy(LOOK_FROM).lerp(LOOK_TO, t);
}

export function CinematicScene({ progress, onReady, onUnavailable }: CinematicSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let world: CinematicWorld;
    try {
      world = createWorld(canvas);
    } catch (error) {
      console.warn('WebGL cinematic unavailable:', error);
      onUnavailable();
      return;
    }

    let frame = 0;
    let resizeFrame = 0;
    let targetProgress = progress.get();
    let currentProgress = targetProgress;
    let pointerX = 0;
    let pointerY = 0;
    let visible = !document.hidden;
    let readyFired = false;
    let contextLost = false;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const unsubscribe = progress.on('change', (value) => { targetProgress = value; });
    const handlePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 0.7;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    const applyViewport = () => {
      const { fov, pixelRatio } = viewportProfile();
      world.camera.aspect = window.innerWidth / window.innerHeight;
      world.camera.fov = fov;
      world.camera.updateProjectionMatrix();
      world.renderer.setPixelRatio(pixelRatio);
      world.renderer.setSize(window.innerWidth, window.innerHeight, false);
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
    };

    // iOS fires resize in bursts as the URL bar collapses, and each pass would
    // reallocate the drawing buffer. Coalesce to one per frame, and ignore the
    // small height-only deltas that the URL bar produces.
    const handleResize = () => {
      const widthChanged = window.innerWidth !== lastWidth;
      const heightDelta = Math.abs(window.innerHeight - lastHeight);
      if (!widthChanged && heightDelta < 120) return;
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        applyViewport();
      });
    };

    const handleVisibility = () => { visible = !document.hidden; };
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      onUnavailable();
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    canvas.addEventListener('webglcontextlost', handleContextLoss);

    const paperColor = readPaperColor();
    const darkBackground = new THREE.Color(DARK_BACKGROUND);
    const position = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    let elapsed = 0;
    let lastTime = performance.now();

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible) return;

      // Frame-rate independent smoothing: a fixed factor would let a 120Hz
      // display catch up twice as fast and drift out of sync with the copy.
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += delta;
      currentProgress += (targetProgress - currentProgress) * (1 - Math.pow(1 - 0.09, delta * 60));
      const p = currentProgress;

      const coreAlpha = windowAlpha(GROUP_WINDOWS.core, p);
      const securityAlpha = windowAlpha(GROUP_WINDOWS.security, p);
      const deployAlpha = windowAlpha(GROUP_WINDOWS.deploy, p);
      const bloom = smoothstep(FINALE.bloom[0], FINALE.bloom[1], p);

      samplePose(p, position, lookTarget);
      world.camera.position.set(
        position.x + Math.sin(p * Math.PI * 2.6) * 0.34 + pointerX,
        position.y + Math.sin(p * Math.PI * 1.9) * 0.2 - pointerY,
        position.z,
      );
      world.camera.lookAt(lookTarget);
      // Roll must follow lookAt — lookAt rewrites the rotation wholesale.
      world.camera.rotateZ(Math.sin(p * Math.PI * 4) * 0.02);

      world.core.rotation.x = elapsed * 0.12 + p * 2.2;
      world.core.rotation.y = elapsed * 0.18 + p * 3.1;
      // Collapses as it dissolves, rather than blinking out.
      world.core.scale.setScalar(0.55 + coreAlpha * (0.45 + smoothstep(0, 0.32, p) * 0.25));
      world.core.visible = coreAlpha > 0.002;
      if (world.core.visible) applyFades(world.coreFades, coreAlpha);

      world.security.rotation.z = Math.sin(elapsed * 0.35) * 0.018;
      world.security.visible = securityAlpha > 0.002;
      if (world.security.visible) {
        applyFades(world.securityFades, securityAlpha);
        world.scanPlane.position.z = -2 - ((elapsed * 5.2 + securityAlpha * 25) % 23);
        world.scanMaterial.opacity = (0.08 + Math.sin(elapsed * 2) * 0.035) * securityAlpha;
      }

      world.deploy.visible = deployAlpha > 0.002;
      if (world.deploy.visible) {
        // The racks dissolve into the whitewash so the last frame resolves to a
        // clean plate with only the ring on it — otherwise they sit there as
        // hard blue slabs against `--paper`.
        applyFades(world.deployFades, deployAlpha * (1 - bloom * 0.94));
        world.deploy.position.y = Math.sin(elapsed * 0.3) * 0.12;
        // The portal blooms toward the paper colour as we reach it, and holds
        // while everything else clears, so the exit wipe reads as passing
        // through the ring rather than as a cut.
        world.portalMaterial.color.copy(world.portalBaseColor).lerp(paperColor, bloom);
        world.portalMaterial.opacity = Math.max(0.9 * deployAlpha, bloom * 0.9);
      }

      world.starField.position.z = (elapsed * 0.8 + p * 10) % 9;
      world.starField.rotation.z = p * 0.08;
      world.pulseLights[0].intensity = (11 + Math.sin(elapsed * 2) * 4) * coreAlpha;
      world.pulseLights[1].intensity = 4 + securityAlpha * 14;
      world.pulseLights[2].intensity = 4 + deployAlpha * 18;

      world.background.copy(darkBackground).lerp(paperColor, bloom * 0.985);
      world.fog.color.copy(world.background);
      world.fog.density = 0.019 - bloom * 0.013;
      world.renderer.toneMappingExposure = 1.15 + bloom * 1.45;
      world.renderer.render(world.scene, world.camera);

      // Announce readiness only once a frame has actually landed, so the CSS
      // fallback never unmounts onto an unpainted canvas.
      if (!readyFired) {
        readyFired = true;
        onReady();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(frame);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      unsubscribe();
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
      world.instanced.forEach((mesh) => mesh.dispose());
      world.geometries.forEach((geometry) => geometry.dispose());
      world.materials.forEach((material) => material.dispose());
      world.scene.clear();
      world.renderer.dispose();
      // forceContextLoss on an already-lost context throws in some drivers.
      if (!contextLost) world.renderer.forceContextLoss();
    };
  }, [onReady, onUnavailable, progress]);

  return <canvas ref={canvasRef} className="cinematic-canvas" aria-hidden="true" />;
}
