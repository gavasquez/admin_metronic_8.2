import { Component, OnInit } from '@angular/core';
import { SlidersService } from '../service/sliders.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-slider',
  templateUrl: './create-slider.component.html',
  styleUrls: ['./create-slider.component.scss']
})
export class CreateSliderComponent implements OnInit{

  form: FormGroup;

  imagen_previsualiza: any = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
  file_image: any;
  isLoading$: any;

  constructor(
    private fb: FormBuilder,
    public sliderService: SlidersService,
    public toastr: ToastrService,
  ){
    this.initForm();
  }

  ngOnInit(): void {
    this.isLoading$ = this.sliderService.isLoading$;
  }

  initForm(){
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subtitle: ['', [Validators.required, Validators.minLength(3)]],
      label: [''],
      link: [''],
      color: [''],
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  onSubmit(){
    if( this.form.invalid || this.file_image == undefined){
      this.toastr.error('Validación', "Los campos con el * son obligatorios.")
      return;
    }

    const form = this.form.value;
    const formData = this.formDataCreate(form);

    this.sliderService.create(formData)
      .subscribe(({ message }: any) => {
        if(message == 403) {
          this.toastr.error('Validación', 'El Slider ya existe.');
        }
        this.form.setValue({
          title: '',
          subtitle: '',
          label: '',
          link: '',
          color: '',
        });
        this.imagen_previsualiza = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
        this.toastr.success('Exito', 'El Slider se registro correctamente.');
    });
  }

  formDataCreate({ title, subtitle, label, link, color }: any){
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    if(label){
      formData.append("label", label);
    }
    if(link){
      formData.append("link", link);
    }
    if(color){
      formData.append("color", color);
    }
    formData.append("image", this.file_image);
    return formData;
  }
}
