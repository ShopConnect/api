import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class ChatMessage{
	@PrimaryGeneratedColumn()
	public id: number;

	@OneToMany(() => User, user => user.sentMessages)
	public sender: User;

	@OneToMany(() => User, user => user.receivedMessages)
	public receiver: User;

	@Column()
	public message: string;

	@Column()
	public isSystemMessage: boolean;
}