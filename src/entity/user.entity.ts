import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
    @ApiProperty({ 
        example: 1, 
        description: 'user ID' 
    })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({
      example: 1,
      description: 'User Group ID',
    })
    @Column()
    users_group_id: number;

    @Column()
    name: string;

    @Column()
    password: string;
}

@Entity('user_group')
export class UsersGroup {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    name: string;

    @Column({ type: 'datetime', default: null })
    created_date: string;

    @Column({ type: 'datetime', default: null })
    modified_date: string; 

    @Column({ default: '0' })
    is_deleted: number; 
}

@Entity('user_permissions')
export class UserPermission {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    user_group_id: number; 

    @Column()
    path: string;

    @Column()
    action: string;

    @Column()
    is_active: number; 

    @Column({ type: 'datetime', default: null })
    created_date: string;

    @Column({ type: 'datetime', default: null })
    modified_date: string; 
}