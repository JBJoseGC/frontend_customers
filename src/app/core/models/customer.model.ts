export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string;
  createdAt: string;
}

export interface CustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string;
}

export interface CustomerFilter {
  dni?: string | null;
  email?: string | null;
}

export interface MonthYearCount {
  year: number;
  month: number;
  period: string;
  total: number;
}

export interface MonthlyBirthRate {
  month: number;
  monthName: string;
  total: number;
  rate: number;
}

export interface CustomerIndicators {
  totalCustomers: number;
  birthsByMonthYear: MonthYearCount[];
  highestBirthMonthYear: MonthYearCount[];
  lowestBirthMonthYear: MonthYearCount[];
  birthRateByMonth: MonthlyBirthRate[];
}

export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  details?: string[];
}
