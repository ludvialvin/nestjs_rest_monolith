import { Module, CacheModule, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { jwtConstants } from '../strategy/constants';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from '../controllers/app.controller';
import { AuthModule } from '../modules/auth.module';
import { LoggerMiddleware } from '../middleware/logger.middleware';
/*import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';*/

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.tokenExpire}
    }),
    CacheModule.register({
      ttl: 10,
      max: 10,
      isGlobal: true
    }),
    PassportModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
  ],
})

export class AppModule  implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
   }
}
