import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";


@Entity('officerbmi')
export class officerbmi {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officerprofile_id: number;

    @Column()
    height_meter: number;

    @Column()
    weight_kg: number;

    @Column()
    bmi: number;

    @Column({ length: 100 })
    category: string;

    @Column({ length: 100 })
    month_taken: string;

    @Column({ length: 100 })
    gender: string;

    @Column()
    age: number;

    @OneToOne(() => officerprofile, (officer: officerprofile) => officer.officerbmi)
    @JoinColumn({ name: 'officerprofile_id' })
    officerprofile: officerprofile;
}