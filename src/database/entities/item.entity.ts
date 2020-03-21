import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { ShoppingList } from "./shoppinglist.entity";
import { ShoppingListItem } from "./shoppingListItem.entity";
import { ItemCategory } from "./itemCategory.entity";

@Entity()
export class Item {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => ItemCategory, category => category.items)
	public category: ItemCategory;

	@Column()
	public name: string;

	@Column()
	public price: number;

	@OneToMany(() => ShoppingListItem, shoppingListItem => shoppingListItem.item)
	public shoppingListItems: ShoppingListItem[];
}