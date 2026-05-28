import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProvider, User } from '../entities/user.entity';

export type UpsertGoogleUserInput = {
  email: string;
  displayName: string;
  providerId: string;
  avatarUrl?: string;
};

export type CreateLocalUserInput = {
  email: string;
  displayName: string;
  passwordHash: string;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email: email.toLowerCase() } });
  }

  createLocalUser(input: CreateLocalUserInput) {
    return this.repository.save(
      this.repository.create({
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        passwordHash: input.passwordHash,
        provider: AuthProvider.Local
      })
    );
  }

  async upsertGoogleUser(input: UpsertGoogleUserInput) {
    const existing = await this.findByEmail(input.email);

    if (existing) {
      return this.repository.save({
        ...existing,
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
        provider: AuthProvider.Google,
        providerId: input.providerId
      });
    }

    return this.repository.save(
      this.repository.create({
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
        provider: AuthProvider.Google,
        providerId: input.providerId
      })
    );
  }
}
