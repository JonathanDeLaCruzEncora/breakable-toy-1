import React, { useRef } from "react";
import Dropdown from "../utils/dropdown";
import DatePicker from "react-datepicker";
import { FaRegCalendar } from "react-icons/fa";
import { Task } from "../tasks/taskList";

interface Props {
  updatedTask: Task;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropdownChange: (name: string, value: string) => void;
  closeModal: () => void;
  setUpdatedTask: (task: Task) => void;
}

export default function ModalContentEdit({
  updatedTask,
  setUpdatedTask,
  handleChange,
  handleDropdownChange,
  closeModal,
}: Props) {
  const datePickerRef = useRef<DatePicker | null>(null);

  return (
    <>
      <h2 className="mb-10 text-xl font-bold">Edit Task</h2>
      <div className="z-40 flex flex-col gap-5">
        <div className="flex items-center">
          <label className="inline-block w-16" htmlFor="nameSearch">
            Name*
          </label>
          <input
            className="ml-5 inline-block w-full rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            placeholder="How will the task be called?"
            id="editTaskName"
            name="name"
            type="text"
            value={updatedTask.name}
            onChange={handleChange}
          />
        </div>

        <Dropdown
          id="editTaskPriority"
          label="Priority*"
          value={updatedTask.priority || "-"}
          options={["Low", "Mid", "High"]}
          onChange={(value) => {
            handleDropdownChange("priority", value);
          }}
        />

        <div className="flex items-center">
          <label className="inline-block w-16" htmlFor="nameSearch">
            Due
          </label>
          <div className="relative w-fit">
            <DatePicker
              className="ml-2 inline-block w-40 cursor-pointer rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              id="editTaskDate"
              name="dueDate"
              type="date"
              minDate={new Date()}
              selected={
                updatedTask.dueDate ? new Date(updatedTask.dueDate) : new Date()
              }
              value={updatedTask.dueDate}
              placeholderText="YYYY-MM-DD"
              onChange={(value: Date | null) => {
                setUpdatedTask({
                  ...updatedTask,
                  dueDate: value ? value.toISOString().split("T")[0] : "",
                });
              }}
              ref={datePickerRef}
            />
            <div
              onClick={() => datePickerRef.current?.setFocus()}
              className="absolute right-[8px] top-[3px] cursor-pointer p-1"
            >
              <FaRegCalendar size={20} />
            </div>
          </div>
        </div>

        <button
          onClick={closeModal}
          className="mb-5 mt-3 flex cursor-pointer items-center justify-center gap-2 self-end rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300"
        >
          Add Task
        </button>
      </div>
    </>
  );
}
