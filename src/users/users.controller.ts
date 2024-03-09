import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./schemas/user.schema";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile/:id")
  async getProfile(@Param() { id }: { id: string }) {
    return await this.usersService.handleGetProfile(id);
  }
}
