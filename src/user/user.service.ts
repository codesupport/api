import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
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

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.auth_id = createUserDto.auth_id;
    user.username = createUserDto.username;

    return this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUserByID(id);

    user.auth_id = updateUserDto.auth_id || user.auth_id;
    user.username = updateUserDto.username || user.username;

    return this.usersRepository.save(user);
  }
}
