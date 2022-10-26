import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Articles } from '../entity/articles.entity';
import { BasicResponse } from '../dto/response.dto';

@Injectable()
export class ArticlesService {
   constructor(
      @InjectRepository(Articles) private articleRepository: Repository<Articles>,
   ) { }

   async create(createArticleDto: CreateArticleDto) {
      const result = await this.articleRepository
      .createQueryBuilder("article")
      .insert()
      .into(Articles)
      .values(createArticleDto)
      .execute()

      if(result.raw > 0){
         const response = new BasicResponse()
         response.statusCode = HttpStatus.OK
         response.message = "success"

         return response
      }

      const response = new BasicResponse()
      response.statusCode = HttpStatus.BAD_REQUEST
      response.message = "failed"

      return response
   }

   async findAll() {
      const result = await this.articleRepository
      .createQueryBuilder("article")
      .where("article.is_active= :is_active", { is_active: 1 })
      .andWhere("article.is_deleted= :is_deleted", { is_deleted: 0 })
      .getMany()

      if(result.length > 0){
         const response = new BasicResponse()
         response.statusCode = HttpStatus.OK
         response.message = "success"
         response.data = result

         return response
      }
      
      const response = new BasicResponse()
      response.statusCode = HttpStatus.NOT_FOUND
      response.message = "success"
      response.data = []

      return response
   }

   async findOne(id: number) {
      const result = await this.articleRepository
      .createQueryBuilder("article")
      .where("article.id= :id", { id: id })
      .andWhere("article.is_active= :is_active", { is_active: 1 })
      .andWhere("article.is_deleted= :is_deleted", { is_deleted: 0 })
      .getOne()

      if(result){
         const response = new BasicResponse()
         response.statusCode = HttpStatus.OK
         response.message = "success"
         response.data = result

         return response
      }
      
      const response = new BasicResponse()
      response.statusCode = HttpStatus.NOT_FOUND
      response.message = "success"
      response.data = []

      return response
   }

   async update(id: number, updateArticleDto: UpdateArticleDto) {
      const result = await this.articleRepository
      .createQueryBuilder("article")
      .update()
      .set(updateArticleDto)
      .where("id = :id", { id: id })
      .execute()

      if(result.affected > 0){
         const response = new BasicResponse()
         response.statusCode = HttpStatus.OK
         response.message = "success"

         return response
      }   

      const response = new BasicResponse()
      response.statusCode = HttpStatus.BAD_REQUEST
      response.message = "failed"

      return response
   }

   async remove(id: number) {
      const result = await this.articleRepository
      .createQueryBuilder("article")
      .update()
      .set({is_deleted: 1})
      .where("id = :id", { id: id })
      .execute()

      if(result.affected > 0){
         const response = new BasicResponse()
         response.statusCode = HttpStatus.OK
         response.message = "success"

         return response
      }   

      const response = new BasicResponse()
      response.statusCode = HttpStatus.BAD_REQUEST
      response.message = "failed"

      return response
   }
}
