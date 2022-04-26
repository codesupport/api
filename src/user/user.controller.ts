import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/:id")
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 200, type: UserDto })
  async getUser(@Param("id") userId: string): Promise<UserDto> {
    const user = await this.userService.getUserByID(Number(userId));
    if (!user) {
      throw new NotFoundException();
    }

    const { id, username, created, modified } = user;
    return {
      id,
      username,
      created: created.toISOString(),
      modified: modified.toISOString(),
    };
  }
}
