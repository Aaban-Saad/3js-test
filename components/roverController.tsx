import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RapierRigidBody, CuboidCollider, CapsuleCollider, CylinderCollider, BallCollider } from "@react-three/rapier";
import { useRef } from "react";
import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import { Rover } from "./rover.jsx";
import { Quaternion, Vector3 } from "three";


function RoverController() {
    const ref = useRef<RapierRigidBody | null>(null);
    const [, getKeys] = useKeyboardControls();
    const { camera } = useThree();

    const orbitRef = useRef<any>(null);

    const fl = useRef<any>(null); // front-left wheel
    const fr = useRef<any>(null); // front-right
    const ml = useRef<any>(null); // middle-left
    const mr = useRef<any>(null); // middle-right
    const rl = useRef<any>(null); // rear-left
    const rr = useRef<any>(null); // rear-right
    const arm1 = useRef<any>(null);
    const arm2 = useRef<any>(null);
    const arm3 = useRef<any>(null);
    const arm4 = useRef<any>(null);
    const arm5 = useRef<any>(null);

    const wheelWorldPosition = new Vector3();
    const pointVelocity = new Vector3();
    const forward = new Vector3();
    const chassis_t = new Vector3();
    const chassis_r = new Quaternion();

    useFrame((_, delta: number) => {
        if (!ref.current) return;
        const body = ref.current;

        const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, w, a, s, d, q, e, i, k, j, l } = getKeys();
        const factor = 1
        const moveSpeed = 0.5 * factor;
        const rotSpeed = 0.3 * factor;
        const wheelRadius = 0.2625;

        // --- Movement and Steering (largely unchanged) ---
        const t = body.translation();
        const r = body.rotation();
        chassis_t.set(t.x, t.y, t.z);
        chassis_r.set(r.x, r.y, r.z, r.w);

        // Calculate forward vector from the chassis's quaternion
        forward.set(0, 0, 1).applyQuaternion(chassis_r);

        const impulse = { x: 0, y: 0, z: 0 };
        if (ArrowUp) {
            impulse.x += forward.x * moveSpeed;
            impulse.z += forward.z * moveSpeed;
        }
        if (ArrowDown) {
            impulse.x -= forward.x * moveSpeed;
            impulse.z -= forward.z * moveSpeed;
        }
        if (impulse.x !== 0 || impulse.z !== 0) {
            body.applyImpulse(impulse, true);
        }

        const steeringDirection = ArrowDown ? -1 : 1;

        // Apply steering torque
        if (ArrowLeft) {
            body.applyTorqueImpulse({ x: 0, y: rotSpeed * steeringDirection, z: 0 }, true);
        }
        if (ArrowRight) {
            body.applyTorqueImpulse({ x: 0, y: -rotSpeed * steeringDirection, z: 0 }, true);
        }

        if (w) {
            if (arm2.current && arm2.current.rotation.z < 1.3){
                arm2.current.rotation.z += 0.02;
            }
        }
        if (s) {
            if (arm2.current && arm2.current.rotation.z > -1.3) {
                arm2.current.rotation.z -= 0.02;
            }
        }
        if (i) {
            if (arm3.current && arm3.current.rotation.z < -.3) {
                arm3.current.rotation.z += 0.02;
            }
        }
        if (k) {
            if (arm3.current && arm3.current.rotation.z > -5.7) {
                arm3.current.rotation.z -= 0.02;
            }
        }
        if (a) {
            if (arm1.current && arm1.current.rotation.y < 0) {
                arm1.current.rotation.y += 0.02;
            }
        }
        if (d) {
            if (arm1.current && arm1.current.rotation.y > -3.14) {
                arm1.current.rotation.y -= 0.02;
            }
        }
        if (j) {
            if (arm4.current  && arm4.current.rotation.z < 3.14) {
                arm4.current.rotation.z += 0.02;
            }
        }

        console.log(arm4.current.rotation.z)
        if (l) {
            if (arm4.current  && arm4.current.rotation.z > -1.0) {
                arm4.current.rotation.z -= 0.02;
            }
        }
        if (q) {
            if (arm5.current) {
                arm5.current.rotation.y += 0.02;
            }
        }
        if (e) {
            if (arm5.current) {
                arm5.current.rotation.y -= 0.02;
            }
        }


    // --- keep rover at center of orbit ---
        if (orbitRef.current) {
            orbitRef.current.target.set(t.x, t.y + 1, t.z);
        }


        // --- 🚗 Individual Wheel Rotation ---
        [fl, fr, ml, mr, rl, rr].forEach((wheelRef) => {
            if (!wheelRef.current) return;

            // 1. Get the world position of the wheel's center
            wheelRef.current.getWorldPosition(wheelWorldPosition);

            // 2. Get the velocity of the rigid body at that specific point
            // velocityAtPoint = linearVelocity + angularVelocity x (point - centerOfMass)
            const lv = body.linvel();
            const av = body.angvel();
            const center = body.translation();
            const relPoint = new Vector3(
                wheelWorldPosition.x - center.x,
                wheelWorldPosition.y - center.y,
                wheelWorldPosition.z - center.z
            );
            const angularVel = new Vector3(av.x, av.y, av.z);
            const linearVel = new Vector3(lv.x, lv.y, lv.z);
            const angVelCrossRel = new Vector3().copy(angularVel).cross(relPoint);
            pointVelocity.copy(linearVel).add(angVelCrossRel);

            // 3. Project the wheel's velocity vector onto the chassis's forward vector
            //    to get the signed speed in the direction of travel.
            const signedSpeed = pointVelocity.dot(forward);

            // 4. Calculate angular rotation from this specific wheel's linear speed
            const wheelRotation = (signedSpeed * delta) / wheelRadius;

            // 5. Apply the rotation to the wheel mesh
            wheelRef.current.rotation.x += wheelRotation;
        });




        // 📷 Camera follow
        // const roverQuat = new Quaternion(r.x, r.y, r.z, r.w);
        // const localOffset = new Vector3(0, 3.5, -7);
        // const rotatedOffset = localOffset.clone().applyQuaternion(roverQuat);
        // const targetPos = new Vector3(t.x, t.y, t.z).add(rotatedOffset);

        // camera.position.lerp(targetPos, 0.02);
        // camera.lookAt(t.x, t.y + 0.5, t.z);
    });

    return (

        <RigidBody
            ref={ref}
            colliders={false}
            friction={0}
            linearDamping={10}
            angularDamping={10}
            position={[0, 1, 1]}
        >
            <Rover fl={fl} fr={fr} ml={ml} mr={mr} rl={rl} rr={rr} arm1={arm1} arm2={arm2} arm3={arm3} arm4={arm4} arm5={arm5} />
            {/* Main body collider */}
            <CuboidCollider args={[.7, 0.4, 1.1]} position={[0, 1.1, -0.3]} density={0.5} />
            <CuboidCollider args={[.1, 0.1, .8]} position={[.3, .8, 1.5]} density={0.001} />

            {/* Wheels (example positions – adjust to your model) */}
            <BallCollider args={[0.3]} position={[-1.05, 0.3, 1.1]} density={3} />
            <BallCollider args={[0.3]} position={[1.05, 0.3, 1.1]} density={3} />
            <BallCollider args={[0.3]} position={[-1.15, 0.3, -0.1]} density={3} />
            <BallCollider args={[0.3]} position={[1.15, 0.3, -0.1]} density={3} />
            <BallCollider args={[0.3]} position={[-1.05, 0.3, -1.2]} density={3} />
            <BallCollider args={[0.3]} position={[1.05, 0.3, -1.2]} density={3} />

            <OrbitControls
                ref={orbitRef}
                enablePan={false}
                minDistance={3}
                maxDistance={5}
            />
        </RigidBody>
    );
}

export default RoverController;


