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

  constructor(
    public productsService: ProductService,
    public modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.listSliders();
    this.isLoading$ = this.productsService.isLoading$;
  }

  listSliders(page: number = 1){
    this.productsService.list(page, this.search).subscribe(({ products, total }: ResponseProducts) => {
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
    })
  }
}
