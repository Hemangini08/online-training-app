import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishCourseRoutingModule } from './publish-course-routing.module';
import { CourseComponent } from './course/course.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';



import { LayoutModule } from '@progress/kendo-angular-layout';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormsModule } from "@angular/forms";
import { IconsModule } from "@progress/kendo-angular-icons";
import { ReactiveFormsModule } from '@angular/forms';
import { PublishCourseComponent } from './publish-course.component';



@NgModule({
  declarations: [
    PublishCourseComponent,
    CourseComponent,
    AttachmentComponent,
    CreateQuizComponent,

  ],
  imports: [
    CommonModule,
    PublishCourseRoutingModule,
    LayoutModule,
    LabelModule,
    InputsModule,
    UploadsModule,
    DropDownsModule,
    DateInputsModule,
    ButtonsModule,
    FormsModule,
    IconsModule,
    ReactiveFormsModule,
  ],
})
export class PublishCourseModule { }
