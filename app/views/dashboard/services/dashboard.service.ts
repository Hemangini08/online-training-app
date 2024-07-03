import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {  }

  getCourseDetails(){
    let objData : any = {
    };
    return this.http
    .post<Response>(`${environment.apidotnetBaseUrl}Quiz/AddQuiz`, objData)
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
