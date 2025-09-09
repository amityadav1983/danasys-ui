// components/InputField.tsx
import React from "react";

type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const InputField: React.FC<Props> = ({ label, type = "text", value, onChange, required }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
};

export default InputField;
