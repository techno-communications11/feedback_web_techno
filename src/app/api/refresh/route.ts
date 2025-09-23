import  {AuthController}  from "../../backend/controllers/refreshtoken.controller";

export async function GET() {
  return AuthController.refreshToken();
}
