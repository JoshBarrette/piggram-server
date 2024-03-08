import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AuthedGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const tokenCookie = req.cookies[process.env.JWT_COOKIE_NAME];

    if (this.authService.verifyToken(tokenCookie)) {
      return true;
    }

    return false;
  }
}
