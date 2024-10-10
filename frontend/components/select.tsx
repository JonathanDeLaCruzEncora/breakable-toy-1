import React from 'react'

interface SelectProps{
    id: string;
    label: string;
    name: string;
    value: string;
    options: string[];
    onChange: (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function Select({id, name, label, value, options, onChange}: SelectProps) {
  return (
    <div>
        <label htmlFor={id}>{label}</label>
        <select
            className='bg-white'
            id = {id}
            name= {name}
            value={value}
            onChange={onChange}
        >
            {options.map((option,i)=> (
                <option key={i}>{option}</option>
            ))}
        </select>
    </div>
  )
}
