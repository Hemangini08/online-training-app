import { Component } from '@angular/core';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { State, process } from '@progress/kendo-data-query';
import { TransactionHistoryService } from './services/transaction-history.service';
import { GlobalSettings } from '../../shared/models/globalSettings';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent {

  activeTab: number = 1; // Initially set the first button as active
  public TransactionDealsDetails: any[] = [];
  TransactionDealsDetailsGridView! : GridDataResult;

  public TransactionBillDetails: any[] = [];
  TransactionBillDetailsGridView! : GridDataResult;

  TransactionForm!: FormGroup;
  MerchantId : number = 0;

  public FDate :Date = new Date();
  public TDate :Date = new Date;

  public sizes = [100, 50, 20, 10];
  public buttonCount = 10;

  MerchantDetails: any = [];

  constructor(private fb : FormBuilder,
    private spinner: NgxSpinnerService,
    private service : TransactionHistoryService,
    private toastr : ToastrService,
    private router : Router)
  {}

  ngOnInit(): void {
    var d = new Date();
    var dh = new Date();
    this.FDate = new Date(d.setDate(d.getDate() - 7));
    this.TDate = new Date(dh.setDate(dh.getDate() - 1));
    this.CreateForm();
    var item = localStorage.getItem('currentUser');
    this.MerchantDetails = item ? JSON.parse(CryptoJS.AES.decrypt(item, GlobalSettings.SecretKey).toString(CryptoJS.enc.Utf8)) : null;
    if(this.MerchantDetails != undefined || this.MerchantDetails != null)
    {
      var merdata = localStorage.getItem('SelectedMerchant');
      var MerchantData = merdata ? JSON.parse(CryptoJS.AES.decrypt(merdata, GlobalSettings.SecretKey).toString(CryptoJS.enc.Utf8)) : null;
      if(MerchantData == null)
      {
        localStorage.removeItem('SelectedMerchant');
        this.MerchantId = this.MerchantDetails.UserId;
      }
      else{
        this.MerchantId = MerchantData.MerchantId;
      }
      this.GetTransactionHistoryByMerchantId();
    }

  }

  toggleTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  public value: Date = new Date(2000, 2, 10);

  dealsortOptions = [{
    allowUnsort: true,
    mode: 'single'
  }];

  public dealstate: State = {
    skip: 0,
    take: 10,
    sort: [{
      field: '',
      dir: 'asc'
    }],
    filter: {
      logic: 'and',
      filters: []
    }
  };
  
  BillsortOptions = [{
    allowUnsort: true,
    mode: 'single'
  }];

  public Billstate: State = {
    skip: 0,
    take: 10,
    sort: [{
      field: '',
      dir: 'asc'
    }],
    filter: {
      logic: 'and',
      filters: []
    }
  };
  
  CreateForm()
  {
    this.TransactionForm = this.fb.group({
      FromDate : [this.FDate,[Validators.required]],
      ToDate : [this.TDate,[Validators.required]],
      MerchantId : ['']
    });
  }

  GetTransactionHistoryByMerchantId()
  {
    this.spinner.show();
    var FromDate = this.TransactionForm.value.FromDate;
    var ToDate = this.TransactionForm.value.ToDate;
    if(FromDate <= ToDate)
    {
      if(this.getDiffDays(FromDate, ToDate) <= 366)
      {
        this.TransactionForm.patchValue({
          MerchantId : this.MerchantId
        })
        this.service.GetTransactionHistoryByMerchantId(this.TransactionForm.value)
        .subscribe((data:any) => {
          if(data['Success'] == true){
            
            this.TransactionDealsDetails = data['Data'].TransactionDeals;
            this.TransactionDealsDetailsGridView = process(this.TransactionDealsDetails, this.dealstate);
            
            this.TransactionBillDetails = data['Data'].BillPayments;
            this.TransactionBillDetailsGridView = process(this.TransactionBillDetails, this.Billstate);
            
          }
          else{
            this.TransactionDealsDetails = [];
            this.TransactionDealsDetailsGridView = process(this.TransactionDealsDetails, this.dealstate);
            
            this.TransactionBillDetails = [];
            this.TransactionBillDetailsGridView = process(this.TransactionBillDetails, this.Billstate);
          }
          this.spinner.hide();
        },err=>{
          this.spinner.hide();
          console.log(err);
        });
      }
      else
      {
        this.spinner.hide();
        this.toastr.error("Please select date between 366 days!")
      }
    }
    else
    {
      this.spinner.hide();
      this.toastr.error("Please add a valid from and to date!")
    }
  }

  public dataStateChange(dealstate: DataStateChangeEvent): void {
    this.dealstate = dealstate;
    this.TransactionDealsDetailsGridView = process(this.TransactionDealsDetails, this.dealstate);
  }
  public BillDataStateChange(Billstate: DataStateChangeEvent): void {
    this.Billstate = Billstate;
    this.TransactionBillDetailsGridView = process(this.TransactionBillDetails, this.Billstate);
  }

  SearchTransactionHistory()
  {
    var item = localStorage.getItem('SelectedMerchant');
    var MerchantDetails = item ? JSON.parse(CryptoJS.AES.decrypt(item, GlobalSettings.SecretKey).toString(CryptoJS.enc.Utf8)) : null;
    if(MerchantDetails != undefined || MerchantDetails != null)
    {
      this.MerchantId = MerchantDetails.MerchantId;
    }
    this.GetTransactionHistoryByMerchantId();
  }

  getDiffDays(startDate : any, endDate: any) {
    return Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
  }
}
