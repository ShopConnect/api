import { Column, Connection, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export abstract class Seed {
    public constructor(
        protected readonly connection: Connection
    ) { }
    
    @PrimaryColumn()
    public guid: string;
    
    @Column({ nullable: false })
    public name: string;
    
    @CreateDateColumn({ nullable: false })
    public createdOn: Date;
    
    abstract async up(): Promise<void>;
    
    abstract async down(): Promise<void>;
}