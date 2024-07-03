import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ManageEnrollmentsComponent} from './manage-enrollments.component';

const routes: Routes = [
    {
        path: '',
        component: ManageEnrollmentsComponent,
        data: {
            title: 'Manage Enrollment',
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ManageEnrollmentsRoutingModule { }