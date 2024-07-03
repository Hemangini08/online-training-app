import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient,
    private router : Router) { }

  GetMerchantByBrandId(BrandId : Number){
    
    let objData : any = {
      BrandId : BrandId
    }
    return this.http
    .post(`${environment.apidotnetBaseUrl}Merchant/GetMerchantByBrandId`, objData)
    .pipe(
      map((response) => response),
      catchError(this.errorHanlder)
    )
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('SelectedMerchant');
    // this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  errorHanlder(error: Response) {
    console.log(error);
    return throwError(error);
  }
}
