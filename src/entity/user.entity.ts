import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id: number;
   @Column()
   name: string;
   @Column()
   email: string;
   @Column()
   password: string;
   @Column({ type: "int", default: 2 })
   user_group_id: number;
   @Column({ type: "int", default: 0 })
   is_active: number;
   @Column({ type: "int", default: 0 })
   is_deleted: number;
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

    @Column({default: null})
    user_group_id: number; 

    @Column({default: null})
    ref_permission_id: number; 

    @Column({default: null})
    path: string;

    @Column({default: null})
    action: string;

    @Column({default: null})
    full_path: string;

    @Column({default: 0})
    is_active: number; 

    @Column({ type: 'datetime', default: null })
    created_date: string;

    @Column({ type: 'datetime', default: null })
    modified_date: string; 
}

@Entity('ref_permissions')
export class RefPermissions {
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
