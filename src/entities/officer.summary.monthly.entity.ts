// src/entities/monthly-summary-with-officers.view.ts
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'monthly_summary_with_officers',
})
export class MonthlySummaryWithOfficer {
  @ViewColumn()
  officer_id: number;

  @ViewColumn()
  officer_name: string;

  @ViewColumn()
  office_unit: string;

  @ViewColumn()
  sex: string;

  @ViewColumn()
  age: number;

  @ViewColumn()
  month: string;

  @ViewColumn()
  month_date: Date;

  @ViewColumn()
  situp_score: number | null;

  @ViewColumn()
  situp_tests: number;

  @ViewColumn()
  pushup_score: number | null;

  @ViewColumn()
  pushup_tests: number;

  @ViewColumn()
  sprint_score: number | null;

  @ViewColumn()
  sprint_tests: number;

  @ViewColumn()
  walk_score: number | null;

  @ViewColumn()
  walk_tests: number;

  @ViewColumn()
  overall_average: number | null;

  @ViewColumn()
  status: string;
}