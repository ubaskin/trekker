import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Flask from './Flask.jsx';
import { mixLiquids, MAX_FILL } from './chemistry.js';

const POUR_DURATION = 4.2; // soniya
const ease = (t) => t * t * (3 - 2 * t); // smoothstep

/**
 * Quyish animatsiyasi "rejissyori".
 * Har kadrda: kolbani ko'taradi → engashtiradi → oqim chizadi →
 * suyuqlik darajalari/ranglarini yangilaydi → joyiga qaytaradi.
 */
function PourDirector({ pour, flasks, liveRef, groupRefs, streamRef, onComplete }) {
  const startRef = useRef(null);
  const doneRef = useRef(false);

  // Quyish boshlanishida bir marta hisoblanadigan qiymatlar
  const plan = useMemo(() => {
    const src = flasks[pour.from];
    const dst = flasks[pour.to];
    const { liquid: mixedLiquid, reaction } = mixLiquids(dst.liquid, src.liquid);

    const dir = Math.sign(dst.position[0] - src.position[0]) || 1;
    return {
      src,
      dst,
      mixedLiquid,
      reaction,
      dir,
      home: new THREE.Vector3(...src.position),
      // Manba kolba boradigan nuqta: nishon ustida, biroz yon tomonda
      pourPos: new THREE.Vector3(dst.position[0] - dir * 0.85, 2.3, dst.position[2]),
      tilt: -dir * 1.95, // engashish burchagi (radian)
      dstColorStart: new THREE.Color(dst.liquid.color),
      dstColorEnd: new THREE.Color(mixedLiquid.color),
      dstFinalLevel: Math.min(dst.level + src.level, MAX_FILL),
    };
  }, [pour, flasks]);

  useFrame(({ clock }) => {
    if (doneRef.current) return;
    if (startRef.current === null) startRef.current = clock.elapsedTime;

    const p = Math.min((clock.elapsedTime - startRef.current) / POUR_DURATION, 1);
    const srcGroup = groupRefs[pour.from].current;
    const live = liveRef.current;
    const { src, dst, pourPos, home, tilt, dir } = plan;

    // 1-bosqich (0–25%): kolbani ko'tarish va engashtirish
    const up = ease(Math.min(p / 0.25, 1));
    // 3-bosqich (75–100%): joyiga qaytarish
    const down = p > 0.75 ? ease((p - 0.75) / 0.25) : 0;
    const travel = up - down * up;

    srcGroup.position.lerpVectors(home, pourPos, travel);
    srcGroup.rotation.z = tilt * travel;

    // 2-bosqich (30–70%): suyuqlik oqimi va aralashish
    const f = THREE.MathUtils.clamp((p - 0.3) / 0.4, 0, 1);
    if (f > 0 && f < 1) {
      live[pour.from].level = src.level * (1 - f);
      live[pour.to].level = dst.level + (plan.dstFinalLevel - dst.level) * f;
      live[pour.to].color =
        '#' + plan.dstColorStart.clone().lerp(plan.dstColorEnd, f).getHexString();

      // Oqim silindri: kolba og'zidan nishon suyuqlik yuzasigacha
      const topY = 2.05;
      const surfaceY = live[pour.to].level * 1.45 + 0.1;
      const stream = streamRef.current;
      stream.visible = true;
      stream.position.set(dst.position[0] - dir * 0.12, (topY + surfaceY) / 2, dst.position[2]);
      stream.scale.y = Math.max(topY - surfaceY, 0.01);
      stream.material.color.set(src.liquid.color);
    } else {
      streamRef.current.visible = false;
      if (f >= 1) {
        live[pour.from].level = 0;
        live[pour.to].level = plan.dstFinalLevel;
        live[pour.to].color = plan.mixedLiquid.color;
      }
    }

    // Yakun: holatni React state'ga qaytarish
    if (p >= 1) {
      doneRef.current = true;
      srcGroup.position.copy(home);
      srcGroup.rotation.z = 0;
      onComplete({
        from: { level: 0, liquid: { ...src.liquid } },
        to: { level: plan.dstFinalLevel, liquid: plan.mixedLiquid },
        reaction: plan.reaction,
      });
    }
  });

  return null;
}

/** Laboratoriya stoli va atrof-muhit. */
function LabTable() {
  return (
    <group>
      {/* Stol usti */}
      <mesh position={[0, -0.11, 0]} receiveShadow>
        <boxGeometry args={[7.5, 0.22, 4]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.6} />
      </mesh>
      {/* Stol oyoqlari */}
      {[
        [-3.4, -1.1, -1.6],
        [3.4, -1.1, -1.6],
        [-3.4, -1.1, 1.6],
        [3.4, -1.1, 1.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.25, 2, 0.25]} />
          <meshStandardMaterial color="#6b4226" roughness={0.7} />
        </mesh>
      ))}
      {/* Pol */}
      <mesh position={[0, -2.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * 2-MODUL: 3D sahna — Canvas, yorug'lik, kamera boshqaruvi va kolbalar.
 */
export default function LabScene({ flasks, selectedId, pour, liveRef, onFlaskClick, onPourComplete }) {
  const groupRefs = { A: useRef(), B: useRef() };
  const streamRef = useRef();

  return (
    <Canvas shadows camera={{ position: [0, 3.4, 6.5], fov: 45 }}>
      <color attach="background" args={['#dbeafe']} />

      {/* Yorug'lik */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />
      <pointLight position={[-4, 4, -3]} intensity={0.4} />
      <Environment preset="city" />

      <LabTable />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={10} blur={2.2} far={3} />

      {Object.entries(flasks).map(([id, flask]) => (
        <Flask
          key={id}
          id={id}
          label={flask.label}
          liveRef={liveRef}
          groupRef={groupRefs[id]}
          selected={selectedId === id}
          disabled={!!pour}
          onClick={onFlaskClick}
        />
      ))}

      {/* Quyish oqimi (PourDirector boshqaradi) */}
      <mesh ref={streamRef} visible={false}>
        <cylinderGeometry args={[0.045, 0.03, 1, 12]} />
        <meshStandardMaterial transparent opacity={0.85} />
      </mesh>

      {pour && (
        <PourDirector
          pour={pour}
          flasks={flasks}
          liveRef={liveRef}
          groupRefs={groupRefs}
          streamRef={streamRef}
          onComplete={onPourComplete}
        />
      )}

      <OrbitControls
        target={[0, 1, 0]}
        minDistance={3.5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.05}
        enablePan={false}
      />
    </Canvas>
  );
}
