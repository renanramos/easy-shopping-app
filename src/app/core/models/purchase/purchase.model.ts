import { Address } from '../address/address.model';
import { CreditCard } from '../credit-card/credit-card.model';
import { Order } from '../order/order.model';

export class Purchase {
  public id?: number;
  public orderId: number;
  public addressId: number;
  public creditCardId: number;
  public purchaseDate?: any;
  public customerId?: string;
}