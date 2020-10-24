import { Component, OnInit, Inject } from '@angular/core';
import { StoreService } from 'src/app/core/service/store/store.service';
import { CompanyService } from 'src/app/core/service/company/company.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company } from 'src/app/core/models/registration/company.model';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { tap } from 'rxjs/operators';
import { Store } from 'src/app/core/models/store/store.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';

@Component({
  selector: 'es-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.css'],
  providers: [StoreService, CompanyService, UtilsService]
})
export class StoreDetailComponent implements OnInit {

  storeForm: FormGroup;
  companies: Company[] = [];
  isWaitingResponse: boolean = false;
  isLoadingCompanies: boolean = false;
  store: Store = new Store();
  isAdminUser: boolean = false;

  constructor(private storeService: StoreService, 
      private companyService: CompanyService,
      private utilsService: UtilsService,
      private formBuilder: FormBuilder,
      private snackBarService: SnackbarService,
      private securityUserService: SecurityUserService,
      private dialogRef: MatDialogRef<StoreDetailComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.isAdminUser = this.securityUserService.isAdminUser;
    this.store = this.data['store'] ? this.data['store'] : new Store();
    this.createForm();
    if (this.isAdminUser) {
      await this.loadCompanies();
    } else {
      this.companyId.setValue(this.securityUserService.userLoggedId);
    }
  }

  async loadCompanies() {

    this.isLoadingCompanies = true;

    const receivedCompanies = {
      next: (companies: Company[]) => {
        if (companies.length) {
          this.companies = companies;
        }
        this.isLoadingCompanies = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingCompanies = false;
      }
    };

    await this.companyService.getCompanies(null, ScrollValues.NO_PAGE_LIMIT, null, true)
      .pipe(tap(receivedCompanies))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  createForm() {
    this.storeForm = this.formBuilder.group({
      name: [this.store.name ? this.store.name : '', [Validators.required]],
      corporateName: [this.store.corporateName ? this.store.corporateName : '', [Validators.required]],
      registeredNumber: [this.store.registeredNumber ? this.store.registeredNumber : '', [Validators.required]],
      companyId: [this.store.companyId ? this.store.companyId : null, [Validators.required]]
    });
  }

  get name() {
    return this.storeForm.get('name');
  }

  get corporateName() {
    return this.storeForm.get('corporateName');
  }

  get registeredNumber() {
    return this.storeForm.get('registeredNumber');
  }

  get companyId() {
    return this.storeForm.get('companyId');
  }

  async submitStore() {
    this.storeForm.invalid ?
      this.storeForm.markAllAsTouched() :
      await this.saveStore();
  }

  async saveStore() {
    const store: Store = this.storeForm.getRawValue();    

    this.store['id'] ?
      await this.updateStore(store) :
      await this.saveNewStore(store);
  }


  async updateStore(store: Store) {
    this.isWaitingResponse = true;

    store['id'] = this.store['id'];

    const receivedStore = {
      next: (storeUpdated: Store) => {
        if (storeUpdated) {
          this.dialogRef.close(storeUpdated);
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.storeService.udpateStore(store)
      .pipe(tap(receivedStore))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async saveNewStore(store: Store) {
    const receivedStore = {
      next: (storeCreated: Store) => {
        if (storeCreated) {
          this.dialogRef.close(storeCreated);
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.storeService.saveStore(store)
      .pipe(tap(receivedStore))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
