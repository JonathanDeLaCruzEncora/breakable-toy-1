"use client";
import React, { useState } from 'react'

interface DropdownProps {
    id: string;
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

export default function Dropdown({options, value, onChange, label, id}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectOption = (option: string) => {
        onChange(option);
        setIsOpen(false);
    }
    
    const toggleDropdown = (e: React.MouseEvent<HTMLDivElement>): void => {
        setIsOpen((prev) => !prev)
    }

  return (
    <div className=''>
        <label htmlFor={id}>{label}</label>
        <div onClick={toggleDropdown}>
            {value}
        </div>

        {isOpen && (
            <ul>
                {options.map((option, index)=>(
                    <li key={index} onClick={() => handleSelectOption(option)}>
                        {option}
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}
