'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '@/lib/world/world-config';
import { createSeededRandom } from '@/lib/world/seeded-random';

interface TreesProps {
  positions: Array<{ x: number; z: number; height: number }>;
}

export default function Trees({ positions }: TreesProps) {
  const { logMatrices, leafMatrices } = useMemo(() => {
    const logs: THREE.Matrix4[] = [];
    const leaves: THREE.Matrix4[] = [];

    const m4 = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const sc = new THREE.Vector3(1, 1, 1);

    const rand = createSeededRandom(77);

    positions.slice(0, 140).forEach((p) => {
      const treeH = 4 + Math.floor(rand() * 3);
      const baseX = p.x;
      const baseY = p.height;
      const baseZ = p.z;

      // Trunk logs
      for (let ty = 0; ty < treeH; ty++) {
        pos.set(baseX, baseY + ty + 0.5, baseZ);
        m4.compose(pos, quat, sc);
        logs.push(m4.clone());
      }

      // Leaf layers
      const leafLayers = [
        { y: treeH - 1, size: 5, skipCorner: true },
        { y: treeH, size: 5, skipCorner: true },
        { y: treeH + 1, size: 3, skipCorner: false },
        { y: treeH + 2, size: 1, skipCorner: false },
      ];

      leafLayers.forEach((layer) => {
        const half = Math.floor(layer.size / 2);
        for (let lx = -half; lx <= half; lx++) {
          for (let lz = -half; lz <= half; lz++) {
            if (layer.skipCorner && Math.abs(lx) === half && Math.abs(lz) === half) {
              continue;
            }
            pos.set(baseX + lx, baseY + layer.y + 0.5, baseZ + lz);
            m4.compose(pos, quat, sc);
            leaves.push(m4.clone());
          }
        }
      });
    });

    return { logMatrices: logs, leafMatrices: leaves };
  }, [positions]);

  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  return (
    <group>
      {/* Instanced Log Trunks */}
      {logMatrices.length > 0 && (
        <instancedMesh
          args={[boxGeo, undefined, logMatrices.length]}
          castShadow
          receiveShadow
          ref={(mesh) => {
            if (!mesh) return;
            logMatrices.forEach((m, i) => mesh.setMatrixAt(i, m));
            mesh.instanceMatrix.needsUpdate = true;
          }}
        >
          <meshStandardMaterial
            color={COLORS.LOG_OAK}
            roughness={0.9}
            metalness={0.05}
          />
        </instancedMesh>
      )}

      {/* Instanced Oak Leaves */}
      {leafMatrices.length > 0 && (
        <instancedMesh
          args={[boxGeo, undefined, leafMatrices.length]}
          castShadow
          receiveShadow
          ref={(mesh) => {
            if (!mesh) return;
            leafMatrices.forEach((m, i) => mesh.setMatrixAt(i, m));
            mesh.instanceMatrix.needsUpdate = true;
          }}
        >
          <meshStandardMaterial
            color={COLORS.LEAVES_OAK}
            roughness={0.85}
            metalness={0.0}
          />
        </instancedMesh>
      )}
    </group>
  );
}
