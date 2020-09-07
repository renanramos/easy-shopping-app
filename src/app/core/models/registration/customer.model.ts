import { CreditCard } from '../credit-card/credit-card.model';
import { Address } from '../address/address.model';

export class Customer {
  public id: number;
  public name: string;
  public email: string;
  public cpf: string;
  public password: string;
  public address: Address[];
  public creditCards: CreditCard[];
}