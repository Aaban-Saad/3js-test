"use client";

import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls, useGLTF } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Mars } from "@/components/mars.jsx"

import Ball from "@/components/ball";
import RoverController from "@/components/roverController";
import { MeshCollider } from "@react-three/rapier";
import { Mesh } from "three";



function Obstacles() {
  return (
    <>
      <RigidBody type="fixed">
        <mesh position={[2, 0.5, -2]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh position={[-2, 0.5, 2]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh position={[0, 0.5, 4]} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>
    </>
  );
}

function Ground() {
  const { nodes, materials } = useGLTF("/mars_one_mission_-_base.glb");

  return (
    <RigidBody type="fixed" colliders={"trimesh"}>
      <Mars />

      {/* <mesh position={[-2, 0.5, 2]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh> */}

      {/* <MeshCollider type="trimesh">
        <group rotation={[-Math.PI / 2, 0, 0]} scale={0.02}>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_11 as Mesh).geometry}
            material={materials.material_9}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_10 as Mesh).geometry}
            material={materials.material_8}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_8 as Mesh).geometry}
            material={materials.material_6}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_9 as Mesh).geometry}
            material={materials.material_7}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_12 as Mesh).geometry}
            material={materials.material_10}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_7 as Mesh).geometry}
            material={materials.material_5}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_3 as Mesh).geometry}
            material={materials.material_1}
          />
        </group>
      </MeshCollider> */}


    </RigidBody>
  );
}



export default function Home() {
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

        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.7} color={'#e1c79d'}/>
          <directionalLight
            position={[-14.5, 10, -3.5]}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={1}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <Physics gravity={[0, -3.728, 0]}>
            <Ground />
            {/* <Ball /> */}
            {/* <Obstacles /> */}
            <RoverController />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}



