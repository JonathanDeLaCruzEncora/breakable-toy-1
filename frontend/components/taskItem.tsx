import React from "react";
import { Task } from "./taskList";

interface TaskProps {
  task: Task;
  onEdit: (id: number) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({
  task,
  onEdit,
  onToggle,
  onDelete,
}: TaskProps) {
  return (
    <tr className="">
      <td className="flex items-center justify-center text-center">
        <input
          type="checkbox"
          className="h-4 w-4 accent-indigo-500"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
      </td>
      <td className="px-10">
        <span
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
        >
          {task.name}
        </span>
      </td>
      <td className="text-center">
        <span>{task.priority}</span>
      </td>
      <td className="text-center">
        <span> (Due: {task.dueDate})</span>
      </td>
      <td className="text-center">
        <div>
          <button onClick={() => onEdit(task.id)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </td>
    </tr>
  );
}
