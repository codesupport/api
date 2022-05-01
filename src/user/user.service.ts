import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO as UpdateUserDTO } from "./dto/update-user.dto";
import { User } from "./user.entity";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private authService: AuthService
	) {}

	getUserByID(id: number): Promise<User> {
		return this.usersRepository.findOne({ where: { id } });
	}

	getUserByAuthID(auth_id: string): Promise<User> {
		return this.usersRepository.findOne({ where: { auth_id } });
	}

	getAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

	async createUser(createUserDTO: CreateUserDTO): Promise<User> {
		const user = new User();

		user.auth_id = createUserDTO.auth_id;
		user.username = createUserDTO.username;

		if (!await this.authService.isUserValid(user.auth_id, user.username)) {
			throw new ConflictException("A user with this auth ID either does not exist or match the given username.");
		}

		return this.usersRepository.save(user);
	}

	async updateUser(id: number, updateUserDTO: UpdateUserDTO) {
		let user = await this.getUserByID(id);

		user = { ...user, ...updateUserDTO };

		return this.usersRepository.save(user);
	}
}
