import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { Customer, CustomerRequest } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';
import { DateUtils } from '../../../core/utils/date.utils';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent {

  readonly maxDate = new Date();
  saving = false;
  errorMessage = '';

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    birthDate: [null as Date | null, Validators.required]
  });

  constructor(
    private readonly customerService: CustomerService,
    private readonly dialogRef: MatDialogRef<CustomerFormComponent, Customer>
  ) {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const request: CustomerRequest = {
      firstName: value.firstName!.trim(),
      lastName: value.lastName!.trim(),
      email: value.email!.trim(),
      dni: value.dni!,
      birthDate: DateUtils.toLocalDateIso(value.birthDate!)
    };

    this.saving = true;
    this.errorMessage = '';
    this.customerService.createCustomer(request)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: customer => this.dialogRef.close(customer),
        error: (err: Error) => (this.errorMessage = err.message)
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
