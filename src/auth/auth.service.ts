import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  /**
   * Handles the redirect from Google after logging in.
   * @param req
   * @param res
   * @returns Sets cookie on res and redirects to front end.
   */
  handleRedirect(req: Request, res: Response) {
    if (!req.user) {
      return res
        .clearCookie(process.env.JWT_COOKIE_NAME)
        .redirect(`${process.env.FRONT_END_URL}`);
    }

    const token = this.jwt.sign({
      ...req.user,
    });

    return res
      .cookie(process.env.JWT_COOKIE_NAME, token, {
        path: "/",
        domain: process.env.FRONT_END_URL.includes("localhost")
          ? "localhost"
          : ".barrette.dev",
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        secure: true,
      })
      .redirect(`${process.env.FRONT_END_URL}`);
  }

  /**
   * Handles verifying JWT cookies.
   * @param req.
   * @returns JSON object with a "valid" boolean field.
   */
  handleVerify(req: Request) {
    const cookie = req.cookies[process.env.JWT_COOKIE_NAME];

    if (!cookie) {
      return { valid: false };
    }

    if (this.verifyToken(cookie)) {
      return { valid: true };
    } else {
      return {
        valid: false,
      };
    }
  }

  /**
   * Verifies if a given token is valid or not.
   * @param token The token to check.
   * @returns Boolean indicating validity.
   */
  verifyToken(token: string | null | undefined): boolean {
    if (!token) return false;

    try {
      this.jwt.verify(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
