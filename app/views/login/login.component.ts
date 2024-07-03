import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonHelper } from '../../shared/helper/common.helper';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  MerchantLoginForm! : FormGroup;
  public ipAddress = '';
  @ViewChild("textbox")
  public textbox!: TextBoxComponent;

  public ngAfterViewInit(): void {
    this.textbox.input.nativeElement.type = "password";
  }
  constructor(private fb : FormBuilder,
    private authenticationService:AuthenticationService,
    private spinner: NgxSpinnerService,
    private router:Router,
    private toastr: ToastrService,
    private helper:CommonHelper){
  }

  ngOnInit() : void{
    this.CreateForm();
    this.getIPAddress();
  }

  CreateForm()
  {
    this.MerchantLoginForm = this.fb.group({
      MerchantId : ['', [Validators.required, Validators.pattern("^[,0-9]*$")]],
      Password : ['', [Validators.required]]
    });
  }

  get f() { return this.MerchantLoginForm.controls; }

  getIPAddress() {
    this.authenticationService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  MerchantLogin()
  {
    if(this.MerchantLoginForm.valid)
    {
      this.spinner.show();
      this.authenticationService.MerchantLogin(this.MerchantLoginForm.value, this.ipAddress)
      .subscribe(data => {
        this.spinner.hide();
        if(data['Success'])
        { 
          this.toastr.success(data['Message']);
          this.router.navigate(['/dashboard']);
        }
        else{
          this.toastr.error(data['Message']);
        }
      }, err => {
        this.spinner.hide();
        console.log(err);
      })
    }
    else{
      this.toastr.warning("Kindly fill all required fields!");
      this.helper.markFormGroupTouched(this.MerchantLoginForm);
      return;
    }
  }
}
