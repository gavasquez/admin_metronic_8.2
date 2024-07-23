import { Component, OnInit } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBrandComponent } from '../create-brand/create-brand.component';
import { EditBrandComponent } from '../edit-brand/edit-brand.component';
import { DeleteBrandComponent } from '../delete-brand/delete-brand.component';
import { ResponseBrands } from '../interfaces/response-brands.interface';
import { Brand } from '../interfaces/brand.interface';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss']
})
export class ListBrandComponent implements OnInit{

  brands: Brand[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public brandsService: BrandService,
    public modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.listBrands();
    this.isLoading$ = this.brandsService.isLoading$;
  }

  listBrands(page: number = 1){
    this.brandsService.list(page, this.search).subscribe(( { total, brands }: ResponseBrands) => {
      this.totalPages = total;
      this.brands = brands;
    });
  }

  openModalCreateBrand(){
    const modalRef = this.modalService.open(CreateBrandComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.brandC.subscribe((brand: Brand)=> {
      this.brands.unshift(brand);
    });
  }

  openModalEditBrand(brand: Brand){
    const modalRef = this.modalService.open(EditBrandComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.brand = brand;
    modalRef.componentInstance.BrandE.subscribe((brand: Brand)=> {
      /* this.attributes.unshift(attribute); */
      let index = this.brands.findIndex((item: Brand) => item.id === brand.id);
      if(index != -1) {
        this.brands[ index ] = brand;
      }
    });
  }


  searchTo() {
    this.listBrands();
  }

  loadPage($event: any){
    this.listBrands($event);
  }

  deleteAttribute(brand: any){
    const modalRef = this.modalService.open(DeleteBrandComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.brand = brand;
    modalRef.componentInstance.brandD.subscribe((resp: any) => {
      let index = this.brands.findIndex((item: any) => item.id === brand.id);
      if(index != -1){
        this.brands.splice(index, 1);
      }
    });
  }

}
