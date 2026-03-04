import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, Sky, Stars, ContactShadows } from '@react-three/drei';
import TaskObject from './TaskObject';

export default function Scene({ tasks, onTaskComplete }) {
    return (
        <div className="canvas-container">
            <Canvas shadows camera={{ position: [0, 8, 15], fov: 45 }}>
                <color attach="background" args={['#070a13']} />

                <ambientLight intensity={0.4} />
                <directionalLight
                    castShadow
                    position={[10, 20, 10]}
                    intensity={1.5}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />

                <Environment preset="night" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

                <Physics gravity={[0, -9.81, 0]}>
                    {/* Ground to catch tasks */}
                    <RigidBody type="fixed" position={[0, -1, 0]} restitution={0.2} friction={1}>
                        <mesh receiveShadow>
                            <boxGeometry args={[40, 2, 40]} />
                            <meshStandardMaterial color="#0f172a" roughness={1} />
                        </mesh>
                    </RigidBody>

                    {/* Invisible Walls to keep objects inside the camera view loosely */}
                    <RigidBody type="fixed" position={[0, 10, -5]} restitution={0.5}>
                        <mesh><boxGeometry args={[20, 25, 1]} /><meshBasicMaterial transparent opacity={0} /></mesh>
                    </RigidBody>
                    <RigidBody type="fixed" position={[0, 10, 8]} restitution={0.5}>
                        <mesh><boxGeometry args={[20, 25, 1]} /><meshBasicMaterial transparent opacity={0} /></mesh>
                    </RigidBody>
                    <RigidBody type="fixed" position={[-7, 10, 0]} restitution={0.5}>
                        <mesh><boxGeometry args={[1, 25, 20]} /><meshBasicMaterial transparent opacity={0} /></mesh>
                    </RigidBody>
                    <RigidBody type="fixed" position={[7, 10, 0]} restitution={0.5}>
                        <mesh><boxGeometry args={[1, 25, 20]} /><meshBasicMaterial transparent opacity={0} /></mesh>
                    </RigidBody>

                    {tasks.map((task, index) => (
                        <TaskObject
                            key={task.id}
                            task={task}
                            onComplete={() => onTaskComplete(task)}
                            index={index}
                        />
                    ))}
                </Physics>
            </Canvas>
        </div>
    );
}
