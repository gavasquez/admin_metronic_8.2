import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Attribute } from '../interfaces/attribute';

@Component({
  selector: 'app-delete-attribute',
  templateUrl: './delete-attribute.component.html',
  styleUrls: ['./delete-attribute.component.scss']
})
export class DeleteAttributeComponent implements OnInit{

  @Input() attribute: Attribute;

  @Output()attributeD: EventEmitter<any> = new EventEmitter();

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
    this.attributeService.delete(this.attribute.id).subscribe(({message}) => {
      if(message === 200){
        this.attributeD.emit({message: 200});
        this.modal.close();
      }
    });
  }

}
