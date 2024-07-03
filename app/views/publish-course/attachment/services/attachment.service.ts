import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private http: HttpClient) {  }

  insertAttachmentDetails(model : any){
    const formData = new FormData();

    // formData.append("AttachmentList", model);

    // Iterate through each attachment and append it to formData
      model.forEach((attachment: any, index: number) => {
      // Append file to formData
      formData.append(`attachmentList[${index}].file`, attachment.file.rawFile);
      // Append other fields
      formData.append(`attachmentList[${index}].attachmentId`, attachment.attachmentId);
      formData.append(`attachmentList[${index}].subCourseId`, attachment.subCourseId);
      formData.append(`attachmentList[${index}].timeToComplete`, attachment.timeToComplete);
      formData.append(`attachmentList[${index}].description`, attachment.description);
      formData.append(`attachmentList[${index}].fileName`, attachment.fileName);
      formData.append(`attachmentList[${index}].attachmentType`, attachment.attachmentType);
    });
      debugger
     return this.http.post<Response>(`${environment.apidotnetBaseUrl}Attachment/AddAttachment`, formData)
     .pipe(
      map((response : Response) => response),
      catchError(this.errorHanlder)
    )
    }

    getAttachmentTypes(){
      let objData : any ={
      }          
         return this.http.post<Response>(`${environment.apidotnetBaseUrl}AttachmentTypeExtensions/GetAttachmentTypeExtensions`, objData)
         .pipe(
          map((response : Response) => response),
          catchError(this.errorHanlder)
        )
        }

    getAttachments(){
      let objData : any = {}
      return this.http.post<Response>(`${environment.apidotnetBaseUrl}Attachment/GetAttachmentList`, objData)
      .pipe(
        map((response : Response) => response),
        catchError(this.errorHanlder)
      )
    }  
    
    deleteAttachments(attachmentId : number){
      let objData : any = {
        attachmentId : attachmentId
      }
      return this.http
      .post<Response>(`${environment.apidotnetBaseUrl}Attachment/DeleteAttaxhment`, objData)
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
