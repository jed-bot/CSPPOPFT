import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";

@Entity('situp1_mmin')
export class officersitup1min {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officer_id: number;

    @Column()
    age: number;

    @Column({ length: 100 })
    gender_type: string;

    @Column()
    reps: number;

    @Column({ length:100, nullable:true})
    grade:string;

    @Column({ length: 100 })
    test_date: string;

    @CreateDateColumn({name:'created_at'})
    created_at:Date;

    @OneToOne(() => officerprofile, (profile: officerprofile) => profile.officersitup1min)
    @JoinColumn({ name: 'officer_id' })
    officerprofile: officerprofile;
}