import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class UserDevice {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => User, user => user.devices)
    public user: User;

    @Column()
    public token: string;
}