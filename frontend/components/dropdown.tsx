"use client";
import React, { useEffect, useRef, useState } from "react";

import { IoIosArrowDown } from "react-icons/io";

interface DropdownProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function Dropdown({
  options,
  value,
  onChange,
  label,
  id,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLDivElement>): void => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false); // Close the dropdown if clicked outside
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <label className="inline-block w-16" htmlFor={id}>
        {label}
      </label>
      <div
        className={`ml-2 flex w-40 cursor-pointer justify-between rounded-md border border-slate-300 bg-white bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider hover:border-slate-400 hover:from-white hover:to-white ${isOpen ? "outline-none ring-2 ring-indigo-400 ring-offset-2" : ""}`}
        onClick={toggleDropdown}
      >
        {value}
        <IoIosArrowDown className="inline-block" size={24} />
      </div>

      {isOpen && (
        <ul
          className={`absolute bottom-0 left-0 z-10 mt-2 w-40 translate-x-[4.5rem] translate-y-full divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-100 bg-white object-cover tracking-wider shadow-lg`}
        >
          {options.map((option, index) => (
            <li
              className="cursor-pointer select-none px-4 py-1 first:pt-2 last:pb-2 hover:bg-slate-100"
              key={index}
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
