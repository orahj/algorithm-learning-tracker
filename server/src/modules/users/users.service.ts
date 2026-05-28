import { Injectable } from '@nestjs/common';
import { CreateLocalUserInput, UsersRepository, UpsertGoogleUserInput } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  createLocalUser(input: CreateLocalUserInput) {
    return this.usersRepository.createLocalUser(input);
  }

  upsertGoogleUser(input: UpsertGoogleUserInput) {
    return this.usersRepository.upsertGoogleUser(input);
  }
}
