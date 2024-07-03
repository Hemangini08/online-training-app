import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageEnrollmentsComponent } from './manage-enrollments.component';
import { ManageEnrollmentsRoutingModule } from './manage-enrollments-routing.service';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { LabelModule } from "@progress/kendo-angular-label";

@NgModule({
  declarations: [ManageEnrollmentsComponent],
  imports: [
    CommonModule,
    ManageEnrollmentsRoutingModule,
    GridModule,
    LayoutModule,
    ButtonsModule,
    DropDownListModule,
    InputsModule,
    DropDownsModule,
    LabelModule,
  ]
})
export class ManageEnrollmentsModule { }
