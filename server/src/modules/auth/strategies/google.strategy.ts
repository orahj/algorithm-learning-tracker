import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || 'google-client-id-not-configured';
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || 'google-client-secret-not-configured';
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:4000/api/auth/google/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('Google account did not return an email address'));

    const user = await this.usersService.upsertGoogleUser({
      email,
      providerId: profile.id,
      displayName: profile.displayName || email,
      avatarUrl: profile.photos?.[0]?.value
    });

    done(null, {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    });
  }
}
