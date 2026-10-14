import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { IndicatorsComponent } from './features/indicators/indicators.component';

const routes: Routes = [
  { path: 'clientes', component: CustomerListComponent, title: 'Clientes' },
  { path: 'indicadores', component: IndicatorsComponent, title: 'Indicadores' },
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: '**', redirectTo: 'clientes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
