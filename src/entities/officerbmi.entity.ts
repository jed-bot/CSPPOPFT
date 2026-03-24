import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";


@Entity('officer_bmi')
export class officerbmi {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officer_profile_id: number;

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

    //@Column({ length: 100 })
    //gender: string;

    //@Column()
    //age: number;

    @OneToOne(() => officerprofile, (officer: officerprofile) => officer.officerbmi)
    @JoinColumn({ name: 'officer_profile_id' })
    officerprofile: officerprofile;
}