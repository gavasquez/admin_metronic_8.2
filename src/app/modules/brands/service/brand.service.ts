import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ResponseBrands } from '../interfaces/response-brands.interface';
import { Brand } from '../interfaces/brand.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

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
    let URL = URL_SERVICIOS + "/admin/brands?page="+page+"&search="+search;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get<ResponseBrands>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  create(data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/brands";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<{message: number, brand: Brand }>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  update(id: number, data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/brands/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.put<{message: number, brand: Brand }>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  delete(id: number){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/brands/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.delete<{message: number}>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

}
