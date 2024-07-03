import { Component, ChangeDetectorRef} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CourseService } from '../publish-course/course/services/course.service';
import { EnrollmentService } from './services/manage-enrollments.service';
import { GridDataResult, RemoveEvent } from '@progress/kendo-angular-grid';
import { GroupResult, State, groupBy, distinct } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { iterator } from '@progress/kendo-angular-grid/utils';

@Component({
  selector: 'app-manage-enrollments',
  templateUrl: './manage-enrollments.component.html',
  styleUrls: ['./manage-enrollments.component.scss']
})
export class ManageEnrollmentsComponent {

  public courseDB!: GridDataResult;
  public formGroup: FormGroup = new FormGroup({});
  public enrollmentsDB : any[] =[];
  public subcourseForEnrollments : any[] = [];
  public subCourseId! : any;
  public gridData : any[] = [''];
  public gridvisible = false;

  constructor(
    public courseService : CourseService,
    public enrollmentService : EnrollmentService,
    private toastr : ToastrService,
    private cdr : ChangeDetectorRef,
    private router : Router)
    { }

    ngOnInit() : void {
      this.loadData();
    }

    public loadData(){
      this.getEnrollments();
    }

    public GridFilter(){

      let filteredData : any = { unq : this.subcourseForEnrollments.map(item => ({ courseId : item.courseId, courseName : item.courseName, subCourseId: item.subCourseId, subCourseName : item.subCourseName}) )};
      filteredData = distinct(filteredData.unq,'subCourseId')

      this.subcourseForEnrollments = groupBy(filteredData, [
        { field: 'courseName'},
      ]) as GroupResult[];
    
    }

    public getEnrollments()
    {
      this.enrollmentService.getEnrollments()
      .subscribe((data:any) => {
        this.enrollmentsDB = data['data'];
        this.subcourseForEnrollments = this.enrollmentsDB;
        this.GridFilter();
      }, err => {
        console.log(err);
      });
    }

    onGridFilterChange(event: any): void {
      this.subCourseId = event.subCourseId;
      this.gridData = this.enrollmentsDB.filter(item => item.subCourseId === this.subCourseId);
      if(this.gridData.length===0){
        this.gridvisible=false;
      }else {
        this.gridvisible=true;
      }
    }

    // --------Grid Actions---------

    public onStateChange(state: State) : void {
      this.loadData();
    }

    public editHandler(): void {
      this.router.navigateByUrl('/attachments')
    }

    public removeHandler(args: RemoveEvent) : void {
      // ------API Work---------

      this.enrollmentService.deleteEnrollments(args["dataItem"].enrollmentId)
      .subscribe((data:any) => {
        var msg = data['data'][0].resultMsg;
        this.toastr.error(msg, '', {
          timeOut : 3000,
        });
        this.cdr.detectChanges();
      },err=>{
        console.log(err);
      });
    }
  }
  

