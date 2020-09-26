import { ProductImage } from '../product-image/product-image.model';

export class Product {
  public id: number;
  public name: string;
  public description: string;
  public price: number;
  public productCategoryId: number;
  public productCategoryName: string;
  public storeId: number;
  public picture: any;
  public companyId: number;
}