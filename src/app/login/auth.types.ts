// types/auth.types.ts
export interface Credentials {
  email: string;
  password: string;
}

export interface LoginProps {
  updateAuth: (isAuth: boolean, role: string, id: string) => void;
}


export interface RegisterUser {
  email: string;
  password: string;
  confirmPassword: string;
  ntid: string;
  market: number | null;
  role: string;
}

export interface RegisterErrors {
  email: string;
  password: string;
  confirmPassword: string;
  ntid: string;
  market: string;
  role: string;
}