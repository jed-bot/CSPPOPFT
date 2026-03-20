import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { administrator } from "./administrator.entity";
import { officerprofile } from "./officerprofile.entity";


@Entity('officer_account')
export class officeraccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    administrator_id: number;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 100})
    user_name: string;

    @Column({ length: 100 })
    password: string;

    @Column({type: 'boolean', default: true})
    status: boolean;

    @ManyToOne(() => administrator, (administrator: administrator) => administrator.officers)
    @JoinColumn({ name: 'administrator_id' })
    administrator: administrator;

    @OneToOne(() => officerprofile, profile => profile.officeraccount)
    profile: officerprofile;
}