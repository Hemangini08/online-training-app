import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';

// import { CourseComponent } from './views/publish-course/course/course.component';
// import { AttachmentComponent } from './views/publish-course/attachment/attachment.component';
// import { CreateQuizComponent } from './views/publish-course/create-quiz/create-quiz.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full'
  // },

  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      // {
      //   path: 'transaction-history',
      //   loadChildren: () =>
      //     import('./views/transaction-history/transaction-history.module').then((m) => m.TransactionHistoryModule)
      // },
      {
        path: 'publish-course',
        loadChildren: () =>
          import('./views/publish-course/publish-course.module').then((m) => m.PublishCourseModule)
      },
      {
        path: 'manage-attachments',
        loadChildren: () =>
          import('./views/manage-attachments/manage-attachments.module').then((m) => m.ManageAttachmentsModule)
      },
      {
        path: 'manage-enrollments',
        loadChildren: () =>
          import('./views/manage-enrollments/manage-enrollments.module').then((m) => m.ManageEnrollmentsModule)
      },
      
    ]
  },
  {path: '**', redirectTo: 'dashboard'},
  // {
  //   path : "course",
  //   component : CourseComponent
  // },
  // {
  //   path : "attachment",
  //   component : AttachmentComponent
  // },
  // {
  //   path : "create-quiz",
  //   component : CreateQuizComponent
  // },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // scrollPositionRestoration: 'top',
      // anchorScrolling: 'enabled',
      // initialNavigation: 'enabledBlocking'
      // // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
