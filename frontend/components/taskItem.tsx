import React from 'react'
import { Task } from './taskList';

interface TaskProps {
    task: Task;
    onEdit: (id:number) => void;
    onToggle: (id:number) => void;
    onDelete: (id:number) => void;
}

export default function TaskItem({task, onEdit, onToggle, onDelete}: TaskProps) {
  return (
    <div>
        <input
            type = "checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
        />
        <span style={{textDecoration: task.completed ? 'line-through': 'none'}}>
            {task.name}
        </span>
        <span> (Due: {task.dueDate})</span>
        <div>
            <button onClick={() => onEdit(task.id)}>
                Edit
            </button>
            <button onClick={() => onDelete(task.id)}>
                Delete
            </button>
        </div>
        
    </div>
  )
}
