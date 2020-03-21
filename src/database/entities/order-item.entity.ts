import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Item } from "./item.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => Order, order => order.items)
	public list: Order;

	@ManyToOne(() => Item, item => item.orderItems)
	public item: Item;

	@Column()
	public quantity: number;

	@Column()
	public isOptional: boolean;
}