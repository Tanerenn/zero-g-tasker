import { useState, useEffect, Suspense } from 'react';
import TaskForm from './components/TaskForm';
import Scene from './three_components/Scene';
import { getTasks, createTask, updateTask } from './services/api';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            const newTask = await createTask(taskData);
            setTasks([newTask, ...tasks]);
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    const handleTaskComplete = async (task) => {
        try {
            
            setTasks(prevTasks =>
                prevTasks.map(t => t.id === task.id ? { ...t, is_completed: true } : t)
            );

            await updateTask(task.id, { is_completed: true });
        } catch (error) {
            console.error("Failed to update task", error);
            
            setTasks(prevTasks =>
                prevTasks.map(t => t.id === task.id ? { ...t, is_completed: false } : t)
            );
        }
    };

    return (
        <div className="app-container">
            {/* 2D HTML UI Layer */}
            <div className="ui-layer">
                <header className="header">
                    <div className="title">
                        <span>🚀</span>
                        Zero-G Tasker
                    </div>
                </header>

                <TaskForm onTaskAdded={handleAddTask} />

                <div className="instructions">
                    <span>✨ Click a task to complete and launch into Zero-G</span>
                    <span>📥 Add new tasks on the left to drop them in</span>
                </div>
            </div>

            {/* 3D WebGL Canvas Layer */}
            <Suspense fallback={
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 0 }}>
                    Initializing Physics Engine...
                </div>
            }>
                {!loading && <Scene tasks={tasks} onTaskComplete={handleTaskComplete} />}
            </Suspense>
        </div>
    );
}

