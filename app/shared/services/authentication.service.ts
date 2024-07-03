import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../../../environments/environment';
import { GlobalSettings } from '../models/globalSettings';
import { BehaviorSubject, Observable, map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { User } from '../models/customModels';
import { Router } from '@angular/router';
import { CommonHelper } from '../helper/common.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public deviceInfo : any = null;
  private currentUserSubject!: BehaviorSubject<User>;
  public currentUser!: Observable<User>;

  constructor(private http : HttpClient,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private commonHelper: CommonHelper) { }

    private getsetUserData() {
      if (localStorage.getItem('currentUser')) {
          var item1 : any = localStorage.getItem('currentUser');
          sessionStorage.setItem('currentUser', item1);
      }
      if (sessionStorage.getItem('currentUser')) {
          var item2 : any = sessionStorage.getItem('currentUser');
          localStorage.setItem('currentUser', item2);
      }

      var item = localStorage.getItem('currentUser');
      let curUser = item ? JSON.parse(CryptoJS.AES.decrypt(item, GlobalSettings.SecretKey).toString(CryptoJS.enc.Utf8)) : null;
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(curUser));
      this.currentUser = this.currentUserSubject.asObservable();
      if(!curUser){
        // this.currentUserSubject.next(null);
      }
    }

  public get currentUserValue(): User {
    this.getsetUserData();
    return this.currentUserSubject.value;
  }

  public get currentUserData(): User {
      return this.commonHelper.getDecodedAccessToken(this.currentUserValue.Token);
  }

  public getIPAddress() {
    return this.http.get("http://api.ipify.org/?format=json");
  } 

  MerchantLogin(FormData : any, ipAddress: string)
  {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    
    return this.http
            .post<any>(`${environment.apidotnetBaseUrl}Account/MerchantLogin`, { MerchantId: FormData.MerchantId, Password: FormData.Password, APIKey: GlobalSettings.APIKey, 
                IPAddress: ipAddress,Os: this.deviceInfo.os,Osversion: this.deviceInfo.os_version,DeviceType: this.deviceInfo.deviceType,
                Browser: this.deviceInfo.browser, BrowserVersion: this.deviceInfo.browser_version,Orientation: this.deviceInfo.orientation,
                Device: this.deviceInfo.device, UserAgent : this.deviceInfo.userAgent
            })
    .pipe(
      map(user => {
        if (user && user.Data && user.Data.Token) {
            let ExpireTime = new Date();
            
            ExpireTime.setMinutes(ExpireTime.getMinutes() + (user.Data.LoginTimeSpan - 10));
            user.Data.TokenExpirationTime = ExpireTime;
            let curUser = CryptoJS.AES.encrypt(JSON.stringify(user.Data), GlobalSettings.SecretKey);
            
            localStorage.setItem('currentUser', curUser.toString());
            sessionStorage.setItem('currentUser', curUser.toString());

            // this.currentUserSubject.next(user.Data);
        }
        return user;
    }),
    )        
  }

}
