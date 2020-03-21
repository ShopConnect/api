import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Item } from "./item.entity";

@Entity()
export class ItemCategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(() => Item, item => item.category)
  public items: Item[];
}