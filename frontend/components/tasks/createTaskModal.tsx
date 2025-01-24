import React, { useRef, useState } from "react";
import { FaPlus, FaRegCalendar } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import Modal from "../modal/modal";
import Dropdown from "../utils/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NewTask } from "../utils/types";
import useTasks from "./useTasks";

/**
 * CreateTaskModal component to create a new task.
 */
const CreateTaskModal: React.FC = () => {
  const { handleAddTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [canAdd, setCanAdd] = useState<boolean>(true);
  const datePickerRef = useRef<DatePicker | null>(null);
  const [newData, setNewData] = useState<NewTask>({
    name: "",
    priority: "",
    dueDate: "",
  });

  /**
   * Handle changes in dropdown selections for the new task.
   *
   * @param {string} name - The name of the field to update.
   * @param {string} value - The new value for the field.
   */
  const handleDropdownChange = (name: string, value: string) => {
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  /**
   * Handle changes in text input fields for the new task.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  /**
   * Open the modal to create a new task.
   */
  const openModal = () => {
    setIsModalOpen(true);
  };

  /**
   * Close the modal and reset the form.
   */
  const closeModal = () => {
    setCanAdd(true);
    setIsModalOpen(false);
    setNewData({ name: "", priority: "", dueDate: "" });
  };

  /**
   * Handle the add task action.
   */
  const handleAddClick = async () => {
    if (newData.name && newData.priority) {
      handleAddTask(newData);
      closeModal();
      setCanAdd(true);
    } else setCanAdd(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="mt-16 flex h-fit cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300 dark:border-indigo-500 dark:bg-indigo-500 dark:shadow-none dark:hover:border-indigo-600 dark:hover:bg-indigo-600 dark:active:border-indigo-700 dark:active:bg-indigo-700"
      >
        <FaPlus className="" size={20} color="white" /> Create
      </button>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="mb-10 text-xl font-bold">Create Task</h2>
          <div className="z-40 flex flex-col gap-5">
            <div className="flex items-center">
              <label className="inline-block w-16" htmlFor="createTaskName">
                Name*
              </label>
              <input
                className="ml-5 inline-block w-full rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:border-slate-400 dark:from-slate-700 dark:to-slate-800 dark:placeholder:text-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-700 dark:focus:bg-slate-700 dark:focus:ring-offset-slate-800"
                placeholder="How will the task be called?"
                id="createTaskName"
                name="name"
                type="text"
                value={newData.name}
                onChange={handleNewChange}
              />
            </div>

            <Dropdown
              id="createTaskPriority"
              label="Priority*"
              value={newData.priority || "-"}
              options={["Low", "Medium", "High"]}
              onChange={(value) => {
                handleDropdownChange("priority", value);
              }}
            />

            <div className="flex items-center justify-start">
              <label className="block w-16" htmlFor="createTaskDate">
                Due
              </label>
              <div className="relative w-fit">
                <DatePicker
                  className="ml-2 inline-block w-40 cursor-pointer rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:border-slate-400 dark:from-slate-700 dark:to-slate-800 dark:placeholder:text-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-700 dark:focus:bg-slate-700 dark:focus:ring-offset-slate-800"
                  id="createTaskDate"
                  name="dueDate"
                  type="date"
                  minDate={new Date()}
                  selected={
                    newData.dueDate
                      ? new Date(newData.dueDate + "T00:00:00")
                      : new Date()
                  }
                  value={newData.dueDate}
                  placeholderText="YYYY-MM-DD"
                  onChange={(value: Date | null) => {
                    setNewData({
                      ...newData,
                      dueDate: value ? value.toLocaleDateString("en-CA") : "",
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

              <button
                onClick={() =>
                  setNewData({
                    ...newData,
                    dueDate: "",
                  })
                }
                className=""
              >
                <IoReloadOutline
                  className="ml-2 h-full cursor-pointer rounded-md border-2 border-slate-600 bg-slate-700 p-1 text-white hover:bg-slate-800 active:border-slate-800 active:bg-slate-900"
                  size={30}
                />
              </button>
            </div>
            <div
              className={`mb-5 mt-3 flex items-center ${!canAdd ? "justify-between" : "justify-end"}`}
            >
              {!canAdd && (
                <span className="block text-red-800 dark:text-red-400">
                  All elements with (*) are required
                </span>
              )}
              <button
                onClick={() => handleAddClick()}
                className="flex cursor-pointer items-center justify-center gap-2 self-end rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300 dark:border-indigo-500 dark:bg-indigo-500 dark:shadow-none dark:hover:border-indigo-600 dark:hover:bg-indigo-600 dark:active:border-indigo-700 dark:active:bg-indigo-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateTaskModal;
