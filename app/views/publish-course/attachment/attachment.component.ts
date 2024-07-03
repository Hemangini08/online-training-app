import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StepperDataService } from '../services/stepper-data.service';
import { PublishCourseComponent } from '../publish-course.component';
import { AttachmentService } from './services/attachment.service';
import { FileRestrictions } from "@progress/kendo-angular-upload";

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {
  AttachmentDetailsForm!: FormGroup;
  attachments!: FormArray;
  public attachmentTypes! : any;
  fileRestrictions!: FileRestrictions;
  public subId!: number;
  // uploadSaveUrl : any; // should represent an actual API endpoint
  // uploadRemoveUrl : any; // should represent an actual API endpoint

  constructor(private fb: FormBuilder, private toastr: ToastrService,
    private stepperDataService : StepperDataService,
    private stepper : PublishCourseComponent, 
    private attachmentService : AttachmentService) {
    }

  ngOnInit(): void {
    this.getAttachmentTypes();
    this.createForm();
  }

  createForm() {
    this.AttachmentDetailsForm = this.fb.group({
      attachments: this.fb.array([])
    });
    this.attachments = this.AttachmentDetailsForm.get('attachments') as FormArray;
    this.addAttachment(); // Initially add one attachment
  }

  addAttachment() {
    this.attachments.push(
      this.fb.group({
        fileName: ['', Validators.required],
        file: [null, Validators.required],
        description: ['', Validators.required],
        timeToComplete: [0, [Validators.required, this.validatePositiveNumber.bind(this)]]
      })
    );


  }

  // --------- Validations -------------
  validatePositiveNumber(control: any) {
    if (control.value < 0) {
      this.toastr.error("Duration cannot be negative", '', {
        timeOut: 3000,
        });
      return { 'negativeTimeToComplete': true };
    }
    return null;
  }

  removeAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  onFileSelect(event: any, attachmentIndex: number) {
    const file = event.files[0]; // Assuming single file upload
    const attachmentControl = this.attachments.at(attachmentIndex);
    if (attachmentControl) {
      const fileControl = attachmentControl.get('file');
      if (fileControl) {
        fileControl.setValue(file);
        if (fileControl) {
          // // Store the file as a Blob object
          // fileControl.setValue(new Blob([file]));
        }
      }
    }

  }
  onFileRemove(attachmentIndex: number) {
    const attachmentControl = this.attachments.at(attachmentIndex);
    if (attachmentControl) {
      const fileControl = attachmentControl.get('file');
      if (fileControl) {
        fileControl.setValue(null); // Clear the value of the file control
      }
    }
  }
  
  public getAttachmentTypes(){
    let extToType! : any;
    this.attachmentService.getAttachmentTypes()
    .subscribe((data:any) => {
      if(data.success){
        extToType= data.data
        this.attachmentTypes = extToType; 
        this.fileRestrictions = {
            allowedExtensions: this.attachmentTypes.map((item: { extension: any; }) => item.extension),
          };
        }
    },err=>{
      console.log(err);
    });
  }
  // getAttachmentType(extToType: any[]) {
  //   // Logic to determine attachment type based on extToType
  //   // For example, you can return the type based on the file extension
  //   return extToType[0].type; // Adjust index as needed
  // }

  submitForm() {

    if(this.AttachmentDetailsForm.value.attachments.map((file: { file: { validationErrors: any; }; }) => file.file.validationErrors).length>0){
        const attachments = this.AttachmentDetailsForm.value.attachments;
        attachments.forEach((attachment: { file: any }, index: number) => {
          if (attachment.file && 'validationErrors' in attachment.file) {
            
            this.toastr.error(attachment.file.extension+' file type is not allowed', 'Invalid File Type', { timeOut: 3000 });
            this.onFileRemove(index);
          }
        });
    }
    if (this.AttachmentDetailsForm.valid) {
      // Handle form submission here
      this.AttachmentDetailsForm.value.attachments.forEach((attachment: { attachmentId: any; subCourseId: any; attachmentType: any;file: any;}) => {
        attachment.attachmentId = 0;
        attachment.subCourseId = this.stepperDataService.subcourseId;
        attachment.attachmentType=this.attachmentTypes.find((item: { extension: string; }) => item.extension === attachment.file.extension).attachmentType
      });
      this.attachmentService.insertAttachmentDetails(this.AttachmentDetailsForm.value.attachments)
          .subscribe((data:any) => {
            debugger
            if(data.data[0].result){
              debugger
              this.toastr.success(data.data[0].resultMsg, '', {
              timeOut: 3000,
              });
              this.clearForm();
              this.stepperDataService.incrementStep();
              this.stepper.currentStep();
            }
            else {
              this.toastr.error(data.data[0].resultMsg, '', {
                timeOut: 3000,
                });
            }
          },err=>{
            console.log(err);
          });

    } else {
      // Form is invalid, show error or handle accordingly
      this.toastr.error('Form is invalid. Please fill in all required fields.', '', {
        timeOut: 3000,
        });
        this.AttachmentDetailsForm.markAllAsTouched();
    }
  }

  public clearForm(): void {
    this.AttachmentDetailsForm.reset();
    this.createForm();
  }
}
