import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";

@Entity('pushup_1min')  // Your table name
export class officer1minpushup {
    @PrimaryGeneratedColumn()
    id: number;

    // Match the database column name exactly
    @Column({ name: 'officer_id' })
    officer_id: number;  // Use the exact column name from database

    @Column({ length: 100 })
    gender: string;

    @Column()
    age: number;

    @Column()
    reps: number;

    // Match the database column name exactly
    @Column({ name: 'test_date', length: 100 })
    test_date: string;  // Use the exact column name from database

    // Match the database column name exactly
    @Column()
    grade: string;  // Note: Your CSV shows "70%", so grade is likely a string/varchar

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @OneToOne(() => officerprofile, (profile: officerprofile) => profile.officer1minpushup)
    @JoinColumn({ name: 'officer_id' })  // Use the actual foreign key column
    officerprofile: officerprofile;
}