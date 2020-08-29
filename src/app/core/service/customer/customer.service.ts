import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Customer } from '../../models/registration/customer.model';
import { Observable } from 'rxjs';

@Injectable()
export class CustomerService extends ApiService<Customer> {

  private url: string = '/customers';

  constructor(inject: Injector) {
    super(inject);
  }

  saveCustomer(customer: Customer): Observable<Customer> {
    return this.post(`${this.url}/register`, customer);
  }
}
