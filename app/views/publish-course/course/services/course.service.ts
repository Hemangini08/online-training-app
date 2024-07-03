import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) {  }

  postCourseDetails(){

    let objData : any = {}
    return this.http
    .post<Response>(`${environment.apidotnetBaseUrl}Course/GetCourseList`, objData)
    .pipe(
      map((response : Response) => response),
      catchError(this.errorHanlder)
    )
  }
  getEnrollmentPerCourse(){

    let objData : any = {}
    return this.http
    .post<Response>(`${environment.apidotnetBaseUrl}Enrollment/GetEnrollmentPerCourseList`, objData)
    .pipe(
      map((response : Response) => response),
      catchError(this.errorHanlder)
    )
  }
  postSubCourseDetailsByCourseId(courseId : number){
    let objData : any = {
      courseId : courseId
    }
    return this.http
    .post<Response>(`${environment.apidotnetBaseUrl}SubCourse/GetSubCourseByCourseId`, objData)
    .pipe(
      map((response : Response) => response),
      catchError(this.errorHanlder)
    )
  }
  
  insertCourseDetails(newCourseName : string ,model : any){
    debugger
    let objData : any = {
      courseName : newCourseName,
      courseDescription  : model.courseDescription,

    }
    return this.http
    .post<Response>(`${environment.apidotnetBaseUrl}Course/AddCourse`, objData)
    .pipe(
      map((response : Response) => response),
      catchError(this.errorHanlder)
    )
    }

    updateCourseDetails(CourseId : string, model : any){
      let objData : any = {
        courseId : CourseId,
        courseName : model.courseName,
        courseDescription : model.courseDescription
      }
      return this.http
      .post<Response>(`${environment.apidotnetBaseUrl}Course/UpdateCourse`, objData)
      .pipe(
        map((response : Response) => response),
        catchError(this.errorHanlder)
      )
    }

    DeleteCourseDetails(courseId : any){
      let objData : any = {
        courseId : courseId,
      }
      return this.http
      .post<Response>(`${environment.apidotnetBaseUrl}Course/DeleteCourse`, objData)
      .pipe(
        map((response : Response) => response),
        catchError(this.errorHanlder)
      )
    }

    insertSubCourseDetails(newCourseName : string ,model : any){
      debugger
      let SubCourseData : any = {
        
        courseId : newCourseName,
        subCourseName  : model.subCourseName,
        description  : model.subCourseDescription,
        type : model.subCourseType
      }
       return this.http.post<Response>(`${environment.apidotnetBaseUrl}SubCourse/AddSubCourse`, SubCourseData)
       .pipe(
        map((response : Response) => response),
        catchError(this.errorHanlder)
      )
      }
  
  updateSubCourseDetails(subCourseId : any, model : any){
    let SubCourseData : any = {
      subCourseId : subCourseId,
      courseId : model.courseId,
      subCourseName : model.subCourseName,
      description : model.description,
      type : model.type
    }
    return this.http
    .post<Response>(`${environment.apidotnetBaseUrl}SubCourse/UpdateSubCourse`, SubCourseData)
    .pipe(
      map((response : Response) => response),
      catchError(this.errorHanlder)
    )
  }

  DeleteSubCourseDetails(subcourseId : any){
    let objData : any = {
      subCourseId : subcourseId,
    }
    return this.http
    .post<Response>(`${environment.apidotnetBaseUrl}SubCourse/DeleteSubCourse`, objData)
    .pipe(
      map((response : Response) => response),
      catchError(this.errorHanlder)
    )
  }
  
  errorHanlder(error: Response) {
    console.log(error);
    return throwError(error);
  }
}
