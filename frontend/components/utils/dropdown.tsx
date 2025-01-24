"use client";
import React, { useEffect, useRef, useState } from "react";

import { IoIosArrowDown } from "react-icons/io";

interface DropdownProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
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
        className={`ml-2 flex w-40 cursor-pointer justify-between rounded-md border border-slate-300 bg-white bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider hover:border-slate-400 hover:from-white hover:to-white ${isOpen ? "outline-none ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-800" : ""} dark:border-slate-400 dark:from-slate-700 dark:to-slate-800 dark:placeholder:text-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-700 dark:focus:bg-slate-700 dark:focus:ring-offset-slate-800`}
      >
        <button
          id={id}
          className="h-full w-full text-left"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {value}
        </button>
        <IoIosArrowDown className="inline-block" size={24} />
      </div>

      {isOpen && (
        <ul
          className={`absolute bottom-0 left-0 z-10 mt-2 w-40 translate-x-[4.5rem] translate-y-full divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-100 bg-white object-cover tracking-wider shadow-lg dark:divide-slate-400 dark:border-slate-600 dark:bg-slate-800`}
          role="listbox"
        >
          {options.map((option) => (
            <DropdownItem
              key={option}
              option={option}
              onSelect={handleSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const DropdownItem = ({
  option,
  onSelect,
}: {
  option: string;
  onSelect: (option: string) => void;
}) => (
  <li
    className="cursor-pointer select-none px-4 py-1 first:pt-2 last:pb-2 hover:bg-slate-100 dark:hover:bg-slate-600"
    onClick={() => onSelect(option)}
    role="option"
  >
    {option}
  </li>
);

export default Dropdown;
