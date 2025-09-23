import React from "react";

interface InputBoxProps {
  type: string;
  text: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
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
}: InputBoxProps) {
  // 👇 Dynamically assign class based on size
  // const sizeClass = size === "xs" ? "form-control-xs" : "form-control-sm";

  return (
    <input
      type={type}
      placeholder={text}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`form-control  ${error ? "is-invalid" : ""}`}
      aria-describedby={`${name}Error`}
      aria-invalid={!!error}
      disabled={disabled}
      required={required}
    />
  );
}

export default Inputbox;