export class CreateUserDto {
   id: number;
   name: string;
   email: string;
   password: string;
   user_group_id: number;
   is_active: number;
   is_deleted: number;
}
