import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Property } from '../interfaces/property';

@Component({
  selector: 'app-sub-attribute-delete',
  templateUrl: './sub-attribute-delete.component.html',
  styleUrls: ['./sub-attribute-delete.component.scss']
})
export class SubAttributeDeleteComponent implements OnInit{

  @Input() propertie: Property;

  @Output()propertieD: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public attributeService: AttributesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){}

  ngOnInit(): void {
    this.isLoading = this.attributeService.isLoading$;
  }

  delete(){
    this.attributeService.deletePropertie(this.propertie.id).subscribe(({message}) => {
      if(message === 200){
        this.propertieD.emit({message: 200});
        this.modal.close();
      }
    });
  }

}
