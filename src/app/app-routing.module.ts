import { NgModule } from '@angular/core';
import { RouterModule, Routes, RunGuardsAndResolvers } from '@angular/router';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ServerErrorComponent } from './Errors/server-error/server-error.component';
import { TestErrorComponent } from './Errors/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AdminGuard } from './_guards/admin.guard';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberDetailsReslover } from './_reslover/member-detail.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always' as RunGuardsAndResolvers,
    canActivate: [AuthGuard] ,
    children: [
      { path: 'members', component: MemberListComponent},
      { path: 'members/:username', component: MemberDetailComponent ,resolve : {member : MemberDetailsReslover} },
      { path: 'member/edit', component: MemberEditComponent , canDeactivate:[PreventUnsavedChangesGuard] },
      { path: 'list', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'admin', component: AdminPanelComponent, canActivate:[AdminGuard] },
    ]
  },
  { path: 'errors', component: TestErrorComponent},
  { path: 'not-found', component: NotFoundComponent},
  { path: 'server-error', component: ServerErrorComponent},
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
