import { cookies } from "next/headers";
import { TokenService } from "../../backend/services/token.service";

export class AuthController {
  static async refreshToken() {
    try {
      // 1. Get refresh token from cookie
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refresh_token")?.value;
      if (!refreshToken) {
        return Response.json({ message: "No refresh token" }, { status: 401 });
      }

      // 2. Verify refresh token
      const payload = TokenService.verifyToken(refreshToken);

      // 3. Create new access token
      const newAccessToken = TokenService.generateAccessToken({
        applicant_uuid: payload.applicant_uuid,
        email: payload.email,
        role:payload.role,
        market_id:payload.market_id
      });

      return Response.json({ token: newAccessToken });
    } catch (err) {
      console.error("Refresh token error:", err);
      return Response.json(
        { message: "Invalid refresh token" },
        { status: 403 }
      );
    }
  }
}
