import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TaskForm({ onTaskAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onTaskAdded({ title, description, weight: parseFloat(weight) });
        setTitle('');
        setDescription('');
        setWeight(1);
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="task-input"
                placeholder="What's your next mission?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                className="task-input"
                placeholder="Mission details... (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="weight-selector">
                <label>Urgency / Mass: {weight}</label>
                <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    className="weight-slider"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
            </div>
            <button type="submit" className="submit-btn" disabled={!title.trim()}>
                <Plus size={20} />
                Deploy Mission
            </button>
        </form>
    );
}
