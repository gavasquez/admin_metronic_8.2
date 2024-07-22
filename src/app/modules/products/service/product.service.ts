import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ResponseProducts } from '../interfaces/response-products.interfaces';
import { Product } from '../interfaces/product.interface';
import { ResponseShowProduct } from '../interfaces/response-show-product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  list(page: number = 1, data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/products/index?page="+page;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<ResponseProducts>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  configAll(){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/products/config";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get<any>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  create(data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/products";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<{message: number}>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  show(id: string){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/products/" + id;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get<any>(URL, {

      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  update(id: string, data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/products/"+id;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<ResponseShowProduct>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  delete(id: number){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/products/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.delete<{message: number}>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }


  imagenAdd(data:any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/products/imagens";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<{message: number}>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  deleteImage(id: string) {
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/admin/products/imagens/${id}`;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.delete<{message: number}>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

}
