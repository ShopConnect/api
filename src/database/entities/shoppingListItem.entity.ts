import { Entity, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";
import { ShoppingList } from "./shoppinglist.entity";
import { Item } from "./item.entity";

@Entity()
export class ShoppingListItem {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => ShoppingList, ShoppingList => ShoppingList.items)
	public list: ShoppingList;

	@ManyToOne(() => Item, item => item.shoppingListItems)
	public item: Item;

	@Column()
	public quantity: number;

	@Column()
	public isOptional: boolean;
}