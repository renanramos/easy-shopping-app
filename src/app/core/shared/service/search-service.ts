import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchSubject: Subject<string> = new Subject();
  hideSearchField: Subject<boolean> = new Subject();

  searchSubject$ = this.searchSubject.asObservable().pipe(debounceTime(300));
  hideSearchField$ = this.hideSearchField.asObservable();

  constructor() { }

  searchFilterContent(parameter: string) {
   this.searchSubject.next(parameter);
  }

  hideSearchFieldOption(value: boolean) {
    this.hideSearchField.next(value);
  }
}