 export const getyearsService = async (): Promise<number[]> => {
  try {
    const responser = await fetch(`/api/getyears`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await responser.json();

    // data.data is the array of objects [{ year: 2025 }, ...]
    const years = Array.isArray(data.data)
      ? data.data.map((item: { year: number }) => item.year)
      : [];

    return years;
  } catch (error) {
    console.error("Error fetching years:", error);
    return [];
  }
};
