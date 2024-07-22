import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-imagen-add',
  templateUrl: './delete-imagen-add.component.html',
  styleUrls: ['./delete-imagen-add.component.scss']
})
export class DeleteImagenAddComponent implements OnInit{

  @Input() id: any;

  @Output()imageD: EventEmitter<any> = new EventEmitter();

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
    this.productService.deleteImage(this.id).subscribe(({message}) => {
      if(message === 200){
        this.imageD.emit({message: 200});
        this.modal.close();
      }
    });
  }

}
