import { RowDataPacket } from "mysql2/promise";
export interface EvaluationRow extends RowDataPacket {
  form_uuid: string;
  first_name: string;
  last_name: string;
  ntid: string;
  market_id: number;
  market_name: string;
  market_manager_firstname: string;
  market_manager_lastname: string;
  hours_worked: number;
  boxes_completed: number;
  accessories_sold: number;
  feature_revenue: number;
  csat: number;
  day_35_activation_retention: number;
  day_35_future_mrc_retention: number;
  day_65_activation_retention: number;
  day_65_future_mrc_retention: number;
  day_95_activation_retention: number;
  day_95_future_mrc_retention: number;
  day_125_activation_retention: number;
  day_125_future_mrc_retention: number;
  day_155_activation_retention: number;
  day_155_future_mrc_retention: number;
  form_created_at: string; // can use Date if you parse it later
  comment_id: number | null;
  comment_text: string | null;
  manager_comment: string | null;
  form_uuid_comment: string | null;
  comment_created_at: string | null; // can use Date if you parse it later
}


export interface WriteupRow extends RowDataPacket {
  writeup_uuid: string;
  ntid: string;
  first_name: string;
  last_name: string;
  market_id: number;
  market_name: string;
  document_url: string;
  writeup_created_at: Date;
}
