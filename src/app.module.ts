import { Module, CacheModule } from '@nestjs/common';
import { jwtConstants } from './auth/strategy/constants';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
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
export class AppModule {}
