import * as React from "react"
import { cn } from "../../lib/utils"

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({ isOpen, onClose, title, children, className, ...props }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative z-10 w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
          "p-6 transform transition-all",
          className
        )}
        {...props}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-neo-pink border-2 border-black font-bold text-xl hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-black mb-4 pr-8 border-b-4 border-black pb-2">{title}</h2>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
