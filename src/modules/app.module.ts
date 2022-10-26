import { Module, CacheModule, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { AuthModule } from '../modules/auth.module';
import { Auth } from '../entity/auth.entity';
import { UsersModule } from '../modules/users.module';
import { User, UsersGroup, UserPermission, RefPermissions } from '../entity/user.entity';
import { ArticlesModule } from '../modules/articles.module';
import { Articles } from '../entity/articles.entity';

const config: SqliteConnectionOptions = {
   type: "sqlite",
   database: "db/db.sqlite3",
   entities: [Auth,User,UsersGroup,UserPermission,RefPermissions,Articles],
   synchronize: true
}

@Module({
  imports: [
   TypeOrmModule.forRoot(config),
    CacheModule.register({
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    ArticlesModule
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})

export class AppModule  implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
   }
}
