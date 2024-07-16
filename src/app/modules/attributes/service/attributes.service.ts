import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ResponseAttributes } from '../interfaces/response-attributes.interfaces';
import { Attribute } from '../interfaces/attribute';
import { Property } from '../interfaces/property';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

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
    let URL = URL_SERVICIOS + "/admin/attributes?page="+page+"&search="+search;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get<ResponseAttributes>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  create(data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/attributes";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<{message: number, attribute: Attribute }>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  update(id: number, data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/attributes/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.put(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  delete(id: number){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/attributes/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.delete<{message: number}>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  createPropertie(data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/properties";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<{message: number, propertie: Property }>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  deletePropertie(id: number){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/properties/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.delete<{message: number}>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

}
