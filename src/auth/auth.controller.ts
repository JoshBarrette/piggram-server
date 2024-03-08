import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Call this endpoint to login
   */
  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  handleLogin() {}

  /**
   * Handles the redirect from Google after logging in
   * @param req
   * @param res
   * @returns AuthService handler
   */
  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  handleRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.handleRedirect(req, res);
  }

  /**
   * Handles verifying JWT cookies
   * @param req
   * @returns JSON object with a "valid" boolean field
   */
  @Get("verify-jwt")
  handleVerify(@Req() req: Request) {
    return this.authService.handleVerify(req);
  }
}
