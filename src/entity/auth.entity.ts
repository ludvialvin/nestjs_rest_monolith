import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth')
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    token: string;

    @Column()
    refresh_token: string;

    @Column({ type: 'datetime', default: null })
    created_date: string;

    @Column({ type: 'datetime', default: null })
    modified_date: string; 

    @Column({ default: 0 })
    is_deleted: number;
}