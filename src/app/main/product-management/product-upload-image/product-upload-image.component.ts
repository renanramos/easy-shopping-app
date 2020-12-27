import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ProductImage } from 'src/app/core/models/product-image/product-image.model';
import { ProductImageService } from 'src/app/core/service/product-image/product-image.service';
import { AlertDialogComponent } from 'src/app/core/shared/components/alert-dialog/alert-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-product-upload-image',
  templateUrl: './product-upload-image.component.html',
  styleUrls: ['./product-upload-image.component.css'],
  providers: [ProductImageService]
})
export class ProductUploadImageComponent implements OnInit {

  maxImageSize: number = 1024;
  productImageForm: FormGroup;

  selectedFile: File;
  base64Data: any;
  productId: number;
  convertedBinaryImage: any;
  fileReader = new FileReader();
  productImage: ProductImage;
  isCoverImageFlag: boolean = true;
  pictureNotSelected: boolean = false;

  alertDialogRef: MatDialogRef<AlertDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private productImageService: ProductImageService,
    private dialogRef: MatDialogRef<ProductUploadImageComponent>,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.productId = this.data['product']['id'];
    this.createForm();
  }

  createForm() {
    this.productImageForm = this.formBuilder.group({
      description: [''],
      picture: [null],
      isCoverImage: [this.isCoverImageFlag, [Validators.required]]
    })
  }

  async submitProductImage() {
    this.verifyPictureSelected();
    this.productImageForm.invalid ?
      this.productImageForm.markAllAsTouched() :
      this.uploadNewImage();
  }

  verifyPictureSelected() {
    if(!this.selectedFile || this.selectedFile.size <= 0) {
      this.pictureNotSelected = true;
      this.picture.setErrors({
        required: true
      });
    }
  }

  uploadNewImage() {
    let productImage: ProductImage = this.productImageForm.getRawValue();
    productImage = this.setProductImageValues(productImage);
    this.savePicture(productImage);
  }

  setProductImageValues(productImage: ProductImage): ProductImage {
    productImage.picture = this.base64Data.split(',')[1];
    productImage.productId = this.productId;
    productImage.isCoverImage = this.isCoverImageFlag;
    return productImage;
  }

  onSelectFile(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.isValidImageSize();
    }
  }

  isValidImageSize() {
    const imageSize = (this.selectedFile.size / 1000);
    (imageSize > this.maxImageSize) ?
      this.openaAlertDialog() :
      this.setPreviewImageProperty();
  }

  openaAlertDialog() {
    this.alertDialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: ConstantMessages.INVALID_IMAGE_SIZE },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    this.alertDialogRef.afterClosed()
      .subscribe(() => {
        this.productImageForm.reset();
        this.selectedFile = null;
        this.picture.setValue(null);
      });
  }

  async setPreviewImageProperty() {
    this.fileReader.readAsDataURL(this.selectedFile);
    this.fileReader.onload = (e) => {
      this.base64Data = this.fileReader.result;
      this.convertedBinaryImage = this.base64Data;
      if(this.convertedBinaryImage.length) {
        this.pictureNotSelected = false;
      }
    }
  }

  async savePicture(productImage: ProductImage) {
    const pictureUploaded = {
      next: (value) => {
        this.dialogRef.close(true);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.productImageService.uploadImage(productImage)
      .pipe(tap(pictureUploaded))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  get description() {
    return this.productImageForm.get('description');
  }

  get isCoverImage() {
    return this.productImageForm.get('isCoverImage');
  }

  get picture() {
    return this.productImageForm.get('picture');
  }
}
