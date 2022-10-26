import { Controller, Body, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorator/request';
import { AuthService } from '../services/auth.service';
import { AuthCredentials } from '../dto/auth.dto';
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
	async login(@Request() request) {
		request.session.permissions = request.session.permissions ? request.session.permissions : request.user.permissions;
      return await this.authService.login(request.user);
	}

	@Post('/register')
	async register(@Body() params) {
		//return this.authService.register(params); 
		return {}
	}

	@Post('/refresh')
	async refreshToken(@Body() params) {
		return await this.authService.refreshToken(params);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@GetUser() user: any) {
		//return this.authService.logout(user);  
		return {}
	}
}
