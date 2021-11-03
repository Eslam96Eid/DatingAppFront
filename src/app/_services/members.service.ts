import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/User';
import { UserParams } from '../_models/UserParams';
import { AccountServiceService } from './account-service.service';
import { getPaginationResult, getPationationHeaders } from './paginationHelpers';
@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams;
  user: User;
  constructor(private http: HttpClient, private accountService: AccountServiceService) {
    accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  addLike(username : string){
    return this.http.post(this.baseUrl + 'likes/' + username , {});
  }
  getLikes(predicate : string , pageNumber , pageSize){
    let params = getPationationHeaders(pageNumber , pageSize);
    params = params.append('predicate' , predicate);
    return getPaginationResult<any>(this.baseUrl + 'likes' , params,this.http)
    .pipe(map(response => {
      return response;
    }))
  }
  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  getUserParams() {
    return this.userParams;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMember(username: string) {
    // const member = [...this.memberCache.values()]
    //   .reduce((arr, elem) => arr.concat(elem.result),[])
    //   .find((member: Member) => member.username === username);
    // if (member) {
    //   return of(member);
    // }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + "users/set-main-photo/" + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.put(this.baseUrl + "users/delete-photo/" + photoId, {});

  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = getPationationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return getPaginationResult<any>(this.baseUrl + 'users', params , this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }))
  }


}


