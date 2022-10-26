import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorator/permissions.decorator';

@Controller('articles')
export class ArticlesController {
   constructor(private readonly articlesService: ArticlesService) {}

   @Post()
   @UseGuards(JwtAuthGuard,PermissionsGuard)
   @Permissions('articles:create')
   async create(@Body() createArticleDto: CreateArticleDto) {
      const result = await this.articlesService.create(createArticleDto);
      throw new HttpException(result, result.statusCode);
   }

   @Get()
   @UseGuards(JwtAuthGuard,PermissionsGuard)
   @Permissions('articles:get')
   async findAll() {
      const result = await this.articlesService.findAll();
      throw new HttpException(result, result.statusCode);
   }

   @Get(':id')
   @UseGuards(JwtAuthGuard,PermissionsGuard)
   @Permissions('articles:get')
   async findOne(@Param('id') id: string) {
      const result = await this.articlesService.findOne(+id);
      throw new HttpException(result, result.statusCode);
   }

   @Patch(':id')
   @UseGuards(JwtAuthGuard,PermissionsGuard)
   @Permissions('articles:update')
   async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
      const result = await this.articlesService.update(+id, updateArticleDto);
      throw new HttpException(result, result.statusCode);
   }

   @Delete(':id')
   @UseGuards(JwtAuthGuard,PermissionsGuard)
   @Permissions('articles:delete')
   async remove(@Param('id') id: string) {
      const result = await this.articlesService.remove(+id);
      throw new HttpException(result, result.statusCode);
   }
}
