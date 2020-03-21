import { Connection } from "typeorm";
import { Item } from "../entities/item.entity";
import { ItemCategory } from "../entities/item-category.entity";
import { Seed } from "../entities/seed.entity";

export class InitialSeed20200321 extends Seed {
    constructor(
        connection: Connection
    ) {
        super(connection);

        this.guid = '58448468-A40A-43C0-B8B1-4FFC8CF9E4DD';
        this.name = InitialSeed20200321.name;
    }

    public async up() {
        await this.connection.createQueryBuilder()
            .insert()
            .into(ItemCategory)
            .values([
                {
                    name: 'Lebensmittel'
                },
                {
                    name: 'Drogerie und Haushalt'
                },
                {
                    name: 'Tier'
                }
            ])
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Item)
            .values([
                {
                    name: 'Schmelzkäse Chester Scheiben 250g',
                    price: 0.99,
                    category: {
                        id: 1
                    }
                },
                {
                    name: 'Gustavo Gusto Steinofen Salame 460g',
                    price: 3.79,
                    category: {
                        id: 1
                    }
                },
                {
                    name: 'Nivea Flüssigseife Creme Soft 250ml',
                    price: 1.25,
                    category: {
                        id: 2
                    }
                },
                {
                    name: 'Duschdas Men Duschgel 250ml',
                    price: 1.25,
                    category: {
                        id: 2
                    }
                },
                {
                    name: 'Crave Pastete mit Huhn & Truthahn 300g',
                    price: 1.99,
                    category: {
                        id: 3
                    }
                },
                {
                    name: 'Wildes Land Entenbrust in Streifen',
                    price: 2.49,
                    category: {
                        id: 3
                    }
                }
            ])
            .execute()
    }

    public async down() {
        await this.connection.createQueryBuilder()
            .delete()
            .from(Item)
            .where("id IN (1, 2, 3, 4, 5, 6)")
            .execute();
            
        await this.connection.createQueryBuilder()
            .delete()
            .from(ItemCategory)
            .where("id IN (1, 2, 3)")
            .execute();
    }
}