"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, Text3D } from "@react-three/drei";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Mars } from "@/components/mars.jsx"

import RoverController from "@/components/roverController";
import { useRef, useState } from "react";
import { DirectionalLight, Vector3 } from "three";
import { MoveDown, MoveLeft, MoveRight, MoveUp } from "lucide-react";


function Ground() {

  return (
    <RigidBody type="fixed" colliders={"trimesh"} position={[0, -275, 0]}>
      <Mars />
    </RigidBody>
  );
}



function SunLight({ targetRef }: { targetRef: any }) {
  const lightRef = useRef<DirectionalLight>(null);

  useFrame(() => {
    if (lightRef.current && targetRef.current) {
      const roverPos = targetRef.current.translation();
      const lightPos = new Vector3(
        roverPos.x - 29,
        roverPos.y + 15,
        roverPos.z - 7
      );

      lightRef.current.position.copy(lightPos);
      lightRef.current.target.position.copy(roverPos);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        intensity={3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.005}
      />
    </>
  );
}

// New component to handle position updates inside the Canvas
function RoverPositionUpdater({ roverRef, onPositionUpdate }: { roverRef: any, onPositionUpdate: any }) {
  useFrame(() => {
    if (roverRef.current) {
      const { x, y, z } = roverRef.current.translation();
      onPositionUpdate({ x, y, z });
    }
  });
  return null;
}



export default function Home() {

  const roverRef = useRef<RapierRigidBody | null>(null);
  const [roverPosition, setRoverPosition] = useState({ x: 0, y: 0, z: 0 });

  return (
    <div className="w-screen h-screen bg-amber-100">
      <KeyboardControls
        map={[
          { name: "ArrowUp", keys: ["ArrowUp"] },
          { name: "ArrowDown", keys: ["ArrowDown"] },
          { name: "ArrowLeft", keys: ["ArrowLeft"] },
          { name: "ArrowRight", keys: ["ArrowRight"] },
          { name: "w", keys: ["w"] },
          { name: "s", keys: ["s"] },
          { name: "a", keys: ["a"] },
          { name: "d", keys: ["d"] },
          { name: "q", keys: ["q"] },
          { name: "e", keys: ["e"] },
          { name: "i", keys: ["i"] },
          { name: "k", keys: ["k"] },
          { name: "j", keys: ["j"] },
          { name: "l", keys: ["l"] },
        ]}
      >

        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} dpr={[0.5, 1]} >
          <fog attach="fog" args={['#fef3c6', 10, 200]} />
          <ambientLight intensity={0.7} color={'#e1c79d'} />

          <SunLight targetRef={roverRef} />

          <Text3D
            font="https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json" // **You need to provide the font file.**
            size={.5}
            height={0.1}
            curveSegments={12}
            position={[-3, 4.5, 3]} // Position it slightly above the ground
            rotation={[0, Math.PI / 2, 0]}
          // castShadow
          >
            LANDING SPOT
            <meshStandardMaterial color="white" transparent={true} opacity={.5} />
          </Text3D>

          <Physics gravity={[0, -3.728, 0]}>
            <Ground />
            <RoverController ref={roverRef} />
            <RoverPositionUpdater
              roverRef={roverRef}
              onPositionUpdate={setRoverPosition}
            />
            {/* <OrbitControls /> */}
          </Physics>
        </Canvas>

        {/* Overlay UI to display the position */}
        <div className="absolute text-xs top-2 left-2 p-2 rounded-lg text-white bg-black/50 bg-opacity-50 font-mono flex items-center gap-3">
          <p>X:{roverPosition.x.toFixed(2)}</p>
          <p>Y:{roverPosition.y.toFixed(2)}</p>
          <p>Z:{roverPosition.z.toFixed(2)}</p>
        </div>

        {/* keyboard controls */}
        <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center gap-2 opacity-30">
          <div className="bg-black w-10 h-10 flex items-center justify-center"><MoveUp /></div>
          <div className="flex items-center gap-2">
            <div className="bg-black w-10 h-10 flex items-center justify-center"><MoveLeft /></div>
            <div className="bg-black w-10 h-10 flex items-center justify-center"><MoveDown /></div>
            <div className="bg-black w-10 h-10 flex items-center justify-center"><MoveRight /></div>
          </div>
        </div>
      </KeyboardControls>
    </div>
  );
}



