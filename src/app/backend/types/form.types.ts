export interface FormData {
  applicant_uuid: string;
  first_name: string;
  last_name: string;
  NTID: string;
  market_id: string;
  market_manager_firstname: string;
  market_manager_lastname: string;
  HoursWorked: string;
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

export interface MonthData {
  ntid: string;
  month: number;
  year: number;
}

export interface ApiResponse {
  status: number;
  message: string;
  data?: unknown;
  error?: string;
}
