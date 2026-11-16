
import { Link } from "react-router-dom";
import type { Task } from "../types/task";

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}

function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return <p>No tasks available. Create your first task!</p>;
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <div className="task-card" key={task.id}>
                    <h3>
                        <Link to={`/tasks/${task.id}`}>
                            {task.title}
                        </Link>
                    </h3>

                    <p>{task.description || "No description"}</p>
                    <p>
                        Status: <strong>{task.status}</strong>
                    </p>

                    <button type="button" onClick={() => onEdit(task)}>
                        Edit
                    </button>

                    <button type="button" onClick={() => onDelete(task.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default TaskList;
