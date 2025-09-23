// ./form-validation.ts
import { FormData, FormErrors } from "./form.types";
import { requiredFields, numberFields } from "./form.types";

const validation = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  requiredFields.forEach((field) => {
    if (!formData[field as keyof FormData]?.trim()) {
      errors[field] = `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
    }
  });

  // Numeric fields validation

  numberFields.forEach((field) => {
    const value = formData[field as keyof FormData];
    if (!value || value.trim() === "") {
      errors[field] = `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
    } else if (isNaN(Number(value))) {
      errors[field] = `${field
        .replace(/([A-Z])/g, " $1")
        .trim()} must be a number`;
    }
  });

  return errors;
};

export default validation;
