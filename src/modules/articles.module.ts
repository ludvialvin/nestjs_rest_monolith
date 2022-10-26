import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from '../services/articles.service';
import { ArticlesController } from '../controllers/articles.controller';
import { Articles } from '../entity/articles.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Articles])],
   controllers: [ArticlesController],
   providers: [ArticlesService]
})
export class ArticlesModule {}
