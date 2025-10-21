import React from 'react';

const RadioGroup = ({ label, name, options, selectedValue, onChange }) => {
  return (
    <div className="mb-6">
      {label && <p className="font-bold text-xl text-gray-800 mb-4 border-b border-gray-200 pb-1.5">{label}</p>}
      <div className="flex flex-col gap-3"> {/* radio-group */}
        {options.map((option) => (
          <div
            key={option.value}
            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all duration-200
              ${selectedValue === option.value
                ? 'bg-secondary-light border-accent' // Selected state
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100' // Unselected state
              }`}
            onClick={() => onChange({ target: { name, value: option.value } })}
          >
            <input
              type="radio"
              id={option.value}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              className="w-4 h-4 text-accent focus:ring-accent"
            />
            <label htmlFor={option.value} className="font-medium text-text-primary">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
