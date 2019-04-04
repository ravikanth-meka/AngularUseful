#\src\app\shared\icg-pr-data-table\icg-pr-data-table.component.ts

import { ReportingComponent } from './../../icg14a-aggregator/reporting/reporting.component';
import { Component, Input, Output, OnInit, EventEmitter, ViewChild, TemplateRef, ElementRef, QueryList } from '@angular/core';
import { TransferdataService } from '../services/transferdata.service';

@Component({
  selector: 'app-icg-pr-data-table',
  templateUrl: './icg-pr-data-table.component.html',
  styleUrls: ['./icg-pr-data-table.component.css']
})
export class IcgPrDataTableComponent implements OnInit {
  _rows: any[];
  @Input() columns: any[];
  @Input() rows: any[];
  @Input() rowLimitInp: number;
  @Input() cmdType: string;
  @Input() metadata: string;
  @Input() uniq_col: String;
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
  rowLimit: number;
  totalPages: number = 0;
  currPage: number = 0
  selectedRow;
  currPageText: String;
  @ViewChild('filterInput') filterInput: ElementRef;
 // @ViewChild('filterInputNew') filterInputNew: QueryList<ElementRef>;
  @ViewChild('filterInputNew') filterInputCol: ElementRef[];


  constructor(private transferdataService: TransferdataService, elementRef: ElementRef) {

  }
  private filters = new Map([]);
  applyfilter = true;

  ngOnInit() {
    this.rowLimit = 10;
    if (this.rowLimitInp)
      this.rowLimit = this.rowLimitInp;
    if (this.cmdType) {
      this.getGridData();
    } else {
      this._rows = this.rows;
      if (this.rows) {
        this._rows = this.transferdataService.formatGridData(this.rows);
        this.currPage = 1;
        this.totalPages = Math.ceil(this._rows.length / this.rowLimit) || 1;
        this.pageNumber();
      }
    }
    if (this.filterInput)
      this.filterInput.nativeElement.value = '';

  }
  onFilter($event, dt) {
    this.currPage = 1;
    this.totalPages = Math.ceil(dt.totalRecords / this.rowLimit) || 1;
    this.currPageText = "Page " + this.currPage + " of " + this.totalPages + "";
  }
  onPageLoad(event, dt) {
    this.currPage = event.first / this.rowLimit + 1;
    this.totalPages = Math.ceil(dt.totalRecords / this.rowLimit) || 1;
    this.pageNumber();
  }

  pageNumber() {
    this.currPageText = "Page " + this.currPage + " of " + this.totalPages + "";
  }
  public getGridData() {
    const success = (resp: any[]) => {
      this._rows = this.transferdataService.formatGridData(resp);
      if (this._rows) {
        console.log(this._rows[0])
        this.currPage = 1;
        this.totalPages = Math.ceil(this._rows.length / this.rowLimit) || 1;
        this.pageNumber();
      }
    };
    const failure = (resp: any[]) => {
      this._rows = null;
    };
    this.transferdataService.sendInfoReq(this.cmdType, this.metadata, success, failure);
  }

  gridTitle: String = "";
  setGridTitle(title: String) {
    this.gridTitle = title.toUpperCase();
  }

  refreshDataGrid(event) {
    event.preventDefault()
    this.applyfilter = true;
    this.ngOnInit();
  }


  applyFilter(event, dt) {
    event.preventDefault()
    this.applyfilter = !this.applyfilter;
    if (!this.applyfilter)
      this.clearFilters(event, dt)
  }

  i: number = 0;
  clearFilters(event, dt) {
    this.i=0;
    if (this.filterInput) {
      this.filterInput.nativeElement.value = '';
    }
    for (const column of this.columns) {
      if (dt.filters[column.field]) {
        let elem: NodeListOf<HTMLElement> = document.getElementsByName("filterInputNew["+this.i+"]")
        var filterElememt  = (<HTMLInputElement>document.getElementById(elem[0].getAttribute("id"))).value =""
        dt.filters[column.field] = { value: null };
        delete dt.filters[column.field];
        if (dt.filters['global']) {
          dt.filters['global'].value = "";
        }
      }
      this.i = this.i +1;
    }
    dt.filters = null;
    dt.reset();
  }

  columnCallback(row, columnCallbackFunc: (row) => void) {
    columnCallbackFunc(row);
  }
  deriveColumnValue(row, columnValueProcessor: (row) => void) {
    return columnValueProcessor(row);
  }
}
