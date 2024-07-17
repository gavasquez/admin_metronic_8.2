import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SlidersService } from '../service/sliders.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Slider } from '../interfaces/slider.interface';

@Component({
  selector: 'app-delete-slider',
  templateUrl: './delete-slider.component.html',
  styleUrls: ['./delete-slider.component.scss']
})
export class DeleteSliderComponent implements OnInit {


  @Input() slider: Slider;

  @Output()sliderD: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService,
    public modal: NgbActiveModal,
  ){}

  ngOnInit(): void {
    this.isLoading = this.sliderService.isLoading$;
  }

  delete(){
    this.sliderService.delete(this.slider.id).subscribe(({message}) => {
      if(message === 200){
        this.sliderD.emit({message: 200});
        this.modal.close();
      }
    });
  }

}
