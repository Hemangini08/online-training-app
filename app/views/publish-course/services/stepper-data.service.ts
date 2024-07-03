import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepperDataService {

  constructor() { }

  currentStep: number = 0;
  subcourseId : number = 0;

  initializeStep(){
    this.currentStep = 0;
    this.subcourseId = 0;
  }

  incrementStep() {
    this.currentStep++;
  }

  setSubcourse(subId : number){
    this.subcourseId = subId ;
  }

}
