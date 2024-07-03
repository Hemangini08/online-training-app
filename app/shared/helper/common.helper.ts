import { NgModule } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jwtDecode  } from 'jwt-decode';
@NgModule()
export class CommonHelper{
    constructor(){}
    getDecodedAccessToken(token: string): any {
        try {
          return jwtDecode(token);
        }
        catch (Error) {
          return null;
        }
      }
      
    public markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: FormGroup<any>) => {
            control.markAsTouched();
            if (control.controls) {
            this.markFormGroupTouched(control);
            }
        });
    }

    public formGroupMarkAsTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: FormGroup<any>) => {
            control.markAsTouched();
            if (control.controls) {
            this.formGroupMarkAsTouched(control);
            }
        });
    }
}


