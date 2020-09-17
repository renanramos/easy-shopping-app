import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchSubject: Subject<string> = new Subject();

  searchSubject$ = this.searchSubject.asObservable();

  constructor() { }

  searchFilterContent(parameter: string) {
   this.searchSubject.next(parameter);
  }
}