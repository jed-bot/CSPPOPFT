import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";

@Entity('sprint_300m_test')
export class officer300msprint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officer_id: number;

    @Column({ length: 100 })
    gender: string;

    @Column()
    age: number;

    @Column()
    minutes: number;

    @Column()
    seconds: number;

    @Column()
    grade:string;

    @Column({ length: 100 })
    test_date: string;

    @OneToOne(() => officerprofile, (profile: officerprofile) => profile.officer300msprint)
    @JoinColumn({ name: 'officer_id' })
    officerprofile: officerprofile;
}