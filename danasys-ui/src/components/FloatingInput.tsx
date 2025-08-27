import React, { useState } from "react";
import { Input } from "./ui/input";

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <div className="relative bg-white rounded-xl">
        {/* Top border */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            focused ? "bg-blue-500" : "bg-blue-200"
          }`}
        />
        {/* Bottom border */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            focused ? "bg-blue-500" : "bg-blue-200"
          }`}
        />
        {/* Left border */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
            focused ? "bg-blue-500" : "bg-blue-200"
          }`}
        />
        {/* Right border */}
        <div
          className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
            focused ? "bg-blue-500" : "bg-blue-200"
          }`}
        />

        {/* Floating Label */}
        <div
          className={`absolute left-4 bg-white px-2 text-gray-500 font-medium transition-all duration-200 ${
            focused || value
              ? "-top-2 text-xs text-blue-500"
              : "top-3 text-sm"
          }`}
        >
          {label}
        </div>

        {/* Input */}
        <Input
  type={type}
  value={value}
  onChange={onChange}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
  required={required}
  placeholder=""
  className="!border-none !outline-none focus:!border-none focus:!ring-0 focus:!outline-none shadow-none px-4 py-3 pt-4 rounded-xl"
/>

      </div>
    </div>
  );
};

export default FloatingInput;
