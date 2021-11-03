import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { User } from '../_models/User';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';
@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {
  baseUrl = environment.apiUrl;

  // It is kind of like a buffer object, store the value inside here
  // Anytime a subscriber subscribe to it, it will emit the last value inside it
  // 1 means we will going to store only one user, it like size of a bugger
  private currentUserSource = new ReplaySubject<User>(1);
  // By convention we add $ sign to observables
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient , private presence :PresenceService) { }
  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.presence.CreateHubConnection(user);
          // localStorage.setItem('user', JSON.stringify(user));
          // this.currentUserSource.next(user);
        }
       // return user;
      })
    )
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: any) => {
        if (user) {
          this.setCurrentUser(user);
          this.presence.CreateHubConnection(user);
        }
      })
    )
  }
  setCurrentUser = (user: User) => {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next();
    this.presence.stopHubConnection();
  }

  getDecodedToken = (token: string) => {
    // atob allows us to decode the value inside token is returning
    // token is not encrypted only the signature part is encrupted
    return JSON.parse(atob(token?.split('.')[1]));
  }
}
