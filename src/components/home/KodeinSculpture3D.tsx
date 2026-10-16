'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface KodeinSculpture3DProps {
  /** Normalized scroll progress from 0 to 1 */
  progress: number;
  /** Currently active stat index (0 to 5) */
  activeIndex: number;
}

function createCapsuleShape(width: number, height: number): THREE.Shape {
  const shape = new THREE.Shape();
  const r = width / 2;
  const halfH = height / 2 - r;

  shape.absarc(0, halfH, r, 0, Math.PI, false);
  shape.lineTo(-r, -halfH);
  shape.absarc(0, -halfH, r, Math.PI, Math.PI * 2, false);
  shape.lineTo(r, halfH);

  return shape;
}

export function KodeinSculpture3D({ progress, activeIndex }: KodeinSculpture3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(progress);
  const activeIdxRef = useRef<number>(activeIndex);

  progressRef.current = progress;
  activeIdxRef.current = activeIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, and Physically-Based WebGLRenderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.set(0, 0.25, 8.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Map for Metallic & Clearcoat Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    roomEnv.dispose();

    // 3. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f5, 3.0);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xee2b10, 2.6);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xff5e2b, 2.4, 12);
    coreLight.position.set(0, 0, 2.2);
    scene.add(coreLight);

    // 4. Master 3D Sculpture Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 4A. The 6 Extruded 3D Kodein Pinwheel Blades + Kinematic Telescoping Piston Arms
    const bladeShape = createCapsuleShape(0.45, 1.3);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 1,
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.08,
      bevelOffset: 0,
      bevelSegments: 8,
    };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    bladeGeo.center();

    // Unit-length cylinder (height = 1.0) so we can dynamically scale & orient it between Core (0,0,0) and Blade Joint
    const rodGeo = new THREE.CylinderGeometry(0.036, 0.036, 1.0, 20);
    const sleeveGeo = new THREE.CylinderGeometry(0.068, 0.078, 1.0, 20);
    const jointGeo = new THREE.SphereGeometry(0.088, 20, 20);

    interface ArmLinkage {
      bladeMesh: THREE.Mesh;
      bladeMat: THREE.MeshPhysicalMaterial;
      rodMesh: THREE.Mesh;
      rodMat: THREE.MeshStandardMaterial;
      sleeveMesh: THREE.Mesh;
      jointMesh: THREE.Mesh;
    }

    const arms: ArmLinkage[] = [];

    for (let i = 0; i < 6; i++) {
      const angleRad = (i * 60 * Math.PI) / 180;
      const pivot = new THREE.Group();
      pivot.rotation.z = angleRad;

      // Inner Telescoping Piston Rod (connects Core 0,0,0 to Blade Joint)
      const rodMat = new THREE.MeshStandardMaterial({
        color: 0x3f3f46,
        metalness: 0.88,
        roughness: 0.16,
        emissive: new THREE.Color(0x000000),
      });
      const rodMesh = new THREE.Mesh(rodGeo, rodMat);
      pivot.add(rodMesh);

      // Outer Hydraulic Cylinder Sleeve (anchors from Core toward Blade)
      const sleeveMat = new THREE.MeshStandardMaterial({
        color: 0x18181c,
        metalness: 0.9,
        roughness: 0.22,
      });
      const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
      pivot.add(sleeveMesh);

      // Spherical Ball-Joint Socket right where the Rod meets the Blade
      const jointMesh = new THREE.Mesh(jointGeo, rodMat);
      pivot.add(jointMesh);

      // Extruded Pinwheel Blade
      const bladeMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x18181c),
        metalness: 0.78,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 1.0,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0,
      });

      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.castShadow = true;
      bladeMesh.receiveShadow = true;

      bladeMesh.position.set(-0.42, 1.12, 0);
      bladeMesh.rotation.z = (-6 * Math.PI) / 180;
      bladeMesh.rotation.y = (14 * Math.PI) / 180;

      pivot.add(bladeMesh);
      rootGroup.add(pivot);

      arms.push({
        bladeMesh,
        bladeMat,
        rodMesh,
        rodMat,
        sleeveMesh,
        jointMesh,
      });
    }

    // 4B. Central Faceted Core + Dual Gyroscopic Cages
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    const innerCoreGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const innerCoreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xee2b10),
      metalness: 0.35,
      roughness: 0.14,
      clearcoat: 1.0,
      emissive: new THREE.Color(0xee2b10),
      emissiveIntensity: 0.3,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCoreMesh);

    const cageGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.92,
      roughness: 0.1,
      wireframe: true,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    const coreBezelGeo = new THREE.TorusGeometry(0.82, 0.03, 20, 80);
    const coreBezelMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      metalness: 0.9,
      roughness: 0.15,
    });
    const coreBezel = new THREE.Mesh(coreBezelGeo, coreBezelMat);
    rootGroup.add(coreBezel);

    // 4C. Precision Machined Gimbal Rings
    const outerRingGeo = new THREE.TorusGeometry(2.36, 0.028, 24, 128);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.88,
      roughness: 0.18,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    rootGroup.add(outerRing);

    const innerRingGeo = new THREE.TorusGeometry(2.02, 0.018, 20, 128);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xee2b10,
      metalness: 0.65,
      roughness: 0.22,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 3;
    rootGroup.add(innerRing);

    const markerGeo = new THREE.SphereGeometry(0.068, 20, 20);
    const markerMat = new THREE.MeshStandardMaterial({
      color: 0xee2b10,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0xee2b10,
      emissiveIntensity: 0.35,
    });
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 * Math.PI) / 180;
      const m = new THREE.Mesh(markerGeo, markerMat);
      m.position.set(Math.cos(a) * 2.36, Math.sin(a) * 2.36, 0);
      outerRing.add(m);
    }

    // 4D. 72-Tick Precision Chronograph / Turbine Dial Ring
    const dialGroup = new THREE.Group();
    rootGroup.add(dialGroup);

    const tickGeo = new THREE.BoxGeometry(0.028, 0.15, 0.06);
    const tickMeshes: THREE.Mesh[] = [];
    const tickMats: THREE.MeshStandardMaterial[] = [];
    const totalTicks = 72;
    const dialRadius = 2.74;

    for (let i = 0; i < totalTicks; i++) {
      const angle = (i / totalTicks) * Math.PI * 2;
      const isMajor = i % 12 === 0;
      const tMat = new THREE.MeshStandardMaterial({
        color: isMajor ? 0xee2b10 : 0x52525b,
        metalness: 0.75,
        roughness: 0.25,
      });
      const tick = new THREE.Mesh(tickGeo, tMat);
      if (isMajor) {
        tick.scale.set(1.4, 1.55, 1.4);
      }
      tick.position.set(Math.cos(angle) * dialRadius, Math.sin(angle) * dialRadius, 0);
      tick.rotation.z = angle - Math.PI / 2;
      dialGroup.add(tick);
      tickMeshes.push(tick);
      tickMats.push(tMat);
    }

    // 4E. 3D Orbital Satellite Nodes around the sculpture
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    const satGeo = new THREE.OctahedronGeometry(0.045, 0);
    const satMatRed = new THREE.MeshStandardMaterial({
      color: 0xee2b10,
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0xee2b10,
      emissiveIntensity: 0.25,
    });
    const satMatDark = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.85,
      roughness: 0.2,
    });

    const satellites: Array<{
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      yOffset: number;
      tilt: number;
    }> = [];

    for (let i = 0; i < 28; i++) {
      const mesh = new THREE.Mesh(satGeo, i % 3 === 0 ? satMatRed : satMatDark);
      const radius = 3.05 + (i % 5) * 0.22;
      const angle = (i / 28) * Math.PI * 2;
      const yOffset = ((i % 7) - 3) * 0.32;
      const tilt = ((i % 4) - 1.5) * 0.25;
      mesh.scale.setScalar(0.65 + (i % 3) * 0.25);
      satelliteGroup.add(mesh);
      satellites.push({
        mesh,
        radius,
        speed: 0.25 + (i % 4) * 0.12,
        angle,
        yOffset,
        tilt,
      });
    }

    // 4F. Soft Contact Shadow Receiver Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(10, 10);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.85;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Mouse & Touch Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouseX = Math.max(-1, Math.min(1, nx)) * 0.38;
      targetMouseY = Math.max(-1, Math.min(1, ny)) * 0.26;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 6. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.position.z = w < 480 ? 9.1 : 8.6;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 7. Real-Time 60fps Animation Loop with Exact Kinematic Linkage
    const colorActive = new THREE.Color(0xee2b10);
    const colorDark = new THREE.Color(0x18181c);
    const colorRodIdle = new THREE.Color(0x3f3f46);
    const colorTickIdle = new THREE.Color(0x71717a);
    const emissiveActive = new THREE.Color(0x420a03);
    const emissiveDark = new THREE.Color(0x000000);

    // Base radial vector (-0.42, 1.12) normalized so extension slides strictly along the arm axis
    const baseVecX = -0.42;
    const baseVecY = 1.12;
    const baseLen = Math.hypot(baseVecX, baseVecY);
    const radialDirX = baseVecX / baseLen;
    const radialDirY = baseVecY / baseLen;

    const upAxis = new THREE.Vector3(0, 1, 0);
    const jointPos = new THREE.Vector3();
    const armDir = new THREE.Vector3();
    const localJointOffset = new THREE.Vector3(0, -0.42, 0);

    let smoothScroll = progressRef.current;
    let clock = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      clock += 0.012;

      smoothScroll += (progressRef.current - smoothScroll) * 0.09;
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Rotate entire 3D sculpture driven by scroll progress + pointer parallax
      rootGroup.rotation.y =
        smoothScroll * Math.PI * 1.75 - 0.4 + currentMouseX + Math.sin(clock * 0.7) * 0.05;
      rootGroup.rotation.x =
        0.3 + Math.sin(smoothScroll * Math.PI) * 0.28 - currentMouseY * 0.55;
      rootGroup.rotation.z = -smoothScroll * Math.PI * 0.9;

      // Counter-rotate internal core & gimbal rings
      coreGroup.rotation.x = -clock * 0.85 - smoothScroll * Math.PI * 2.2;
      coreGroup.rotation.y = clock * 1.15 + smoothScroll * Math.PI * 2.2;
      const corePulse = 1 + Math.sin(clock * 2.6) * 0.05;
      innerCoreMesh.scale.setScalar(corePulse);
      coreBezel.rotation.x = Math.sin(clock + smoothScroll * 4) * 0.35;
      coreBezel.rotation.y = Math.cos(clock + smoothScroll * 4) * 0.35;

      outerRing.rotation.x = Math.PI * 0.16 + smoothScroll * Math.PI * 1.1;
      outerRing.rotation.y = smoothScroll * Math.PI * 0.85;
      innerRing.rotation.y = -clock * 0.65 - smoothScroll * Math.PI * 2.5;
      innerRing.rotation.z = smoothScroll * Math.PI * 1.5;

      const currentActive = activeIdxRef.current;
      const explodeFactor = Math.sin(smoothScroll * Math.PI) * 0.18;

      // Articulate the 6 Kodein Blades AND dynamically lock their Telescoping Piston Arms
      for (let i = 0; i < 6; i++) {
        const isTarget = i === currentActive;
        const { bladeMesh, bladeMat, rodMesh, rodMat, sleeveMesh, jointMesh } = arms[i];

        // Slide strictly along the radial axis (radialDirX, radialDirY) + Z depth
        const radialExtension = explodeFactor + (isTarget ? 0.3 : 0);
        const targetX = baseVecX + radialDirX * radialExtension;
        const targetY = baseVecY + radialDirY * radialExtension;
        const targetZ = isTarget ? 0.26 : (i % 2 === 0 ? 1 : -1) * explodeFactor * 0.4;
        const targetRotY = isTarget ? (24 * Math.PI) / 180 : (14 * Math.PI) / 180;
        const targetScale = isTarget ? 1.08 : 1.0;

        bladeMesh.position.x += (targetX - bladeMesh.position.x) * 0.12;
        bladeMesh.position.y += (targetY - bladeMesh.position.y) * 0.12;
        bladeMesh.position.z += (targetZ - bladeMesh.position.z) * 0.12;
        bladeMesh.rotation.y += (targetRotY - bladeMesh.rotation.y) * 0.12;
        bladeMesh.scale.x += (targetScale - bladeMesh.scale.x) * 0.12;
        bladeMesh.scale.y += (targetScale - bladeMesh.scale.y) * 0.12;
        bladeMesh.scale.z += (targetScale - bladeMesh.scale.z) * 0.12;

        // Compute exact 3D position of the blade's base socket in pivot space
        jointPos
          .copy(localJointOffset)
          .multiplyScalar(bladeMesh.scale.y)
          .applyEuler(bladeMesh.rotation)
          .add(bladeMesh.position);

        const dist = jointPos.length();
        armDir.copy(jointPos).normalize();

        // Lock Ball-Joint Socket right onto the base of the blade
        jointMesh.position.copy(jointPos);

        // Lock Telescoping Inner Piston Rod from Core (0,0,0) -> Joint Socket (jointPos)
        rodMesh.position.copy(jointPos).multiplyScalar(0.5);
        rodMesh.scale.set(1, dist, 1);
        rodMesh.quaternion.setFromUnitVectors(upAxis, armDir);

        // Lock Outer Hydraulic Sleeve along the lower 58% of the Piston Rod
        const sleeveLen = dist * 0.58;
        sleeveMesh.position.copy(armDir).multiplyScalar(sleeveLen * 0.5);
        sleeveMesh.scale.set(1, sleeveLen, 1);
        sleeveMesh.quaternion.copy(rodMesh.quaternion);

        // Smooth material transitions
        bladeMat.color.lerp(isTarget ? colorActive : colorDark, 0.12);
        bladeMat.emissive.lerp(isTarget ? emissiveActive : emissiveDark, 0.12);
        bladeMat.metalness += ((isTarget ? 0.42 : 0.78) - bladeMat.metalness) * 0.12;
        bladeMat.roughness += ((isTarget ? 0.12 : 0.2) - bladeMat.roughness) * 0.12;

        rodMat.color.lerp(isTarget ? colorActive : colorRodIdle, 0.12);
        rodMat.emissive.lerp(isTarget ? emissiveActive : emissiveDark, 0.12);
      }

      // Animate 72 Chronograph Dial Ticks in a 3D wave around the active blade
      const activeAngle = ((currentActive * 60 + 90) % 360) * (Math.PI / 180);
      for (let i = 0; i < totalTicks; i++) {
        const tickAngle = (i / totalTicks) * Math.PI * 2;
        const diff = Math.abs(
          Math.atan2(Math.sin(tickAngle - activeAngle), Math.cos(tickAngle - activeAngle))
        );
        const proximity = Math.max(0, 1 - diff / 0.65);
        const tick = tickMeshes[i];
        const tMat = tickMats[i];

        const targetTickZ = proximity * 0.28 + Math.sin(clock * 2 + i * 0.25) * 0.03;
        tick.position.z += (targetTickZ - tick.position.z) * 0.15;

        const isMajor = i % 12 === 0;
        tMat.color.lerp(proximity > 0.35 || isMajor ? colorActive : colorTickIdle, 0.12);
      }

      // Orbit the 28 3D Satellites around the sculpture
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        const a = sat.angle + clock * sat.speed + smoothScroll * Math.PI * 2.2;
        sat.mesh.position.x = Math.cos(a) * sat.radius;
        sat.mesh.position.z = Math.sin(a) * sat.radius * 0.65;
        sat.mesh.position.y = sat.yOffset + Math.sin(a * 1.5) * sat.tilt;
        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      envTexture.dispose();
      pmremGenerator.dispose();
      bladeGeo.dispose();
      rodGeo.dispose();
      sleeveGeo.dispose();
      jointGeo.dispose();
      innerCoreGeo.dispose();
      cageGeo.dispose();
      coreBezelGeo.dispose();
      outerRingGeo.dispose();
      innerRingGeo.dispose();
      markerGeo.dispose();
      tickGeo.dispose();
      satGeo.dispose();
      shadowPlaneGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="h-full w-full cursor-grab active:cursor-grabbing select-none"
      aria-hidden="true"
    />
  );
}
