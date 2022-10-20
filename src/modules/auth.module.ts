import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../strategy/constants';
import { LocalStrategy } from '../strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../modules/database.module';
import { authProviders } from '../providers/auth.providers';
import { userProviders } from '../providers/user.providers';

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
    ...userProviders,
    AuthService,
    LocalStrategy,
  ]
})
export class AuthModule {}
