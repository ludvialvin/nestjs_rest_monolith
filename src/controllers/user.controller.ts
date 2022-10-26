import { Controller, Get, Post, Body, Put, Delete, Query, UseGuards, Param, CacheInterceptor, UseInterceptors, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorator/permissions.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { User } from '../entity/user.entity';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
@UseInterceptors(CacheInterceptor)

export class UsersController {
   constructor(
      private readonly usersService: UsersService
   ) {}

   @Get('/')
   @ApiOperation({ summary: 'Get users' })
   @ApiQuery({
      name: 'username',
      required: false
    })
   @ApiResponse({
      status: 200,
      description: 'The found record',
      type: User,
   })
   @UseGuards(JwtAuthGuard, PermissionsGuard)
   @Permissions('user:get')
   async get(@Query() param) {
      const result = await this.usersService.findAll();
      throw new HttpException(result, result.statusCode);
   }

    @Get(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('user:get')
    async getOne(@Param('id') id: string) {
      const result = await this.usersService.findOne(+id);
      throw new HttpException(result, result.statusCode);
    }

    @Post('/')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('user:get')
    async create(@Body() createUserDto: CreateUserDto) {
      const result = await this.usersService.create(createUserDto);
      throw new HttpException(result, result.statusCode);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('user:update')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      const result = await this.usersService.update(+id, updateUserDto);
      throw new HttpException(result, result.statusCode);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('user:delete')
    async delete(@Param('id') id: string) {
      const result = await this.usersService.remove(+id);
      throw new HttpException(result, result.statusCode);
    }
}
