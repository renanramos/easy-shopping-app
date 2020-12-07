
export class Product {
  public id: number;
  public name: string;
  public description: string;
  public price: number;
  public amount?: number;
  public productCategoryId?: number;
  public productCategoryName?: string;
  public storeId?: string;
  public picture?: any;
  public companyId?: string;
  public inCart?: boolean;
}