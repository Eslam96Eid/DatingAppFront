import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AccountServiceService } from '../_services/account-service.service';
import { User } from '../_models/User';
import { catchError, take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService : AccountServiceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
   let currentUser : any ;
   let authReq = request;

   this.accountService.currentUser$.pipe(take(1)).subscribe(user=> currentUser = user);
   if(currentUser){
     request = request.clone({
       setHeaders:{
         Authorization : 'Bearer ${currentUser.token}'
       }
     })
     authReq = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + currentUser.token) });
   }
 
    return next.handle(authReq);
  }
}
