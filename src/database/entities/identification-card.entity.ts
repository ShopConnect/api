import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class IdentificationCard {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => User, user => user.identificationCard)
  public user: User;

  @Column({ nullable: true })
  public idd: string;

  @Column('json', {nullable: true})
  public fotoBlobs: string;
}