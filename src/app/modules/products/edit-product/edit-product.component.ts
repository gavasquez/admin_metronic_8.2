import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../interfaces/product.interface';
import { ResponseShowProduct } from '../interfaces/response-show-product.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteImagenAddComponent } from './delete-imagen-add/delete-imagen-add.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit{

form: FormGroup;

imagen_previsualiza: any = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
imagen_add_previsualiza: any = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
file_image: any;
isLoading$: any;
images_files: any[] = [];

categories_first: any = [];

categories_second: any = [];
categories_second_back: any = [];

categories_thirds: any = [];
categories_thirds_back: any = [];

dropdownList: any[] = [];
dropdownSettings:IDropdownSettings = {};

isShowMultiselect: boolean = false;
marcas:any = [];

product_id: string;

imagen_add: any;


constructor(
  private fb: FormBuilder,
  public productService: ProductService,
  public toastr: ToastrService,
  private activateRoute: ActivatedRoute,
  private modalService: NgbModal,
){}

ngOnInit(): void {
  this.initForm();
  this.isLoading$ = this.productService.isLoading$;

  this.dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 3,
    allowSearchFilter: true
  };

  this.activateRoute.params.subscribe( (resp: any) => {
    this.product_id = resp.id;
  });
  this.configAll();

}

initForm(){
  this.form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', [Validators.required, Validators.minLength(3)]],
    price_col: [0, [Validators.required, Validators.min(0)]],
    price_usd: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required]],
    resumen: ['', [Validators.required]],
    categorie_first_id: ['', [Validators.required]],
    categorie_second_id: [''],
    categorie_third_id: [''],
    selectedItems: [ ,[Validators.required]],
    marca_id: ['', [Validators.required]],
    word: ['']
  });

}

configAll(){
  this.productService.configAll().subscribe((resp: any) => {
    this.marcas = resp.brands;
    this.categories_first = resp.categories_first;
    this.categories_second = resp.categories_second;
    this.categories_thirds = resp.categories_thirds;
    this.showProduct(); //cargar el producto
  });
}

showProduct(){
  this.productService.show( this.product_id ).subscribe( ({product}: ResponseShowProduct) => {
    this.form.setValue({
      title: product.title,
      sku: product.sku,
      price_col: product.price_col,
      price_usd: product.price_usd,
      description: product.description,
      resumen: product.resumen,
      categorie_first_id: product.categorie_first_id,
      categorie_second_id: product.categorie_second_id == null  ? '' : product.categorie_second_id,
      categorie_third_id: product.categorie_third_id == null ? '' : product.categorie_third_id,
      selectedItems: product.tags,
      marca_id: product.brand_id,
      word: '',
    });
    this.imagen_previsualiza = product.imagen;
    this.images_files = product.images;
    this.changeDeparmento();
    this.changeCategoria();
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
  this.productService.isLoadingSubject.next(true);
  setTimeout(() => {
    this.productService.isLoadingSubject.next(false);
  }, 50);
}

processFiles($event: any){
  if($event.target.files[0].type.indexOf("image") < 0){
    this.toastr.error('Validación','Solo se permiten imagenes'); return;
  }
  this.imagen_add = $event.target.files[0]; // Guardamos la imagen en el atributo file_image
  let reader = new FileReader();
  reader.readAsDataURL(this.imagen_add);
  reader.onloadend = () => this.imagen_add_previsualiza = reader.result;
  this.isLoadingView();
}

changeDeparmento(){
  if(!this.form.get('categorie_first_id')!.value){
    this.categories_second_back = [];
    this.categories_thirds_back = [];
  }
  this.categories_second_back = this.categories_second.filter((item: any) => item.categorie_second_id == this.form.get('categorie_first_id')!.value);
}

changeCategoria(){
  this.categories_thirds_back = this.categories_thirds.filter((item: any) => item.categorie_second_id == this.form.get('categorie_second_id')!.value);
}

onItemSelect(item: any) {
  console.log(item);
}
onSelectAll(items: any) {
  console.log(items);
}

addItems(event: any): void {
  this.isShowMultiselect = true;

  if(event.key === 'Enter'){
    event.preventDefault();
    if(!this.form.get('word')!.value){
      return;
    }
    let time_date = new Date().getTime();

    this.dropdownList.push({ item_id: time_date, item_text: this.form.get('word')!.value});

    this.form.get('selectedItems')!.setValue([
      ...this.form.get('selectedItems')!.value ?? [],
      { item_id: time_date, item_text: this.form.get('word')!.value }
    ]);

    setTimeout(() => {
      this.form.get('word')!.setValue('');
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);

  }
}

addImagen(){
  if(!this.imagen_add){
    this.toastr.error('Validación', "Es requerido subir una imagen");
    return;
  }
  let formData = new FormData();
  formData.append("imagen_add", this.imagen_add);
  formData.append("product_id", this.product_id);
  this.productService.imagenAdd(formData).subscribe( (resp:any) => {
    this.images_files.unshift(resp.imagen);
    this.imagen_add = null;
    this.imagen_add_previsualiza = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
  });
}

removeImages(id: number){
  const modalRef = this.modalService.open(DeleteImagenAddComponent, { centered: true, size: 'md'});
  modalRef.componentInstance.id = id;
  modalRef.componentInstance.imageD.subscribe((resp: any) => {
    let index = this.images_files.findIndex((item: any) => item.id === id);
    if(index != -1){
      this.images_files.splice(index, 1);
    }
  });
}

onSubmit(){
  if( this.form.invalid){
    this.toastr.error('Validación', "Los campos con el * son obligatorios.")
    return;
  }

  const form = this.form.value;
  const formData = this.formDataCreate(form);

  this.productService.update(this.product_id ,formData)
    .subscribe(({ message }: any) => {
      if(message == 403) {
        this.toastr.error('Validación', 'El Producto ya existe.');
      }
      this.file_image = null;
      this.toastr.success('Exito', 'El Producto se edito correctamente.');
  });
}

formDataCreate({ title ,sku, price_col, price_usd, description, resumen, categorie_first_id, categorie_second_id, categorie_third_id, selectedItems, marca_id, word }: any){
  const formData = new FormData();
  formData.append("title", title);
  if(this.file_image){
    formData.append("portada", this.file_image);
  }
  formData.append("title", title);
  formData.append("sku", sku);
  formData.append("price_col", price_col);
  formData.append("price_usd", price_usd);
  formData.append("description", description);
  formData.append("resumen", resumen);
  formData.append("portada", this.file_image);
  formData.append("categorie_first_id", categorie_first_id);
  formData.append("multiselect", JSON.stringify(selectedItems));
  formData.append("brand_id", marca_id);
  if(categorie_second_id){
    formData.append("categorie_second_id", categorie_second_id);
  }
  if(categorie_third_id){
    formData.append("categorie_third_id", categorie_third_id);
  }
  return formData;
}
}
