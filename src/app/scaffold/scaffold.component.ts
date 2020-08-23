import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'es-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrls: ['./scaffold.component.css']
})
export class ScaffoldComponent implements OnInit {

  @ViewChild('drawer', { static: true}) drawer: MatDrawer;

  constructor() {
    
  }

  ngOnInit() {
    
  }

}
