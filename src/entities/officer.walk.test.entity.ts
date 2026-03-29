import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";

@Entity('walk_2km_test')
export class walktest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officer_id: number;

    @Column()
    age: number;

    @Column({ length: 100 })
    gender: string;

    @Column()
    minutes:number;

    @Column()
    seconds:number;

    @Column({ length:100, nullable:true})
    grade:string;

    @Column()
    time_formatted:string;

    @Column({ length: 100 })
    test_date: string;

    @CreateDateColumn({name:'created_at'})
    created_at:Date;

    @OneToOne(() => officerprofile, (profile: officerprofile) => profile.officersitup1min)
    @JoinColumn({ name: 'officer_id' })
    officerprofile: officerprofile;
}