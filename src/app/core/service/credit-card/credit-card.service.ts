import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';

import { CreditCard } from '../../models/credit-card/credit-card.model';
import { Observable } from 'rxjs';

@Injectable()
export class CreditCardService extends ApiService<CreditCard>{

  private url: string = '/credit-cards';

  saveCreditCard(creditCard: CreditCard): Observable<CreditCard> {
    return this.post(this.url, creditCard);
  }

  getCreditCards(customerId?: number): Observable<CreditCard | CreditCard[]> {

    let filter = '';

    if (customerId) {
      filter += `?customerId=${customerId}`;
    }

    return this.get(`${this.url}${filter}`);
  }

  getCreditCardById(creditCardId: number): Observable<CreditCard | CreditCard[]> {
    return this.get(`${this.url}/${creditCardId}`);
  }

  updateCreditCard(creditCard: CreditCard): Observable<CreditCard> {
    return this.patch(`${this.url}/${creditCard['id']}`, creditCard);
  }

  removeCreditCard(creditCardId: number) : Observable<CreditCard> {
    return this.delete(`${this.url}/${creditCardId}`);
  }
}