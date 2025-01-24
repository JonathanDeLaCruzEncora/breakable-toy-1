import React from "react";
import SortArrows from "../utils/sortArrows";
import { useApp } from "../AppContext";

const headerButton = (
  name: string,
  displayText: string,
  order: number,
  handleOrderChange: (e: React.MouseEvent<HTMLButtonElement>) => void,
) => (
  <button
    name={name}
    onClick={handleOrderChange}
    className="flex h-10 w-full cursor-pointer items-center justify-start gap-2 px-1 text-black transition duration-200 md:px-4 dark:text-white"
  >
    <SortArrows order={order} />
    {displayText}
  </button>
);

const TableHeader: React.FC = () => {
  const {
    sortName,
    sortPriority,
    sortDueDate,
    sortCompleted,
    setSortName,
    setSortPriority,
    setSortDueDate,
    setSortCompleted,
  } = useApp();

  const handleOrderChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;

    const updateSortState = (
      sortState: number,
      setSortState: (value: number) => void,
    ) => {
      const newValue = sortState === 0 ? 1 : sortState === 1 ? -1 : 0;
      setSortState(newValue);
    };

    switch (name) {
      case "name":
        updateSortState(sortName, setSortName);
        setSortPriority(0);
        setSortDueDate(0);
        break;
      case "priority":
        updateSortState(sortPriority, setSortPriority);
        setSortName(0);
        break;
      case "dueDate":
        updateSortState(sortDueDate, setSortDueDate);
        setSortName(0);
        break;
      default:
        setSortCompleted(!sortCompleted);
        break;
    }
  };

  const headers = [
    { name: "name", displayText: "Name", order: sortName, width: "30%" },
    {
      name: "priority",
      displayText: "Priority",
      order: sortPriority,
      width: "25%",
    },
    {
      name: "dueDate",
      displayText: "Due Date",
      order: sortDueDate,
      width: "20%",
    },
  ];

  return (
    <thead
      id="tasksHeader"
      className="text-md mb-5 bg-slate-200 tracking-widest dark:bg-slate-800"
    >
      <tr>
        <th className="w-[10%] p-0"></th>
        {headers.map((header) => (
          <th
            key={header.name}
            className={`w-[${header.width}] transition-colors hover:bg-slate-300 active:bg-slate-400 dark:hover:bg-slate-900 dark:active:bg-slate-950`}
          >
            {headerButton(
              header.name,
              header.displayText,
              header.order,
              handleOrderChange,
            )}
          </th>
        ))}
        <th className="w-[15%] sm:w-[20%]">
          <div className="flex h-10 w-full select-none items-center justify-center rounded-xl px-1 text-black md:px-4 dark:text-white">
            Actions
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
