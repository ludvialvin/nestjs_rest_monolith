import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UsersGroup, UserPermission, RefPermissions } from '../entity/user.entity';
import { BasicResponse } from '../dto/response.dto';

@Injectable()
export class UsersService {
   constructor(
      @InjectRepository(User) private userRepository: Repository<User>,
      @InjectRepository(UsersGroup) private userGroupRepository: Repository<UsersGroup>,
      @InjectRepository(UserPermission) private userPemissionsRepository: Repository<UserPermission>,
      @InjectRepository(RefPermissions) private refpermissionsRepository: Repository<RefPermissions>,
   ) { }

  async create(createUserDto: CreateUserDto) {
   const result = await this.userRepository
   .createQueryBuilder("user")
   .insert()
   .into(User)
   .values(createUserDto)
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
   const result = await this.userRepository
   .createQueryBuilder("user")
   .where("is_active= :is_active", { is_active: 1 })
   .andWhere("is_deleted= :is_deleted", { is_deleted: 0 })
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
   const result = await this.userRepository
   .createQueryBuilder("user")
   .where("id= :id", { id: id })
   .andWhere("is_deleted= :is_deleted", { is_deleted: 0 })
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

   async update(id: number, updateUserDto: UpdateUserDto) {
      const result = await this.userRepository
      .createQueryBuilder("user")
      .update()
      .set(updateUserDto)
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
      const result = await this.userRepository
      .createQueryBuilder("user")
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

   async findByEmail(email: string) {
      const result = await this.userRepository
      .createQueryBuilder("user")
      .where("email= :email", { email: email })
      .andWhere("is_active= :is_active", { is_active: 1 })
      .andWhere("is_deleted= :is_deleted", { is_deleted: 0 })
      .getOne()

      if(result){
         const permissions = await this.getUserPermissions(result.user_group_id)
         const role = await this.getUserRole(result.user_group_id)

         const user = {
            id: result.id,
            userGroupId: result.user_group_id,
            username: result.name,
            password: result.password,
            profile: '',
            role: role,
            permissionsB: permissions.backend,
            permissionsF: permissions.frontend,
            permissions: permissions.list
         }

         return user
      }

      return null
   }

   async findByUsername(username: string) {
      const result = await this.userRepository
      .createQueryBuilder("user")
      .where("name= :username", { username: username })
      .andWhere("is_active= :is_active", { is_active: 1 })
      .andWhere("is_deleted= :is_deleted", { is_deleted: 0 })
      .getOne()

      return result
   }

   async getListPermission() {
      const result = await this.refpermissionsRepository
      .createQueryBuilder("ref_permissions")
      .getMany()

      return result
   }

   async getUserPermissions(userGroupId) {
      const refPermissions = await this.getListPermission()
      
      let indexedArray: {[key: string]: object} = {}
      let arrList = []
      for(const index of refPermissions){
         const resPermissions = await this.userPemissionsRepository
         .createQueryBuilder("user_permissions")
         .where("user_group_id= :user_group_id", {user_group_id:userGroupId})
         .andWhere("ref_permission_id= :ref_permission_id", {ref_permission_id:index.id})
         .getMany()
  
         if(resPermissions){
            let arrayBoolAcces: {[key: string]: boolean} = {}

            for(const rp of resPermissions){
               var accessPath = false
               if(rp.is_active == 1){
                  accessPath = true
                  arrList.push(rp.full_path)
               }
               arrayBoolAcces[rp.action] = accessPath
            }    

            const namee = index.name
            indexedArray[namee] = arrayBoolAcces
         }
      }

      const userPermissions = await this.userPemissionsRepository
      .createQueryBuilder("user_permissions")
      .where("user_group_id= :user_group_id", {user_group_id:userGroupId})
      .getMany()

      return {
          frontend: indexedArray,
          backend: userPermissions,
          list: arrList
      }
   }

   async getUserRole(userGroupId) {
      const result = await this.userGroupRepository
      .createQueryBuilder("user_group")
      .where("id= :id", { id: userGroupId })
      .getOne()

      return result.name
   }
}
