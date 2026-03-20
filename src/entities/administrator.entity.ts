import { Entity,Column,PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { officeraccount } from "./officeraccount.entity";
@Entity('administrator')
export class administrator{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length:100})
    department:string;

    @Column({length:100})
    email:string;

    @Column({length:100})
    role:string;

    @Column({length:100})
    user_name:string;

    @Column({length:100})
    password:string;

    @Column({length:100})
    status:string;

    @OneToMany(() => officeraccount, (officer: officeraccount) => officer.administrator)
    officers: officeraccount[];
}