import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { officeraccount } from "./officeraccount.entity";
import { officer1minpushup } from "./officer1minpushup.entity";
import { officer300msprint } from "./officer300msprint.entity";
import { officersitup1min } from "./officersitup1min.entity";
import { officerbmi } from "./officerbmi.entity";

@Entity('officerprofile')
export class officerprofile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    officeraccount_id: number;

    @Column({ length: 100 })
    first_name: string;

    @Column({ length: 100 })
    last_name: string;

    @Column({ length: 100 })
    middle_name: string;

    @Column()
    age: number;

    @Column({ length: 100 })
    gender: string;

    @Column({ length: 100 })
    birth_date: string;

    @Column({ length: 100 })
    office_unit: string;

    @OneToOne(() => officeraccount, (acct: officeraccount) => acct.profile)
    @JoinColumn({ name: 'officeraccount_id' })
    officeraccount: officeraccount;

    @OneToOne(() => officer1minpushup, (pushup: officer1minpushup) => pushup.officerprofile)
    officer1minpushup: officer1minpushup;

    @OneToOne(() => officer300msprint, (sprint: officer300msprint) => sprint.officerprofile)
    officer300msprint: officer300msprint;

    @OneToOne(() => officersitup1min, (situp: officersitup1min) => situp.officerprofile)
    officersitup1min: officersitup1min;

    @OneToOne(() => officerbmi, (bmi: officerbmi) => bmi.officerprofile)
    officerbmi: officerbmi;
}