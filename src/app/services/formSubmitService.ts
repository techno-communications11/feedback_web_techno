import { FormData } from "../admin/create-form/form.types";
import { ApiResponse } from "../admin/create-form/form.types";


export const submitEmployeeForm = async (
  formData: FormData
): Promise<ApiResponse> => {
  try {
    const response = await fetch("/api/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: response.status,
        message: data.message || "Failed to submit form",
        error: data.error || "Unknown error",
      };
    }

    return {
      status: response.status,
      message: data.message || "Form submitted successfully",
      data: data.data,
    };
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Network or server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
