import {
    Injectable,
    CanActivate,
    ExecutionContext
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
      private reflector: Reflector
  ) {}
  
  /*
    compare acl
    path - controller
    method - method
  */
  async canActivate(context: ExecutionContext) {
    const user = await context.switchToHttp().getRequest().user
    
    if(user){
      var path = await context.switchToHttp().getRequest().route?.path
      var cleanPath = path.replace("/", "");
      const method = context.getHandler().name
      const accessList = user.accessList
      const nnn = await context.getHandler()

      console.log(nnn)

      const access = await accessList.find((obj) => {
        if(obj.path === cleanPath && obj.action === method && obj.is_active === 1){
          return true
        }
        return false
      });

      if(access){
        return true
      }
      
      return false
    }

    return false
  }
}