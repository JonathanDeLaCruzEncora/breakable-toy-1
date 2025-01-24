import React from "react";
import { Task } from "../tasks/tasksSection";

export default function ModalContentDelete({
  closeModal,
  task,
  onDelete,
}: {
  closeModal: () => void;
  task: Task;
  onDelete: (id: number) => void;
}) {
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
          <button
            onClick={closeModal}
            className="mb-5 mt-3 cursor-pointer rounded-full border-2 border-slate-300 bg-white px-4 py-1 text-center text-lg font-semibold text-slate-700 shadow-sm shadow-slate-400/50 transition ease-in-out hover:bg-slate-50 active:bg-slate-100 active:shadow-md active:shadow-slate-200 dark:border-slate-500 dark:bg-slate-700 dark:text-white dark:shadow-none dark:hover:bg-slate-800 dark:hover:shadow-none dark:active:bg-slate-900 dark:active:shadow-none"
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="mb-5 mt-3 cursor-pointer rounded-full border-2 border-slate-600 bg-slate-700 px-4 py-1 text-center text-lg font-semibold text-white shadow-sm shadow-slate-400/50 transition ease-in-out hover:bg-slate-800 active:border-black active:bg-black active:shadow-md active:shadow-slate-200 dark:border-black dark:bg-black dark:shadow-none dark:hover:border-slate-950 dark:hover:bg-slate-950 dark:hover:shadow-none dark:active:border-slate-900 dark:active:bg-slate-900 dark:active:shadow-none"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
