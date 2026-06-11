import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const GLASS_RADIUS = 0.5;
const GLASS_HEIGHT = 1.6;
const LIQUID_RADIUS = 0.44;
const LIQUID_MAX_HEIGHT = 1.45;

/**
 * Bitta laboratoriya kolbasi (stakan): shisha devor + ichidagi suyuqlik.
 *
 * Suyuqlik darajasi va rangi `liveRef` (mutable store) dan har kadrda o'qiladi —
 * bu quyish animatsiyasini React re-render'larsiz silliq (60fps) qiladi.
 */
export default function Flask({ id, label, liveRef, groupRef, selected, disabled, onClick }) {
  const liquidRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    const live = liveRef.current[id];
    if (!live || !liquidRef.current) return;

    const h = Math.max(live.level, 0.001) * LIQUID_MAX_HEIGHT;
    liquidRef.current.scale.y = h;
    liquidRef.current.position.y = h / 2 + 0.06;
    liquidRef.current.visible = live.level > 0.01;
    liquidRef.current.material.color.set(live.color);
  });

  return (
    <group
      ref={groupRef}
      position={liveRef.current[id].home}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      onPointerOver={() => {
        if (!disabled) {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Suyuqlik — balandligi har kadrda liveRef'dan yangilanadi */}
      <mesh ref={liquidRef}>
        <cylinderGeometry args={[LIQUID_RADIUS, LIQUID_RADIUS, 1, 32]} />
        <meshStandardMaterial transparent opacity={0.88} roughness={0.25} />
      </mesh>

      {/* Shisha devor (ochiq ustki qism) */}
      <mesh position={[0, GLASS_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[GLASS_RADIUS, GLASS_RADIUS, GLASS_HEIGHT, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          transparent
          opacity={hovered || selected ? 0.4 : 0.22}
          roughness={0.05}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shisha tubi */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[GLASS_RADIUS, GLASS_RADIUS, 0.05, 32]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.35} roughness={0.05} />
      </mesh>

      {/* Ustki gardish */}
      <mesh position={[0, GLASS_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GLASS_RADIUS, 0.025, 12, 32]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.6} />
      </mesh>

      {/* Tanlanganlik halqasi */}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.74, 40]} />
          <meshBasicMaterial color="#5b6cff" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Kolba yorlig'i (DOM overlay) */}
      <Html position={[0, GLASS_HEIGHT + 0.45, 0]} center distanceFactor={8}>
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap select-none shadow ${
            selected ? 'bg-brand-500 text-white' : 'bg-white/90 text-slate-700'
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}
