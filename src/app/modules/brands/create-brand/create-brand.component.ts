import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Brand } from '../interfaces/brand.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../service/brand.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent implements OnInit{

  @Output() brandC: EventEmitter<Brand> = new EventEmitter();

  form: FormGroup;
  isLoading$: any;

  constructor(
    private fb: FormBuilder,
    private brandsService: BrandService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.isLoading$ = this.brandsService.isLoading$;
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      name: [ '' , [Validators.required, Validators.minLength(3)]],
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

    this.brandsService.create(data).subscribe(( { message, brand } : { message: number, brand: Brand } ) => {
      if(message == 403){
        this.toastr.error('Validación', 'El nombre de la Marca ya existe en la base de datos');
        return;
      }else {
        this.brandC.emit(brand);
        this.toastr.success('Exitos', 'La Marca se ha registrado correctamente');
        this.modal.close();
      }
    });
  }

}
