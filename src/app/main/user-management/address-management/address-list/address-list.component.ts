import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AddressService } from 'src/app/core/service/address/address.service';
import { Address } from 'src/app/core/models/address/address.model';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { tap } from 'rxjs/internal/operators/tap';
import { Subject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'es-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
  providers: [AddressService]
})
export class AddressListComponent implements OnInit, OnDestroy {
  
  @Input() shouldUpdateList: Observable<any>;
  updateListSubscription: Subscription;

  isLoadingAddresses: boolean = false;
  addresses: Address[] = [];
  displayedColumns: string[] = ["cep", "city", "district", "number", "state", "streetName", "options"]

  constructor(
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private addressService: AddressService) { }

  async ngOnInit() {
    this.updateListSubscription = this.shouldUpdateList.subscribe(() => this.loadAddress());
    await this.loadAddress();
  }

  ngOnDestroy() {
    this.updateListSubscription &&
      this.updateListSubscription.unsubscribe();
  }

  async loadAddress() {
    this.isLoadingAddresses = true;
    const receivedAddresses = {
      next: (addresses: Address[]) => {
        this.addresses = addresses;
        this.isLoadingAddresses = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingAddresses = false;
      }
    };

    await this.addressService.getAddresses()
      .pipe(tap(receivedAddresses))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
