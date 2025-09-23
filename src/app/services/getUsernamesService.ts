export interface Usernames {
  applicant_uuid: string;
  first_name: string;
  last_name: string;
  ntid: string;
}

export const getAllUserNames = async (): Promise<Usernames[]> => {
  try {
    const res = await fetch(`/api/getusers`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch data");
    return json.data;
  } catch (err: any) {
    console.error("EmployeeService error:", err.message);
    throw err;
  }
};
