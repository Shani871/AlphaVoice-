import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CoreState, AudioLevels } from '../../types';

interface WowCoreProps {
  state: CoreState;
  audioLevels?: AudioLevels;
  size?: 'normal' | 'hero';
  className?: string;
  enableHoverCircle?: boolean;
}

// Generate radial soft sprite on offscreen canvas
function createCircleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.2, 'rgba(240, 245, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(155, 180, 255, 0.3)');
    gradient.addColorStop(0.8, 'rgba(91, 127, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const WowCore: React.FC<WowCoreProps> = ({
  state,
  audioLevels = { bass: 0, mid: 0, treble: 0, overall: 0 },
  size = 'normal',
  className = '',
  enableHoverCircle = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CoreState>(state);
  stateRef.current = state;

  const audioRef = useRef<AudioLevels>(audioLevels);
  audioRef.current = audioLevels;

  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered && enableHoverCircle;

  // Track reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const reducedMotionRef = useRef(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;

  // State metadata for text label
  const stateLabels: Record<
    CoreState,
    { label: string; tag: string; toneClass: string }
  > = {
    IDLE: { label: 'Idle', tag: 'Core standby', toneClass: 'text-[#A3AAB5] bg-[#1C1F24]' },
    LISTENING: { label: 'Listening', tag: 'Awaiting speech', toneClass: 'text-[#EDEFF2] bg-[#1C1F24]' },
    USER_SPEAKING: { label: 'User speaking', tag: 'Voice active', toneClass: 'text-[#3ECF8E] bg-[#3ECF8E]/10 border border-[#3ECF8E]/30' },
    AI_SPEAKING: { label: 'AI speaking', tag: 'AuraLife active', toneClass: 'text-[#5B7FFF] bg-[#5B7FFF]/10 border border-[#5B7FFF]/30' },
    AI_INTERRUPTED: { label: 'AI interrupted', tag: 'Yielding floor', toneClass: 'text-[#EF4B52] bg-[#EF4B52]/10 border border-[#EF4B52]/30' },
    TRANSLATING: { label: 'Translating', tag: 'Cross-language processing', toneClass: 'text-[#E3A54A] bg-[#E3A54A]/10 border border-[#E3A54A]/30' },
    ERROR: { label: 'Error', tag: 'Core reconnection', toneClass: 'text-[#EF4B52] bg-[#EF4B52]/10 border border-[#EF4B52]/30' },
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const circleTexture = createCircleTexture();

    // 1. GALAXY SPIRAL PARTICLES
    // Logarithmic spiral: r = a * e^(b * theta)
    const particleCount = size === 'hero' ? 5200 : 4200;
    const spiralPositions = new Float32Array(particleCount * 3);
    const circlePositions = new Float32Array(particleCount * 3);
    const activePositions = new Float32Array(particleCount * 3);
    const baseColors = new Float32Array(particleCount * 3);
    const currentColors = new Float32Array(particleCount * 3);
    const radii = new Float32Array(particleCount);
    const initialY = new Float32Array(particleCount);

    const numArms = 3;
    const a = 0.22;
    const b = 0.26;
    const maxTheta = Math.PI * 4.6;

    // Color definitions
    const colorWhiteCore = new THREE.Color('#FFFFFF');
    const colorCoolBlue = new THREE.Color('#9FB4FF');
    const colorDeepBlue = new THREE.Color('#5B7FFF');
    const colorAmber = new THREE.Color('#F2C88F');
    const colorSuccessGreen = new THREE.Color('#3ECF8E');
    const colorDangerRed = new THREE.Color('#EF4B52');
    const colorWarningAmber = new THREE.Color('#E3A54A');

    for (let i = 0; i < particleCount; i++) {
      const armIndex = i % numArms;
      const armOffset = (armIndex * (2 * Math.PI)) / numArms;

      // Distribution weighted towards center but sweeping outwards
      const progress = Math.pow(Math.random(), 1.6);
      const theta = progress * maxTheta;
      const logR = a * Math.exp(b * theta);

      // Jitter
      const jitterRadius = (Math.random() - 0.5) * (0.12 + logR * 0.22);
      const angle = theta + armOffset + (Math.random() - 0.5) * 0.2;
      const r = Math.max(0.04, logR + jitterRadius);
      radii[i] = r;

      const x = Math.cos(angle) * r;
      // Core is slightly thicker in z/y, flat disk at periphery
      const heightFalloff = Math.exp(-r * 1.2);
      const y = (Math.random() - 0.5) * (0.28 * heightFalloff + 0.04);
      const z = Math.sin(angle) * r;

      spiralPositions[i * 3] = x;
      spiralPositions[i * 3 + 1] = y;
      spiralPositions[i * 3 + 2] = z;

      activePositions[i * 3] = x;
      activePositions[i * 3 + 1] = y;
      activePositions[i * 3 + 2] = z;
      initialY[i] = y;

      // Target circular positions when hovered:
      // Form a dense, luminous circular ring disk with tight radius (centered at origin)
      const circAngle = angle;
      const circRadius = 0.95 + (r / 3.4) * 0.38 + (Math.random() - 0.5) * 0.08;
      circlePositions[i * 3] = Math.cos(circAngle) * circRadius;
      circlePositions[i * 3 + 1] = y * 0.12; // flattened disc
      circlePositions[i * 3 + 2] = Math.sin(circAngle) * circRadius;

      // Two-tone color: 85% cool white-to-blue, 15% warm amber (weighted toward outer arms)
      const isAmber = Math.random() < 0.16 && r > 0.8;
      const pointColor = new THREE.Color();

      if (isAmber) {
        pointColor.copy(colorAmber);
      } else {
        const t = Math.min(1, r / 3.4);
        pointColor.copy(colorWhiteCore).lerp(colorCoolBlue, t);
      }

      baseColors[i * 3] = pointColor.r;
      baseColors[i * 3 + 1] = pointColor.g;
      baseColors[i * 3 + 2] = pointColor.b;

      currentColors[i * 3] = pointColor.r;
      currentColors[i * 3 + 1] = pointColor.g;
      currentColors[i * 3 + 2] = pointColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(activePositions, 3);
    geometry.setAttribute('position', positionAttribute);
    const colorAttribute = new THREE.BufferAttribute(currentColors, 3);
    geometry.setAttribute('color', colorAttribute);

    const pointsMaterial = new THREE.PointsMaterial({
      size: size === 'hero' ? 0.08 : 0.065,
      map: circleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
      opacity: 0.9,
    });

    const spiralPoints = new THREE.Points(geometry, pointsMaterial);
    scene.add(spiralPoints);

    // 2. BACKGROUND STARFIELD LAYER (sparse distant dots for parallax)
    const starCount = 280;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const dist = 7 + Math.random() * 8;
      const u = Math.random();
      const v = Math.random();
      const phi = Math.acos(2 * v - 1);
      const lam = 2 * Math.PI * u;

      starPositions[i * 3] = dist * Math.sin(phi) * Math.cos(lam);
      starPositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(lam);
      starPositions[i * 3 + 2] = dist * Math.cos(phi);

      const brightness = 0.15 + Math.random() * 0.35;
      starColors[i * 3] = brightness;
      starColors[i * 3 + 1] = brightness * 1.05;
      starColors[i * 3 + 2] = brightness * 1.2;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.035,
      map: circleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 3. CORE LIGHT GLOW MESH (Inner intense luminous glow center)
    const coreGlowGeo = new THREE.BufferGeometry();
    const corePointCount = 80;
    const corePositions = new Float32Array(corePointCount * 3);
    for (let i = 0; i < corePointCount; i++) {
      const cr = Math.pow(Math.random(), 2) * 0.45;
      const cang = Math.random() * Math.PI * 2;
      corePositions[i * 3] = Math.cos(cang) * cr;
      corePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      corePositions[i * 3 + 2] = Math.sin(cang) * cr;
    }
    coreGlowGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    const coreGlowMat = new THREE.PointsMaterial({
      size: size === 'hero' ? 0.16 : 0.12,
      map: circleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      color: new THREE.Color('#FFFFFF'),
      opacity: 0.7,
    });
    const coreGlow = new THREE.Points(coreGlowGeo, coreGlowMat);
    scene.add(coreGlow);

    // State transition tracking & easing
    let currentInterruptedFactor = 0;
    let currentScale = 1.0;
    let targetScale = 1.0;
    let hoverMorph = 0.0;
    let lastHoverMorph = -1;
    let lastState = stateRef.current;

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const st = stateRef.current;
      const audio = audioRef.current;
      const reducedMotion = reducedMotionRef.current;
      const hovered = isHoveredRef.current;

      // Handle hover morph: smooth transition from spiral (0) to circle (1)
      const targetHoverMorph = hovered ? 1.0 : 0.0;
      hoverMorph += (targetHoverMorph - hoverMorph) * 0.13;

      // Update positions if morphing or in circular mode
      if (Math.abs(hoverMorph - lastHoverMorph) > 0.001 || (hovered && hoverMorph > 0.95)) {
        const pos = positionAttribute.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          pos[idx] = spiralPositions[idx] * (1 - hoverMorph) + circlePositions[idx] * hoverMorph;
          pos[idx + 1] = spiralPositions[idx + 1] * (1 - hoverMorph) + circlePositions[idx + 1] * hoverMorph;
          pos[idx + 2] = spiralPositions[idx + 2] * (1 - hoverMorph) + circlePositions[idx + 2] * hoverMorph;
        }
        positionAttribute.needsUpdate = true;
        lastHoverMorph = hoverMorph;
      }

      // Handle instant snap on AI_INTERRUPTED
      if (st === 'AI_INTERRUPTED' && lastState !== 'AI_INTERRUPTED') {
        currentInterruptedFactor = 1.0;
      }
      lastState = st;

      // Decay interrupted factor smoothly
      if (currentInterruptedFactor > 0.01) {
        currentInterruptedFactor = Math.max(0, currentInterruptedFactor - delta * 3.8);
      }

      const bassVal = audio.bass || 0;
      const midVal = audio.mid || 0;
      const trebleVal = audio.treble || 0;

      // Determine base scale & speed by state
      let baseSpeed = 0.004;
      let targetOpacity = 0.85;

      if (st === 'IDLE') {
        baseSpeed = 0.0025;
        targetScale = 0.95;
        targetOpacity = 0.55;
      } else if (st === 'LISTENING') {
        baseSpeed = 0.0038;
        targetScale = 1.0;
        targetOpacity = 0.8;
      } else if (st === 'USER_SPEAKING') {
        baseSpeed = 0.0045 * (1.0 + midVal * 0.7);
        targetScale = 1.0 + bassVal * 0.28;
        targetOpacity = 0.95 + bassVal * 0.1;
      } else if (st === 'AI_SPEAKING') {
        baseSpeed = 0.0032 * (1.0 + midVal * 0.5);
        targetScale = 1.05 + bassVal * 0.35;
        targetOpacity = 1.0;
      } else if (st === 'AI_INTERRUPTED' || currentInterruptedFactor > 0.1) {
        baseSpeed = 0.0003;
        targetScale = 1.15;
      } else if (st === 'TRANSLATING') {
        baseSpeed = 0.005;
        targetScale = 1.08 + Math.sin(clock.getElapsedTime() * 8) * 0.06;
      }

      // SHRINK FEATURE ON HOVER:
      // When hover morph activates, target scale shrinks by ~46%, creating a tight compact circle!
      const hoverScaleMultiplier = 1.0 - hoverMorph * 0.46;
      targetScale *= hoverScaleMultiplier;

      // Rotation speeds up slightly on hover into an elegant circular orbital spin
      baseSpeed *= 1.0 + hoverMorph * 1.8;

      // Smooth scale interpolation
      currentScale += (targetScale - currentScale) * 0.15;
      if (!reducedMotion) {
        spiralPoints.scale.set(currentScale, currentScale, currentScale);
        coreGlow.scale.set(currentScale, currentScale, currentScale);
      }

      // Rotation around axis
      if (!reducedMotion) {
        spiralPoints.rotation.y += baseSpeed;
        coreGlow.rotation.y += baseSpeed * 1.1;
        starField.rotation.y += 0.0004;
      }

      // Color tinting per vertex
      const colors = colorAttribute.array as Float32Array;
      const tintTarget = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const r = radii[i];
        const baseR = baseColors[idx];
        const baseG = baseColors[idx + 1];
        const baseB = baseColors[idx + 2];

        if (currentInterruptedFactor > 0.05) {
          const factor = Math.max(0, 1 - r * 0.5) * currentInterruptedFactor;
          tintTarget.setRGB(baseR, baseG, baseB).lerp(colorDangerRed, factor);
        } else if (st === 'USER_SPEAKING') {
          const innerFactor = Math.max(0, 1 - r * 0.55);
          tintTarget.setRGB(baseR, baseG, baseB).lerp(colorSuccessGreen, innerFactor * 0.75);
        } else if (st === 'AI_SPEAKING') {
          const innerFactor = Math.max(0, 1 - r * 0.45);
          tintTarget.setRGB(baseR, baseG, baseB).lerp(colorDeepBlue, innerFactor * 0.85);
        } else if (st === 'TRANSLATING') {
          tintTarget.setRGB(baseR, baseG, baseB).lerp(colorWarningAmber, 0.6);
        } else {
          tintTarget.setRGB(baseR, baseG, baseB);
        }

        // On hover circle, add subtle electric glow towards primary blue
        if (hoverMorph > 0.05) {
          tintTarget.lerp(colorDeepBlue, hoverMorph * 0.25);
        }

        // Treble twinkle
        let twinkleMod = 1.0;
        if (!reducedMotion && (st === 'USER_SPEAKING' || st === 'AI_SPEAKING' || st === 'LISTENING')) {
          if (i % 17 === 0 && trebleVal > 0.15) {
            twinkleMod = 1.0 + (Math.random() - 0.5) * trebleVal * 1.5;
          }
        }

        // Bass core boost
        const bassBoost = r < 0.8 ? 1.0 + bassVal * 0.5 : 1.0;

        const lerpRate = 0.18;
        colors[idx] += (tintTarget.r * twinkleMod * bassBoost - colors[idx]) * lerpRate;
        colors[idx + 1] += (tintTarget.g * twinkleMod * bassBoost - colors[idx + 1]) * lerpRate;
        colors[idx + 2] += (tintTarget.b * twinkleMod * bassBoost - colors[idx + 2]) * lerpRate;
      }
      colorAttribute.needsUpdate = true;

      // Adjust overall material opacity
      pointsMaterial.opacity += (targetOpacity - pointsMaterial.opacity) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      starGeometry.dispose();
      coreGlowGeo.dispose();
      pointsMaterial.dispose();
      starMaterial.dispose();
      coreGlowMat.dispose();
      circleTexture.dispose();
      renderer.dispose();
    };
  }, [size]);

  const currentLabelInfo = stateLabels[state] || stateLabels.IDLE;

  return (
    <div
      onMouseEnter={() => enableHoverCircle && setIsHovered(true)}
      onMouseLeave={() => enableHoverCircle && setIsHovered(false)}
      className={`relative group cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${className}`}
      title={enableHoverCircle ? (isHovered ? 'Shrunk into circular mode' : 'Hover to shrink 3D core into circle') : undefined}
    >
      {/* Visual glowing circular focus ring on hover */}
      {enableHoverCircle && (
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-full border border-[#5B7FFF]/40 shadow-[0_0_35px_rgba(91,127,255,0.25)] animate-pulse" />
        </div>
      )}

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full ${
          size === 'hero' ? 'h-[360px] sm:h-[460px]' : 'h-[220px] sm:h-[260px]'
        } overflow-hidden pointer-events-auto transition-transform duration-300`}
      />

      {/* State label & Hover indicator badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-3 py-1 bg-[#141619]/90 border border-[#26292F] shadow-lg backdrop-blur-md pointer-events-auto transition-all duration-200">
        <span
          className={`h-2 w-2 rounded-full ${
            isHovered
              ? 'bg-[#5B7FFF] ring-2 ring-[#5B7FFF]/40 animate-ping'
              : state === 'USER_SPEAKING'
              ? 'bg-[#3ECF8E] animate-pulse'
              : state === 'AI_SPEAKING'
              ? 'bg-[#5B7FFF] animate-pulse'
              : state === 'AI_INTERRUPTED'
              ? 'bg-[#EF4B52]'
              : state === 'TRANSLATING'
              ? 'bg-[#E3A54A] animate-pulse'
              : 'bg-[#5F6773]'
          }`}
        />
        <span className="text-xs font-semibold text-[#EDEFF2]">
          {isHovered ? 'Circle Focus Mode' : currentLabelInfo.label}
        </span>
        <span className="text-[11px] text-[#A3AAB5] border-l border-[#26292F] pl-2">
          {isHovered ? 'Shrunk into Circle' : currentLabelInfo.tag}
        </span>
      </div>

      {/* Subtle hover affordance hint (disappears on hover) */}
      {enableHoverCircle && !isHovered && size !== 'hero' && (
        <span className="absolute top-3 right-4 text-[10px] font-medium text-[#5F6773] bg-[#141619]/80 border border-[#26292F] rounded-full px-2 py-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
          Hover to shrink
        </span>
      )}
    </div>
  );
};
