import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Pagination } from '../_models/Pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
members:Partial<Member[]>;
pagination: Pagination;
predicate = 'liked';
pageNumber =1;
pageSize=5;

  constructor(private memberService : MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }
  loadLikes(){
    this.memberService.getLikes(this.predicate , this.pageNumber , this.pageSize).subscribe(response =>{
      this.members = response.data;
      this.pagination = response.pagination;  
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }

}
