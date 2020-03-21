import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { ShoppingListItem } from "./shoppingListItem.entity";

@Entity()
export class ShoppingList {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => User, user => user.ownedShoppingLists)
	public owner: User;

	@ManyToOne(() => User, user => user.shoppedShoppingLists)
	public shopper: User;

	@Column()
	public maxValue: number;

	@OneToMany(() => ShoppingListItem, shoppingListItems => shoppingListItems.list)
	public items: ShoppingListItem[];
}