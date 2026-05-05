// src/entities/officer.summary.monthly.entity.ts
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'monthly_performance_summary', // Change this to match your actual table
    expression: `
        SELECT * FROM monthly_performance_summary
    `
})
export class MonthlySummaryWithOfficer {
    @ViewColumn()
    officer_id: number;

    @ViewColumn()
    officer_name: string;

    @ViewColumn()
    year_month: string;  // Note: this is 'year_month' not 'month'

    @ViewColumn()
    month_date: Date;

    @ViewColumn()
    situp_avg: number | null;  // Note: 'situp_avg' not 'situp_score'

    @ViewColumn()
    situp_tests: number;

    @ViewColumn()
    pushup_avg: number | null;  // 'pushup_avg' not 'pushup_score'

    @ViewColumn()
    pushup_tests: number;

    @ViewColumn()
    sprint_avg: number | null;  // 'sprint_avg' not 'sprint_score'

    @ViewColumn()
    sprint_tests: number;

    @ViewColumn()
    walk_avg: number | null;  // 'walk_avg' not 'walk_score'

    @ViewColumn()
    walk_tests: number;

    @ViewColumn()
    overall_score: number | null;  // 'overall_score' not 'overall_average'

    @ViewColumn()
    status: string;
}