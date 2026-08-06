import React from 'react';

const Input = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={name} className='block mb-2 text-sm font-semibold text-gray-700'>
        {label}
      </label>

      <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required = {required}

      className=' w-full
      rounded-xl
      border
      border-gray-300
      px-4
      py-3
      outline-none
      transition-all
      duration-300
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-200'
      />
    </div>
  );
}

export default Input;
