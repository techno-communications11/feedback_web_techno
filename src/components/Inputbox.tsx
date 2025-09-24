import React from "react";

interface Option {
  id: string | number;
  name: string;
}

interface InputBoxProps {
  type: string;
  text?: string;
  name: string;
  value: string;
  onChange?: (e: any) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  options?: Option[]; // for dropdown
}

function Inputbox({
  type,
  text,
  name,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  options = [],
}: InputBoxProps) {
  if (type === "dropdown") {
    return (
      <select
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`form-select ${error ? "is-invalid" : ""}`}
        disabled={disabled}
        required={required}
      >
        <option value="">{text || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      placeholder={text}
      name={name}
      id={name}
      value={value}
      onChange={(e) => onChange?.(e)}
      className={`form-control ${error ? "is-invalid" : ""}`}
      disabled={disabled}
      required={required}
    />
  );
}

export default Inputbox;
