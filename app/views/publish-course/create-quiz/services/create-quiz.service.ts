import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CreateQuizService {

  constructor(private http: HttpClient) {  }

  InsertQuiz(model : any){
    debugger
    let objData : any = {
      QuestionList : model
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
