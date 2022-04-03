import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
}
