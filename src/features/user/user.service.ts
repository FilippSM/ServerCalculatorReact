import type { User } from "@prisma/client";
import { NotFoundError } from "../../shared/errors/index.js";
import type { UserRepository } from "./user.repository.js";
import type { CreateUserInput, UpdateUserInput } from "./user.schemas.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(`User with id "${id}" not found`);
    }

    return user;
  }

  async create(data: CreateUserInput): Promise<User> {
    return this.userRepository.create(data);
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    await this.getById(id);
    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<User> {
    await this.getById(id);
    return this.userRepository.delete(id);
  }
}
