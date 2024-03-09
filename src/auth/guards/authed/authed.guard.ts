import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AuthedGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const tokenCookie = req.cookies[process.env.JWT_COOKIE_NAME];

    if (this.authService.verifyToken(tokenCookie)) {
      const token = this.jwt.decode(tokenCookie);
      req.user = { ...token };
      return true;
    }

    return false;
  }
}
