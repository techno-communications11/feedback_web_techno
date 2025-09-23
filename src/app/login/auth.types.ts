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
  role: string;
}