import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { jwtConstants } from '../config/constants';
import { LocalStrategy } from '../strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { Auth } from '../entity/auth.entity';
import { UsersModule } from '../modules/users.module';
import { UsersService } from '../services/users.service';
import { User, UsersGroup, UserPermission, RefPermissions } from '../entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
   UsersModule,
   PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.tokenExpire },
    }),
    TypeOrmModule.forFeature([Auth]),
   TypeOrmModule.forFeature([User]),
   TypeOrmModule.forFeature([UsersGroup]),
   TypeOrmModule.forFeature([UserPermission]),
   TypeOrmModule.forFeature([RefPermissions])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
  ]
})
export class AuthModule {}
