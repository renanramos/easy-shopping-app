import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'es-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.css']
})
export class AddButtonComponent implements OnInit {

  @Output() newClickEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  addButtonClick() {
    this.newClickEvent.emit();
  }
}
