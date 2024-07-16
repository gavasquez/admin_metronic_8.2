import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttributesService } from '../service/attributes.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Attribute } from '../interfaces/attribute';
import { Property } from '../interfaces/property';
import { SubAttributeDeleteComponent } from '../sub-attribute-delete/sub-attribute-delete.component';

interface ResponseCreatePropertie {
  message: number,
  propertie: Property
}

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss']
})
export class SubAttributeCreateComponent implements OnInit {
  @Output() AttributeC: EventEmitter<Attribute> = new EventEmitter();
  @Input() properties: Property[] = [];
  @Input() attribute: Attribute;

  form: FormGroup;
  isLoading$: any;

  constructor(
    private fb: FormBuilder,
    private attributeService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    public modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.initForm();
    this.properties = this.attribute.properties;
  }

  initForm(){
    this.form = this.fb.group({
      name: [ '' , [Validators.required, Validators.minLength(1)]],
      type_action: [ 1 , [Validators.required]],
      code: ['']
    });
  }


  onSubmit(){
    console.log(this.form.value)
    if( this.form.invalid ){
      this.toastr.error('Validación', 'Todos los campos son necesarios');
      return;
    }

    const { type_action, code } = this.form.value;

    if(type_action === 2 && !code){
      this.toastr.error('Validación', 'Necesitas seleccionar un color');
      return;
    }

    const data = {
      ...this.form.value,
      state: 1, // 1 = activo
      attribute_id: this.attribute.id,
    }

    this.attributeService.createPropertie(data).subscribe(( { message, propertie } : ResponseCreatePropertie) => {
      if(message == 403){
        this.toastr.error('Validación', 'El nombre de la propiedad ya existe');
        return;
      }else {
        this.properties.unshift(propertie);
        this.toastr.success('Exitos', 'La propiedad se ha registrado correctamente');
      }
    });
  }

  onChangeType($event:any){
    this.form.get('type_action')?.setValue(+$event.target.value);
  }

  delete(propertie: Property){

    const modalRef = this.modalService.open(SubAttributeDeleteComponent, { centered: true, size: 'md'});

    modalRef.componentInstance.propertie = propertie;

    modalRef.componentInstance.propertieD.subscribe((resp: any) => {
      let index = this.properties.findIndex((item: Property) => item.id === propertie.id);
      if(index != -1){
        this.properties.splice(index, 1);
      }
    });
  }

}
