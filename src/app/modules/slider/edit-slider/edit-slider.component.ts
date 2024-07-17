import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlidersService } from '../service/sliders.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Slider } from '../interfaces/slider.interface';
import { ResponseShowSliders } from '../interfaces/response-show-sliders.interface';

@Component({
  selector: 'app-edit-slider',
  templateUrl: './edit-slider.component.html',
  styleUrls: ['./edit-slider.component.scss']
})
export class EditSliderComponent implements OnInit {

  form: FormGroup;

  imagen_previsualiza: any = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
  file_image: any = null;
  isLoading$: any;
  slider_id: string = '';

  constructor(
    private fb: FormBuilder,
    public sliderService: SlidersService,
    public toastr: ToastrService,
    public activateRouter: ActivatedRoute,
  ){
    this.initForm();
  }

  ngOnInit(): void {
    this.isLoading$ = this.sliderService.isLoading$;
    this.activateRouter.params.subscribe((resp: any) => {
      this.slider_id = resp.id;
    });

    this.sliderService.show(this.slider_id).subscribe( (response: ResponseShowSliders) => {
      const { slider } = response;
      const { id, imagen , ...rest} = slider;
      this.form.setValue({
        ...rest
      });
      this.imagen_previsualiza = imagen;
    });
  }

  initForm(){
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subtitle: ['', [Validators.required, Validators.minLength(3)]],
      label: [''],
      link: [''],
      state: ['1'],
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

    if( this.form.invalid){
      this.toastr.error('Validación', "Los campos con el * son obligatorios.")
      return;
    }

    const form = this.form.value;
    const formData = this.formDataCreate(form);

    this.sliderService.update(this.slider_id, formData)
      .subscribe(({ message, slider }: any) => {
        console.log(slider);
        if(message == 403) {
          this.toastr.error('Validación', 'El Slider ya existe.');
        }
        this.toastr.success('Exito', 'El Slider se registro correctamente.');
    });
  }

  formDataCreate({ title, subtitle, label, link, color, state }: any){
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("state", state);

    label ? formData.append("label", label) : formData.append("label", '');
    link ? formData.append("link", link) : formData.append("link", '');
    color ? formData.append("color", color) : formData.append("color", '');

    if(this.file_image){
      formData.append("image", this.file_image);
    }
    return formData;
  }
}
