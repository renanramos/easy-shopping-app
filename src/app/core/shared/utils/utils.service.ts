import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  handleErrorMessage(response: any) {
    return response && response.error.errors && response.error.errors.length ? 
                response.error.errors[0] :
                response.error.message;
  }
}
