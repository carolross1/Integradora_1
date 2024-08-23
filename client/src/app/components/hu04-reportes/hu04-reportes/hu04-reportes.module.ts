import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesComponent } from '../reportes/reportes.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReportesComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
   exports: [
    ReportesComponent
  ]
})
export class Hu04ReportesModule { }
