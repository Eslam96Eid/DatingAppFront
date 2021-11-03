import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/User';
import { AccountServiceService } from '../_services/account-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accountService :AccountServiceService, private toastr :ToastrService, private router: Router) {}
  
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user: User) => {
        if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
          return true;
        }
        else{
        this.toastr.error('You are not authorized for this area');
        this.router.navigate(['/']);
        }
        return false;
      })
    );
  }
  
}
