import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entity/auth.entity';
import { UsersService } from '../services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/constants';

@Injectable()
export class AuthService {
   constructor(
      @InjectRepository(Auth) private authRepository: Repository<Auth>,
      private usersService: UsersService,
      private jwtService: JwtService
   ) { }

   async validateUser(username: string, password: string): Promise<any> {   
      const user = await this.usersService.findByEmail(username);
      if (user) {
         const isMatch = await bcrypt.compare(password, user.password);
			
			if(isMatch){
				return user;
			}else{
				return null;
			}
      }
      return null;
   }

   async login(user: any) {
      const payloadToken = { 
         username: user.email, 
         sub: user.id, 
         userGroupId: user.userGroupId
      };
       
      var expirydate = new Date();
      expirydate.setDate(expirydate.getDate() + jwtConstants.refreshTokenExpire);
      expirydate.toISOString();
   
      const payloadRefreshToken = { sub: user.id, expireIn: expirydate };
   
      const accessToken = this.jwtService.sign(payloadToken)
      const refreshAccessToken = this.jwtService.sign(payloadRefreshToken)
   
      const dataLogToken = {
         user_id: user.id,
         token: accessToken,
         refresh_token: refreshAccessToken
      }

      const logToken = this.logToken(dataLogToken)
   
      return {
         statusCode: HttpStatus.OK,
         status: "success",
         access_token: accessToken,
         refresh_token: refreshAccessToken,
         /* me: {
           profile: user.profile,
           role: user.role,
           acl: {
             modules: user.permissionsF
           }
         } */
      };
   }

   async refreshToken(param) {
      const { sub, expireIn } = this.jwtService.verify(param.refresh_token);
      const userId = sub;
  
      const resAuth = await this.findById( userId)
  
      if (resAuth) {
        const isRefreshTokenMatching = await bcrypt.compare(
          param.refresh_token,
          resAuth.refresh_token
        );
     
        if (isRefreshTokenMatching) {
          if (new Date() > new Date(expireIn)) {
            return {
              statusCode: HttpStatus.OK,
              status: "failed",
              message: "Refresh token expired"
            };
          } 
  
          const payloadToken = { sub: resAuth.user_id };
          const payloadRefreshToken = { sub: resAuth.user_id };
  
          const accessToken = this.jwtService.sign(payloadToken)
          const refreshAccessToken = this.jwtService.sign(payloadRefreshToken)
  
          const dataLogToken = {
            user_id: resAuth.user_id,
            token: accessToken,
            refresh_token: refreshAccessToken
          }
          
          const logToken = this.logToken(dataLogToken)
          
          return {
            statusCode: HttpStatus.OK,
            status: "success",
            access_token: accessToken,
            refresh_token: refreshAccessToken,
          };
        }else{
          return {
            statusCode: HttpStatus.OK,
            status: "failed",
            message: "Refresh token not match"
          };
        }
      }
  
      return {
        statusCode: HttpStatus.OK,
        status: "failed",
        message: "User with this id does not exist"
      };
   }

   async logToken(data: any) {
      const checkLog = await this.authRepository
      .createQueryBuilder("auth")
      .where("user_id= :user_id", { user_id: data.user_id })
      .getOne()

      if(!checkLog){
         const now = new Date();
         const created_date = now.toISOString();
         const hashedToken = await bcrypt.hash(data.token, 10);
         const hashedRefreshToken = await bcrypt.hash(data.refresh_token, 10);
         const dataLogToken = {
            user_id: data.user_id,
            token: hashedToken,
            refresh_token: hashedRefreshToken,
            created_date: created_date,
            modified_date: null,
         }

         const result = await this.authRepository
         .createQueryBuilder("auth")
         .insert()
         .into(Auth)
         .values(dataLogToken)
         .execute()

         if(result.raw > 0){
            return result
         }

         return null
      }else{
         const now = new Date();
         const created_date = now.toISOString();
         const hashedToken = await bcrypt.hash(data.token, 10);
         const hashedRefreshToken = await bcrypt.hash(data.refresh_token, 10);
         const dataLogToken = {
            token: hashedToken,
            refresh_token: hashedRefreshToken,
            modified_date: created_date,
         }

         const result = await this.authRepository
         .createQueryBuilder("auth")
         .update()
         .set(dataLogToken)
         .where("id = :id", { id: checkLog.id })
         .execute()

         if(result.affected > 0){
            return result
         }
      }

      return null
   }

   async findById(userId: number) {
      const result = await this.authRepository
      .createQueryBuilder("auth")
      .where("user_id= :user_id", { user_id: userId })
      .getOne()

      return result
   }
}
