export const dumpFormData = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/dumpform_data", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Import failed" };
    }

    return { success: true, message: "Users imported successfully!" };
  } catch (error) {
    console.error("Error importing users:", error);
    return { success: false, message: "Server error while importing" };
  }
};
