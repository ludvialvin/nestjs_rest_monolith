import { Controller, Body, Post, Request, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorator/request';
import { AuthService } from '../services/auth.service';
import { AuthCredentials } from '../dto/auth.dto';
//import { AuthResponse } from '../interfaces/auth.interface';
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
  
	@Post('/login')
	@UseGuards(LocalAuthGuard)
	async login(@Body() body) {
		return this.authService.login(body);
	}

	@Post('/register')
	async register(@Body() params) {
		//return this.authService.register(params); 
		return {}
	}

	@Post('/refresh')
	async refreshToken(@Body() params) {
		console.log(params)
		return await this.authService.refreshToken(params);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@GetUser() user: any) {
		//return this.authService.logout(user);  
		return {}
	}
}
