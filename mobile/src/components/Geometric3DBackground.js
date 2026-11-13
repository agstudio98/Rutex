import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

const { width: windowWidth } = Dimensions.get('window');

// Vértices 3D normalizados de un icosaedro geométrico volumétrico
const phi = (1 + Math.sqrt(5)) / 2;
const rawVertices = [
  [-1, phi, 0],
  [1, phi, 0],
  [-1, -phi, 0],
  [1, -phi, 0],
  [0, -1, phi],
  [0, 1, phi],
  [0, -1, -phi],
  [0, 1, -phi],
  [phi, 0, -1],
  [phi, 0, 1],
  [-phi, 0, -1],
  [-phi, 0, 1],
];

// Aristas que conectan los vértices del icosaedro
const edges = [
  [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
  [1, 5], [1, 9], [1, 8], [1, 7],
  [2, 11], [2, 10], [2, 6], [2, 4],
  [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 10], [6, 7], [6, 8],
  [7, 10], [7, 8],
  [8, 9],
  [10, 11],
];

export const Geometric3DBackground = ({
  height = 240,
  color = '#FFE600',
  secondaryColor = '#FFFFFF',
  speed = 0.012,
  opacity = 0.85,
  style,
}) => {
  const [angles, setAngles] = useState({ x: 0.2, y: 0.3, z: 0.1 });

  useEffect(() => {
    let animId;
    const updateRotation = () => {
      setAngles((prev) => ({
        x: prev.x + speed * 0.9,
        y: prev.y + speed * 1.3,
        z: prev.z + speed * 0.5,
      }));
      animId = requestAnimationFrame(updateRotation);
    };

    animId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  // Proyección 3D a 2D con rotación en los tres ejes (Euler angles)
  const cx = windowWidth > 500 ? 250 : windowWidth / 2;
  const cy = height / 2;
  const scale = Math.min(height, windowWidth) * 0.22;
  const perspective = 4.2;

  const cosX = Math.cos(angles.x);
  const sinX = Math.sin(angles.x);
  const cosY = Math.cos(angles.y);
  const sinY = Math.sin(angles.y);
  const cosZ = Math.cos(angles.z);
  const sinZ = Math.sin(angles.z);

  const projectedPoints = rawVertices.map(([x, y, z]) => {
    // Rotar en Y
    let x1 = x * cosY + z * sinY;
    let y1 = y;
    let z1 = -x * sinY + z * cosY;

    // Rotar en X
    let x2 = x1;
    let y2 = y1 * cosX - z1 * sinX;
    let z2 = y1 * sinX + z1 * cosX;

    // Rotar en Z
    let x3 = x2 * cosZ - y2 * sinZ;
    let y3 = x2 * sinZ + y2 * cosZ;
    let z3 = z2;

    // Proyección en perspectiva
    const distance = perspective + z3;
    const factor = perspective / Math.max(distance, 0.1);

    return {
      u: cx + x3 * scale * factor,
      v: cy + y3 * scale * factor,
      depth: z3,
    };
  });

  return (
    <View style={[styles.container, { height }, style]} pointerEvents="none">
      <Svg width="100%" height={height}>
        {/* Líneas / Aristas volumétricas 3D */}
        {edges.map(([i1, i2], idx) => {
          const p1 = projectedPoints[i1];
          const p2 = projectedPoints[i2];
          if (!p1 || !p2) return null;
          const avgDepth = (p1.depth + p2.depth) / 2;
          const lineOpacity = Math.max(0.15, Math.min(opacity, (avgDepth + 2.5) / 5));

          return (
            <Line
              key={idx}
              x1={p1.u}
              y1={p1.v}
              x2={p2.u}
              y2={p2.v}
              stroke={color}
              strokeWidth={avgDepth > 0 ? '1.75' : '1'}
              strokeOpacity={lineOpacity}
            />
          );
        })}

        {/* Nodos / Vértices en esquinas */}
        {projectedPoints.map((p, idx) => (
          <Circle
            key={`c-${idx}`}
            cx={p.u}
            cy={p.v}
            r={p.depth > 0 ? 3.5 : 2}
            fill={p.depth > 0 ? color : secondaryColor}
            fillOpacity={opacity}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Geometric3DBackground;
