import React, { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ options, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: SelectOption) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2 bg-white border rounded-sm cursor-pointer" onClick={toggleDropdown}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0-9 17 17"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-sm shadow-lg">
          {options.map((option, index) => (
            <div key={index} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => selectOption(option)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;