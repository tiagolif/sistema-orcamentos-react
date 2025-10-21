import React from 'react';

const ToggleSwitch = ({ id, checked, onChange, label }) => {
  return (
    <div className="flex items-center">
      {label && <label htmlFor={id} className="mr-3 text-sm font-medium text-text-primary">{label}</label>}
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            checked={checked}
            onChange={onChange}
          />
          <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              checked ? 'translate-x-full bg-accent' : ''
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
