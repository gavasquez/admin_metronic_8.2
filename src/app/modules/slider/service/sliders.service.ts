import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ResponseSliders } from '../interfaces/response-sliders.interface';
import { ResponseShowSliders } from '../interfaces/response-show-sliders.interface';


@Injectable({
  providedIn: 'root'
})
export class SlidersService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  list(page: number = 1, search: string){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/sliders?page="+page+"&search="+search;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get<ResponseSliders>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  create(data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/sliders";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<{message: number}>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  show(id: string){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/sliders/" + id;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get<ResponseShowSliders>(URL, {

      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  update(id: string, data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/sliders/"+id;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  delete(id: number){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/sliders/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.delete<{message: number}>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }



}
