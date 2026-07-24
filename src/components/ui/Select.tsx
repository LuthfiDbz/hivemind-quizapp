import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ options, value, onChange, placeholder = "Select...", className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex justify-between items-center bg-white border-4 border-black p-3 font-bold text-black text-lg outline-none transition-all cursor-pointer",
          "shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg",
          "active:translate-x-1 active:translate-y-1 active:shadow-none",
          isOpen && "-translate-x-0.5 -translate-y-0.5 shadow-neo-lg bg-neo-pink"
        )}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={cn("transition-transform border-2 border-transparent", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-2 text-black bg-white border-4 border-black max-h-60 overflow-y-auto shadow-neo-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "p-3 font-bold cursor-pointer hover:bg-neo-blue hover:text-white border-b-4 border-black last:border-b-0 transition-colors",
                value === option.value && "bg-neo-yellow text-black hover:bg-neo-yellow hover:text-black"
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
