import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { CustomerIndicators, MonthYearCount } from '../../core/models/customer.model';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrl: './indicators.component.scss'
})
export class IndicatorsComponent implements OnInit {

  indicators?: CustomerIndicators;
  loading = false;
  errorMessage = '';
  maxRate = 0;
  maxMonthYear = 0;

  readonly monthYearColumns = ['period', 'total'];
  readonly rateColumns = ['monthName', 'total', 'rate'];

  constructor(private readonly customerService: CustomerService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.customerService.getIndicators()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: data => {
          this.indicators = data;
          this.maxRate = Math.max(0, ...data.birthRateByMonth.map(r => r.rate));
          this.maxMonthYear = Math.max(0, ...data.birthsByMonthYear.map(r => r.total));
        },
        error: (err: Error) => (this.errorMessage = err.message)
      });
  }

  periods(items: MonthYearCount[]): string {
    return items.map(i => i.period).join(', ');
  }

  barHeight(rate: number): number {
    return this.maxRate ? (rate / this.maxRate) * 100 : 0;
  }

  barWidth(total: number): number {
    return this.maxMonthYear ? (total / this.maxMonthYear) * 100 : 0;
  }
}
