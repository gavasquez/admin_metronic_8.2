import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttributesService } from '../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Attribute } from '../interfaces/attribute';

interface ResponseCreateAttribute {
  message: number,
  attribute: Attribute,
}

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent implements OnInit{

  @Output() AttributeE: EventEmitter<Attribute> = new EventEmitter();
  @Input() attribute: Attribute;

  form: FormGroup;
  isLoading$: any;

  constructor(
    private fb: FormBuilder,
    private attributeService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      name: [ this.attribute.name , [Validators.required, Validators.minLength(3)]],
      type_attribute: [ this.attribute.type_attribute , [Validators.required]],
    });
  }


  onSubmit(){
    if( this.form.invalid ){
      this.toastr.error('Validación', 'Todos los campos son necesarios')
      return;
    }

    const data = {
      ...this.form.value,
      state: 1, // 1 = activo
    }

    this.attributeService.update(this.attribute.id, data).subscribe(( { message, attribute} : any) => {
      if(message == 403){
        this.toastr.error('Validación', 'El nombre del atributo ya existe en la base de datos');
        return;
      }else {
        this.AttributeE.emit(attribute);
        this.toastr.success('Exitos', 'El atributo se ha actualizado correctamente');
        this.modal.close();
      }
    });
  }

}
