// services/ValidationService.ts
export class ValidationService {
  static validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) throw new Error("Invalid email format");
  }

  static validatePassword(password: string) {
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
  }
}
