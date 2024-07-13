import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../service/categories.service';

interface CreateCategorieResponse {
  message: number;
}

@Component({
  selector: 'app-create-categorie',
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss']
})
export class CreateCategorieComponent implements OnInit  {

  form: FormGroup;
  type_categorie: number = 1;

  imagen_previsualiza: any = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
  file_image: any = null;
  isLoading$: any;

  categories_first: any = [];
  categories_second: any = [];
  categories_second_back: any = [];

  constructor(
    private fb: FormBuilder,
    public categorieService: CategoriesService,
    public toastr: ToastrService,
  ){
    this.initForm();
  }

  ngOnInit(): void {
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();
  }

  initForm(){
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      icon: [''],
      imagen: [''],
      categorie_second_id: [''],
      categorie_third_id: [''],
      position: [1, [Validators.required]],
    });
  }

  config(){
    this.categorieService.configCategories().subscribe((resp: any) => {
      this.categories_first = resp.categories_first;
      this.categories_second = resp.categories_second;
    });
  }

  processFile($event: any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toastr.error('Validación','Solo se permiten imagenes'); return;
    }
    this.file_image = $event.target.files[0]; // Guardamos la imagen en el atributo file_image
    let reader = new FileReader();
    reader.readAsDataURL(this.file_image);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
    this.isLoadingView();
  }

  isLoadingView(){
    this.categorieService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categorieService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategorie(value: number){
    this.type_categorie = value;
    this.form.patchValue({
      categorie_second_id: '', // Limpiamos el campo
      categorie_third_id: '',
    });
  }

  changeDeparmento(){
    this.categories_second_back = this.categories_second.filter((item: any) => item.categorie_second_id == this.form.get('categorie_third_id')!.value);
  }

  onSubmit(){

    if( this.form.invalid ){
      this.toastr.error('Validación', "Los campos con el * son obligatorios.")
      return;
    }

    if(this.type_categorie == 1 && !this.form.get('icon')?.value){
      this.toastr.error('Validación', 'El icono es obligatorio.');
      return;
    }

    if(this.type_categorie == 1 && !this.file_image){
      this.toastr.error('Validación', 'La imagen es obligatoria.');
      return;
    }

    if(this.type_categorie == 2 && !this.form.get('categorie_second_id')?.value){
      this.toastr.error('Validación', 'El departamento es obligatorio.');
      return;
    }

    if(this.type_categorie == 3 && (!this.form.get('categorie_second_id')!.value || !this.form.get('categorie_third_id')!.value) ){
      this.toastr.error('Validación', 'El departamento y la categoria es obligatorio.');
      return;
    }

    const { imagen, ...rest } = this.form.value;
    const formData = this.formDataCreate(rest);

    this.categorieService.createCategorie(formData)
      .subscribe(({ message }: CreateCategorieResponse) => {
        if(message == 403) {
          this.toastr.error('Validación', 'La categoria ya existe.');
        }
        this.form.setValue({
          name: '',
          icon: '',
          imagen: '',
          categorie_second_id: '',
          categorie_third_id: '',
          position: 1,
        });
        this.imagen_previsualiza = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
        this.toastr.success('Exito', 'La categoria se registro correctamente.');
        this.config();
    });
  }

  formDataCreate({ name, icon, position, categorie_second_id, categorie_third_id }: any){
    const formData = new FormData();
    formData.append("type_categorie", `${this.type_categorie}`);
    formData.append("name", name);
    icon ? formData.append("icon", icon) : null;
    formData.append("position", position);
    if(categorie_second_id){
      formData.append("categorie_second_id", categorie_second_id);
    }
    if(categorie_third_id){
      formData.append("categorie_third_id", categorie_third_id);
    }
    formData.append("image", this.file_image);
    return formData;
  }
}
