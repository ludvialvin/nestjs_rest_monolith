import { Inject, OnModuleInit, OnModuleDestroy, Logger, Controller, Get, Post, Body, Req, Put, Delete, Query, UseGuards, Param, CacheInterceptor, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
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

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
@UseInterceptors(CacheInterceptor)

export class UserController {
   constructor(
      
   ) {}

   logger = new Logger('Main');

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
   @Permissions('get:user')
   async get(@Query() param) {
        this.logger.log('Get all users');
        const pattern = 'users.get';
        //return await this.client.send(pattern, param);

        return {}
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('getOne:user')
    //async getUserById(@Req() body:Body) {
    async getOne(@Param() param) {
        this.logger.log('Get user by id');
        const pattern = 'users.getById';
        //return await this.client.send(pattern, param);
        return {}
    }

    @Post('/')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('create:user')
    async create(@Body() param) {
        this.logger.log('Create user');
        const pattern = 'users.insert';
        //return await this.client.send(pattern, param);
        return {}
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('update:user')
    async update(@Body() param) {
        this.logger.log('Update user');
        const pattern = 'users.update';
        //return await this.client.send(pattern, param);
        return {}
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('delete:user')
    async delete(@Param() param) {
        this.logger.log('Delete user');
        const pattern = 'users.delete';
        //return await this.client.send(pattern, param);
        return {}
    }
}
