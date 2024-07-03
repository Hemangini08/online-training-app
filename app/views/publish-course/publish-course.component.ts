import { Component } from '@angular/core';

import {
  bookIcon,
  eyeIcon,
  paperclipIcon,
} from "@progress/kendo-svg-icons";
import { StepperDataService } from './services/stepper-data.service';

@Component({
  selector: 'app-publish-course',
  templateUrl: './publish-course.component.html',
  styleUrls: ['./publish-course.component.scss']
})
export class PublishCourseComponent {
  public current = 0;


  public steps = [
    { label: "Course", svgIcon: bookIcon },
    { label: "Attachments", svgIcon: paperclipIcon, disabled:true},
    { label: "Quiz", svgIcon: eyeIcon, disabled:true },
  ];

  constructor(private stepperDataService : StepperDataService){
    this.stepperDataService.initializeStep();
  }

  public currentStep() {
    this.current=this.stepperDataService.currentStep;
    switch(this.current){
      case 1:
      this.steps = [
        { label: "Course", svgIcon: bookIcon, disabled:true },
        { label: "Attachments", svgIcon: paperclipIcon},
        { label: "Quiz", svgIcon: eyeIcon, disabled:true },
      ];
      break;
      case 2:
        this.steps = [
          { label: "Course", svgIcon: bookIcon, disabled:true },
          { label: "Attachments", svgIcon: paperclipIcon, disabled:true },
        { label: "Quiz", svgIcon: eyeIcon},
      ];
      break;
    }
  }

}
