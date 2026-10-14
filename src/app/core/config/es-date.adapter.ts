import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

// Permite escribir la fecha como dd/mm/aaaa
@Injectable()
export class EsDateAdapter extends NativeDateAdapter {

  override parse(value: unknown): Date | null {
    if (typeof value === 'string') {
      const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) {
        return value.trim() ? this.invalid() : null;
      }
      const [, d, m, y] = match.map(Number);
      const date = new Date(y, m - 1, d);
      return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : this.invalid();
    }
    return super.parse(value);
  }

  override format(date: Date, displayFormat: object): string {
    if ((displayFormat as { input?: boolean }).input) {
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      return `${d}/${m}/${date.getFullYear()}`;
    }
    return super.format(date, displayFormat);
  }
}

export const ES_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: { input: true } },
  display: {
    dateInput: { input: true },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
