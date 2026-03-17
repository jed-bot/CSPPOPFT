import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";

@Entity('officersitup1min')
export class officersitup1min {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officerprofile_id: number;

    @Column()
    age: number;

    @Column({ length: 100 })
    gender: string;

    @Column()
    reps: number;

    @Column({ length: 100 })
    month_taken: string;

    @OneToOne(() => officerprofile, (profile: officerprofile) => profile.officersitup1min)
    @JoinColumn({ name: 'officerprofile_id' })
    officerprofile: officerprofile;
}