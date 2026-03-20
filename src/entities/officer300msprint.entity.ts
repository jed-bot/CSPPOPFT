import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";

@Entity('officer300msprint')
export class officer300msprint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officerprofile_id: number;

    @Column()
    age: number;

    @Column({ length: 100 })
    gender: string;

    @Column()
    minutes: number;

    @Column()
    seconds: number;

    @Column({ length: 100 })
    month_taken: string;

    @OneToOne(() => officerprofile, (profile: officerprofile) => profile.officer300msprint)
    @JoinColumn({ name: 'officerprofile_id' })
    officerprofile: officerprofile;
}