import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/Pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
messages :Message[];
pagination :Pagination;
container ='Unread';
pageNumber =1;
pageSize= 5;
loading = false;
  constructor(private messageService :MessageService , private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages(){
    this.loading = true;
    this.messageService.getMessages(this.pageNumber,this.pageSize,this.container).subscribe(response=>{
      this.messages =response.data;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }
  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }

  deleteMessage = (id: number) => {
    this.confirmService.confirm('Confirm deletion', 'Are you sure?').subscribe(result => {
      if (result) {
        this.messageService.deleteMessage(id).subscribe(() => {
          this.messages.splice(this.messages.findIndex(x =>Number(x.id )=== id), 1);
        });
      }
    });
  }

}
