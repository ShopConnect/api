import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserToken } from './user-token.entity';
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

  @Column({ default: 0, nullable: true })
  @Exclude()
  public lastLogin: Date;

  @Column()
  public createdOn: Date;

  @Column({ type: 'decimal', precision: 7, scale: 2 })
  public balance: number;

  @Column({ type: 'boolean', default: false })
  public isDeactivated: boolean;

  @Column()
  public country: string;

  @Column()
  public city: string;

  @Column()
  public zipCode: string;

  @Column()
  public street: string;

  @Column()
  public houseNumber: string;

  @Column()
  public payPalHandle: string;

  @Column()
  public iban: string;

  @Column()
  public telephoneNumber: string;

  @OneToMany(() => UserToken, token => token.user)

  @Exclude()
  public tokens: UserToken[];

  @OneToMany(() => ShoppingList, shoppingList => shoppingList.owner)
  public ownedShoppingLists: ShoppingList[];

  @OneToMany(() => ShoppingList, shoppingList => shoppingList.shopper)
  public shoppedShoppingLists: ShoppingList[];
}