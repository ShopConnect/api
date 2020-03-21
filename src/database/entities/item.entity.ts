import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ItemCategory } from "./item-category.entity";
import { OrderItem } from "./order-item.entity";

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

	@OneToMany(() => OrderItem, orderItem => orderItem.item)
	public orderItems: OrderItem[];
}