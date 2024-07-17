import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderRoutingModule } from './slider-routing.module';
import { SliderComponent } from './slider.component';
import { CreateSliderComponent } from './create-slider/create-slider.component';
import { EditSliderComponent } from './edit-slider/edit-slider.component';
import { DeleteSliderComponent } from './delete-slider/delete-slider.component';
import { ListSliderComponent } from './list-slider/list-slider.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    SliderComponent,
    CreateSliderComponent,
    EditSliderComponent,
    DeleteSliderComponent,
    ListSliderComponent
  ],
  imports: [
    CommonModule,
    SliderRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class SliderModule { }
