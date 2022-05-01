import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO as UpdateUserDTO } from "./dto/update-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
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

	createUser(createUserDTO: CreateUserDTO): Promise<User> {
		const user = new User();

		user.auth_id = createUserDTO.auth_id;
		user.username = createUserDTO.username;

		return this.usersRepository.save(user);
	}

	async updateUser(id: number, updateUserDTO: UpdateUserDTO) {
		let user = await this.getUserByID(id);

		user = { ...user, ...updateUserDTO };

		return this.usersRepository.save(user);
	}
}
