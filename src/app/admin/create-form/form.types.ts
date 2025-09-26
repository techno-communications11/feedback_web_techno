export interface FormData {
  first_name: string;
  last_name: string;
  NTID: string;
  market_id:string
  market_manager_firstname: string;
  market_manager_lastname: string;
  HoursWorked: string
  BoxesCompleted: string;
  AccessorySold: string;
  FeatureRevenue: string;
  CSAT: string;
  DayActivationRetention35: string;
  DayFeatureMRCRetention35: string;
  DayActivationRetention65: string;
  DayFeatureMRCRetention65: string;
  DayActivationRetention95: string;
  DayFeatureMRCRetention95: string;
  DayActivationRetention125: string;
  DayFeatureMRCRetention125: string;
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
  { name: "market_manager_firstname", text: "First Name" },
  { name: "market_manager_lastname", text: "Last Name" },
];

export const performanceFields = [
  { name: "HoursWorked", text: "Hours Worked" },
  { name: "BoxesCompleted", text: "Boxes Completed" },
  { name: "AccessorySold", text: "Accessory Sold" },
  { name: "FeatureRevenue", text: "Feature Revenue" },
  { name: "CSAT", text: "CSAT" },
  { name: "DayActivationRetention35", text: "35 Day Activation Retention" },
  { name: "DayFeatureMRCRetention35", text: "35 Day Feature MRC Retention" },
  { name: "DayActivationRetention65", text: "65 Day Activation Retention" },
  { name: "DayFeatureMRCRetention65", text: "65 Day Feature MRC Retention" },
  { name: "DayActivationRetention95", text: "95 Day Activation Retention" },
  { name: "DayFeatureMRCRetention95", text: "95 Day Feature MRC Retention" },
  { name: "DayActivationRetention125", text: "125 Day Activation Retention" },
  { name: "DayFeatureMRCRetention125", text: "125 Day Feature MRC Retention" },
  { name: "DayActivationRetention155", text: "155 Day Activation Retention" },
  { name: "DayFeatureMRCRetention155", text: "155 Day Feature MRC Retention" },
];
export const numberFields = [
  "market_id",
  "HoursWorked",
  "BoxesCompleted",
  "AccessorySold",
  "FeatureRevenue",
  "CSAT",
  "DayActivationRetention35",
  "DayFeatureMRCRetention35",
  "DayActivationRetention65",
  "DayFeatureMRCRetention65",
  "DayActivationRetention95",
  "DayFeatureMRCRetention95",
  "DayActivationRetention125",
  "DayFeatureMRCRetention125",
  "DayActivationRetention155",
  "DayFeatureMRCRetention155",
];

// Required text fields
export const requiredFields = [
  "first_name",
  "last_name",
  "NTID",
  "market_id",
  "market_manager_firstname",
  "market_manager_lastname",
];
