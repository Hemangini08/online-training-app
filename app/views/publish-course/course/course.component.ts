import { Component } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { CourseService } from './services/course.service';
import { ToastrService } from 'ngx-toastr';
import { StepperDataService } from '../services/stepper-data.service';
import { PublishCourseComponent } from '../publish-course.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent  {
  public newCourse: boolean = false;
  public filter!: string;

  public courseDB: any[] = [];    // fetch Course from API
  public tempcourseDB: any[] = [] ;  // temporary variable to hold the temp added data
  public lastItemValue!: number ;
  public courseData: any[] = []
  public courseDetailsForm! : FormGroup;
  public newCourseName! : string;
  
  constructor(private fb : FormBuilder, private courseService : CourseService, private stepperDataService : StepperDataService,private stepper : PublishCourseComponent , private toastr: ToastrService) {
    
  }

  ngOnInit() : void {
    this.postCourseDetails();
    this.CreateForm();
  }
  
  CreateForm()
  {
    this.courseDetailsForm = this.fb.group({
      courseName : ['',Validators.required],
      courseDescription : [''],
      subCourseName : ['',Validators.required],
      subCourseDescription : [''],
      subCourseType : ['',Validators.required],
    });

  }

  public addNew(): void {
    this.tempcourseDB.push({
      courseName: this.filter,
      courseId: ++this.lastItemValue,
    });
    this.handleFilter(this.filter);

  }

  public handleFilter(value: string) {
    this.filter = value;
    this.courseData = this.tempcourseDB.filter(
      (s) => s.courseName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  fetchSelectedValue(selectedValue: any) {
    if (!this.courseDB.find(course => course.courseId === selectedValue) && selectedValue!==undefined && selectedValue !== null) {
      this.newCourse = true;
      // Set courseDescription validator based on newCourse value
      this.courseDetailsForm.get('courseDescription')?.setValidators(this.newCourse ? Validators.required : null);
      this.courseDetailsForm.get('courseDescription')?.updateValueAndValidity();
    } else if (selectedValue !== undefined) {
      this.newCourse = false;
      // Clear the validator if newCourse is false
      this.courseDetailsForm.get('courseDescription')?.clearValidators();
      this.courseDetailsForm.get('courseDescription')?.updateValueAndValidity();
    } else if (selectedValue === undefined) {
      this.newCourse = false;
      // Clear the validator if newCourse is false
      this.courseDetailsForm.get('courseDescription')?.clearValidators();
      this.courseDetailsForm.get('courseDescription')?.updateValueAndValidity();
    } else {
      this.newCourse = false;
      // Clear the validator if newCourse is false
      this.courseDetailsForm.get('courseDescription')?.clearValidators();
      this.courseDetailsForm.get('courseDescription')?.updateValueAndValidity();
    }
}

public postCourseDetails(){

  this.courseService.postCourseDetails( )
  .subscribe((data:any) => {
    this.courseDB=data['data'];
    this.tempcourseDB = this.courseDB.slice();
    this.courseData = this.tempcourseDB;
    this.lastItemValue = this.tempcourseDB[this.tempcourseDB.length - 1].courseId;
  },err=>{
    console.log(err);
  });

}


submitForm() {

  if (this.courseDetailsForm.valid) {
    if (this.newCourse===true){
      let flag=0
      this.newCourseName=this.tempcourseDB.find(item => item.courseId === this.courseDetailsForm.value.courseName).courseName;
      
      this.courseService.insertCourseDetails(this.newCourseName,this.courseDetailsForm.value )
      .subscribe((data:any) => {
        if(data['data'].result[0].result){
          flag=1;
          
          this.newCourseName = data['data'].result[0].resultId;
          this.toastr.success(data['data'].result[0].resultMsg, '', {
          timeOut: 3000,
          });
          
          if(flag===1){
           
            this.courseService.insertSubCourseDetails(this.newCourseName,this.courseDetailsForm.value )
            .subscribe((data:any) => {
              
              if(data['data'].result[0].result){
                this.toastr.success(data['data'].result[0].resultMsg, '', {
                timeOut: 3000,
                });
                this.stepperDataService.setSubcourse(data.data.result[0].resultId);
                this.stepperDataService.incrementStep();
                this.stepper.currentStep();
                this.clearForm();
              }
            },err=>{
              console.log(err);
            });
          }

        }
      },err=>{
        console.log(err);
      });

    }
    else{
      this.courseService.insertSubCourseDetails(this.courseDetailsForm.value.courseName,this.courseDetailsForm.value )
      .subscribe((data:any) => {
        
        if(data['data'].result[0].result){
          this.toastr.success(data['data'].result[0].resultMsg, '', {
          timeOut: 3000,
          });
          this.stepperDataService.setSubcourse(data.data.result[0].resultId);
          this.stepperDataService.incrementStep();
          this.stepper.currentStep();
          this.clearForm();
        }
      },err=>{
        console.log(err);
      });
    }
    
  } else {

    this.courseDetailsForm.markAllAsTouched();
  }
}

public clearForm(): void {
  this.courseDetailsForm.reset();
  this.newCourse=false;
}

}