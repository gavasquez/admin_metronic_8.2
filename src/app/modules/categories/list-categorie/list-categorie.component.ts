import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoiresResponse, Datum } from '../../auth/interfaces/categories-response.interface';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.scss']
})
export class ListCategorieComponent implements OnInit {


  categories: Datum[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public categoreService: CategoriesService,
    public modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.listCategories();
    this.isLoading$ = this.categoreService.isLoading$;
  }

  listCategories(page: number = 1){
    this.categoreService.listCategories(page, this.search).subscribe(({ categories, total }: CategoiresResponse) => {
      this.currentPage = page;
      this.categories = categories.data;
      this.totalPages = total;
    });
  }

  searchTo() {
    this.listCategories();
  }

  loadPage($event: any){
    this.listCategories($event);
  }

  getDomParser(categorie: any){
    var miDiv: any = document.getElementById('svg-categorie-'+categorie.id);
    miDiv.innerHTML = categorie.icon;
  }

}
