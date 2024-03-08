import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  /**
   * Possibly going to be used for checking the API is
   * spun up on render or not from the front end.
   * @returns online: true
   */
  @Get()
  getStatus() {
    return { online: true };
  }
}
