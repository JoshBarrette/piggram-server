import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
  const jwt = new JwtService();
  let service: AuthService;

  beforeEach(async () => {
    service = new AuthService(jwt);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
