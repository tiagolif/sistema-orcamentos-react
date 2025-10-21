import React from 'react';

const Input = ({ className = '', ...props }) => {
  const baseStyles = "flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20";

  return (
    <input
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;
