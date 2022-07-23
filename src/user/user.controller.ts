import {
	BadRequestException, Body,
	Controller,
	Get,
	NotFoundException,
	Param, Post, UseGuards
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { UserDTO } from "./dto/user.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	async getAllUsers(): Promise<UserDTO[]> {
		const users = await this.userService.getAllUsers();

		return users.map(({ auth_id, ...user }) => ({
			...user,
			created: user.created.toISOString(),
			modified: user.modified.toISOString()
		}));
	}

	@Get("/:id")
	@ApiResponse({ status: 200, type: UserDTO })
	@ApiResponse({ status: 400 })
	@ApiResponse({ status: 404 })
	async getUser(@Param("id") userId: string): Promise<UserDTO> {
		if (!Number(userId)) {
			throw new BadRequestException();
		}

		const user = await this.userService.getUserByID(Number(userId));

		if (!user) {
			throw new NotFoundException();
		}

		const { id, username, created, modified } = user;

		return {
			id,
			username,
			created: created.toISOString(),
			modified: modified.toISOString()
		};
	}

	@Post()
	@UseGuards(AuthGuard("jwt"))
	async createUser(@Body() body: CreateUserDTO): Promise<UserDTO> {
		const user = await this.userService.createUser(body);

		const { id, username, created, modified } = user;

		return {
			id,
			username,
			created: created.toISOString(),
			modified: modified.toISOString()
		};
	}
}
