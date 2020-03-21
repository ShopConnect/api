import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class LogEntry {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public ip: string;

    @Column()
    public requestMethod: string;

    @Column()
    public path: string;

    @Column('timestamp with time zone')
    public timestamp: Date;

    @ManyToOne(() => User, user => user.logEntries)
    public authenticatedUser: User;
}