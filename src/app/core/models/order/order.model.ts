import { OrderItem } from "../orderItem/order-item.model";

export class Order {
  public id?: number;
  public orderNumber: string;
  public customerId: string;
  public finished?: boolean;
  public items?: OrderItem[];
}