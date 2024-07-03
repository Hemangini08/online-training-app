import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalSettings } from '../../shared/models/globalSettings';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import {CourseService} from '../publish-course/course/services/course.service';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { GroupResult, State,groupBy } from '@progress/kendo-data-query';
import { CancelEvent,EditEvent, RemoveEvent, SaveEvent } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  
  public courseDB!: GridDataResult;  
  private editedRowIndex! : number;

  public formGroup: FormGroup = new FormGroup({});

  @ViewChild(GridComponent) grid!: GridComponent;
  constructor(
    public courseService : CourseService,
    private toastr : ToastrService,
    private cdr: ChangeDetectorRef )
  {}

  ngOnInit(): void {
    this.loadData();
  }

  public postCourseDetails(){

    this.courseService.postCourseDetails( )
    .subscribe((data:any) => {
      this.courseDB=data['data'];
    },err=>{
      console.log(err);
    });
  
  }



  public loadData(){
    this.postCourseDetails();
    this.getEnrollmentPerCourse()

  }
  

  public EnrollmentCountDB : any[] = [];
  public barEnrollmentCount : any[] = [];
  public barFilterName :  any = [''];
  // Define categoryAxis and valueAxis if needed
  public valueAxis: any = {};

  public categoryAxis: any = {
    labels: {
      rotation: -5
    }
  };
  // ----------Bar Filtering--------------
  public filterBar(){
    
    this.barFilterName=groupBy(this.EnrollmentCountDB, [
    { field: 'courseName' },
  ]) as GroupResult[];

}

onBarFilterChange(event: any): void {
  const selectedId = event.map((item: any) => item.subCourseId);
  this.barEnrollmentCount= this.EnrollmentCountDB.filter(item => selectedId.includes(item.subCourseId));
  if(this.barEnrollmentCount.length===0){
    this.barEnrollmentCount=this.EnrollmentCountDB;
  }

}

public getEnrollmentPerCourse()
{
  this.courseService.getEnrollmentPerCourse()
  .subscribe((data:any) => {
    this.EnrollmentCountDB = data['data'];
    this.barEnrollmentCount = this.EnrollmentCountDB;
    this.filterBar();
    // this.barProName=data.data.map((entry: any) => entry.proName);

  },err=>{
    console.log(err);
  });
}

// -----------Grid-------------





public onStateChange(state: State): void {

  // ----api work---------- 
  this.loadData();
}
public onDescriptionChange(event : Event): void {
  debugger
  // this.descValue=event.target['courseDescription'];
  // ----api work---------- 
  this.loadData();
}




public editHandler(args: EditEvent): void {
  
  this.closeEditor(args.sender);

  // define all editable fields validators and default values
  const { dataItem } = args;
  
  this.formGroup = new FormGroup({
      courseName: new FormControl(dataItem.courseName, Validators.required),
      courseDescription: new FormControl(dataItem.courseDescription,Validators.required),
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

  if(formGroup.valid){
  
    var gridCourseId = (sender as any)['data'][rowIndex].courseId;
    this.courseService.updateCourseDetails(gridCourseId,formGroup.value)
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
    },
    (error:any)=>{
      console.log(error)
    }
    );
    sender.closeRow(rowIndex);
  }
  this.loadData();
}

public removeHandler(args: RemoveEvent): void {

  // // ------- API Work----------
  this.courseService.DeleteCourseDetails( args["dataItem"].courseId)
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
