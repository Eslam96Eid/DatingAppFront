import { Component, OnInit } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/Pagination';
import { User } from 'src/app/_models/User';
import { UserParams } from 'src/app/_models/UserParams';
import { AccountServiceService } from 'src/app/_services/account-service.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members$: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList =[{value :'male' , display:'Male'},{value :'female' , display:'Female'}]
  constructor(private memberService: MembersService) {
   this.userParams = memberService.getUserParams();
   }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
       this.members$ = response.data;
       this.pagination = response.pagination;  

    })
  }
  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }
  resetFilters(){
    this.userParams = this.memberService.resetUserParams();
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }

}
