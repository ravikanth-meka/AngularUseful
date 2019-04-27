import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AccordionModule } from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { IcgDataGridComponent } from './icg-data-grid/icg-data-grid.component';
import { IcgPrDataTableComponent } from './icg-pr-data-table/icg-pr-data-table.component';
import { FileNamePipe } from './pipes/file-name.pipe';
import { MapToIterPipe } from './pipes/map-to-iter.pipe';


@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule, 
    ReactiveFormsModule,
    CalendarModule,
    AccordionModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    ConfirmDialogModule,
    TableModule,
    DataTableModule,
    SharedModule

  ],
  declarations: [
    IcgDataGridComponent,
    IcgPrDataTableComponent,
    FileNamePipe,
    MapToIterPipe
  ],
  exports: [
    CommonModule,
     AccordionModule,
    NgxDatatableModule,
    DatePipe,
    IcgDataGridComponent,
    IcgPrDataTableComponent,
    FileNamePipe,
    MapToIterPipe,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    AccordionModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    ConfirmDialogModule,
    TableModule,
    DataTableModule,
    SharedModule
  ]
})
export class IcgSharedModule { }
