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
import { Task } from "./tasksSection";
import { FaSpinner } from "react-icons/fa";

interface NewTask {
  name: string;
  priority: string;
  dueDate: string;
}

interface Props {
  taskList: Task[];
  setTaskList: (list: Task[]) => void;
  currentPage: number;
  setNumberOfPages: (pages: number) => void;
  setCurrentPage: (pages: number) => void;
}

export default function TaskList({
  taskList,
  setTaskList,
  currentPage,
  setNumberOfPages,
  setCurrentPage,
}: Props) {
  const [sortedTasks, setSortedTasks] = useState<Task[]>(taskList);
  const [sortCompleted, setSortCompleted] = useState<boolean>(false);
  const [sortName, setSortName] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortPriority, setSortPriority] = useState<number>(0);
  const [sortDueDate, setSortDueDate] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [canAdd, setCanAdd] = useState<boolean>(true);
  const [changesDone, setChangesDone] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker | null>(null);

  useEffect(() => {
    setLoading(true);
    const tempTasks = filterCompletedOrUncompletedTasks(
      taskList,
      sortCompleted,
    );
    setSortedTasks(tempTasks);
    setNumberOfPages(Math.ceil(tempTasks.length / 6 || 1));
    setLoading(false);
  }, [taskList]);

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
        setSortCompleted((prev) => {
          return !prev;
        });

        break;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setLoading(true);
    const newTasks = sortTasks(
      filterCompletedOrUncompletedTasks(taskList, sortCompleted),
    );
    setSortedTasks(newTasks);
    setNumberOfPages(Math.ceil(newTasks.length / 6) || 1);
    setLoading(false);
  }, [sortName, sortPriority, sortDueDate, sortCompleted]); // Dependencies to trigger sort

  const handleDropdownChange = (name: string, value: string) => {
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  const handleToggleTask = (id: number) => {
    setSortedTasks(
      sortedTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
    localStorage.setItem("tasks", JSON.stringify(taskList));
  };

  const getNextTaskId = () => {
    const id = localStorage.getItem("idTask");
    const currentId = id ? parseInt(id) : 0;
    localStorage.setItem("idTask", (currentId + 1).toString());
    return currentId;
  };

  const handleAddTask = () => {
    if (newData.name && newData.priority) {
      const id = getNextTaskId();
      const newTask = {
        ...newData,
        completed: false,
        id: id,
        createdAt: new Date().toISOString(),
        completedAt: "",
      };

      const newSortedTasks = sortTasks([newTask, ...sortedTasks]);
      setSortedTasks(newSortedTasks);
      const newList = [newTask, ...taskList];
      setTaskList(newList);
      localStorage.setItem("tasks", JSON.stringify(newList));
      closeModal();
      resetSort();
      if (newList.length % 6 === 1) setNumberOfPages(newList.length / 6 + 1);
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

  const handleEditTask = (task: Task) => {};

  const handleDeleteTask = (id: number) => {
    setSortedTasks(sortedTasks.filter((task) => task.id !== id));
  };

  const sortTasks = (list: Task[]) => {
    const initialTasks = list;
    if (sortName !== 0) {
      return initialTasks.sort((a, b) =>
        sortName === 1
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
    }

    if (sortPriority !== 0) {
      const groups = groupTasksByPriority(initialTasks);
      if (sortDueDate !== 0) {
        for (const priority in groups) {
          let sorted = sortByDueDate(groups[priority]);
          groups[priority] = sorted;
        }
      }
      const res: Task[] = [];
      if (sortPriority === 1) {
        // Ascending order for priority
        res.push(
          ...(groups["High"] || []),
          ...(groups["Mid"] || []),
          ...(groups["Low"] || []),
        );
      } else {
        // Descending order for priority
        res.push(
          ...(groups["Low"] || []),
          ...(groups["Mid"] || []),
          ...(groups["High"] || []),
        );
      }
      return res;
    }

    if (sortDueDate !== 0) return sortByDueDate(initialTasks);
    return initialTasks;
  };

  const groupTasksByPriority = (tasks: Task[]): { [key: string]: Task[] } => {
    return tasks.reduce<{ [key: string]: Task[] }>(
      (acc, task) => {
        const { priority } = task;

        // Initialize the array if it doesn't exist
        if (!acc[priority]) {
          acc[priority] = [];
        }

        // Push the task into the corresponding priority array
        acc[priority].push(task);

        return acc;
      },
      {}, // Initial value as an empty object
    );
  };

  const sortByDueDate = (list: Task[]) => {
    const res = list.sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate) : null;
      const dateB = b.dueDate ? new Date(b.dueDate) : null;

      // Handle empty strings:
      // Option 1: Empty strings at the end
      if (!dateA && !dateB) return 0; // Both are empty
      if (!dateA) return 1; // a is empty, b is not
      if (!dateB) return -1; // b is empty, a is not

      return sortDueDate === 1
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
    return res;
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
                onChange={handleChange}
              />
            </div>

            <Dropdown
              id="createTaskPriority"
              label="Priority*"
              value={newData.priority || "-"}
              options={["Low", "Mid", "High"]}
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
                    newData.dueDate ? new Date(newData.dueDate) : new Date()
                  }
                  value={newData.dueDate}
                  placeholderText="YYYY-MM-DD"
                  onChange={(value: Date | null) => {
                    setNewData({
                      ...newData,
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
      <div className="container mx-auto my-10 h-min overflow-hidden overflow-x-auto rounded-xl shadow-sm shadow-indigo-400/10">
        <table className="w-full table-fixed overflow-auto">
          <thead
            id="tasksHeader"
            className="text-md mb-5 bg-slate-200 tracking-widest"
          >
            <tr className="">
              <th className="w-[10%] cursor-pointer p-0 transition-colors hover:bg-slate-300 active:bg-slate-400">
                <button
                  name="completed"
                  onClick={handleOrderChange}
                  className={`h-10 w-full cursor-pointer px-2 transition duration-200`}
                >
                  <FaCheck
                    className={`mx-auto rounded-md border-2 border-black transition duration-300 ${sortCompleted ? "bg-black" : ""}`}
                    size={24}
                    color={sortCompleted ? "#e2e8f0" : "transparent"}
                  />
                </button>
              </th>
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
              <th className="w-[25%] transition-colors hover:bg-slate-300 active:bg-slate-400 sm:w-[20%]">
                <button
                  name="priority"
                  onClick={handleOrderChange}
                  className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 px-1 text-black transition duration-200 md:px-4"
                >
                  <div className="relative size-[20px]">
                    <SortArrows order={sortPriority} />
                  </div>
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
            {sortedTasks.length > 0 &&
              sortedTasks
                .slice((currentPage - 1) * 6, currentPage * 6)
                .map((task) => (
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
        {loading ? (
          <>
            <div className="relative mx-auto my-6 h-16 w-16 text-indigo-400">
              <FaSpinner className="absolute h-full w-full animate-spin" />
            </div>
          </>
        ) : sortedTasks.length === 0 ? (
          <span className="my-4 block w-full text-center text-lg text-slate-700">
            No tasks were found...
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
