export interface UserData {
  email: string;
  password: string;
  role?: 'employee' | 'admin' | 'market_manager';
  ntid:string
}
