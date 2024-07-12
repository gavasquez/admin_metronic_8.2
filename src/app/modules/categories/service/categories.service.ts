import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { CategoiresResponse } from '../../auth/interfaces/categories-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  listCategories(page: number = 1,search: string){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/categories?page="+page+"&search="+search;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get<CategoiresResponse>(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  configCategories(){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/categories/config";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }


  createCategorie(data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/categories";
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post<{message: number}>(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  showCategorie(categorie_id: string){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/categories/" + categorie_id;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  updateCategorie(categorie_id: string, data: any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/categories/"+categorie_id;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.post(URL, data, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  deleteCategorie(categorie_id: string){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + "/admin/categories" + categorie_id;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.delete(URL, {
      headers,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }



}
