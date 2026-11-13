import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import * as THREE from 'three';

export const Geometric3DBackground = ({
  height = 280,
  shape = 'icosahedron', // 'icosahedron' | 'cube' | 'torus'
  color = '#FFE600',
  secondaryColor = '#FFFFFF',
  speed = 0.008,
  opacity = 0.85,
  style,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const currentHeight = height;

    // 1. Configurar Escena Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / currentHeight, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, currentHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Crear geometrías volumétricas 3D de estilo brutalista
    let geometry;
    if (shape === 'cube') {
      geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    } else if (shape === 'octahedron') {
      geometry = new THREE.OctahedronGeometry(2, 0);
    } else {
      geometry = new THREE.IcosahedronGeometry(2, 0);
    }

    // Bordes alámbricos geométricos
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      linewidth: 2,
      transparent: true,
      opacity: opacity,
    });
    const wireframeMesh = new THREE.LineSegments(edges, lineMaterial);
    scene.add(wireframeMesh);

    // Nodos/Vértices volumétricos en las esquinas
    const innerGeom = new THREE.IcosahedronGeometry(1.2, 0);
    const innerEdges = new THREE.EdgesGeometry(innerGeom);
    const innerMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(secondaryColor),
      linewidth: 1,
      transparent: true,
      opacity: opacity * 0.45,
    });
    const innerMesh = new THREE.LineSegments(innerEdges, innerMaterial);
    scene.add(innerMesh);

    // Pequeño octaedro central
    const centerGeom = new THREE.OctahedronGeometry(0.5, 0);
    const centerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: true,
    });
    const centerMesh = new THREE.Mesh(centerGeom, centerMat);
    scene.add(centerMesh);

    let animationFrameId;

    // 3. Loop de Renderizado 3D
    const animate = () => {
      wireframeMesh.rotation.x += speed * 0.9;
      wireframeMesh.rotation.y += speed * 1.3;
      wireframeMesh.rotation.z += speed * 0.5;

      innerMesh.rotation.x -= speed * 1.2;
      innerMesh.rotation.y -= speed * 0.8;

      centerMesh.rotation.y += speed * 2;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 360;
      camera.aspect = newWidth / currentHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, currentHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      edges.dispose();
      lineMaterial.dispose();
      innerGeom.dispose();
      innerEdges.dispose();
      innerMaterial.dispose();
      centerGeom.dispose();
      centerMat.dispose();
      renderer.dispose();
    };
  }, [height, shape, color, secondaryColor, speed, opacity]);

  return (
    <View style={[styles.wrapper, { height }, style]}>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Geometric3DBackground;
