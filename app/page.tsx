"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, Text3D } from "@react-three/drei";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Mars } from "@/components/mars.jsx"

import RoverController from "@/components/roverController";
import { useRef, useState } from "react";
import { DirectionalLight, Vector3 } from "three";
import { Crosshair, MapPin, MoveDown, MoveLeft, MoveRight, MoveUp, Pointer, PointerIcon } from "lucide-react";
import { ChatBar } from "@/components/sidebar";
import Info from "@/components/info";
import Image from "next/image";
import { Button } from "@/components/ui/button";


function Ground() {

  return (
    <RigidBody type="fixed" colliders={"trimesh"} position={[0, -275, 0]} rotation={[0, Math.PI, 0]}>
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
        roverPos.x - 10,
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
        intensity={2}
        castShadow
        shadow-mapSize-width={448}
        shadow-mapSize-height={448}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={20}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.005}
      />
    </>
  );
}

// New component to handle position updates inside the Canvas

// Update the RoverPositionUpdater to also track rotation
function RoverPositionUpdater({ roverRef, onPositionUpdate, onRotationUpdate }: {
  roverRef: any,
  onPositionUpdate: any,
  onRotationUpdate: any
}) {
  const lastUpdateTime = useRef(0);
  const updateInterval = 300; // Update every 100ms instead of every frame

  useFrame(() => {
    const now = Date.now();
    if (roverRef.current && now - lastUpdateTime.current > updateInterval) {
      const { x, y, z } = roverRef.current.translation();
      const rotation = roverRef.current.rotation();
      onPositionUpdate({ x, y, z });
      onRotationUpdate(rotation);
      lastUpdateTime.current = now;
    }
  });
  return null;
}


function DirectionIndicator({ currentPosition, targetPosition, roverRotation }: {
  currentPosition: { x: number, y: number, z: number },
  targetPosition: { x: number, y: number, z: number },
  roverRotation: any
}) {
  // Calculate distance
  const distance = Math.sqrt(
    Math.pow(targetPosition.x - currentPosition.x, 2) +
    Math.pow(targetPosition.z - currentPosition.z, 2)
  );

  // Calculate angle to target relative to world coordinates (corrected for Three.js coordinate system)
  const targetAngle = Math.atan2(
    targetPosition.x - currentPosition.x,  // Swapped x and z
    targetPosition.z - currentPosition.z   // This gives us the correct world angle
  );

  // Get rover's current facing direction (Y rotation from quaternion)
  let roverAngle = 0;
  if (roverRotation) {
    // Convert quaternion to Euler angle (Y rotation) - corrected formula
    const { x, y, z, w } = roverRotation;
    roverAngle = Math.atan2(2 * (w * y + x * z), 1 - 2 * (y * y + z * z));
  }

  // Calculate relative angle (target direction relative to rover's facing direction)
  let relativeAngle = (targetAngle - roverAngle) * (180 / Math.PI);

  // Normalize to -180 to 180 degrees
  while (relativeAngle > 180) relativeAngle -= 360;
  while (relativeAngle < -180) relativeAngle += 360;

  // Invert the angle to match the UI coordinate system
  relativeAngle = -relativeAngle;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        {/* Direction Arrow - rotates relative to rover's facing direction */}
        <div
          className="w-6 h-6 flex items-center justify-center"
          style={{ transform: `rotate(${relativeAngle}deg)` }}
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[20px] border-l-transparent border-r-transparent border-b-green-400"></div>
        </div>

        {/* Distance Info */}
        <div className="flex flex-col text-xs">
          <span className="text-green-400 font-semibold">Target Location</span>
          <span className="font-mono">{distance.toFixed(1)}m remaining</span>
        </div>

        {/* Relative Direction */}
        {/* <div className="text-xs opacity-75">
          {Math.abs(relativeAngle) < 15 ? 'Forward' : 
           relativeAngle > 0 ? `Left ${Math.abs(relativeAngle).toFixed(0)}°` : 
           `Right ${Math.abs(relativeAngle).toFixed(0)}°`}
        </div> */}
      </div>
    </div>
  );
}


export default function Home() {

  const roverRef = useRef<RapierRigidBody | null>(null);
  const [roverPosition, setRoverPosition] = useState({ x: 0, y: 0, z: 0 });
  const [roverRotation, setRoverRotation] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Add target position
  const targetPosition = { x: -540, y: 0, z: 700 };
  // const targetPosition = { x: 0, y: 0, z: 0 };

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

        <Canvas
          shadows
          camera={{ position: [5, 5, 5], fov: 50 }}
          dpr={[0.5, 1]}
          performance={{ min: 0.5 }} // Add performance settings
          gl={{
            antialias: true, // Disable for better performance
            powerPreference: "high-performance"
          }}
        >
          <fog attach="fog" args={['#fef3c6', 10, 200]} />
          <ambientLight intensity={0.7} color={'#e1c79d'} />

          <SunLight targetRef={roverRef} />

          <Text3D
            font="https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json" // **You need to provide the font file.**
            size={.5}
            height={0.1}
            curveSegments={12}
            position={[-3.3, 4.5, 2.7]} // Position it slightly above the ground
            rotation={[0, Math.PI / 2, 0]}
          // castShadow
          >
            LANDING SPOT
            <meshStandardMaterial color="white" transparent={true} opacity={.5} />
          </Text3D>

          <Physics gravity={[0, -9.8, 0]}>
            {/* -3.728 */}
            <Ground />
            <RoverController ref={roverRef} />
            <RoverPositionUpdater
              roverRef={roverRef}
              onPositionUpdate={setRoverPosition}
              onRotationUpdate={setRoverRotation}
            />
            {/* <OrbitControls /> */}
          </Physics>
        </Canvas>

        {/* Add Direction Indicator */}
        {/* Updated Direction Indicator with rover rotation */}
        <DirectionIndicator
          currentPosition={roverPosition}
          targetPosition={targetPosition}
          roverRotation={roverRotation}
        />

        <div className="absolute bottom-4 flex flex-row items-center justify-center gap-2 w-full">
          {/* map button */}
          <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
            onClick={() => setIsMapOpen(!isMapOpen)}
          >
            <MapPin className="animate-bounce" />
          </Button>
          <ChatBar />
        </div>
        {/* Overlay UI to display the position */}
        <div className="absolute top-0 left-0">
          <Info />
        </div>

        {/* current location */}
        {/* <div className="absolute top-2 right-2 h-fit w-fit text-xs p-2 rounded-lg text-white bg-black/50 bg-opacity-50 font-mono flex items-center gap-3">
          <p>X:{roverPosition.x.toFixed(2)}</p>
          <p>Y:{roverPosition.y.toFixed(2)}</p>
          <p>Z:{roverPosition.z.toFixed(2)}</p>
        </div> */}


        {/* map */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-3xl bg-opacity-70 z-10 transition-opacity duration-300 ${isMapOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMapOpen(false)}></div>
        <div hidden={!isMapOpen} className="absolute scale-[.75] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-50">
          <div className="h-[699px] w-[1322px] relative">
            {/* rover icon */}
            <span className={`fixed font-bold text-xl`}

              style={{
                // Perform arithmetic directly on the 'top' and 'left' style properties.
                top: `${505 - roverPosition.z / 10}px`,
                left: `${1210 - roverPosition.x / 10}px`,
              }}
            >

              <Image src={'/rover-pointer.png'} height={50} width={50} alt="rover" />
            </span>


            {/* sample 1 */}
            <span className={`fixed text-blue-200 text-xl`}

              style={{
                // Perform arithmetic directly on the 'top' and 'left' style properties.
                top: `${505 + 95.2}px`,
                left: `${1210 - 3.4}px`,
              }}
            >

              <MapPin />
              Sample 1
            </span>

            {/* target icon */}
            <span className={`fixed text-red-500 text-3xl font-bold`}

              style={{
                // Perform arithmetic directly on the 'top' and 'left' style properties.
                top: `${505 - targetPosition.z / 10}px`,
                left: `${1210 - targetPosition.x / 10}px`,
              }}
            >
              <Crosshair />
            </span>

            <Image src={'/map.webp'} height={699} width={1322} alt="map" /> 
          </div>
        </div>

        {/* keyboard controls */}
        {/* <div className="absolute bottom-2 left-2 flex flex-col items-center justify-center gap-2 opacity-30 scale-75">
          <div className="bg-black w-10 h-10 flex items-center justify-center text-white"><MoveUp /></div>
          <div className="flex items-center gap-2">
            <div className="bg-black w-10 h-10 flex items-center justify-center text-white"><MoveLeft /></div>
            <div className="bg-black w-10 h-10 flex items-center justify-center text-white"><MoveDown /></div>
            <div className="bg-black w-10 h-10 flex items-center justify-center text-white"><MoveRight /></div>
          </div>
        </div> */}

      </KeyboardControls>
    </div>
  );
}



