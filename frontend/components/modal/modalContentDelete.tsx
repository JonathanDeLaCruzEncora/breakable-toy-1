import React from "react";
import { Task } from "../tasks/taskList";

export default function ModalContentDelete({
  closeModal,
  task,
}: {
  closeModal: () => void;
  task: Task;
}) {
  return (
    <>
      <h2 className="mb-8 text-left text-xl font-bold text-black">
        Delete Task
      </h2>

      <span className="mb-4 block text-center">
        You are about to delete the next task:
      </span>
      <input
        className="mx-auto block w-[80%] rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 px-2 py-1"
        placeholder="How will the task be called?"
        id="deleteTaskName"
        name="name"
        type="text"
        value={task.name}
        disabled
      />
      <div className="m z-50 text-center text-xl text-black">
        <span className="mt-8 block">Are you sure?</span>
        <div className="mt-4 grid grid-flow-col gap-16">
          <button
            onClick={closeModal}
            className="mb-5 mt-3 cursor-pointer rounded-full border-2 border-slate-300 bg-white px-4 py-1 text-center text-lg font-semibold text-slate-700 shadow-sm shadow-slate-400/50 transition ease-in-out hover:bg-slate-50 active:bg-slate-100 active:shadow-md active:shadow-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={closeModal}
            className="mb-5 mt-3 cursor-pointer rounded-full border-2 border-slate-600 bg-slate-700 px-4 py-1 text-center text-lg font-semibold text-white shadow-sm shadow-slate-400/50 transition ease-in-out hover:bg-slate-800 active:border-black active:bg-black active:shadow-md active:shadow-slate-200"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
