import React, { useState } from "react";
import { FaRegTrashAlt, FaCircle } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import Modal from "../modal/modal";
import ModalContentEdit from "../modal/modalContentEdit";
import ModalContentDelete from "../modal/modalContentDelete";
import { Task } from "../utils/types";
import useTasks from "./useTasks";

interface TaskProps {
  task: Task;
}

/**
 * TaskItem component to display a single task with options to edit, delete, and toggle completion status.
 *
 * @param {TaskProps} props - The component props.
 * @param {Task} props.task - The task to display.
 */
export default function TaskItem({ task }: TaskProps) {
  const { handleToggleTask } = useTasks();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });

  /**
   * Handle changes in dropdown selections for the task.
   *
   * @param {string} name - The name of the field to update.
   * @param {string} value - The new value for the field.
   */
  const handleDropdownChange = (name: string, value: string) => {
    setUpdatedTask({
      ...updatedTask,
      [name]: value,
    });
  };

  /**
   * Handle changes in text input fields for the task.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedTask({
      ...updatedTask,
      [name]: value,
    });
  };

  /**
   * Open a modal.
   *
   * @param {function} setFunction - The function to set the modal state.
   */
  const openModal = (setFunction: (value: boolean) => void) => {
    setFunction(true);
  };

  /**
   * Calculate the number of weeks left until the task's due date.
   *
   * @param {string} due - The due date of the task.
   * @returns {number} The number of weeks left.
   */
  const calculateWeeks = (due: string) => {
    const currentDate = new Date();
    const dueDate = new Date(due + "T00:00:00");
    const timeDiff = dueDate.getTime() - currentDate.getTime();

    if (timeDiff < 0) return 0;

    const weeksLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
    return weeksLeft;
  };

  /**
   * Choose the color based on the number of weeks left until the due date.
   *
   * @param {number} weeks - The number of weeks left.
   * @returns {string} The color class.
   */
  const chooseColors = (weeks: number) => {
    if (weeks === 1) return "text-red-400";
    if (weeks === 2) return "text-amber-400";
    if (weeks > 2) return "text-green-400";
    return "text-red-800";
  };

  return (
    <>
      <tr className="group border-b border-slate-200 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600">
        <td
          onClick={() => handleToggleTask(task.id)}
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
          <span className={task.completed ? "line-through" : ""}>
            {task.name}
          </span>
        </td>
        <td className="px-1 text-center sm:px-4">
          <span className={task.completed ? "line-through" : ""}>
            {task.priority}
          </span>
        </td>
        <td className="font-tr px-1 text-center sm:px-4">
          <span
            className={`relative tracking-tighter ${task.completed ? "line-through" : ""}`}
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
              className="active rounded-md border border-slate-200 bg-white p-1 text-emerald-500 hover:bg-slate-50 dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={() => openModal(setIsEditModalOpen)}
              aria-label="Edit Task"
              data-testid="edit-button"
            >
              <CiEdit className="size-[20px] sm:size-[26px]" />
            </button>

            <button
              className="rounded-md border border-slate-200 bg-white p-1 text-red-400 hover:bg-slate-50 dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={() => openModal(setIsDeleteModalOpen)}
              aria-label="Delete Task"
              data-testid="delete-button"
            >
              <FaRegTrashAlt className="size-[20px] sm:size-[26px]" />
            </button>
            {isEditModalOpen && (
              <Modal
                onClose={() => {
                  setUpdatedTask({ ...task });
                  setIsEditModalOpen(false);
                }}
              >
                <ModalContentEdit
                  updatedTask={updatedTask}
                  closeModal={() => setIsEditModalOpen(false)}
                  setUpdatedTask={setUpdatedTask}
                  handleChange={handleChange}
                  handleDropdownChange={handleDropdownChange}
                />
              </Modal>
            )}

            {isDeleteModalOpen && (
              <Modal onClose={() => setIsDeleteModalOpen(false)}>
                <ModalContentDelete
                  closeModal={() => setIsDeleteModalOpen(false)}
                  task={task}
                />
              </Modal>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
