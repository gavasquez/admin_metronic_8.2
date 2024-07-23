import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Brand } from '../interfaces/brand.interface';
import { BrandService } from '../service/brand.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.scss']
})
export class DeleteBrandComponent implements OnInit{

  @Input() brand: Brand;

  @Output()brandD: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public brandsService: BrandService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){}

  ngOnInit(): void {
    this.isLoading = this.brandsService.isLoading$;
  }

  delete(){
    this.brandsService.delete(this.brand.id).subscribe(({message}) => {
      if(message === 200){
        this.brandD.emit({message: 200});
        this.modal.close();
      }
    });
  }
}
