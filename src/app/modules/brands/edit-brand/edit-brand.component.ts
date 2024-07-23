import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Brand } from '../interfaces/brand.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../service/brand.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit{

  @Output() BrandE: EventEmitter<Brand> = new EventEmitter();
  @Input() brand: Brand;

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
      name: [ this.brand.name , [Validators.required, Validators.minLength(3)]],
      state: [ this.brand.state , [Validators.required]],
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

    this.brandsService.update(this.brand.id, data).subscribe(( { message, brand} : {message: number, brand: Brand}) => {
      if(message == 403){
        this.toastr.error('Validación', 'El nombre de la marca ya existe en la base de datos');
        return;
      }else {
        this.BrandE.emit(brand);
        this.toastr.success('Exitos', 'La Marca se ha actualizado correctamente');
        this.modal.close();
      }
    });
  }

}
