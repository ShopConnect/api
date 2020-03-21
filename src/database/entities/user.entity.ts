import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ChatMessage } from './chat-message.entity';
import { Exclude } from 'class-transformer';
import { IdentificationCard } from './identification-card.entity';
import { LogEntry } from './log-entry.entity';
import { Order } from './order.entity';
import { UserDevice } from './user-device.entity';
import { UserToken } from './user-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, nullable: false })
  public email: string;

  @Column({ type: 'boolean', default: false })
  public isAdmin: boolean = false;

  @Column({ nullable: false })
  @Exclude()
  public password: string;

  @Column({ nullable: false })
  @Exclude()
  public salt: string;

  @Column({ nullable: false })
  @Exclude()
  public iterations: number;

  @OneToOne(() => IdentificationCard, identificationCard => identificationCard.user)
  @JoinColumn()
  @Exclude()
  public identificationCard: IdentificationCard;

  @Column({ default: false, nullable: false })
  public isVerified: boolean;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  @Exclude()
  public lastLogin: Date;

  @Column({ type: 'timestamp with time zone' })
  public createdOn: Date;

  @Column({ type: 'boolean', default: false })
  public isDeactivated: boolean;

  @Column({ nullable: true })
  public firstName: string;

  @Column({ nullable: true })
  public lastName: string;

  @Column('date', { nullable: true })
  public birthday: Date;

  @Column({ nullable: true })
  public country: string;
  
  @Column({ nullable: true })
  public city: string;

  @Column({ nullable: true })
  public zipCode: string;

  @Column({ nullable: true })
  public street: string;

  @Column({ nullable: true })
  public houseNumber: string;

  @Column({ nullable: true })
  public payPalHandle: string;

  @Column({ nullable: true })
  public iban: string;

  @Column({ nullable: true })
  public telephoneNumber: string;

  @OneToMany(() => UserToken, token => token.user)
  @Exclude()
  public tokens: UserToken[];

  @OneToMany(() => Order, order => order.owner)
  public ownedOrders: Order[];

  @OneToMany(() => Order, order => order.accepter)
  public acceptedOrders: Order[];
    
  @OneToMany(() => LogEntry, logEntry => logEntry.authenticatedUser)
  public logEntries: LogEntry[];

  @OneToMany(() => ChatMessage, chatMessage => chatMessage.sender)
  public sentMessages: ChatMessage[];

  @OneToMany(() => ChatMessage, chatMessage => chatMessage.receiver)
  public receivedMessages: ChatMessage[];

  @OneToMany(() => UserDevice, userDevice => userDevice.user)
  public devices: UserDevice[];
}