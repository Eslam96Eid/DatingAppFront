import { Injectable } from '@angular/core';
import {  CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountServiceService } from '../_services/account-service.service';
import { map } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private accountService:AccountServiceService , private toastr :ToastrService) {}
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if(user) return  true;
        this.toastr.error('You shall not pass!');
        return false
      })
    )
  }
  
}
