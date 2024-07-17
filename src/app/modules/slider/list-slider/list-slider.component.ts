import { Component, OnInit } from '@angular/core';
import { SlidersService } from '../service/sliders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSliderComponent } from '../delete-slider/delete-slider.component';
import { Slider } from '../interfaces/slider.interface';
import { ResponseSliders } from '../interfaces/response-sliders.interface';

@Component({
  selector: 'app-list-slider',
  templateUrl: './list-slider.component.html',
  styleUrls: ['./list-slider.component.scss']
})
export class ListSliderComponent implements OnInit {

  sliders: Slider[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public sliderService: SlidersService,
    public modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.listSliders();
    this.isLoading$ = this.sliderService.isLoading$;
  }

  listSliders(page: number = 1){
    this.sliderService.list(page, this.search).subscribe(({ sliders, total }: ResponseSliders) => {
      this.currentPage = page;
      this.sliders = sliders;
      this.totalPages = total;
    });
  }

  searchTo() {
    this.listSliders();
  }

  loadPage($event: any){
    this.listSliders($event);
  }

  delete(slider: Slider){
    const modalRef = this.modalService.open(DeleteSliderComponent, { centered: true, size: 'md'});
    modalRef.componentInstance.slider = slider;
    modalRef.componentInstance.sliderD.subscribe((resp: any) => {
      let index = this.sliders.findIndex((item: any) => item.id === slider.id);
      if(index != -1){
        this.sliders.splice(index, 1);
      }
    })
  }
}
