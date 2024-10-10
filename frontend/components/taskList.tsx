"use client";
import React, { useState } from "react";
import TaskItem from "./taskItem";
import { FaArrowDownZA, FaArrowUpAZ, FaCheck } from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FaArrowUpZA } from "react-icons/fa6";
import { FaArrowDownAZ } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";
import { FaArrowUpLong } from "react-icons/fa6";

export interface Task {
  id: number;
  completed: boolean;
  name: string;
  priority: string;
  dueDate: string;
}

interface OrderParams {
  completed: boolean;
  name: number;
  priority: number;
  dueDate: number;
}

const tempTasks = [
  {
    id: 1,
    completed: false,
    name: "complete project",
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
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>("");
  let nextId = tasks.length + 1;

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

  const handleAddTask = () => {
    if (newTaskName.trim() !== "" && newTaskDueDate.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: nextId,
          name: newTaskName,
          completed: false,
          priority: "Low",
          dueDate: newTaskDueDate,
        },
      ]);
      setNewTaskDueDate("");
      setNewTaskName("");
      nextId++;
    }
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
    <section className="z-10 flex justify-center overflow-x-auto">
      <table className="mx-10 my-20 w-full table-auto">
        <thead id="tasksHeader" className="">
          <tr className="text-md tracking-widest sm:text-lg">
            <th>
              <button
                name="completed"
                onClick={handleOrderChange}
                className={`mx-auto mb-5 flex h-10 cursor-pointer items-center justify-center rounded-xl px-2 transition duration-200 hover:scale-105 hover:shadow-lg ${orderCompleted ? "bg-indigo-400" : "bg-slate-600"}`}
              >
                <FaCheck
                  className={`rounded-md border-2 border-white transition duration-300 ${orderCompleted ? "bg-indigo-400" : ""}`}
                  size={24}
                  color={orderCompleted ? "white" : "transparent"}
                />
              </button>
            </th>
            <th className="pl-1 sm:pl-2">
              <button
                name="name"
                onClick={handleOrderChange}
                className="mb-5 flex h-10 w-full cursor-pointer items-center justify-between rounded-xl bg-slate-600 px-1 text-white transition duration-200 hover:scale-105 hover:shadow-lg md:px-4"
              >
                Name
                <div className="relative size-[24px]">
                  <FaArrowUpAZ
                    size={24}
                    className={`${orderName === 1 ? "opacity-100" : "opacity-0"} absolute transition duration-300`}
                  />
                  <FaArrowDownZA
                    size={24}
                    className={`${orderName === -1 ? "opacity-100" : "opacity-0"} absolute transition duration-300`}
                  />
                </div>
              </button>
            </th>
            <th className="pl-1 sm:pl-2">
              <button
                name="priority"
                onClick={handleOrderChange}
                className="mb-5 flex h-10 w-full cursor-pointer items-center justify-between rounded-xl bg-slate-600 px-1 text-white transition duration-200 hover:scale-105 hover:shadow-lg md:px-4"
              >
                Priority
                <div className="relative size-[24px]">
                  <FaArrowUpWideShort
                    size={24}
                    className={`${orderPriority === 1 ? "opacity-100" : "opacity-0"} absolute transition duration-300`}
                  />
                  <FaArrowDownShortWide
                    size={24}
                    className={`${orderPriority === -1 ? "opacity-100" : "opacity-0"} absolute transition duration-300`}
                  />
                </div>
              </button>
            </th>
            <th className="pl-1 sm:pl-2">
              <button
                name="dueDate"
                onClick={handleOrderChange}
                className="mb-5 flex h-10 w-full min-w-[7.5rem] cursor-pointer items-center justify-between rounded-xl bg-slate-600 px-1 text-white transition duration-200 hover:scale-105 hover:shadow-lg md:px-4"
              >
                Due Date
                <div className="relative size-[24px]">
                  <FaArrowUpLong
                    size={24}
                    className={`${orderDueDate === 1 ? "opacity-100" : "opacity-0"} absolute p-0.5 transition duration-300`}
                  />
                  <FaArrowDownLong
                    size={24}
                    className={`${orderDueDate === -1 ? "opacity-100" : "opacity-0"} absolute p-0.5 transition duration-300`}
                  />
                </div>
              </button>
            </th>
            <th className="pl-1 sm:pl-2">
              <div className="mb-5 flex h-10 w-full select-none items-center justify-center rounded-xl bg-slate-600 px-1 text-white md:px-4">
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
    </section>
  );
}
