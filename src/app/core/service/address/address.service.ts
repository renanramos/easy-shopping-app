import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Address } from '../../models/address/address.model';
import { Observable } from 'rxjs';

@Injectable()
export class AddressService extends ApiService<Address> {

  private url: string = '/addresses';

  constructor(inject: Injector) {
    super(inject)
  }

  getAddresses(customerId?: number):Observable<Address | Address[]> {

    let filter = '';

    if (customerId) {
      filter += `?customerId=${customerId}`;
    }

    return this.get(`${this.url}${filter}`);
  }

  saveAddress(address: Address): Observable<Address> {
    return this.post(`${this.url}`, address);
  }

  updateAddress(address: Address): Observable<Address> {
    return this.patch(`${this.url}/${address['id']}`, address);
  }

  removeAddress(addressId: number): Observable<Address> {
    return this.delete(`${this.url}/${addressId}`);
  }
}