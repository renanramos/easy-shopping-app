import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/core/models/product/product.model';
import { ProductService } from 'src/app/core/service/product/product.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-publish-product-component',
  templateUrl: './publish-product-component.component.html',
  styleUrls: ['./publish-product-component.component.css'],
  providers: [ProductService]
})
export class PublishProductComponentComponent implements OnInit {

  product: Product;

  constructor(
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<PublishProductComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.product = this.data['product'] ? this.data['product'] : new Product();
  }

  async publishProduct() {
    const productPublished = {
      next: (product: Product) => {
        this.dialogRef.close(product);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.productService.publishProduct(this.product)
      .pipe(tap(productPublished))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
