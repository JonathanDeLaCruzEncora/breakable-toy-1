import React from "react";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

export default function SortArrows({ order }: { order: number }) {
  return (
    <div className="relative size-[20px]">
      <FaSortUp
        size={20}
        className={`${order === -1 ? "opacity-100" : "opacity-0"} absolute transition duration-300`}
      />
      <FaSortDown
        size={20}
        className={`${order === 1 ? "opacity-100" : "opacity-0"} absolute transition duration-300`}
      />
      <FaSort
        size={20}
        className={`${order === 0 ? "opacity-100" : "opacity-0"} absolute transition duration-300`}
      />
    </div>
  );
}
