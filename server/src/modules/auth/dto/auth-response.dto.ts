import { AuthenticatedUser } from '../types/authenticated-user.type';

export class AuthResponseDto {
  accessToken: string;
  user: AuthenticatedUser;
}
