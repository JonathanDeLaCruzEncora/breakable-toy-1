import React from "react";
import { Task } from "./taskList";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

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
    <tr className="group border-b border-slate-200 bg-white hover:bg-slate-100">
      <td
        onClick={() => onToggle(task.id)}
        className="flex cursor-pointer items-center justify-center py-5 text-center"
      >
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer accent-indigo-500"
          checked={task.completed}
          readOnly
        />
      </td>
      <td className="overflow-auto break-words border-l-2 px-1 sm:px-4">
        <span
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
        >
          {task.name}
        </span>
      </td>
      <td className="px-1 text-center sm:px-4">
        <span
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
        >
          {task.priority}
        </span>
      </td>
      <td className="px-1 text-center sm:px-4">
        <span
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
        >
          {" "}
          {task.dueDate}
        </span>
      </td>
      <td className="text-center">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <button
            className="active rounded-md border border-slate-200 bg-white p-1 text-emerald-500 hover:bg-slate-50"
            onClick={() => onEdit(task.id)}
          >
            <CiEdit className="size-[20px] sm:size-[26px]" />
          </button>
          <button
            className="rounded-md border border-slate-200 bg-white p-1 text-red-400 hover:bg-slate-50"
            onClick={() => onDelete(task.id)}
          >
            <FaRegTrashAlt className="size-[20px] sm:size-[26px]" />
          </button>
        </div>
      </td>
    </tr>
  );
}
