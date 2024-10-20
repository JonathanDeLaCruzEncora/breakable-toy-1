"use client";
import React, { useEffect, useRef, useState } from "react";
import TaskItem from "./taskItem";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import Modal from "../modal/modal";
import SortArrows from "../utils/sortArrows";
import Dropdown from "../utils/dropdown";
import DatePicker from "react-datepicker";
import { FaRegCalendar } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import { PriorityAvg, Task } from "./tasksSection";
import { FaSpinner } from "react-icons/fa";
import {
  markAsDone,
  markAsUndone,
  createTask,
  getTasks,
  deleteTask,
  editTask,
} from "../utils/api";

interface NewTask {
  name: string;
  priority: string;
  dueDate: string;
}

interface Props {
  loadingTasks: boolean;
  setLoadingTasks: (value: boolean) => void;
  taskList: Task[];
  setTaskList: (list: Task[]) => void;
  currentPage: number;
  setNumberOfPages: (pages: number) => void;
  setCurrentPage: (pages: number) => void;
  searchParams: object;
  sortCompleted: boolean;
  sortPriority: number;
  sortName: number;
  sortDueDate: number;
  setSortCompleted: (val: boolean) => void;
  setSortPriority: (val: number) => void;
  setSortName: (val: number) => void;
  setSortDueDate: (val: number) => void;
  setAvgTime: (val: number) => void;
  setPriorityAvg: (val: PriorityAvg) => void;
  priorityAvg: PriorityAvg;
}

export default function TaskList({
  setAvgTime,
  setPriorityAvg,
  priorityAvg,
  taskList,
  loadingTasks,
  setLoadingTasks,
  setTaskList,
  currentPage,
  setNumberOfPages,
  setCurrentPage,
  searchParams,
  sortCompleted,
  sortPriority,
  sortName,
  sortDueDate,
  setSortCompleted,
  setSortPriority,
  setSortName,
  setSortDueDate,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [canAdd, setCanAdd] = useState<boolean>(true);
  const [changesDone, setChangesDone] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker | null>(null);

  const [newData, setNewData] = useState<NewTask>({
    name: "",
    priority: "",
    dueDate: "",
  });

  const filterCompletedOrUncompletedTasks = (
    list: Task[],
    completed: boolean,
  ) => {
    return completed
      ? list.filter(({ completed }) => completed)
      : list.filter(({ completed }) => !completed);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCanAdd(true);
    setIsModalOpen(false);
    setNewData({ name: "", priority: "", dueDate: "" });
  };

  const handleOrderChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    let newValue;
    switch (name) {
      case "name":
        newValue = sortName === 0 ? 1 : sortName === 1 ? -1 : 0;
        setSortName(newValue);
        setSortPriority(0);
        setSortDueDate(0);
        break;
      case "priority":
        newValue = sortPriority === 0 ? 1 : sortPriority === 1 ? -1 : 0;
        setSortPriority(newValue);
        setSortName(0);
        break;
      case "dueDate":
        newValue = sortDueDate === 0 ? 1 : sortDueDate === 1 ? -1 : 0;
        setSortDueDate(newValue);
        setSortName(0);
        break;
      default:
        setSortCompleted(!sortCompleted);

        break;
    }
  };

  useEffect(() => {
    const fetchSortedTasks = async () => {
      try {
        setLoadingTasks(true);
        const filtersAndSort = {
          ...searchParams,
          sortCompleted,
          sortName,
          sortPriority,
          sortDueDate,
        };
        const { tasks: fetchedTasks, totalPages } = await getTasks(
          currentPage - 1,
          filtersAndSort,
        );
        setTaskList(fetchedTasks);
        setNumberOfPages(totalPages);
        setLoadingTasks(false);
      } catch (error) {
        console.log("Error loading initial tasks: ", error);
        setLoadingTasks(false);
      }
    };
    fetchSortedTasks();
    setLoadingTasks(false);
  }, [sortName, sortPriority, sortDueDate, sortCompleted]); // Dependencies to trigger sort

  const handleDropdownChange = (name: string, value: string) => {
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  const handleToggleTask = async (id: number) => {
    try {
      // Find the task to be updated first
      const taskToUpdate = taskList.find((task) => task.id === id);

      if (!taskToUpdate) return; // Safeguard in case the task is not found

      const completedVal = taskToUpdate.completed;

      // Update the state optimistically
      setTaskList(
        taskList.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      );

      // Perform the async action based on the old value of completedVal
      if (!completedVal) {
        const { avg, priority } = await markAsDone(id);
        setAvgTime(avg);
        setPriorityAvg({
          ...priorityAvg,
          [taskToUpdate.priority]: priority,
        });
      } else {
        const { avg, priority } = await markAsUndone(id);
        setAvgTime(avg);
        setPriorityAvg({
          ...priorityAvg,
          [taskToUpdate.priority]: priority,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async () => {
    if (newData.name && newData.priority) {
      try {
        const fetchedTask = await createTask(newData);
        try {
          const { tasks: fetchedTasks, totalPages } = await getTasks(0, {
            ...searchParams,
            sortCompleted: sortCompleted,
            sortName: sortName,
            sortPriority: sortPriority,
            sortDueDate: sortDueDate,
          });
          setTaskList(fetchedTasks);
          setNumberOfPages(totalPages);
        } catch (error) {
          console.error("Error while loading tasks");
        }
      } catch (error) {
        console.error("Error while creating  tasks");
      }
      closeModal();
      setCanAdd(true);
    } else {
      setCanAdd(false);
    }
  };

  const resetSort = () => {
    setSortDueDate(0);
    setSortName(0);
    setSortPriority(0);
    setSortCompleted(false);
    setCurrentPage(1);
  };

  const handleEditTask = async (updatedTask: any) => {
    try {
      await editTask(updatedTask);
      setTaskList(
        taskList.map((t) =>
          t.id === updatedTask.id
            ? {
                ...t,
                name: updatedTask.name,
                priority: updatedTask.priority,
                dueDate: updatedTask.dueDate,
              }
            : t,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    setTaskList(taskList.filter((task: Task) => task.id !== id));
    try {
      await deleteTask(id);
      setLoadingTasks(true);
      let newCurrentPage =
        taskList.length === 1 ? currentPage - 1 : currentPage;
      const { tasks: fetchedTasks, totalPages } = await getTasks(
        newCurrentPage === 0 ? 0 : newCurrentPage - 1,
        {
          ...searchParams,
          sortCompleted,
          sortName,
          sortPriority,
          sortDueDate,
        },
      );
      setCurrentPage(newCurrentPage || 1);
      setTaskList(fetchedTasks);
      setNumberOfPages(totalPages || 1);
      setLoadingTasks(false);
    } catch (error) {
      setLoadingTasks(false);
      console.error(error);
    }
  };

  return (
    <div className="container z-10 mx-auto flex max-w-screen-xl flex-col items-start overflow-x-auto px-3 sm:px-20">
      <button
        onClick={openModal}
        className="mt-16 flex h-fit cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300"
      >
        <FaPlus className="" size={20} color="white" /> Create
      </button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="mb-10 text-xl font-bold">Create Task</h2>
          <div className="z-40 flex flex-col gap-5">
            <div className="flex items-center">
              <label className="inline-block w-16" htmlFor="createTaskName">
                Name*
              </label>
              <input
                className="ml-5 inline-block w-full rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
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
                  className="ml-2 inline-block w-40 cursor-pointer rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
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
                <span className="block text-red-800">
                  All elements with (*) are required
                </span>
              )}
              <button
                onClick={handleAddTask}
                className="flex cursor-pointer items-center justify-center gap-2 self-end rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300"
              >
                Add Task
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="container relative mx-auto my-10 h-[612px] overflow-hidden overflow-x-auto rounded-xl bg-slate-50 shadow-sm shadow-indigo-400/10">
        <table className="w-full table-fixed overflow-auto">
          <thead
            id="tasksHeader"
            className="text-md mb-5 bg-slate-200 tracking-widest"
          >
            <tr className="">
              <th className="w-[10%] p-0"></th>
              <th className="w-[30%] transition-colors hover:bg-slate-300 active:bg-slate-400">
                <button
                  name="name"
                  onClick={handleOrderChange}
                  className="flex h-10 w-full cursor-pointer items-center justify-start gap-2 px-1 text-black transition duration-200 md:px-4"
                >
                  <SortArrows order={sortName} />
                  Name
                </button>
              </th>
              <th
                className={`relative w-[25%] transition-colors hover:bg-slate-300 active:bg-slate-400 sm:w-[20%]`}
              >
                <button
                  name="priority"
                  onClick={handleOrderChange}
                  className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 px-1 text-black transition duration-200 md:px-4"
                >
                  <SortArrows order={sortPriority} />
                  Priority
                </button>
              </th>
              <th className="w-[20%] transition-colors hover:bg-slate-300 active:bg-slate-400">
                <button
                  name="dueDate"
                  onClick={handleOrderChange}
                  className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 px-1 text-black transition duration-200 lg:px-4"
                >
                  <SortArrows order={sortDueDate} />
                  Due Date
                </button>
              </th>
              <th className="w-[15%] sm:w-[20%]">
                <div className="flex h-10 w-full select-none items-center justify-center rounded-xl px-1 text-black md:px-4">
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {taskList &&
              !loadingTasks &&
              taskList.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
          </tbody>
        </table>
        {loadingTasks ? (
          <>
            <div className="relative mx-auto my-6 h-16 w-16 text-indigo-400">
              <FaSpinner className="absolute h-full w-full animate-spin" />
            </div>
          </>
        ) : !taskList || taskList.length === 0 ? (
          <span className="mt-8 block w-full text-center text-lg text-slate-700">
            No tasks were found...
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
