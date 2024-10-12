"use client";
import React, { useState } from "react";
import TaskItem from "./taskItem";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import Modal from "./modal";
import SortArrows from "./sortArrows";
import Dropdown from "./dropdown";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";

import "react-datepicker/dist/react-datepicker.css";

export interface Task {
  id: number;
  completed: boolean;
  name: string;
  priority: string;
  dueDate: string;
}

interface NewTask {
  name: string;
  priority: string;
  dueDate: string;
}

const tempTasks = [
  {
    id: 1,
    completed: false,
    name: "complete projectdddd",
    priority: "High",
    dueDate: "10/21/2024",
  },
  {
    id: 2,
    completed: false,
    name: "complete project2",
    priority: "Mid",
    dueDate: "10/21/2024",
  },
  {
    id: 3,
    completed: true,
    name: "testing testing",
    priority: "Low",
    dueDate: "10/21/2024",
  },
];

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(tempTasks);
  const [orderCompleted, setOrderCompleted] = useState<boolean>(false);
  const [orderName, setOrderName] = useState<number>(0);
  const [orderPriority, setOrderPriority] = useState<number>(0);
  const [orderDueDate, setOrderDueDate] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newData, setNewData] = useState<NewTask>({
    name: "",
    priority: "",
    dueDate: "",
  });
  let nextId = tasks.length + 1;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOrderChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;

    const updateOrder = (
      currentValue: number,
      setState: (value: number) => void,
      otherSet1: (value: number) => void,
      otherSet2: (value: number) => void,
    ) => {
      const newValue = currentValue === 0 ? 1 : currentValue === 1 ? -1 : 0;
      setState(newValue);
      otherSet1(0);
      otherSet2(0);
    };

    switch (name) {
      case "name":
        updateOrder(orderName, setOrderName, setOrderPriority, setOrderDueDate);
        break;
      case "priority":
        updateOrder(
          orderPriority,
          setOrderPriority,
          setOrderName,
          setOrderDueDate,
        );
        break;
      case "dueDate":
        updateOrder(
          orderDueDate,
          setOrderDueDate,
          setOrderPriority,
          setOrderName,
        );
        break;
      default:
        setOrderCompleted((prev) => !prev);
        break;
    }
  };

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
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };
  const handleEditTask = (id: number) => {};

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
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
          <h2 className="mb-6 text-xl font-bold">Create Task</h2>
          <div className="z-50 flex flex-col gap-4">
            <div className="flex items-center">
              <label className="inline-block w-16" htmlFor="nameSearch">
                Name
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
              label="Priority"
              value={newData.priority || "-"}
              options={["Low", "Mid", "High"]}
              onChange={(value) => {
                handleDropdownChange("priority", value);
              }}
            />

            <div className="flex items-center">
              <label className="inline-block w-16" htmlFor="nameSearch">
                Due
              </label>
              <DatePicker
                className="ml-2 inline-block w-40 rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                id="createTaskDate"
                name="dueDate"
                type="date"
                value={newData.dueDate}
                onChange={(value: Date | null) => {
                  setNewData({
                    ...newData,
                    dueDate: value ? value.toISOString().split("T")[0] : "",
                  });
                }}
              />
            </div>

            <button
              onClick={closeModal}
              className="mt-5 flex h-fit cursor-pointer items-center justify-center gap-2 self-end rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300"
            >
              Add Task
            </button>
          </div>
        </Modal>
      )}
      <div className="container my-10 h-min overflow-hidden overflow-x-auto rounded-xl shadow-sm shadow-indigo-400/10">
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
                    className={`mx-auto rounded-md border-2 border-black transition duration-300 ${orderCompleted ? "bg-black" : ""}`}
                    size={24}
                    color={orderCompleted ? "#e2e8f0" : "transparent"}
                  />
                </button>
              </th>
              <th className="w-[30%] transition-colors hover:bg-slate-300 active:bg-slate-400">
                <button
                  name="name"
                  onClick={handleOrderChange}
                  className="flex h-10 w-full cursor-pointer items-center justify-start gap-2 px-1 text-black transition duration-200 md:px-4"
                >
                  <SortArrows order={orderName} />
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
                    <SortArrows order={orderPriority} />
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
                  <SortArrows order={orderDueDate} />
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
            {tasks.map((task) => (
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
      </div>
    </div>
  );
}
