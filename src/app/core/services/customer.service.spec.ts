import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Customer, CustomerIndicators, CustomerRequest } from '../models/customer.model';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  const baseUrl = `${environment.apiUrl}/customers`;
  let service: CustomerService;
  let httpMock: HttpTestingController;

  const customer: Customer = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@mail.com',
    dni: '70123456',
    birthDate: '1993-04-18',
    createdAt: '2026-10-14T18:30:00'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('consulta todos los clientes sin parámetros cuando no hay filtros', () => {
    service.findCustomers().subscribe(result => expect(result).toEqual([customer]));

    const req = httpMock.expectOne(r => r.url === baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush([customer]);
  });

  it('envía solo los filtros informados, sin espacios', () => {
    service.findCustomers({ dni: ' 70123456 ', email: '  ' }).subscribe();

    const req = httpMock.expectOne(r => r.url === baseUrl);
    expect(req.request.params.get('dni')).toBe('70123456');
    expect(req.request.params.has('email')).toBeFalse();
    req.flush([]);
  });

  it('crea un cliente con POST', () => {
    const request: CustomerRequest = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@mail.com',
      dni: '70123456',
      birthDate: '1993-04-18'
    };

    service.createCustomer(request).subscribe(result => expect(result.id).toBe(1));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(customer);
  });

  it('obtiene los indicadores', () => {
    const indicators: CustomerIndicators = {
      totalCustomers: 1,
      birthsByMonthYear: [{ year: 1993, month: 4, period: 'Abril 1993', total: 1 }],
      highestBirthMonthYear: [{ year: 1993, month: 4, period: 'Abril 1993', total: 1 }],
      lowestBirthMonthYear: [{ year: 1993, month: 4, period: 'Abril 1993', total: 1 }],
      birthRateByMonth: []
    };

    service.getIndicators().subscribe(result => expect(result).toEqual(indicators));

    const req = httpMock.expectOne(`${baseUrl}/indicators`);
    expect(req.request.method).toBe('GET');
    req.flush(indicators);
  });

  it('propaga el mensaje de error del backend', () => {
    let message = '';
    service.createCustomer({} as CustomerRequest).subscribe({ error: (e: Error) => (message = e.message) });

    httpMock.expectOne(baseUrl).flush(
      { status: 409, message: 'Ya existe un cliente con el DNI 70123456' },
      { status: 409, statusText: 'Conflict' }
    );

    expect(message).toBe('Ya existe un cliente con el DNI 70123456');
  });

  it('informa cuando el backend no está disponible', () => {
    let message = '';
    service.getIndicators().subscribe({ error: (e: Error) => (message = e.message) });

    httpMock.expectOne(`${baseUrl}/indicators`).error(new ProgressEvent('error'), { status: 0 });

    expect(message).toBe('No se pudo conectar con el servicio de clientes');
  });
});
