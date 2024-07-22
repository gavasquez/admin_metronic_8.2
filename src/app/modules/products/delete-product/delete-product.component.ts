import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent implements OnInit{

  @Input() product: Product;

  @Output()productD: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public productService: ProductService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){}

  ngOnInit(): void {
    this.isLoading = this.productService.isLoading$;
  }

  delete(){
    this.productService.delete(this.product.id).subscribe(({message}) => {
      if(message === 200){
        this.productD.emit({message: 200});
        this.modal.close();
      }
    });
  }

}
