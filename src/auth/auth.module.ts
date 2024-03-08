import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { UsersModule } from "src/users/users.module";
import { AuthedGuard } from "./guards/authed/authed.guard";

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, AuthedGuard],
  exports: [AuthedGuard],
})
export class AuthModule {}
