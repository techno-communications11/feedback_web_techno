export interface FormData {
  first_name: string;
  last_name: string;
  NTID: string;
  Marketmanagerfirst_name: string;
  Marketmanagerlast_name: string;
  HoursWorked: string;
  BoxesCompleted: string;
  AccessorySold: string;
  FeatureRevenue: string;
  CSAT: string;
  DayActivationRetention155: string;
  DayFeatureMRCRetention155: string;
}

export interface FormErrors {
  [key: string]: string;
}
export interface ApiResponse {
  status: number;
  message: string;
  data?: unknown;
  error?: string;
}

export const employeeFields = [
  { name: "first_name", text: "First Name" },
  { name: "last_name", text: "Last Name" },
];

export const marketManagerFields = [
  { name: "Marketmanagerfirst_name", text: "First Name" },
  { name: "Marketmanagerlast_name", text: "Last Name" },
];

export const performanceFields = [
  { name: "HoursWorked", text: "Hours Worked" },
  { name: "BoxesCompleted", text: "Boxes Completed" },
  { name: "AccessorySold", text: "Accessory Sold" },
  { name: "FeatureRevenue", text: "Feature Revenue" },
  { name: "CSAT", text: "CSAT" },
  { name: "DayActivationRetention155", text: "155 Day Activation Retention" },
  { name: "DayFeatureMRCRetention155", text: "155 Day Feature MRC Retention" },
];
export const numberFields = [
  "HoursWorked",
  "BoxesCompleted",
  "AccessorySold",
  "FeatureRevenue",
  "CSAT",
  "DayActivationRetention155",
  "DayFeatureMRCRetention155",
];

// Required text fields
export const requiredFields = [
  "first_name",
  "last_name",
  "NTID",
  "Marketmanagerfirst_name",
  "Marketmanagerlast_name",
];
