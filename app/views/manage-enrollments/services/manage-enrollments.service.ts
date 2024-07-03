import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, throwError } from "rxjs";
import { environment } from "../../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {

    constructor(private http: HttpClient) { }

    getEnrollments(){
        let objData : any = {
        }
        return this.http.post<Response>(`${environment.apidotnetBaseUrl}Enrollment/GetEnrollmentList`, objData)
        .pipe(
            map((response: Response) => response),
            catchError(this.errorHandler)
        )
    }
    deleteEnrollments(enrollmentId : number){
        let objData : any = {
            enrollmentId:enrollmentId
        }
        return this.http.post<Response>(`${environment.apidotnetBaseUrl}Enrollment/DeleteEnrollment`, objData)
        .pipe(
            map((response : Response) => response),
            catchError(this.errorHandler)
        )
    }
    errorHandler(error: Response) {
       console.log(error);
       return throwError(error);
    }
    }
    
