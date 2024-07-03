import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionHistoryRoutingModule } from './transaction-history-routing.module';
import { TransactionHistoryComponent } from './transaction-history.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TransactionHistoryComponent],
  imports: [
    GridModule,
    LabelModule,
    DateInputsModule,
    CommonModule,
    TransactionHistoryRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TransactionHistoryModule { }
