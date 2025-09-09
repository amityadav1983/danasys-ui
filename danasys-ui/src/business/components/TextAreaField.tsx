// components/TextAreaField.tsx
import React from "react";

type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
};

const TextAreaField: React.FC<Props> = ({ label, value, onChange, required }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
};

export default TextAreaField;
