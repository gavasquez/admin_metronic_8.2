import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent implements OnInit {


  @Input() categorie: any;

  @Output()categorieD: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public categorieService: CategoriesService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){}

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
  }

  delete(){
    this.categorieService.deleteCategorie(this.categorie.id).subscribe(({message}) => {
      if(message === 200){
        this.categorieD.emit({message: 200});
        this.modal.close();
      }
    });
  }

}
