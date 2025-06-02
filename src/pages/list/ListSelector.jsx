/**
 * The place where you select what tier List you want to create
 */
import React from 'react';

const ListSelector = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex space-x-2 bg-gray-100 p-2 rounded-xl">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                selectedOption === option.value
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-indigo-100'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};


export default ListSelector;
