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
    return this.post(`${this.url}`, customer);
  }

  getCustomers(pageNumber?: number, pageSize?: number, filterByName?: string): Observable<Customer | Customer[]> {
    let query = '';

    if (pageNumber) {
      query = `?pageNumber=${pageNumber}`
    }

    if (filterByName) {
      query +=  query ? `&name=${filterByName}` : `?name=${filterByName}`;
    }

    return this.get(`${this.url}${query}`);
  }

  getCustomerById(customerId: number): Observable<Customer | Customer[]> {
    return this.get(`${this.url}/${customerId}`);
  }

  getCustomerByTokenId(tokenId: string): Observable<Customer| Customer[]> {
    return this.get(`${this.url}/${tokenId}`);
  }

  updateCustomer(customer: Customer, tokenId: string): Observable<Customer> {
    return this.patch(`${this.url}/${tokenId}`, customer);
  }

  removeCustomer(customerId: number): Observable<any> {
    return this.delete(`${this.url}/${customerId}`);
  }
}
