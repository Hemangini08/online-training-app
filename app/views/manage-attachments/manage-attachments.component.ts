import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {CourseService} from '../publish-course/course/services/course.service';
import {AttachmentService} from '../publish-course/attachment/services/attachment.service';
import {  GridDataResult, RemoveEvent } from '@progress/kendo-angular-grid';
import { GroupResult, State, groupBy, distinct } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-attachments',
  templateUrl: './manage-attachments.component.html',
  styleUrls: ['./manage-attachments.component.scss']
})
export class ManageAttachmentsComponent {
  public courseDB!: GridDataResult;  
  private editedRowIndex!: number;

  public formGroup: FormGroup = new FormGroup({});
  public attachmentsDB : any[] = [];
  public  subcourseForAttachments : any[] = [];
  public subCourseId! : any;
  public gridData :  any[] = [''];
  public gridvisible  = false;
  constructor(
    public courseService : CourseService,
    public attachmentService : AttachmentService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router:Router)
  {}

  ngOnInit(): void {
    this.loadData();
  }
  
  public loadData(){
    this.getAttachments();
  }

  public GridFilter(){
    let filterData : any = { unq : this.subcourseForAttachments.map(item => ({ courseId: item.courseId, courseName: item.courseName, subCourseId : item.subCourseId , subCourseName : item.subCourseName}))};

    filterData = distinct(filterData.unq,'subCourseId')
    this.subcourseForAttachments=groupBy(filterData, [
    { field: 'courseName' },
  ]) as GroupResult[];

  }

  public getAttachments()
  {
    this.attachmentService.getAttachments()
    .subscribe((data:any) => {
      this.attachmentsDB = data['data'];
      this.subcourseForAttachments = this.attachmentsDB;
      this.GridFilter();
      // this.barProName=data.data.map((entry: any) => entry.proName);

    },err=>{
      console.log(err);
    });
  }
  onGridFilterChange(event: any): void {
    debugger
    this.subCourseId = event.subCourseId;
    this.gridData= this.attachmentsDB.filter(item => item.subCourseId === this.subCourseId);
    if(this.gridData.length===0){
      this.gridvisible=false;
    }else{
      this.gridvisible=true;
    }
  
  }


// -------------Grid Actions--------------


public onStateChange(state: State): void {
  // ----api work---------- 
  this.loadData();
}


public editHandler(): void {
  debugger
  this.router.navigateByUrl('/publish-course/attachments',)
  }

public removeHandler(args: RemoveEvent): void {

  // // ------- API Work----------
  this.attachmentService.deleteAttachments( args["dataItem"].attachmentId)
  .subscribe((data:any) => {
    var msg  =data['data'][0].resultMsg;
    this.toastr.error(msg, '', {
      timeOut: 3000,
    });
    this.cdr.detectChanges();
  },err=>{
    console.log(err);
  });
  // this.postProjectDetails();
  // this.postStatusDetails();
  // this.postEmployeePerProject();
  // this.labelContent = this.labelContent.bind(this);


}
}
