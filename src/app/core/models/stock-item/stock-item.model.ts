import { Stock } from '../stock/stock.model';

export class StockItem {
  public id: number;
  public productId: number;
  public maxAmount: number;
  public minAmount: number;
  public currentAmount: number;
  public stockId: number;
  public storeId: number;
}