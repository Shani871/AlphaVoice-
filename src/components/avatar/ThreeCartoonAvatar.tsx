import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AudioLevels, CoreState, AvatarProfile } from '../../types';

interface ThreeCartoonAvatarProps {
  isSpeaking: boolean;
  audioLevels: AudioLevels;
  coreState: CoreState;
  avatarProfile: AvatarProfile;
  size?: 'compact' | 'normal' | 'hero';
  className?: string;
  isHovered?: boolean;
}

export const ThreeCartoonAvatar: React.FC<ThreeCartoonAvatarProps> = ({
  isSpeaking,
  audioLevels,
  coreState,
  avatarProfile,
  size = 'normal',
  className = '',
  isHovered = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Latest props stored in refs for the 60fps render loop
  const audioLevelsRef = useRef(audioLevels);
  audioLevelsRef.current = audioLevels;

  const isSpeakingRef = useRef(isSpeaking || coreState === 'USER_SPEAKING');
  isSpeakingRef.current = isSpeaking || coreState === 'USER_SPEAKING';

  const avatarProfileRef = useRef(avatarProfile);
  avatarProfileRef.current = avatarProfile;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- 3-POINT STUDIO CARTOON LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Key Light (Warm soft directional light)
    const keyLight = new THREE.DirectionalLight(0xfff1e6, 1.4);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Fill Light (Cool subtle fill)
    const fillLight = new THREE.DirectionalLight(0xa5c9ff, 0.8);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // Rim / Backlight (Electric cyan-blue edge shine)
    const rimLight = new THREE.DirectionalLight(0x5b7fff, 1.6);
    rimLight.position.set(0, 4, -3.5);
    scene.add(rimLight);

    // Bottom Bounce Light
    const bounceLight = new THREE.DirectionalLight(0x3ecf8e, 0.45);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // --- 3D CARTOON CHARACTER HIERARCHY ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const isGirl = avatarProfile.gender === 'female' || avatarProfile.id === 'girl';

    // Materials
    const skinColor = isGirl ? 0xf5c8ab : 0xefc2a2;
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.55,
      metalness: 0.02,
    });

    const blushMaterial = new THREE.MeshBasicMaterial({
      color: isGirl ? 0xe2687c : 0xc75c50,
      transparent: true,
      opacity: 0.4,
    });

    const hairColor = isGirl ? 0x6e2e1a : 0x5e371a;
    const hairHighlightColor = isGirl ? 0x964329 : 0x824e29;
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.4,
      metalness: 0.08,
    });
    const hairHighlightMat = new THREE.MeshStandardMaterial({
      color: hairHighlightColor,
      roughness: 0.35,
      metalness: 0.05,
    });

    // Eye materials
    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });
    const irisColor = isGirl ? 0x3d704e : 0x854f24;
    const irisMat = new THREE.MeshStandardMaterial({
      color: irisColor,
      roughness: 0.25,
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x080a0e });
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Mouth Materials
    const cavityMat = new THREE.MeshBasicMaterial({ color: 0x1d070b });
    const teethMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
    });
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xe05e70,
      roughness: 0.5,
    });
    const lipMat = new THREE.MeshStandardMaterial({
      color: isGirl ? 0xdb586b : 0xc26c63,
      roughness: 0.4,
    });

    // Clothes
    const clothesColor = isGirl ? 0x3d5f52 : 0x223048;
    const clothesMat = new THREE.MeshStandardMaterial({
      color: clothesColor,
      roughness: 0.65,
    });
    const innerShirtMat = new THREE.MeshStandardMaterial({
      color: isGirl ? 0xf0ece8 : 0xdee3eb,
      roughness: 0.5,
    });

    // 1. TORSO / SHOULDERS
    const bodyGroup = new THREE.Group();
    rootGroup.add(bodyGroup);

    const shouldersGeo = new THREE.CylinderGeometry(0.85, 1.25, 1.1, 32);
    const shouldersMesh = new THREE.Mesh(shouldersGeo, clothesMat);
    shouldersMesh.position.set(0, -1.35, 0);
    bodyGroup.add(shouldersMesh);

    // Inner Shirt Collar
    const collarGeo = new THREE.TorusGeometry(0.36, 0.09, 16, 32);
    const collarMesh = new THREE.Mesh(collarGeo, innerShirtMat);
    collarMesh.rotation.x = Math.PI / 2.3;
    collarMesh.position.set(0, -0.75, 0.1);
    bodyGroup.add(collarMesh);

    // 2. NECK
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.55, 24);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.set(0, -0.62, 0);
    rootGroup.add(neckMesh);

    // 3. HEAD GROUP (Animates with breathing, speaking nods, and mouse cursor tracking)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.15, 0);
    rootGroup.add(headGroup);

    // Cranium / Face (Cartoon Stylized Rounded Head)
    const headGeo = new THREE.SphereGeometry(0.78, 36, 36);
    headGeo.scale(1.0, 1.12, 1.05);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headGroup.add(headMesh);

    // Cheeks Blush (Volumetric spheres slightly embedded)
    const blushGeo = new THREE.SphereGeometry(0.18, 16, 16);
    blushGeo.scale(1.2, 0.8, 0.5);

    const blushLeft = new THREE.Mesh(blushGeo, blushMaterial);
    blushLeft.position.set(-0.46, -0.05, 0.65);
    blushLeft.rotation.y = -0.3;
    headGroup.add(blushLeft);

    const blushRight = new THREE.Mesh(blushGeo, blushMaterial);
    blushRight.position.set(0.46, -0.05, 0.65);
    blushRight.rotation.y = 0.3;
    headGroup.add(blushRight);

    // Cute Cartoon Button Nose
    const noseGeo = new THREE.SphereGeometry(0.095, 20, 20);
    noseGeo.scale(1.0, 0.9, 1.2);
    const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
    noseMesh.position.set(0, 0.02, 0.83);
    headGroup.add(noseMesh);

    // EARS
    const earGeo = new THREE.SphereGeometry(0.19, 18, 18);
    earGeo.scale(0.5, 0.9, 0.7);

    const earLeft = new THREE.Mesh(earGeo, skinMaterial);
    earLeft.position.set(-0.82, 0.05, 0.05);
    earLeft.rotation.z = 0.15;
    headGroup.add(earLeft);

    const earRight = new THREE.Mesh(earGeo, skinMaterial);
    earRight.position.set(0.82, 0.05, 0.05);
    earRight.rotation.z = -0.15;
    headGroup.add(earRight);

    // Acoustic Neural Communicator (High-tech earpiece on Right Ear)
    const earpieceGeo = new THREE.TorusGeometry(0.11, 0.035, 12, 24);
    const earpieceMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const earpieceMesh = new THREE.Mesh(earpieceGeo, earpieceMat);
    earpieceMesh.position.set(0.85, 0.06, 0.06);
    earpieceMesh.rotation.y = Math.PI / 2;
    headGroup.add(earpieceMesh);

    // Pulsing LED on Communicator
    const ledGeo = new THREE.SphereGeometry(0.038, 12, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x3ecf8e });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.88, 0.06, 0.12);
    headGroup.add(ledMesh);

    // 4. BIG 3D EXPRESSIVE EYES WITH BLINKING EYELIDS
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.18, 0.68);
    headGroup.add(eyesGroup);

    const createEye = (x: number, isRight: boolean) => {
      const singleEye = new THREE.Group();
      singleEye.position.set(x, 0, 0);

      // Eye Sclera (White)
      const eyeGeo = new THREE.SphereGeometry(0.17, 24, 24);
      eyeGeo.scale(1.0, 1.05, 0.7);
      const eyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      singleEye.add(eyeWhite);

      // Iris
      const irisGeo = new THREE.CircleGeometry(0.088, 24);
      const irisMesh = new THREE.Mesh(irisGeo, irisMat);
      irisMesh.position.set(0, 0, 0.125);
      singleEye.add(irisMesh);

      // Pupil
      const pupilGeo = new THREE.CircleGeometry(0.048, 20);
      const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
      pupilMesh.position.set(0, 0, 0.127);
      singleEye.add(pupilMesh);

      // Specular Catchlights (Gives that adorable Pixar glimmer)
      const catchlight1 = new THREE.Mesh(
        new THREE.CircleGeometry(0.024, 16),
        catchlightMat
      );
      catchlight1.position.set(-0.028, 0.03, 0.129);
      singleEye.add(catchlight1);

      const catchlight2 = new THREE.Mesh(
        new THREE.CircleGeometry(0.012, 12),
        catchlightMat
      );
      catchlight2.position.set(0.025, -0.025, 0.129);
      singleEye.add(catchlight2);

      // Eyelid for Blinking (Rotates down to cover eye)
      const eyelidGeo = new THREE.SphereGeometry(0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      eyelidGeo.scale(1.02, 1.08, 0.75);
      const eyelidMesh = new THREE.Mesh(eyelidGeo, skinMaterial);
      eyelidMesh.rotation.x = -Math.PI / 2; // Default open
      singleEye.add(eyelidMesh);

      // Eyelash line for Girl
      if (isGirl) {
        const lashGeo = new THREE.TorusGeometry(0.165, 0.016, 8, 16, Math.PI * 0.75);
        const lashMat = new THREE.MeshBasicMaterial({ color: 0x22110c });
        const lashMesh = new THREE.Mesh(lashGeo, lashMat);
        lashMesh.rotation.z = isRight ? -0.3 : 1.3;
        lashMesh.position.set(0, 0.06, 0.08);
        singleEye.add(lashMesh);
      }

      return { group: singleEye, eyelid: eyelidMesh };
    };

    const eyeL = createEye(-0.28, false);
    const eyeR = createEye(0.28, true);
    eyesGroup.add(eyeL.group);
    eyesGroup.add(eyeR.group);

    // Eyebrows
    const browGeo = new THREE.CylinderGeometry(0.028, 0.016, 0.26, 12);
    const browMat = new THREE.MeshStandardMaterial({
      color: isGirl ? 0x481e13 : 0x3d2212,
      roughness: 0.6,
    });

    const browLeft = new THREE.Mesh(browGeo, browMat);
    browLeft.rotation.z = Math.PI / 2.3;
    browLeft.position.set(-0.29, 0.21, 0.72);
    eyesGroup.add(browLeft);

    const browRight = new THREE.Mesh(browGeo, browMat);
    browRight.rotation.z = -Math.PI / 2.3;
    browRight.position.set(0.29, 0.21, 0.72);
    eyesGroup.add(browRight);

    // 5. 3D CARTOON MOUTH & JAW RIG (PHYSICAL REAL-TIME LIP-SYNC ENGINE)
    const jawGroup = new THREE.Group();
    jawGroup.position.set(0, -0.22, 0.73);
    headGroup.add(jawGroup);

    // Mouth Interior Cavity
    const mouthCavityGeo = new THREE.SphereGeometry(0.14, 16, 16);
    mouthCavityGeo.scale(1.2, 0.6, 0.4);
    const mouthCavity = new THREE.Mesh(mouthCavityGeo, cavityMat);
    mouthCavity.position.set(0, 0, -0.04);
    jawGroup.add(mouthCavity);

    // Upper Pearly Teeth
    const upperTeethGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.045, 16, 1, false, 0, Math.PI);
    const upperTeeth = new THREE.Mesh(upperTeethGeo, teethMat);
    upperTeeth.position.set(0, 0.045, 0.02);
    upperTeeth.rotation.x = Math.PI / 2;
    jawGroup.add(upperTeeth);

    // Lower Teeth
    const lowerTeethGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.038, 16, 1, false, 0, Math.PI);
    const lowerTeeth = new THREE.Mesh(lowerTeethGeo, teethMat);
    lowerTeeth.position.set(0, -0.05, 0.02);
    lowerTeeth.rotation.x = -Math.PI / 2;
    jawGroup.add(lowerTeeth);

    // Tongue (Articulates with speech frequency)
    const tongueGeo = new THREE.SphereGeometry(0.08, 12, 12);
    tongueGeo.scale(1.0, 0.5, 0.8);
    const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    tongueMesh.position.set(0, -0.04, 0.01);
    jawGroup.add(tongueMesh);

    // Upper Lip (Curved Torus Tube)
    const upperLipGeo = new THREE.TorusGeometry(0.14, 0.028, 12, 24, Math.PI * 0.85);
    const upperLip = new THREE.Mesh(upperLipGeo, lipMat);
    upperLip.position.set(0, 0.04, 0.035);
    upperLip.rotation.z = Math.PI * 1.08;
    jawGroup.add(upperLip);

    // Lower Lip
    const lowerLipGeo = new THREE.TorusGeometry(0.13, 0.032, 12, 24, Math.PI * 0.85);
    const lowerLip = new THREE.Mesh(lowerLipGeo, lipMat);
    lowerLip.position.set(0, -0.04, 0.035);
    lowerLip.rotation.z = Math.PI * 0.08;
    jawGroup.add(lowerLip);

    // 6. 3D CARTOON STYLIZED HAIR (BOY vs GIRL)
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    if (isGirl) {
      // GIRL (MAYA): Flowing long layered waves around shoulders + front swept bangs
      // Top Volume
      const topHairGeo = new THREE.SphereGeometry(0.84, 24, 24);
      topHairGeo.scale(1.04, 1.1, 1.12);
      const topHair = new THREE.Mesh(topHairGeo, hairMaterial);
      topHair.position.set(0, 0.12, -0.08);
      hairGroup.add(topHair);

      // Cascading Left Locks
      const leftLockGeo = new THREE.CylinderGeometry(0.18, 0.28, 1.4, 16);
      leftLockGeo.scale(0.8, 1.0, 1.1);
      const leftLock = new THREE.Mesh(leftLockGeo, hairMaterial);
      leftLock.position.set(-0.65, -0.5, 0.1);
      leftLock.rotation.z = 0.18;
      hairGroup.add(leftLock);

      // Cascading Right Locks
      const rightLock = new THREE.Mesh(leftLockGeo, hairMaterial);
      rightLock.position.set(0.65, -0.5, 0.1);
      rightLock.rotation.z = -0.18;
      hairGroup.add(rightLock);

      // Front Bangs Framing
      const bangGeo = new THREE.SphereGeometry(0.32, 16, 16);
      bangGeo.scale(1.3, 0.6, 0.5);
      const bangMesh = new THREE.Mesh(bangGeo, hairHighlightMat);
      bangMesh.position.set(-0.25, 0.72, 0.6);
      bangMesh.rotation.z = -0.3;
      hairGroup.add(bangMesh);

      const bangRight = new THREE.Mesh(bangGeo, hairMaterial);
      bangRight.position.set(0.35, 0.7, 0.55);
      bangRight.rotation.z = 0.25;
      hairGroup.add(bangRight);
    } else {
      // BOY (LEO): Modern textured hair clusters with front sweep and side taper
      const topHairGeo = new THREE.SphereGeometry(0.83, 24, 24);
      topHairGeo.scale(1.05, 1.05, 1.05);
      const topHair = new THREE.Mesh(topHairGeo, hairMaterial);
      topHair.position.set(0, 0.15, -0.08);
      hairGroup.add(topHair);

      // Front textured sweeps
      const tuftGeo = new THREE.ConeGeometry(0.24, 0.48, 12);
      tuftGeo.scale(1.2, 1.0, 0.8);

      const tuft1 = new THREE.Mesh(tuftGeo, hairHighlightMat);
      tuft1.position.set(-0.12, 0.88, 0.42);
      tuft1.rotation.set(-0.5, 0.2, -0.4);
      hairGroup.add(tuft1);

      const tuft2 = new THREE.Mesh(tuftGeo, hairMaterial);
      tuft2.position.set(0.2, 0.86, 0.38);
      tuft2.rotation.set(-0.4, -0.15, 0.35);
      hairGroup.add(tuft2);

      const tuft3 = new THREE.Mesh(tuftGeo, hairHighlightMat);
      tuft3.position.set(-0.35, 0.78, 0.28);
      tuft3.rotation.set(-0.2, 0.4, -0.6);
      hairGroup.add(tuft3);

      const tuft4 = new THREE.Mesh(tuftGeo, hairMaterial);
      tuft4.position.set(0.42, 0.76, 0.25);
      tuft4.rotation.set(-0.2, -0.3, 0.55);
      hairGroup.add(tuft4);
    }

    // --- ANIMATION & BLINK STATE ---
    let animId: number;
    let clock = new THREE.Clock();

    let isBlinking = false;
    let blinkTimer = 0;
    let nextBlinkTime = 2.5 + Math.random() * 2.5;

    // Smoothed speech articulation variables
    let curMouthOpen = 0.05;
    let curMouthWidth = 1.0;
    let curJawY = 0;

    // Mouse Tracking for dynamic interactive gaze
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 0.45;
      targetRotX = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- RENDER LOOP ---
    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const audio = audioLevelsRef.current;
      const speaking = isSpeakingRef.current || audio.overall > 0.05;

      // 1. Natural Eye Blinking
      blinkTimer += delta;
      if (blinkTimer >= nextBlinkTime && !isBlinking) {
        isBlinking = true;
        blinkTimer = 0;
        nextBlinkTime = 2.8 + Math.random() * 2.6;
      }

      if (isBlinking) {
        const blinkProgress = blinkTimer / 0.15; // 150ms blink
        if (blinkProgress >= 1.0) {
          isBlinking = false;
          eyeL.eyelid.rotation.x = -Math.PI / 2;
          eyeR.eyelid.rotation.x = -Math.PI / 2;
        } else {
          // Closed eyelid rotation
          const angle = Math.sin(blinkProgress * Math.PI) * (Math.PI / 2);
          eyeL.eyelid.rotation.x = -Math.PI / 2 + angle;
          eyeR.eyelid.rotation.x = -Math.PI / 2 + angle;
        }
      }

      // 2. Real-Time 3D Lip-Sync Synthesis
      const targetOpen = speaking
        ? Math.min(1.4, Math.max(0.12, audio.overall * 2.8 + audio.bass * 1.2))
        : 0.05;

      const targetWidth = speaking
        ? 1.0 + audio.mid * 0.8 + Math.sin(time * 16) * 0.1
        : 0.95;

      const targetJaw = speaking
        ? -Math.min(0.18, audio.overall * 0.35 + audio.bass * 0.15)
        : 0;

      // Smooth exponential interpolation (LERP) for fluid speech
      curMouthOpen += (targetOpen - curMouthOpen) * 0.35;
      curMouthWidth += (targetWidth - curMouthWidth) * 0.3;
      curJawY += (targetJaw - curJawY) * 0.35;

      // Apply to 3D Mouth Geometry
      jawGroup.position.y = -0.22 + curJawY;
      mouthCavity.scale.set(curMouthWidth * 1.2, Math.max(0.2, curMouthOpen * 1.6), 0.4);
      lowerLip.position.y = -0.04 - curMouthOpen * 0.06;
      upperLip.position.y = 0.04 + curMouthOpen * 0.03;

      // Tongue movement with speech cadence
      tongueMesh.position.y = -0.04 + (speaking ? Math.sin(time * 14) * 0.035 : 0);

      // 3. Conversational 3D Head Gestures & Breathing
      const speechNodX = speaking
        ? Math.sin(time * 5.5) * (0.04 + audio.bass * 0.08)
        : Math.sin(time * 1.4) * 0.015;

      const speechTiltZ = speaking
        ? Math.sin(time * 3.2) * (0.03 + audio.mid * 0.06)
        : Math.sin(time * 0.8) * 0.01;

      // Gaze Tracking interpolation
      headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetRotX + speechNodX - headGroup.rotation.x) * 0.08;
      headGroup.rotation.z += (speechTiltZ - headGroup.rotation.z) * 0.08;

      // Gentle vertical breathing bob
      rootGroup.position.y = Math.sin(time * 2.0) * 0.03;

      // LED Communicator Pulse
      if (speaking) {
        ledMat.color.setHex(0x3ecf8e);
        ledMesh.scale.setScalar(1.0 + Math.sin(time * 12) * 0.3);
      } else {
        ledMat.color.setHex(0x5b7fff);
        ledMesh.scale.setScalar(1.0);
      }

      renderer.render(scene, camera);
    };

    render();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 240;
      const h = container.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [avatarProfile.id, avatarProfile.gender]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
    />
  );
};
