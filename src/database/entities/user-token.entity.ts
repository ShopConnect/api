import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserToken {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column({ nullable: false })
    public token: string;
    
    @Column({ nullable: false })
    public createdOn: Date;
    
    @Column({ default: false })
    public isValid: boolean;
    
    @ManyToOne(() => User, user => user.tokens)
    public user: User;
}