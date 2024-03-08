import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  const jwt = new JwtService();
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    service = new AuthService(jwt);
    controller = new AuthController(service);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
