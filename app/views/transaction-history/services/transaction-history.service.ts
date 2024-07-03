import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  constructor(private http: HttpClient) { }

  GetTransactionHistoryByMerchantId(model : any){
    var fromDate = model.FromDate != null ? new Date(model.FromDate).toDateString() : model.FromDate;
    var toDate = model.ToDate != null ? new Date(model.ToDate).toDateString() : model.ToDate;
    let objData : any = {
      Fromdate : fromDate,
      Todate : toDate,
      MerchantId : model.MerchantId
    }
    return this.http
    .post(`${environment.apidotnetBaseUrl}Transaction/GetTransactionHistoryByMerchantId`, objData)
    .pipe(
      map((response) => response),
      catchError(this.errorHanlder)
    )
  }

  errorHanlder(error: Response) {
    console.log(error);
    return throwError(error);
  }
}
