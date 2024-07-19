import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  form: FormGroup;

  imagen_previsualiza: any = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
  file_image: any;
  isLoading$: any;

  categories_first: any = [];

  categories_second: any = [];
  categories_second_back: any = [];

  categories_thirds: any = [];
  categories_thirds_back: any = [];

  dropdownList: any[] = [];
  dropdownSettings:IDropdownSettings = {};

  isShowMultiselect: boolean = false;
  marcas:any = [];


  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    public toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.initForm();
    this.isLoading$ = this.productService.isLoading$;
    this.configAll();

    /* this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' },
      { item_id: 6, item_text: 'Laravest' },
    ];
    this.form.get('selectedItems')!.setValue([
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ]); */
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };

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

  onSubmit(){
    if( this.form.invalid || this.file_image == undefined){
      this.toastr.error('Validación', "Los campos con el * son obligatorios.")
      return;
    }

    const form = this.form.value;
    const formData = this.formDataCreate(form);

    this.productService.create(formData)
      .subscribe(({ message }: any) => {
        if(message == 403) {
          this.toastr.error('Validación', 'El Producto ya existe.');
        }
        this.form.setValue({
          title: '',
          sku: '',
          price_col: 0,
          price_usd: 0,
          description: '',
          resumen: '',
          categorie_first_id: '',
          categorie_second_id: '',
          categorie_third_id: '',
          selectedItems: [],
          marca_id: '',
          word: '',
        });
        this.dropdownList = [];
        this.file_image = null;
        this.imagen_previsualiza = 'https://preview.keenthemes.com//metronic8/demo1/assets/media/avatars/300-1.jpg';
        this.toastr.success('Exito', 'El Producto se registro correctamente.');
    });
  }

  formDataCreate({ title ,sku, price_col, price_usd, description, resumen, categorie_first_id, categorie_second_id, categorie_third_id, selectedItems, marca_id, word, }: any){
    const formData = new FormData();
    formData.append("title", title);
    formData.append("portada", this.file_image);
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
