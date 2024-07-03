import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateQuizService } from './services/create-quiz.service';
import { StepperDataService } from '../services/stepper-data.service';


@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  createQuizForm!: FormGroup;
  noOfQuestions: number = 10;
  // questionArray!:number[];
  questions!: FormArray;
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private createQuizService : CreateQuizService,
    private stepperDataService : StepperDataService,
  ) {}

  ngOnInit(): void {
    this.CreateForm();
    this.updateNoOfQuestions(this.noOfQuestions);
  }

  CreateForm(){
    this.createQuizForm = this.fb.group({
      totalQuestions: [this.noOfQuestions,[Validators.min(1),Validators.max(25)]],
      questions: this.fb.array([])
    });
    this.questions = this.createQuizForm.get('questions') as FormArray;
  }

  updateNoOfQuestions(value: any) {
    // this.questionArray = Array(Math.round(value)).fill(null).map((_, index) => index + 1);
    this.noOfQuestions=Math.round(value);
    if(this.noOfQuestions>=1 && this.noOfQuestions<=25){
    this.createQuizForm.get("totalQuestions")?.setValue(this.noOfQuestions);

    // Clear existing form array
    while (this.questions.length !== 0) {
      this.questions.removeAt(0);
    }

    // Push new form groups based on updated noOfQuestions
    while (this.questions.length !== this.noOfQuestions){
      this.questions.push(
        this.fb.group({
          question: ['', Validators.required],
          optA: ['', Validators.required],
          optB: ['', Validators.required],
          optC: ['', Validators.required],
          optD: ['', Validators.required],
          correctOpt : ['', Validators.required] 
        })
      );
    };
    }
    else{
      this.toastr.error('No of Questions in Quiz can only be between 10 to 25', '', {
        timeOut: 3000,
      });
    }
  }
  

  submitForm() {
    if(this.questions.valid) {

      this.questions.value.forEach((question: { quizId: any; subCourseId: any; }) => {
        question.quizId = 0;
        question.subCourseId = this.stepperDataService.subcourseId;
      });


      this.createQuizService.InsertQuiz(this.questions.value)
          .subscribe((data:any) => {
            
            if(data.data[0].result){
              
              this.toastr.success(data.data[0].resultMsg, 'Quiz Inserted Successful', {
              timeOut: 3000,
              });
              this.clearForm();
            }
          },err=>{
            console.log(err);
          });
 
    }
    else{        
        if (this.questions.value.some((obj: { correctOpt: string; }) => obj.correctOpt === "" ) ){
          // Display toast message if correctOpt is not filled
          this.toastr.error('Please fill in the correct answer for all questions.', '', {
            timeOut: 3000,
          });
          // Mark the correctOpt control as touched to display validation error
          this.questions.get('correctOpt')?.markAsTouched();
        }
          // Form is invalid, show error or handle accordingly
          this.toastr.error('Form is invalid. Please fill in all required fields.', '', {
            timeOut: 3000,
          });
        this.questions.markAllAsTouched();
    }
  }

  clearForm() {
    this.createQuizForm.reset();
    // this.questionArray = Array((0)).fill(null).map((_, index) => index + 1);
    this.noOfQuestions=Math.round(0);
    this.createQuizForm.get("totalQuestions")?.setValue(0);

    // Clear existing form array
    while (this.questions.length !== 0) {
      this.questions.removeAt(0);
    }
  }
}
