import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { ResponseProducts } from '../interfaces/response-products.interfaces';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-lists-product',
  templateUrl: './lists-product.component.html',
  styleUrls: ['./lists-product.component.scss']
})
export class ListsProductComponent implements OnInit{

  products: Product[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  // Search
  marcas: any[] = [];
  marca_id: string = '';

  categories_first: any[] = [];
  categorie_first_id: string = '';

  categorie_second_id: string = '';
  categories_second_back: any[] = [];
  categories_second: any[] = [];

  categorie_third_id: string = '';
  categories_thirds_back: any[] = [];
  categories_thirds: any[] = [];

  constructor(
    public productsService: ProductService,
    public modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.listSliders();
    this.isLoading$ = this.productsService.isLoading$;
    this.configAll();
  }

  listSliders(page: number = 1){
    let data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
    }
    this.productsService.list(page, data).subscribe(({ products, total }: ResponseProducts) => {
      this.currentPage = page;
      this.products = products.data;
      this.totalPages = total;
    });
  }

  searchTo() {
    this.listSliders();
  }

  loadPage($event: any){
    this.listSliders($event);
  }

  delete(product: Product){
    const modalRef = this.modalService.open(DeleteProductComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.product = product;
    modalRef.componentInstance.productD.subscribe((resp: any) => {
      let index = this.products.findIndex((item: Product) => item.id === product.id);
      if(index != -1){
        this.products.splice(index, 1);
      }
    });
  }

  configAll(){
    this.productsService.configAll().subscribe((resp: any) => {
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_second = resp.categories_second;
      this.categories_thirds = resp.categories_thirds;
    });
  }


  changeDeparmento(){
    this.categories_second_back = this.categories_second.filter((item: any) => item.categorie_second_id == this.categorie_first_id);
  }

  changeCategoria(){
    this.categories_thirds_back = this.categories_thirds.filter((item: any) => item.categorie_second_id == this.categorie_second_id);
  }

}
