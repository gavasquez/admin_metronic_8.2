import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributesService } from '../service/attributes.service';
import { DeleteAttributeComponent } from '../delete-attribute/delete-attribute.component';
import { CreateAttributeComponent } from '../create-attribute/create-attribute.component';
import { ResponseAttributes } from '../interfaces/response-attributes.interfaces';
import { Attribute } from '../interfaces/attribute';
import { EditAttributeComponent } from '../edit-attribute/edit-attribute.component';
import { SubAttributeCreateComponent } from '../sub-attribute-create/sub-attribute-create.component';

@Component({
  selector: 'app-list-attribute',
  templateUrl: './list-attribute.component.html',
  styleUrls: ['./list-attribute.component.scss']
})
export class ListAttributeComponent implements OnInit {

  attributes: Attribute[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public attributeService: AttributesService,
    public modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.listAttributes();
    this.isLoading$ = this.attributeService.isLoading$;
  }

  listAttributes(page: number = 1){
    this.attributeService.list(page, this.search).subscribe(( { total, attributes }: ResponseAttributes) => {
      this.totalPages = total;
      this.attributes = attributes;
    });
  }

  openModalCreateAttribute(){
    const modalRef = this.modalService.open(CreateAttributeComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.AttributeC.subscribe((attribute: Attribute)=> {
      this.attributes.unshift(attribute);
    });
  }

  openModalEditAttribute(attibute: Attribute){
    const modalRef = this.modalService.open(EditAttributeComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.attribute = attibute;
    modalRef.componentInstance.AttributeE.subscribe((attribute: Attribute)=> {
      /* this.attributes.unshift(attribute); */
      let index = this.attributes.findIndex((item: Attribute) => item.id === attibute.id);
      if(index != -1) {
        this.attributes[ index ] = attribute;
      }
    });
  }

  getNameAttribute(type_attribute: number){
    let name_attribute = "";
    switch (type_attribute) {
      case 1:
        name_attribute = "Texto";
        break;
      case 2:
        name_attribute = "Número";
        break;
      case 3:
        name_attribute = "Seleccionable";
        break;
      case 4:
        name_attribute = "Seleccionable Multiple";
        break;

      default:
        break;
    }

    return name_attribute;
  }

  searchTo() {
    this.listAttributes();
  }

  loadPage($event: any){
    this.listAttributes($event);
  }

  deleteAttribute(attribute: Attribute){
    const modalRef = this.modalService.open(DeleteAttributeComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.attribute = attribute;
    modalRef.componentInstance.attributeD.subscribe((resp: any) => {
      let index = this.attributes.findIndex((item: Attribute) => item.id === attribute.id);
      if(index != -1){
        this.attributes.splice(index, 1);
      }
    });
  }

  openModalRegisterProperties(attribute: Attribute){
    const modalRef = this.modalService.open(SubAttributeCreateComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.attribute = attribute;
  }

}
