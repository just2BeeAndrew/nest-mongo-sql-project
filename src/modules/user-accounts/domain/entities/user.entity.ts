import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
@PrimaryGeneratedColumn()
  public id: string;

}

@Entity()
export class AccountData{
@PrimaryGeneratedColumn()
public id: string;

}

@Entity()
export class EmailConfirmation{
  @PrimaryGeneratedColumn()
  public id: string;
}
