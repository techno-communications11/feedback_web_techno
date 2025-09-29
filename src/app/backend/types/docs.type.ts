import { RowDataPacket } from "mysql2/promise";
 export interface WriteUpDocs extends RowDataPacket {
  writeup_uuid: string;
  ntid: string;
  document_url: string;
  created_at: Date;
}