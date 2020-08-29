import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'es-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() menuEvent = new EventEmitter<any>();

  @Input() showMenuIcon: boolean = true;
  userLoggedName: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  eventMenuHandler($event) {
    this.menuEvent.emit(true);
  }

  homePage() {
    this.router.navigate(['/']);
  }
}
