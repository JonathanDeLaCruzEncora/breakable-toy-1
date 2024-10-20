import React, { useState } from "react";
import { FaRegCalendar, FaRegTrashAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import Modal from "../modal/modal";
import ModalContentEdit from "../modal/modalContentEdit";
import ModalContentDelete from "../modal/modalContentDelete";
import { Task } from "./tasksSection";
import { FaCircle } from "react-icons/fa";

interface TaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({
  task,
  onEdit,
  onToggle,
  onDelete,
}: TaskProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });

  const handleDropdownChange = (name: string, value: string) => {
    setUpdatedTask({
      ...updatedTask,
      [name]: value,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedTask({
      ...updatedTask,
      [name]: value,
    });
  };

  const openModal = (setFunction: (value: boolean) => void) => {
    setFunction(true);
  };

  const closeModal = (setFunction: (value: boolean) => void) => {
    setFunction(false);
  };

  const calculateWeeks = (due: string) => {
    const currentDate = new Date();

    // Parse the due date from the string format (assuming dueDateString is in 'YYYY-MM-DD')
    const dueDate = new Date(due + "T00:00:00"); // Ensuring it's treated as local time

    // Calculate the difference in time (in milliseconds)
    const timeDiff = dueDate.getTime() - currentDate.getTime();

    // Check if the due date is in the past
    if (timeDiff < 0) {
      return 0; // No weeks left if the due date has passed
    }

    // Calculate the number of weeks left
    const weeksLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7)); // Convert to weeks

    return weeksLeft;
  };

  const chooseColors = (weeks: number) => {
    if (weeks === 1) {
      return "text-red-400";
    }
    if (weeks === 2) {
      return "text-amber-400";
    }
    if (weeks > 2) {
      return "text-green-400";
    }

    return "text-red-800";
  };

  return (
    <>
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
          <span className={task.completed ? "line-through" : "none"}>
            {task.name}
          </span>
        </td>
        <td className="px-1 text-center sm:px-4">
          <span className={task.completed ? "line-through" : "none"}>
            {task.priority}
          </span>
        </td>
        <td className="font-tr px-1 text-center sm:px-4">
          <span
            className={`relative tracking-tighter ${task.completed ? "line-through" : "none"}`}
          >
            {task.dueDate}
            <FaCircle
              className={`${task.dueDate ? chooseColors(calculateWeeks(task.dueDate)) : "hidden"} absolute -left-5 top-1/2 size-2.5 -translate-y-1/2`}
            />
          </span>
        </td>
        <td className="text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <button
              className="active rounded-md border border-slate-200 bg-white p-1 text-emerald-500 hover:bg-slate-50"
              onClick={() => openModal(setIsEditModalOpen)}
            >
              <CiEdit className="size-[20px] sm:size-[26px]" />
            </button>

            <button
              className="rounded-md border border-slate-200 bg-white p-1 text-red-400 hover:bg-slate-50"
              onClick={() => openModal(setIsDeleteModalOpen)}
            >
              <FaRegTrashAlt className="size-[20px] sm:size-[26px]" />
            </button>
            {isEditModalOpen ? (
              <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setUpdatedTask({ ...task });
                  setIsEditModalOpen(false);
                }}
              >
                <ModalContentEdit
                  updatedTask={updatedTask}
                  editTask={onEdit}
                  closeModal={() => setIsEditModalOpen(false)}
                  setUpdatedTask={setUpdatedTask}
                  handleChange={handleChange}
                  handleDropdownChange={handleDropdownChange}
                />
              </Modal>
            ) : isDeleteModalOpen ? (
              <>
                <Modal
                  isOpen={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                >
                  <ModalContentDelete
                    closeModal={() => setIsDeleteModalOpen(false)}
                    onDelete={onDelete}
                    task={task}
                  />
                </Modal>
              </>
            ) : (
              <></>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
