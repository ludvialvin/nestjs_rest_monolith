/* import { Injectable, Inject, HttpStatus, OnModuleInit, OnModuleDestroy, RequestTimeoutException, createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { lastValueFrom } from 'rxjs';
import { jwtConstants } from './strategy/constants';
import { qbHelper } from '../../helper/qbHelper';
import { Repository, getConnection } from 'typeorm';
import { Auth } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity'; */

import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../strategy/constants';
import { Repository } from 'typeorm';
import { Auth, RefPermissions } from '../entity/auth.entity';
import { User, UsersGroup, UserPermission } from '../entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@Inject('AUTH_REPOSITORY')
		private authRepository: Repository<Auth>,
		@Inject('REF_PERMISSIONS_REPOSITORY')
		private refPermissionsRepository: Repository<RefPermissions>,
		@Inject('USER_REPOSITORY')
		private userRepository: Repository<User>,
		@Inject('USER_GROUP_REPOSITORY')
		private userGroupRepository: Repository<UsersGroup>,
		@Inject('USER_PERMISSIONS_REPOSITORY')
		private userPermissionsRepository: Repository<UserPermission>,
	) {}
	
	async getListPermission(){
		return await this.refPermissionsRepository.find({
			where: {
				is_deleted: 0,
			},
		})
	}

	async getUserPermissions(userGroupId) {
		const refPermissions = await this.getListPermission()

		//const arrPath: PermissionPath[] = [];
		let indexedArray: {[key: string]: object} = {}
		let arrList = []
		for(const index of refPermissions){
				const resPer = await this.userPermissionsRepository.find({
					where: {
						user_group_id: userGroupId,
					},
				})

				if(resPer){
						const namee = index.name

						let arrayB: {[key: string]: boolean} = {}
						for(const mod of resPer){
								var accessPath = false
								if(mod.is_active == 1){
										accessPath = true

										const mmm = mod.action+':'+mod.path
										arrList.push(mmm)
								}
								arrayB[mod.action] = accessPath
						}    

						indexedArray[namee] = arrayB
				}
		}

		const res = await this.userPermissionsRepository.find({
			where: {
				user_group_id: userGroupId,
			},
		})

		return {
				frontend: indexedArray,
				backend: res,
				list: arrList
		}
	}

	async getUserRole(userGroupId) {
		const res = await this.userGroupRepository.findOne({
			where: {
				id: userGroupId,
			},
		})

		return res.name
	}

	async checkUser(params) {
		const username = params.name
		const res = await this.userRepository.findOne({
			where: {
				name: username,
			},
		})
		
		if(res){
				const permissions = await this.getUserPermissions(res.users_group_id)
				const role = await this.getUserRole(res.users_group_id)
				
				const user = {
						id: res.id,
						userGroupId: res.users_group_id,
						username: res.name,
						password: res.password,
						profile: '',
						role: role,
						permissionsB: permissions.backend,
						permissionsF: permissions.frontend,
						permissionsList: permissions.list
				}

				return user
		}else{
				return null
		} 
	}

	async checkUserId(userId): Promise<any> {
		const res = await this.authRepository.findOne({
			where: {
				user_id: userId,
				is_deleted: false 
			},
		}) 
		if(res) {
			const tokenUser = {
				id: res.id,
				refresh_token: res.refresh_token,
			}
			return tokenUser
		}else {
			return null
		} 
   } 

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.checkUser({ name: username })

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

	async logToken(data) {
		const res = await this.authRepository.findOne({
			where: {
				user_id: data.user_id,
				is_deleted : false
			},
		})

		if(res) {
				const now = new Date();
				const created_date = now.toISOString();
				const hashedToken = await bcrypt.hash(data.token, 10);
				const hashedRefreshToken = await bcrypt.hash(data.refresh_token, 10);
				const dataLogToken = {
						token: hashedToken,
						refresh_token: hashedRefreshToken,
						modified_date: created_date,
				}
				
				const queryBuilder = await this.authRepository
				.createQueryBuilder()
				.update("auth")
				.set(dataLogToken)
				.where("id = :id", { id: res.id })
				.execute()

            console.log('update')
            console.log(queryBuilder)

				return queryBuilder
		}else{
			const now = new Date();
			const created_date = now.toISOString();
			const hashedToken = await bcrypt.hash(data.token, 10);
			const hashedRefreshToken = await bcrypt.hash(data.refresh_token, 10);
			/* const dataLogToken = {
				user_id: data.user_id,
				token: hashedToken,
				refresh_token: hashedRefreshToken,
				created_date: created_date,
				modified_date: null,
			} */

			const auth = new Auth()
			auth.user_id = data.user_id
			auth.token = hashedToken
			auth.refresh_token = hashedRefreshToken
			auth.created_date = created_date
			const queryBuilder = await this.authRepository.save(auth)

         console.log('insert')
         console.log(queryBuilder)

			return queryBuilder
		}  
	}

	async login(user:any) {
		const payloadToken = { 
			username: user.username, 
			sub: user.id, 
			userGroupId: user.userGroupId,
			permissions: user.permissionsList,
		};

		//console.log(user)
		
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

		//const logAuthToken = this.logToken(dataLogToken)

		this.logToken(dataLogToken)

		return {
			statusCode: HttpStatus.OK,
			status: "success",
			message: "success create token",
			access_token: accessToken,
			refresh_token: refreshAccessToken,
			me: {
				//profile: user.profile,
				role: user.role,
				acl: {
					modules: user.permissionsF
				}
			}
		};
	}

	async refreshToken(param) {
		if(!param.refresh_token){
			return {
				statusCode: HttpStatus.OK,
				status: "failed",
				message: "Refresh token empty"
			};
		}
		const { sub, expireIn } = await this.jwtService.verify(param.refresh_token);
		const userId = sub;

		const respCheckUser = await this.checkUserId(userId);

		if (respCheckUser) {
			const isRefreshTokenMatching = await bcrypt.compare(
				param.refresh_token,
				respCheckUser.refresh_token
			);
	 
			if (isRefreshTokenMatching) {
				if (new Date() > new Date(expireIn)) {
					return {
						statusCode: HttpStatus.OK,
						status: "failed",
						message: "Refresh token expired"
					};
				} 

				const payloadToken = { sub: respCheckUser.id };
				const payloadRefreshToken = { sub: respCheckUser.id };

				const accessToken = this.jwtService.sign(payloadToken)
				const refreshAccessToken = this.jwtService.sign(payloadRefreshToken)

				const dataLogToken = {
					user_id: respCheckUser.id,
					token: accessToken,
					refresh_token: refreshAccessToken
				}
				
				this.logToken(dataLogToken)
				
				return {
					statusCode: HttpStatus.OK,
					status: "success",
					message: "success refresh token",
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

	async register(params) {
		/*const user = await this.client.send('users.check.register', params)
		const resp = await lastValueFrom(user);
		if(resp) {
			return {
				statusCode: HttpStatus.OK,
				status: "failed",
				message: "username or email already exist"
			};
		}else{
			const user = await this.client.send('users.create', params)
			const resp = await lastValueFrom(user);
			if(resp) {
				return {
					statusCode: HttpStatus.OK,
					message: 'Success',
					//result: resp
				}
			}else{
				return {
					statusCode: HttpStatus.OK,
					status: "failed",
					message: "failed create user"
				};
			}
		}*/
	}

	async logout(user) {
		/*if(user){
			const removeAuthToken = this.client.send('auth.remove.token', { userId: user.userId });
			const respRemoveAuthToken = lastValueFrom(removeAuthToken);
		}
		return {
			statusCode: HttpStatus.OK,
			status: "success",
			message: "Logout success"
		};*/
	}  
}