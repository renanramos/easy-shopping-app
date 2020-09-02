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

  getCustomers(): Observable<Customer | Customer[]> {
    return this.get(this.url);
  }

  getCustomerById(customerId: number): Observable<Customer | Customer[]> {
    return this.get(`${this.url}/${customerId}`);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.patch(`${this.url}/${customer['id']}`, customer);
  }
}
