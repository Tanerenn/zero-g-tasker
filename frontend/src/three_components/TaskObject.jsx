import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';

export default function TaskObject({ task, onComplete, index }) {
    const rigidBodyRef = useRef();
    const [hovered, setHovered] = useState(false);
    const isCompleted = task.is_completed;

    // Randomize initial position slightly so they don't drop on exactly the same spot
    const xPos = (Math.random() - 0.5) * 4;
    const zPos = (Math.random() - 0.5) * 4;
    const initialPosition = [xPos, 5 + index, zPos];

    // Apply Antigravity on Completion
    useEffect(() => {
        if (isCompleted && rigidBodyRef.current) {
            // Set gravity scale to negative for this object so it floats up (0.5 times normal gravity inverted)
            rigidBodyRef.current.setGravityScale(-0.5, true);

            // Give it an initial upwards impulse based on weight to pop it up satisfyingly
            const force = task.weight * 2;
            rigidBodyRef.current.applyImpulse({ x: 0, y: force, z: 0 }, true);

            // Give it a random spin
            rigidBodyRef.current.applyTorqueImpulse({
                x: (Math.random() - 0.5),
                y: (Math.random() - 0.5),
                z: (Math.random() - 0.5)
            }, true);
        }
    }, [isCompleted, task.weight]);

    const handleClick = (e) => {
        e.stopPropagation();
        if (!isCompleted) {
            onComplete();
        }
    };

    const size = 0.6 + (task.weight * 0.1);

    const getColor = () => {
        if (isCompleted) return '#38bdf8'; // Glowing blue when completed
        if (task.weight >= 4) return '#ef4444'; // Red for heavy/urgent
        if (task.weight >= 2) return '#eab308'; // Yellow for medium
        return '#818cf8'; // Soft purple-blue for light
    };

    return (
        <RigidBody
            ref={rigidBodyRef}
            position={initialPosition}
            mass={task.weight}
            restitution={0.6} // Make them delightfully bouncy
            colliders="cuboid"
            canSleep={!isCompleted} // Never sleep once floating away
        >
            <mesh
                castShadow
                receiveShadow
                onClick={handleClick}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = isCompleted ? 'default' : 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
            >
                <boxGeometry args={[size, size, size]} />
                <meshStandardMaterial
                    color={getColor()}
                    emissive={isCompleted ? '#38bdf8' : (hovered && !isCompleted ? '#ffffff' : '#000000')}
                    emissiveIntensity={isCompleted ? 1.5 : (hovered ? 0.2 : 0)}
                    roughness={0.2}
                    metalness={0.8}
                />

                {/* Title Text on the cube facing Forward*/}
                <Text
                    position={[0, 0, size / 2 + 0.01]}
                    fontSize={size * 0.15}
                    color={isCompleted ? "#ffffff" : "#0f172a"}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={size * 0.8}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff"
                >
                    {task.title}
                </Text>
            </mesh>
        </RigidBody>
    );
}
