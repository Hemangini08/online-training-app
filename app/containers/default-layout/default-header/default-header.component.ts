import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from '../../services/header.service';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { GlobalSettings } from '../../../shared/models/globalSettings';
import * as CryptoJS from 'crypto-js';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  
  public headerTitle: string = '';

  MerchantList : any;
  public MerchantListSource: Array<{ MerchantName: string, MerchantId: number }> = [];
  public selectedValue! : Number;
  MerchantId : number = 0;
  BrandId : number = 0;
  MerchantDetails: any = [];
  MerchantName : string = "";
  MerchantAddress : string = "";
  public MerchantLogo : string = "";

  constructor(private classToggler: ClassToggleService,
    private spinner: NgxSpinnerService,
    private service : HeaderService,
    private router : Router,
    private Toastr : ToastrService,
    private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit()
  {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setHeaderTitle();
      }
    });

    

    var item = localStorage.getItem('currentUser');
    this.MerchantDetails = item ? JSON.parse(CryptoJS.AES.decrypt(item, GlobalSettings.SecretKey).toString(CryptoJS.enc.Utf8)) : null;
    if(this.MerchantDetails != undefined || this.MerchantDetails != null)
    {
      this.MerchantId = this.MerchantDetails.UserId;
      this.BrandId = this.MerchantDetails.BrandId;
      localStorage.removeItem('SelectedMerchant');
      this.GetMerchantByBrandId();
    }
    
  }

  setHeaderTitle() {
    const path = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    switch (path) {
      case 'publish-course':
        this.headerTitle = 'Publish Course';
        break;
      case 'client-details':
        this.headerTitle = 'Client Details';
        break;
      case 'module-details':
        this.headerTitle = 'Module Details';
        break;
      // Add more cases for other paths if needed
      default:
        this.headerTitle = '';
        break;
    }
  }

  GetMerchantByBrandId()
  {
    this.spinner.show();
    this.service.GetMerchantByBrandId(this.BrandId)
    .subscribe((data:any) => {
      if(data['Success'] == true){
        this.MerchantList = data['Data'];
        this.MerchantListSource = this.MerchantList.slice();
        this.selectedValue = this.MerchantId;

        var MerchantDetails = this.MerchantList.find((x: { MerchantId: Number; }) => x.MerchantId == this.MerchantId);
        this.MerchantName = MerchantDetails.MerchantName;
        this.MerchantAddress = MerchantDetails.MerchantAddress;
        this.MerchantLogo = MerchantDetails.MerchantLogo; // "https://s3.ap-south-1.amazonaws.com/atdealbox/merchants/"+this.MerchantId+"/1";
      }
      else{
        this.MerchantList = [];
        this.MerchantListSource = this.MerchantList.slice();
      }
      this.spinner.hide();
    },err =>{
      this.spinner.hide();
      console.log(err);
    });
  }

  HandleMerchantFilter(value : any)
  {
    this.MerchantList = this.MerchantListSource.filter((s) => s.MerchantName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  HandleMerchantChange(MerchantId : Number)
  {
    localStorage.removeItem('SelectedMerchant');

    var MerchantDetails = this.MerchantList.find((x: { MerchantId: Number; }) => x.MerchantId == MerchantId);
    let merchant = CryptoJS.AES.encrypt(JSON.stringify(MerchantDetails), GlobalSettings.SecretKey);
    localStorage.setItem('SelectedMerchant', merchant.toString());

    this.MerchantName = MerchantDetails.MerchantName;
    this.MerchantAddress = MerchantDetails.MerchantAddress;
    this.MerchantLogo = MerchantDetails.MerchantLogo; // "https://s3.ap-south-1.amazonaws.com/atdealbox/merchants/"+MerchantId+"/1";
  }

  Logout()
  {
    this.spinner.show();
    window.setTimeout(()=>{
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('SelectedMerchant');
    this.spinner.hide();
    this.Toastr.success("Merchant successfully sign out!");
    this.router.navigate(['/']);
    },1500);
  }
}
