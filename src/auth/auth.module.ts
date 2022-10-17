import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './strategy/constants';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { authProviders, refPermissionsProviders } from './auth.providers';
import { userProviders, userGroupProviders, userPermissionsProviders } from '../user/user.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.tokenExpire },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...authProviders,
    ...refPermissionsProviders,
    ...userProviders,
    ...userGroupProviders,
    ...userPermissionsProviders,
    AuthService,
    LocalStrategy,
  ]
})
export class AuthModule {}
