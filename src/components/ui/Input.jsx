import React from 'react';

const Input = ({ label, id, className = '', error, ...props }) => {
  const baseStyles = "flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20";

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={id} className="text-sm font-medium mb-1">{label}</label>}
      <input
        id={id}
        className={`${baseStyles} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default Input;
