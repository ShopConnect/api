import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { OrderItem } from "./order-item.entity";
import { User } from "./user.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, user => user.ownedOrders)
  public owner: User;

  @ManyToOne(() => User, user => user.acceptedOrders)
  public accepter: User;

  @Column()
  public maxValue: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.list)
  public items: OrderItem[];
}