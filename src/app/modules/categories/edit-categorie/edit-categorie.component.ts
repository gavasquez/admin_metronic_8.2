import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss']
})
export class EditCategorieComponent implements OnInit {

  form: FormGroup;
  type_categorie: number = 1;

  imagen_previsualiza: any = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
  file_image: any = null;
  isLoading$: any;

  categories_first: any = [];
  categories_second: any = [];

  categorie_id: string = '';

  constructor(
    private fb: FormBuilder,
    public categorieService: CategoriesService,
    public toastr: ToastrService,
    public activatedRoute: ActivatedRoute,
  ){
    this.initForm();
  }

  ngOnInit(): void {
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();

    this.activatedRoute.params.subscribe((resp: any) => {
      this.categorie_id = resp.id;
    });

    this.categorieService.showCategorie(this.categorie_id).subscribe((resp: any) => {
      const { name, icon, imagen, categorie_second_id, categorie_third_id, position, type_categorie, state } = resp.categorie;
       this.form.setValue({
          name,
          icon,
          imagen: '',
          categorie_second_id,
          categorie_third_id,
          position,
          state,
       });
       this.type_categorie = type_categorie;
       this.imagen_previsualiza = imagen;
    });
  }

  initForm(){
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      icon: [''],
      imagen: [''],
      categorie_second_id: [''],
      categorie_third_id: [''],
      position: [1, [Validators.required]],
      state: ['1']
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

    /* if(this.type_categorie == 1 && !this.file_image){
      this.toastr.error('Validación', 'La imagen es obligatoria.');
      return;
    } */

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

    this.categorieService.updateCategorie(this.categorie_id, formData)
      .subscribe(({ message }: any) => {
        if(message == 403) {
          this.toastr.error('Validación', 'La categoria ya existe.');
        }
        this.toastr.success('Exito', 'La categoria se actualizo correctamente.');
        this.config();
    });
  }

  formDataCreate({ name, icon, position, categorie_second_id, categorie_third_id }: any){
    const formData = new FormData();
    formData.append("name", name);
    formData.append("icon", icon);
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
