import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerFormComponent } from '../customer-form/customer-form.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly displayedColumns = ['dni', 'fullName', 'email', 'birthDate', 'createdAt'];
  readonly dataSource = new MatTableDataSource<Customer>([]);
  loading = false;

  private readonly fb = inject(FormBuilder);

  readonly filterForm = this.fb.group({
    dni: ['', Validators.pattern(/^\d{1,8}$/)],
    email: ['']
  });

  constructor(
    private readonly customerService: CustomerService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item, column) =>
      column === 'fullName' ? `${item.firstName} ${item.lastName}`.toLowerCase() : (item as any)[column];
    this.search();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get hasFilters(): boolean {
    const { dni, email } = this.filterForm.value;
    return !!(dni?.trim() || email?.trim());
  }

  search(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.customerService.findCustomers(this.filterForm.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: customers => {
          this.dataSource.data = customers;
          this.paginator?.firstPage();
        },
        error: (err: Error) => this.notify(err.message, true)
      });
  }

  clear(): void {
    this.filterForm.reset({ dni: '', email: '' });
    this.search();
  }

  openCreate(): void {
    this.dialog.open(CustomerFormComponent, { width: '560px', maxWidth: '95vw', disableClose: true })
      .afterClosed()
      .subscribe((created?: Customer) => {
        if (created) {
          this.notify(`Cliente ${created.firstName} ${created.lastName} registrado correctamente`);
          this.filterForm.reset({ dni: '', email: '' });
          this.search();
        }
      });
  }

  private notify(message: string, isError = false): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: isError ? 'ic-snack-error' : 'ic-snack-success'
    });
  }
}
