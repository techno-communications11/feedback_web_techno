import { useState } from "react";
// import { VIOLATIONS } from "@/constants/writeup.constants";

export const useFormData = (companyName?: string) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    date: "",
    supervisorName: "",
    location: "",
    company: companyName || "Default Company",
    warningType: [] as string[],
    violation: [] as string[],
    companyStatement: "",
    disagree: "",
    otherViolationText: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const key = name === "warningType" ? "warningType" : "violation";
      setFormData((prev) => ({
        ...prev,
        [key]: checked
          ? [...prev[key], value]
          : prev[key].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isOtherViolationSelected = formData.violation.includes("Others (If Any):");

  return { formData, handleChange, isOtherViolationSelected };
};
