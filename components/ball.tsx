import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";

function Ball() {
  const ref = useRef<RapierRigidBody | null>(null);
  const [, getKeys] = useKeyboardControls();
  const { camera } = useThree();

  useFrame(() => {
    if (!ref.current) return;

    const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space } = getKeys();
    const impulse = { x: 0, y: 0, z: 0 };
    const speed = 0.2;

    if (ArrowUp) impulse.z -= speed;
    if (ArrowDown) impulse.z += speed;
    if (ArrowLeft) impulse.x -= speed;
    if (ArrowRight) impulse.x += speed;

    if (impulse.x !== 0 || impulse.z !== 0) {
      ref.current.applyImpulse(impulse, true);
    }

    // 🟢 Jump
    const t = ref.current.translation();
    if (Space && Math.abs(t.y - 0.5) < 0.05) {
      ref.current.applyImpulse({ x: 0, y: 2, z: 0 }, true);
    }

    // 📷 Third-person chase camera
    const offset = { x: 0, y: 2, z: 5 };
    camera.position.set(t.x + offset.x, t.y + offset.y, t.z + offset.z);
    camera.lookAt(t.x, t.y + 0.5, t.z);
  });

  return (
    <RigidBody ref={ref} colliders="ball" restitution={0.5} friction={0.5}>
      <mesh castShadow>
        <sphereGeometry args={[0.5, 10, 10]}/>
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
}

export default Ball;
