import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { AddressService } from 'src/app/core/service/address/address.service';
import { Address } from 'src/app/core/models/address/address.model';
import { tap } from 'rxjs/internal/operators/tap';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';

@Component({
  selector: 'es-address-detail',
  templateUrl: './address-detail.component.html',
  styleUrls: ['./address-detail.component.css'],
  providers: [AddressService]
})
export class AddressDetailComponent implements OnInit {

  address: Address;
  addressForm: FormGroup;
  isWaitingResponse: boolean = false;
  customerId: string = null;

  constructor(
    private dialogRef: MatDialogRef<AddressDetailComponent>,
    private addressService: AddressService,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.address = this.data['address'] ? this.data['address'] : new Address();
    this.customerId = this.data['userTokenId'];
    this.createForm();
  }

  createForm() {
    this.addressForm = this.formBuilder.group({
      cep: [(this.address['cep'] ? this.address['cep'] : ''), [Validators.required]],
      city: [(this.address['city'] ? this.address['city'] : ''), [Validators.required]],
      district: [(this.address['district'] ? this.address['district'] : ''), [Validators.required]],
      number: [(this.address['number'] ? this.address['number'] : ''), [Validators.required]],
      state: [(this.address['state'] ? this.address['state'] : ''), [Validators.required, Validators.maxLength(2)]],
      streetName: [(this.address['streetName'] ? this.address['streetName'] : ''), [Validators.required]]
    });
  }

  get streetName() {
    return this.addressForm.get('streetName');
  }
  
  get number() {
    return this.addressForm.get('number');
  }

  get cep() {
    return this.addressForm.get('cep');
  }
  
  get district() {
    return this.addressForm.get('district');
  }

  get city() {
    return this.addressForm.get('city');
  }

  get state() {
    return this.addressForm.get('state');
  }

  submitAddress() {
    this.addressForm.invalid ?
      this.addressForm.markAllAsTouched() :
      this.saveAddress();
  }

  async saveAddress() {
    const address: Address = this.addressForm.getRawValue();
    address['customerId'] = this.customerId;
    this.address['id'] ?
      await this.updateAddress(address) :
      await this.saveNewAddress(address);
  }

  async saveNewAddress(address: Address) {
    this.isWaitingResponse = true;
    const addressSaved = {
      next: (address: Address) => {
        this.dialogRef.close(address);
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED, 'close');
        this.isWaitingResponse = false;
      },
      error: (response) => {
        this.isWaitingResponse = false;
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.addressService.saveAddress(address)
      .pipe(tap(addressSaved))
      .toPromise()
      .then(() => true)
      .catch(() => false);

  }

  async updateAddress(address: Address) {
    this.isWaitingResponse = true;
    address['id'] = this.address['id'];
    address['customerId'] = this.address['customerId'];

    const addressUpdated = {
      next: (address: Address) => {
        this.dialogRef.close(address);
        this.isWaitingResponse = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.addressService.updateAddress(address)
      .pipe(tap(addressUpdated))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
