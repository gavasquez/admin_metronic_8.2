import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  selector: 'app-create-attribute',
  templateUrl: './create-attribute.component.html',
  styleUrls: ['./create-attribute.component.scss']
})
export class CreateAttributeComponent implements OnInit {

  @Output() AttributeC: EventEmitter<Attribute> = new EventEmitter();

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
      name: [ '' , [Validators.required, Validators.minLength(3)]],
      type_attribute: [ 1 , [Validators.required]],
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

    this.attributeService.create(data).subscribe(( { message, attribute} : ResponseCreateAttribute) => {
      if(message == 403){
        this.toastr.error('Validación', 'El nombre del atributo ya existe en la base de datos');
        return;
      }else {
        this.AttributeC.emit(attribute);
        this.toastr.success('Exitos', 'El atributo se ha registrado correctamente');
        this.modal.close();
      }
    });
  }

}
