import React from "react";
import { Task } from "../utils/types";
import useTasks from "../tasks/useTasks";

interface ModalContentDeleteProps {
  closeModal: () => void;
  task: Task;
}

const ModalContentDelete = ({ closeModal, task }: ModalContentDeleteProps) => {
  const { handleDeleteTask } = useTasks();

  return (
    <>
      <h2 className="mb-8 text-left text-xl font-bold text-black dark:text-white">
        Delete Task
      </h2>

      <span className="mb-4 block text-center">
        You are about to delete the next task:
      </span>
      <input
        className="mx-auto block w-[80%] rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 px-2 py-1 dark:border-slate-400 dark:from-slate-800 dark:to-slate-900"
        placeholder="How will the task be called?"
        id="deleteTaskName"
        name="name"
        type="text"
        value={task.name}
        disabled
      />
      <div className="m z-50 text-center text-xl text-black dark:text-white">
        <span className="mt-8 block">Are you sure?</span>
        <div className="mt-4 grid grid-flow-col gap-16">
          <Button
            onClick={closeModal}
            label="Cancel"
            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-500 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-800 dark:active:bg-slate-900"
          />
          <Button
            onClick={() => {
              handleDeleteTask(task.id);
              closeModal();
            }}
            label="Delete"
            className="border-slate-600 bg-slate-700 text-white hover:bg-slate-800 active:border-black active:bg-black dark:border-black dark:bg-black dark:hover:border-slate-950 dark:hover:bg-slate-950 dark:active:border-slate-900 dark:active:bg-slate-900"
          />
        </div>
      </div>
    </>
  );
};

const Button = ({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className: string;
}) => (
  <button
    onClick={onClick}
    className={`mb-5 mt-3 cursor-pointer rounded-full border-2 px-4 py-1 text-center text-lg font-semibold shadow-sm shadow-slate-400/50 transition ease-in-out ${className}`}
  >
    {label}
  </button>
);

export default ModalContentDelete;
