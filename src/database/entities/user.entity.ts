import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserToken } from './user-token.entity';
import { IdentificationCard } from './identification-card.entity';
import { ShoppingList } from './shoppinglist.entity';

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

  @OneToMany(() => ShoppingList, shoppingList => shoppingList.owner)
  public ownedShoppingLists: ShoppingList[];

  @OneToMany(() => ShoppingList, shoppingList => shoppingList.shopper)
  public shoppedShoppingLists: ShoppingList[];
}