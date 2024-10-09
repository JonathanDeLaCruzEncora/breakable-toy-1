"use client";
import React, { useState } from 'react'
import Dropdown from './dropdown';

export default function Search() {
    interface FormData {
        name: string;
        priority: string;
        state: string;
    }

    const [formData, setFormData] = useState<FormData>({
        name:'',
        priority: 'All',
        state:'All',
    })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const priorityOptions = ['All', 'High', 'Medium', 'Low']
    const stateOptions = ['All', 'Completed', 'Pending']
    
    const handleDropdownChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    }

  return (
    <>
    <div className='relative'>
        <div id='leftGlow' className='w-72 bg-emerald-500 h-24  absolute top-0 rotate-45 left-0  -translate-y-3/4 '></div>
        <div id='rightGlow' className='w-72 bg-emerald-500 h-24 absolute top-0 -rotate-45 right-0   -translate-y-3/4 '></div>

        <section className=' max-w-screen-sm  mx-10 sm:mx-auto rounded-3xl bg-opacity-70  border-white border-2 bg-gradient-to-r from-white to-gray-50/50   relative'>
            <form 
                className='flex justify-between items-center px-10 py-10 z-10 ' 
                onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nameSearch">Name</label>
                    <input
                        className='ml-4 rounded-sm px-2 py-1 border-none bg-gradient-to-r from-slate-200/50 to-slate-50 placeholder:text-sm focus:bg-none'
                        placeholder='How is the task called?'
                        id='nameSearch'
                        name = 'name'
                        type='text'
                        value = {formData.name}
                        onChange={handleInputChange}
                    />
                    <Dropdown 
                        id = "priorityDropdown"
                        label = "Priority" 
                        options = {priorityOptions}
                        value = {formData.priority}
                        onChange= {(value) => handleDropdownChange("priority", value)}
                    />
                    <Dropdown
                        id = "stateDropdown"
                        label = "State" 
                        options = {stateOptions}
                        value = {formData.state}
                        onChange= {(value) => handleDropdownChange("state", value)}    
                    />
                </div>
                

                <button className='text-right h-fit text-lg shadow-lg shadow-emerald-400/50 text-white font-semibold bg-emerald-400 px-4 py-1 rounded-full border-2 border-emerald-400 cursor-pointer transition ease-in-out hover:bg-emerald-500 hover:border-emerald-500 active:border-emerald-600 active:bg-emerald-600 active:shadow-emerald-300' type='submit'>
                    Search
                </button>
            </form>
        </section>
    </div>
    </>
  )
}
