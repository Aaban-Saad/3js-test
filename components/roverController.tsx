import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RapierRigidBody, CuboidCollider, CapsuleCollider, CylinderCollider, BallCollider, useRevoluteJoint } from "@react-three/rapier";
import { useRef } from "react";
import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import { Rover } from "./rover.jsx";
import { BoxGeometry, Quaternion, Vector3 } from "three";
import JointData from "@react-three/rapier"

function RoverController({ ref }: { ref: React.RefObject<RapierRigidBody | null> }) {
    // const ref = useRef<RapierRigidBody | null>(null);
    const [, getKeys] = useKeyboardControls();

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
    const sus_fl = useRef<any>(null);
    const sus_fr = useRef<any>(null);
    const sus_rl = useRef<any>(null);
    const sus_rr = useRef<any>(null);

    const wheelWorldPosition = new Vector3();
    const pointVelocity = new Vector3();
    const forward = new Vector3();
    const chassis_t = new Vector3();
    const chassis_r = new Quaternion();

    function lerp(start: any, end: any, alpha: any) {
        return start + (end - start) * alpha;
    }

    useFrame((_, delta: number) => {
        if (!ref.current) return;
        const body = ref.current;

        const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, w, a, s, d, q, e, i, k, j, l } = getKeys();
        const factor = 2  // 2 default
        const moveSpeed = 60 * factor;
        const rotSpeed = 10 * factor;
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
            if (!ArrowLeft && !ArrowRight) {
                // Smoothly move each wheel's rotation back to 0
                sus_fl.current.rotation.y = lerp(sus_fl.current.rotation.y, 0, .1);
                sus_fr.current.rotation.y = lerp(sus_fr.current.rotation.y, 0, .1);
                sus_rl.current.rotation.y = lerp(sus_rl.current.rotation.y, 0, .1);
                sus_rr.current.rotation.y = lerp(sus_rr.current.rotation.y, 0, .1);
            }

            impulse.x += forward.x * moveSpeed;
            impulse.z += forward.z * moveSpeed;
        }
        if (ArrowDown) {
            if (!ArrowLeft && !ArrowRight) {
                // Smoothly move each wheel's rotation back to 0
                sus_fl.current.rotation.y = lerp(sus_fl.current.rotation.y, 0, .1);
                sus_fr.current.rotation.y = lerp(sus_fr.current.rotation.y, 0, .1);
                sus_rl.current.rotation.y = lerp(sus_rl.current.rotation.y, 0, .1);
                sus_rr.current.rotation.y = lerp(sus_rr.current.rotation.y, 0, .1);
            }
            impulse.x -= forward.x * moveSpeed;
            impulse.z -= forward.z * moveSpeed;

        }
        if (impulse.x !== 0 || impulse.z !== 0) {
            body.applyImpulse(impulse, true);
        }

        const steeringDirection = ArrowDown ? -1 : 1;

        // Apply steering torque
        if (ArrowLeft) {
            if (!ArrowUp && !ArrowDown) {
                if (sus_fl.current.rotation.y > -Math.PI / 4 || sus_fr.current.rotation.y < Math.PI / 4 || sus_rl.current.rotation.y < Math.PI / 4 || sus_rr.current.rotation.y > -Math.PI / 4) {
                    if (sus_fl.current.rotation.y > -Math.PI / 4) sus_fl.current.rotation.y -= 0.01;
                    if (sus_fr.current.rotation.y < Math.PI / 4) sus_fr.current.rotation.y += 0.01;
                    if (sus_rl.current.rotation.y < Math.PI / 4) sus_rl.current.rotation.y += 0.01;
                    if (sus_rr.current.rotation.y > -Math.PI / 4) sus_rr.current.rotation.y -= 0.01;
                } else {
                    body.applyTorqueImpulse({ x: 0, y: rotSpeed * steeringDirection * 1.5, z: 0 }, true);
                }
            } else {

                if (sus_fl.current.rotation.y < Math.PI / 4) sus_fl.current.rotation.y += 0.06;
                if (sus_fr.current.rotation.y < Math.PI / 8) sus_fr.current.rotation.y += 0.03;
                if (sus_rl.current.rotation.y > -Math.PI / 4) sus_rl.current.rotation.y -= 0.06;
                if (sus_rr.current.rotation.y > -Math.PI / 8) sus_rr.current.rotation.y -= 0.03;

                body.applyTorqueImpulse({ x: 0, y: rotSpeed * steeringDirection, z: 0 }, true);
            }
        }

        if (ArrowRight) {
            if (!ArrowUp && !ArrowDown) {
                if (sus_fl.current.rotation.y > -Math.PI / 4 || sus_fr.current.rotation.y < Math.PI / 4 || sus_rl.current.rotation.y < Math.PI / 4 || sus_rr.current.rotation.y > -Math.PI / 4) {
                    if (sus_fl.current.rotation.y > -Math.PI / 4) sus_fl.current.rotation.y -= 0.01;
                    if (sus_fr.current.rotation.y < Math.PI / 4) sus_fr.current.rotation.y += 0.01;
                    if (sus_rl.current.rotation.y < Math.PI / 4) sus_rl.current.rotation.y += 0.01;
                    if (sus_rr.current.rotation.y > -Math.PI / 4) sus_rr.current.rotation.y -= 0.01;
                } else {
                    body.applyTorqueImpulse({ x: 0, y: -rotSpeed * steeringDirection * 1.5, z: 0 }, true);
                }
            } else {

                if (sus_fl.current.rotation.y > -Math.PI / 8) sus_fl.current.rotation.y -= 0.03;
                if (sus_fr.current.rotation.y > -Math.PI / 4) sus_fr.current.rotation.y -= 0.06;
                if (sus_rl.current.rotation.y < Math.PI / 8) sus_rl.current.rotation.y += 0.03;
                if (sus_rr.current.rotation.y < Math.PI / 4) sus_rr.current.rotation.y += 0.06;

                body.applyTorqueImpulse({ x: 0, y: -rotSpeed * steeringDirection, z: 0 }, true);
            }
        }

        console.log(arm2.current.rotation.z)
        if (w) {
            if (arm2.current && arm2.current.rotation.z > -(Math.PI / 2)) {
                arm2.current.rotation.z -= 0.02;
            }
        }
        if (s) {
            if (arm2.current && arm2.current.rotation.z < (Math.PI / 2)) {
                arm2.current.rotation.z += 0.02;
            }
        }
        if (i) {
            if (arm3.current) {
                arm3.current.rotation.z -= 0.02;
            }
        }
        if (k) {
            if (arm3.current) {
                arm3.current.rotation.z += 0.02;
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
            if (arm4.current && arm4.current.rotation.z < 3.14) {
                arm4.current.rotation.z += 0.02;
            }
        }
        if (l) {
            if (arm4.current && arm4.current.rotation.z > -1.0) {
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

    });

    // const bodyB = useRef<RapierRigidBody | null>(null);

    // useRevoluteJoint(
    //     ref as React.RefObject<RapierRigidBody>,
    //     bodyB as React.RefObject<RapierRigidBody>,
    //     [
    //         [0, 0, 0], // Anchor point on the main rover body (ref)
    //         [0, 0, 0],    // Anchor point on the blue box (bodyB)
    //         [1, 0, 0]       // The axis of rotation
    //     ]
    // );



    return (
        //   <>
        //     {/* Base cube (moved up in air) */}
        //     <RigidBody ref={bodyA} type="fixed" colliders="cuboid">
        //       <mesh position={[0, 3, 0]}>
        //         <boxGeometry args={[1, 1, 1]} />
        //         <meshStandardMaterial color="red" />
        //       </mesh>
        //     </RigidBody>

        //     {/* Top cube (hinged above base) */}
        //     <RigidBody ref={bodyB} colliders="cuboid">
        //       <mesh position={[.5, 4, .5]}>
        //         <boxGeometry args={[1, 1, 1]} />
        //         <meshStandardMaterial color="blue" />
        //       </mesh>
        //     </RigidBody>
        //   </>

        <>
            <RigidBody
                ref={ref}
                colliders={false}
                friction={0}
                linearDamping={10}
                angularDamping={10}
                position={[0 ,3.8, 0]}
            >
                <Rover fl={fl} fr={fr} ml={ml} mr={mr} rl={rl} rr={rr} arm1={arm1} arm2={arm2} arm3={arm3} arm4={arm4} arm5={arm5} sus_fl={sus_fl} sus_fr={sus_fr} sus_rl={sus_rl} sus_rr={sus_rr} />
                {/* Main body collider */}
                <CuboidCollider args={[.7, 0.4, 1.1]} position={[0, 1.1, -0.3]} mass={1000} />
                <CuboidCollider args={[.1, 0.1, .8]} position={[.3, .8, 1.5]} />

                {/* Wheels (example positions – adjust to your model) */}
                <BallCollider args={[0.3]} position={[-1.05, 0.3, 1.1]} />
                <BallCollider args={[0.3]} position={[1.05, 0.3, 1.1]} />
                <BallCollider args={[0.3]} position={[-1.15, 0.3, -0.1]} />
                <BallCollider args={[0.3]} position={[1.15, 0.3, -0.1]} />
                <BallCollider args={[0.3]} position={[-1.05, 0.3, -1.2]} />
                <BallCollider args={[0.3]} position={[1.05, 0.3, -1.2]} />

                <OrbitControls
                    ref={orbitRef}
                    enablePan={false}
                    minDistance={3}
                    maxDistance={5}
                    maxPolarAngle={Math.PI / 1.9}
                />
            </RigidBody>
            {/* <RigidBody ref={bodyB} colliders="cuboid" mass={.1}>
                <group>
                    <mesh position={[0, 0.3, .5]} castShadow receiveShadow>
                        <boxGeometry args={[.4, .4, .4]} />
                        <meshStandardMaterial color="blue" />
                    </mesh>

                    <mesh position={[0, 0.3, -.5]} castShadow receiveShadow>
                        <boxGeometry args={[.4, .4, .4]} />
                        <meshStandardMaterial color="blue" />
                    </mesh>
                </group>
            </RigidBody> */}

        </>
    );
}

export default RoverController;

