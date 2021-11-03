import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { observable, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../_models/User';
import { AccountServiceService } from '../_services/account-service.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  user: User;
  constructor(public accountServices: AccountServiceService, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  login() {
    this.accountServices.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.toastr.error(error.error);
    });
  }
  logout() {
    this.accountServices.logout();
    this.router.navigateByUrl('/');
  }

  getCurrentUser = () => {
    this.accountServices.currentUser$.subscribe(user => {
      this.user = user;
      // !! means if user is null then set false else set true
    }, error => {
      console.log(error);
    });
  }


}
