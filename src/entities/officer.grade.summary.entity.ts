import { Entity, Column,PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { officerprofile } from "./officerprofile.entity";

@Entity('officer_performance_yearly')
export class OfficerPerformanceSummary {
    @PrimaryColumn()
    officer_id: number;

    @PrimaryColumn()
    year: string;

    @Column()
    officer_name: string;

    @Column({ nullable: true })
    pushup_grade: string;

    @Column({ nullable: true })
    situp_grade: string;

    @Column({ nullable: true })
    walk_grade: string;

    @Column({ nullable: true })
    sprint_grade: string;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    average_score: number;

    @Column()
    status: string;
}