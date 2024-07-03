import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishCourseComponent } from './publish-course.component'
import { AttachmentComponent } from './attachment/attachment.component';

const routes: Routes = [
  {
    path: '',
    component: PublishCourseComponent,
    data: {
      title: 'Publish Course',
    },
    children:[
      {
        path: 'attachments',
        component: AttachmentComponent,
        data: {
          title: '/attachments',
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishCourseRoutingModule{ }
