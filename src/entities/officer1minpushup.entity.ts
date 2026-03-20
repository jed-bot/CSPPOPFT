import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";


@Entity('officer1minpushup')
export class officer1minpushup {
    @PrimaryGeneratedColumn()
    id: number;

    // foreign key, no length on numeric type
    @Column()
    officerprofile_id: number;

    @Column({ length: 100 })
    gender: string;

    @Column()
    age: number;

    @Column()
    reps: number;

    @Column({ length: 100 })
    month_taken: string;

    @Column()
    grade: number;

    @OneToOne(() => officerprofile, (profile: officerprofile) => profile.officer1minpushup)
    @JoinColumn({ name: 'officerprofile_id' })
    officerprofile: officerprofile;
} 