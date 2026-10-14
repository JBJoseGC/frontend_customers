import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError, Customer, CustomerFilter, CustomerIndicators, CustomerRequest } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  private readonly baseUrl = `${environment.apiUrl}/customers`;

  constructor(private readonly http: HttpClient) {}

  findCustomers(filter?: CustomerFilter): Observable<Customer[]> {
    let params = new HttpParams();
    const dni = filter?.dni?.trim();
    const email = filter?.email?.trim();
    if (dni) {
      params = params.set('dni', dni);
    }
    if (email) {
      params = params.set('email', email);
    }
    return this.http.get<Customer[]>(this.baseUrl, { params }).pipe(catchError(this.handleError));
  }

  createCustomer(request: CustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, request).pipe(catchError(this.handleError));
  }

  getIndicators(): Observable<CustomerIndicators> {
    return this.http.get<CustomerIndicators>(`${this.baseUrl}/indicators`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      return throwError(() => new Error('No se pudo conectar con el servicio de clientes'));
    }
    const body = error.error as ApiError | null;
    const detail = body?.details?.length ? `: ${body.details.join(', ')}` : '';
    return throwError(() => new Error((body?.message ?? 'Ocurrió un error inesperado') + detail));
  }
}
