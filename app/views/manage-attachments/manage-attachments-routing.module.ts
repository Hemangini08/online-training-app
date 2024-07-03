import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAttachmentsComponent } from './manage-attachments.component'

const routes: Routes = [
  {
    path: '',
    component: ManageAttachmentsComponent,
    data: {
      title: 'Manage Attachments',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAttachmentsRoutingModule{ }
