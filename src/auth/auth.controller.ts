import { Controller, Body, Post, Request, UseGuards, OnModuleInit, OnModuleDestroy, Inject, Logger  } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorator/request';
import { AuthService } from './auth.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')  
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
  
    logger = new Logger('Main');

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(@Body() params, @Request() req) {
        this.logger.log('Login user');
        return this.authService.login(req.user);
    }

    @Post('/register')
    async register(@Body() params) {
        this.logger.log('Register user');
        //return this.authService.register(params); 
        return {}
    }

    @Post('/refresh')
    async refreshToken(@Body() params) {
        this.logger.log('Refresh Token');
        //return this.authService.refreshToken(params);  
        return {}
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@GetUser() user: any) {
        this.logger.log('Logout user');
        //return this.authService.logout(user);  
        return {}
    } 
}
