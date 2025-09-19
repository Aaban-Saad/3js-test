"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Mars } from "@/components/mars.jsx"

import RoverController from "@/components/roverController";
import { useEffect, useRef, useState } from "react";
import { invalidate } from "@react-three/fiber";
import { DirectionalLight } from "three";


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
      const roverPos = targetRef.current.translation(); // rapier gives {x,y,z}
      // Keep sun offset but always follow rover
      lightRef.current.position.set(
        roverPos.x - 19,
        roverPos.y + 20,
        roverPos.z - 7
      );
      lightRef.current.target.position.set(roverPos.x, roverPos.y, roverPos.z);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
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
    <div className="w-screen h-screen bg-orange-200">
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

        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} dpr={[0.5, 1]}>
          <ambientLight intensity={0.7} color={'#e1c79d'} />

          <SunLight targetRef={roverRef} />

          <Physics gravity={[0, -37.28, 0]}>
            <Ground />
            <RoverController ref={roverRef}/>
            <RoverPositionUpdater
              roverRef={roverRef}
              onPositionUpdate={setRoverPosition}
            />
            {/* <OrbitControls /> */}
          </Physics>
        </Canvas>

         {/* Overlay UI to display the position */}
        <div className="absolute top-4 left-4 p-4 rounded-lg text-white bg-black bg-opacity-50 font-mono text-sm">
          <p>X: {roverPosition.x.toFixed(2)}</p>
          <p>Y: {roverPosition.y.toFixed(2)}</p>
          <p>Z: {roverPosition.z.toFixed(2)}</p>
        </div>
      </KeyboardControls>
    </div>
  );
}



