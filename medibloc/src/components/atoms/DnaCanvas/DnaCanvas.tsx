import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DnaCanvasProps {
  readonly className?: string;
}

export const DnaCanvas = ({ className = '' }: DnaCanvasProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 35;
    camera.position.x = 8;
    camera.position.y = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const pointCount = 48;
    const radius = 6.2;
    const heightSpan = 38;

    const sphereGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const strandAMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
    });
    const strandBMat = new THREE.MeshStandardMaterial({
      color: 0x7ed957,
      roughness: 0.15,
      metalness: 0.2,
      emissive: 0x7ed957,
      emissiveIntensity: 0.45,
    });

    const bridgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });

    for (let i = 0; i < pointCount; i += 1) {
      const angle = (i / pointCount) * Math.PI * 4.5;
      const y = (i / pointCount - 0.5) * heightSpan;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      const mesh1 = new THREE.Mesh(sphereGeo, strandAMat);
      mesh1.position.set(x1, y, z1);
      group.add(mesh1);

      const mesh2 = new THREE.Mesh(sphereGeo, strandBMat);
      mesh2.position.set(x2, y, z2);
      group.add(mesh2);

      const bridgePoints = [
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x2, y, z2),
      ];
      const bridgeGeo = new THREE.BufferGeometry().setFromPoints(bridgePoints);
      const bridge = new THREE.Line(bridgeGeo, bridgeMat);
      group.add(bridge);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7ed957, 1.4);
    dirLight2.position.set(-15, -10, -15);
    scene.add(dirLight2);

    group.rotation.x = 0.45;
    group.rotation.z = -0.78;
    group.rotation.y = 0.3;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = event.clientX - rect.left - width / 2;
      const y = event.clientY - rect.top - height / 2;
      mouseX = (x / width) * 0.3;
      mouseY = (y / height) * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      group.rotation.y += 0.007;
      group.rotation.x += (mouseY - group.rotation.x + 0.45) * 0.03;
      group.rotation.z += (mouseX - group.rotation.z - 0.78) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) {
        return;
      }
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.domElement.remove();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
};
