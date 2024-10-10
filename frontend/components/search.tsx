"use client";
import React, { useState } from "react";
import Dropdown from "./dropdown";
import { IoSearchOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

export default function Search() {
  interface FormData {
    name: string;
    priority: string;
    state: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    priority: "All",
    state: "All",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const priorityOptions = ["All", "High", "Medium", "Low"];
  const stateOptions = ["All", "Completed", "Pending"];

  const handleDropdownChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <div className="relative">
        <div
          id="leftGlow"
          className="absolute left-0 top-0 -z-10 h-16 w-36 -translate-y-3/4 rotate-45 bg-indigo-500"
        ></div>
        <div
          id="rightGlow"
          className="absolute right-0 top-0 -z-10 h-16 w-72 translate-x-1/4 translate-y-1/2 bg-indigo-500"
        ></div>

        <section className="relative mx-10 max-w-screen-sm rounded-3xl bg-white bg-opacity-70 sm:mx-auto dark:bg-white dark:bg-opacity-20">
          <form
            className="z-10 flex flex-col items-center px-10 py-10 sm:flex-row sm:justify-between"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-1 flex-col gap-6">
              <div className="">
                <label className="inline-block w-16" htmlFor="nameSearch">
                  Name
                </label>
                <input
                  className="ml-2 inline-block w-80 rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                  placeholder="How is the task called?"
                  id="nameSearch"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <Dropdown
                id="priorityDropdown"
                label="Priority"
                options={priorityOptions}
                value={formData.priority}
                onChange={(value) => handleDropdownChange("priority", value)}
              />
              <Dropdown
                id="stateDropdown"
                label="State"
                options={stateOptions}
                value={formData.state}
                onChange={(value) => handleDropdownChange("state", value)}
              />
            </div>

            <button
              className="mt-6 h-fit cursor-pointer rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-right text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300 sm:m-0"
              type="submit"
            >
              Search
              <FiSearch
                className="my-1 ml-2 inline-block"
                size={20}
                color="white"
              />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
