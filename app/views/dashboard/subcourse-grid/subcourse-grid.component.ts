import { ChangeDetectorRef,Component, Input } from '@angular/core';
import {CourseService} from '../../publish-course/course/services/course.service';
import { CancelEvent,EditEvent,GridComponent,GridDataResult,RemoveEvent,SaveEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

export interface Course {
  courseId: number;
}

@Component({
  selector: 'app-subcourse-grid',
  templateUrl: './subcourse-grid.component.html',
  styleUrls: ['./subcourse-grid.component.scss']
})
export class SubcourseGridComponent {

  @Input() public courseId!: Course;
  public subCourseDB!: GridDataResult;  
  private editedRowIndex! : number;
  public formGroup: FormGroup = new FormGroup({});

  constructor(
    public courseService : CourseService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
   )
  {}
  ngOnInit(): void {
    this.loadGridData();
  }

  public postSubCourseDetails(){

    this.courseService.postSubCourseDetailsByCourseId(this.courseId.courseId)
    .subscribe((data:any) => {

      this.subCourseDB=data.data;
    },err=>{
      console.log(err);
    });
  
  }

  public loadGridData(){
    this.postSubCourseDetails();

  }

  // -------------Grid Actions--------------



public onStateChange(state: State): void {
  // ----api work---------- 
  this.loadGridData();
}


public editHandler(args: EditEvent): void {
  this.closeEditor(args.sender);
  // define all editable fields validators and default values
  const { dataItem } = args;
  debugger
  this.formGroup = new FormGroup({
      subCourseName: new FormControl(dataItem.subCourseName, Validators.required),
      description: new FormControl(dataItem.description),
      type: new FormControl(dataItem.type,Validators.required),
      courseId : new FormControl(dataItem.courseId),
  });


 
  this.editedRowIndex = args.rowIndex;
  // put the row in edit mode, with the `FormGroup` build above
  args.sender.editRow(args.rowIndex, this.formGroup);


}

public cancelHandler(args: CancelEvent): void {
  // close the editor for the given row
  this.closeEditor(args.sender, args.rowIndex);
}

public saveHandler({sender, rowIndex, formGroup}: SaveEvent): void {
  debugger
  if(formGroup.valid){
    debugger
    var gridSubCourseId = (sender as any)['data'][rowIndex].subCourseId;
    this.courseService.updateSubCourseDetails(gridSubCourseId,formGroup.value)
    .subscribe((data:any)=>{

      
      var msg =data.data[0].resultMsg;

      if(data.data[0].result){
   
        this.toastr.success(msg, '', {
          timeOut: 3000,
        });
      }
      else {
 
        this.toastr.error(msg, '', {
          timeOut: 3000,
        });
      }
      this.loadGridData();
    },
    (error:any)=>{
      console.log(error)
    }
    );
    sender.closeRow(rowIndex);
  }
  this.formGroup.markAllAsTouched();
  this.loadGridData();
}

public removeHandler(args: RemoveEvent): void {

  // // ------- API Work----------
  this.courseService.DeleteSubCourseDetails( args["dataItem"].subCourseId)
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

private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
  // ---close the editor------
  if (rowIndex!=null){ 
  grid.closeRow(rowIndex);
  //----- reset the helpers------
  this.editedRowIndex = NaN;
  this.formGroup.reset();
  }
  
}
}
