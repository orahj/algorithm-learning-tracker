import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthenticatedUser } from './types/authenticated-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('An account with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.createLocalUser({
      email,
      displayName: dto.displayName,
      passwordHash
    });

    return this.createAuthResponse(this.toAuthenticatedUser(user));
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (!user?.passwordHash) throw new UnauthorizedException('Invalid email or password');

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) throw new UnauthorizedException('Invalid email or password');

    return this.createAuthResponse(this.toAuthenticatedUser(user));
  }

  createAuthResponse(user: AuthenticatedUser) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        email: user.email
      }),
      user
    };
  }

  getClientAuthRedirectUrl(accessToken: string) {
    const clientUrl = this.configService.get<string>('CLIENT_URL') ?? 'http://localhost:5173';
    return `${clientUrl}/auth/callback?token=${encodeURIComponent(accessToken)}`;
  }

  private toAuthenticatedUser(user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    };
  }
}
