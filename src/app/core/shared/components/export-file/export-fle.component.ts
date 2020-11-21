import { EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import { ExportCsvOptions } from 'src/app/core/models/export-csv/export-csv-model';

@Component({
  selector: 'es-export-file',
  templateUrl: './export-file.component.html',
  styleUrls: ['./export-file.component.css'],
})
export class ExportFileComponent implements OnInit, OnChanges{
  
  @Output() exportFileEvent = new EventEmitter<any>();

  @Input() data: any[] = [];

  @Input() headers: string[] = [];

  exportCsvOptions: ExportCsvOptions;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data.length) {
      this.exportData();
    }
  }

  exportData() {
    this.exportCsvOptions.headers = this.headers;
    const csvExporter = new ExportToCsv(this.exportCsvOptions);
    csvExporter.generateCsv(this.data);
  }

  ngOnInit() {
    this.exportCsvOptions = new ExportCsvOptions();
  }

  exportCsvFileEvent() {
    this.exportFileEvent.next();
  }
}