import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/user.controller';
import { User, UsersGroup, UserPermission, RefPermissions } from '../entity/user.entity';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
   imports: [
      TypeOrmModule.forFeature([User]),
      TypeOrmModule.forFeature([UsersGroup]),
      TypeOrmModule.forFeature([UserPermission]),
      TypeOrmModule.forFeature([RefPermissions])
   ],
   controllers: [UsersController],
   providers: [UsersService,JwtStrategy]
})
export class UsersModule {}
