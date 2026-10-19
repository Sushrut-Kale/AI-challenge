'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { TerrainCell } from '@/lib/world/terrain-generator';
import { COLORS } from '@/lib/world/world-config';

interface TerrainProps {
  cells: TerrainCell[];
}

// Build the terrain using instanced meshes grouped by block type
export default function Terrain({ cells }: TerrainProps) {
  const groups = useMemo(() => {
    const grassTop: THREE.Matrix4[] = [];
    const dirt: THREE.Matrix4[] = [];
    const stone: THREE.Matrix4[] = [];
    const stoneDark: THREE.Matrix4[] = [];
    const sand: THREE.Matrix4[] = [];

    const m4 = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const sc = new THREE.Vector3(1, 1, 1);

    for (const cell of cells) {
      const { x, z, height, type } = cell;
      const y = height;

      // Top surface block
      pos.set(x, y, z);
      m4.compose(pos, quat, sc);

      if (type === 'grass') {
        grassTop.push(m4.clone());
      } else if (type === 'sand') {
        sand.push(m4.clone());
      } else if (type === 'stone') {
        stone.push(m4.clone());
      }

      // Dirt and stone layers down to y = 0
      for (let dy = 0; dy < height; dy++) {
        pos.set(x, dy, z);
        m4.compose(pos, quat, sc);

        if (dy >= height - 2) {
          dirt.push(m4.clone());
        } else {
          stone.push(m4.clone());
        }
      }

      // Exposed sand edge ring
      if (cell.isEdge || height <= 1) {
        pos.set(x, 0, z);
        m4.compose(pos, quat, sc);
        sand.push(m4.clone());
      }

      // Island Underbelly — tapered floating landmass cliff tapering down into void
      const distRatio = Math.sqrt(x * x + z * z) / 38.0;
      if (distRatio < 0.95) {
        const noiseVar = Math.sin(x * 0.45) * Math.cos(z * 0.45) * 1.5;
        const underbellyDepth = Math.max(
          1,
          Math.floor((1.0 - Math.pow(distRatio, 1.3)) * 6.5 + noiseVar)
        );

        for (let dy = -1; dy >= -underbellyDepth; dy--) {
          pos.set(x, dy, z);
          m4.compose(pos, quat, sc);
          if (dy < -3) {
            stoneDark.push(m4.clone());
          } else {
            stone.push(m4.clone());
          }
        }

        // Hanging stalactites under the central core
        if (distRatio < 0.55 && Math.abs(x * 3 + z * 5) % 4 === 0) {
          const extraH = 2 + Math.floor(Math.abs(Math.sin(x + z)) * 2);
          for (let si = 1; si <= extraH; si++) {
            const dy = -underbellyDepth - si;
            pos.set(x, dy, z);
            m4.compose(pos, quat, sc);
            stoneDark.push(m4.clone());
          }
        }
      }
    }

    return { grassTop, dirt, stone, stoneDark, sand };
  }, [cells]);

  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const renderInstanced = (
    matrices: THREE.Matrix4[],
    color: string,
    roughness = 0.9,
    metalness = 0.05
  ) => {
    if (matrices.length === 0) return null;
    return (
      <instancedMesh
        args={[boxGeo, undefined, matrices.length]}
        castShadow
        receiveShadow
        ref={(mesh) => {
          if (!mesh) return;
          matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
          mesh.instanceMatrix.needsUpdate = true;
        }}
      >
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </instancedMesh>
    );
  };

  return (
    <group>
      {renderInstanced(groups.grassTop, COLORS.GRASS_TOP, 0.85)}
      {renderInstanced(groups.dirt, COLORS.DIRT, 0.95)}
      {renderInstanced(groups.stone, COLORS.STONE, 0.8)}
      {renderInstanced(groups.stoneDark, COLORS.STONE_DARK, 0.75)}
      {renderInstanced(groups.sand, COLORS.SAND, 0.9)}

      {/* Mountain formations for vertical depth */}
      <MountainFormations />
    </group>
  );
}

// Hand-crafted mountain formations for visual richness
function MountainFormations() {
  const peaks = useMemo(
    () => [
      // North-east mountain cluster
      {
        cx: 20,
        cz: -20,
        layers: [
          { y: 0, r: 8 },
          { y: 1, r: 7 },
          { y: 2, r: 6 },
          { y: 3, r: 5 },
          { y: 4, r: 4 },
          { y: 5, r: 3 },
          { y: 6, r: 2 },
          { y: 7, r: 1 },
        ],
      },
      // South-west cliffs
      {
        cx: -20,
        cz: 15,
        layers: [
          { y: 0, r: 6 },
          { y: 1, r: 5 },
          { y: 2, r: 4 },
          { y: 3, r: 3 },
          { y: 4, r: 2 },
          { y: 5, r: 1 },
        ],
      },
      // Far north peak
      {
        cx: 5,
        cz: -30,
        layers: [
          { y: 0, r: 5 },
          { y: 1, r: 4 },
          { y: 2, r: 3 },
          { y: 3, r: 2 },
          { y: 4, r: 1 },
        ],
      },
    ],
    []
  );

  const { grassMatrices, stoneMatrices } = useMemo(() => {
    const grass: THREE.Matrix4[] = [];
    const stone: THREE.Matrix4[] = [];
    const m4 = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const sc = new THREE.Vector3(1, 1, 1);

    for (const peak of peaks) {
      for (const layer of peak.layers) {
        for (let bx = -layer.r; bx <= layer.r; bx++) {
          for (let bz = -layer.r; bz <= layer.r; bz++) {
            const dist = Math.sqrt(bx * bx + bz * bz);
            if (dist > layer.r) continue;
            pos.set(peak.cx + bx, layer.y + 8, peak.cz + bz);
            m4.compose(pos, quat, sc);
            if (layer.y >= peak.layers.length - 2) {
              grass.push(m4.clone());
            } else {
              stone.push(m4.clone());
            }
          }
        }
      }
    }
    return { grassMatrices: grass, stoneMatrices: stone };
  }, [peaks]);

  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  return (
    <>
      {grassMatrices.length > 0 && (
        <instancedMesh
          args={[boxGeo, undefined, grassMatrices.length]}
          castShadow
          receiveShadow
          ref={(mesh) => {
            if (!mesh) return;
            grassMatrices.forEach((m, i) => mesh.setMatrixAt(i, m));
            mesh.instanceMatrix.needsUpdate = true;
          }}
        >
          <meshStandardMaterial color={COLORS.GRASS_TOP} roughness={0.85} />
        </instancedMesh>
      )}
      {stoneMatrices.length > 0 && (
        <instancedMesh
          args={[boxGeo, undefined, stoneMatrices.length]}
          castShadow
          receiveShadow
          ref={(mesh) => {
            if (!mesh) return;
            stoneMatrices.forEach((m, i) => mesh.setMatrixAt(i, m));
            mesh.instanceMatrix.needsUpdate = true;
          }}
        >
          <meshStandardMaterial color={COLORS.STONE} roughness={0.8} />
        </instancedMesh>
      )}
    </>
  );
}
