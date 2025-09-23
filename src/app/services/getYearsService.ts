const getyearsService = async (): Promise<number[]> => {
  try {
    const responser = await fetch(`/api/getyears`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await responser.json();
    console.log(data, "ffff");
    return data;
  } catch (error) {
    console.error("Error fetching years:", error);
    return [];
  }
};

export { getyearsService };
