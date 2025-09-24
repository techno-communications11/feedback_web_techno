export interface FormData {
  applicant_uuid: string;
  first_name: string;
  last_name: string;
  NTID: string;
  market_manager_firstname: string;
  market_manager_lastname: string;
  HoursWorked: string;
  BoxesCompleted: string;
  AccessorySold: string;
  FeatureRevenue: string;
  CSAT: string;
  DayActivationRetention155: string;
  DayFeatureMRCRetention155: string;
}

export interface MonthData {
  applicant_uuid: string;
  month: number;
  year: number;
}

export interface ApiResponse {
  status: number;
  message: string;
  data?: unknown;
  error?: string;
}
