import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SliderComponent } from './slider.component';
import { CreateSliderComponent } from './create-slider/create-slider.component';
import { EditSliderComponent } from './edit-slider/edit-slider.component';
import { ListSliderComponent } from './list-slider/list-slider.component';

const routes: Routes = [
  {
    path: '',
    component: SliderComponent,
    children: [
      {
        path: 'register',
        component: CreateSliderComponent,
      },
      {
        path: 'list/edit/:id',
        component: EditSliderComponent,
      },
      {
        path: 'list',
        component: ListSliderComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SliderRoutingModule { }
