import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttributesService } from '../../service/attributes.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-variation-specifications',
  templateUrl: './create-variation-specifications.component.html',
  styleUrls: ['./create-variation-specifications.component.scss']
})
  export class CreateVariationSpecificationsComponent implements OnInit{

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
    public attributesService: AttributesService,
    public toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.initForm();
    this.isLoading$ = this.attributesService.isLoading$;

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

    this.showProduct();
  }

  initForm(){
    this.form = this.fb.group({
      title: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      sku: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
    });

  }

  showProduct(){
    this.attributesService.showProduct( this.product_id ).subscribe( ({product}: any) => {
      this.form.setValue({
        title: product.title,
        sku: product.sku,
      });
      this.imagen_previsualiza = product.imagen;
      this.images_files = product.images;
    });
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

  isLoadingView(){
    this.attributesService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributesService.isLoadingSubject.next(false);
    }, 50);
  }

  onSubmit(){

  }
}
