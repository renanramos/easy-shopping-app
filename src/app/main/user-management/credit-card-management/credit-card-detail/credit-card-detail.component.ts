import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { CreditCardService } from 'src/app/core/service/credit-card/credit-card.service';
import { CreditCard } from 'src/app/core/models/credit-card/credit-card.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';

@Component({
  selector: 'es-credit-card-detail',
  templateUrl: './credit-card-detail.component.html',
  styleUrls: ['./credit-card-detail.component.css'],
  providers: [CreditCardService]
})
export class CreditCardDetailComponent implements OnInit {

  crediCardForm: FormGroup;
  customerId: number = null;
  creditCard: CreditCard;
  isWaitingResponse: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreditCardDetailComponent>,
    private securityUserService: SecurityUserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private creditCardService: CreditCardService) { }

  ngOnInit() {
    this.creditCard = this.data['creditCard'] ? this.data['creditCard'] : new CreditCard();
    this.customerId = this.securityUserService.idUserLoggedIn;
    this.createForm();
  }

  createForm() {
    this.crediCardForm = this.formBuilder.group({
      ownerName: [(this.creditCard['ownerName'] ? this.creditCard['ownerName'] : ''), [Validators.required]],
      creditCardNumber: [(this.creditCard['creditCardNumber'] ? this.creditCard['creditCardNumber'] : ''), [Validators.required]],
      code: [(this.creditCard['code'] ? this.creditCard['code'] : ''), [Validators.required]],
      validDate: [(this.creditCard['validDate'] ? this.creditCard['validDate'] : ''), [Validators.required]]
    });
  }

  submitCreditCard() {
    this.crediCardForm.invalid ?
      this.crediCardForm.markAllAsTouched() :
      this.saveCreditCard();
  }

  async saveCreditCard() {
    const creditCard: CreditCard = this.crediCardForm.getRawValue();
    creditCard['customerId'] = this.customerId;

    this.creditCard['id'] ?
      await this.updateCreditCard(creditCard) :
      await this.saveNewCreditCard(creditCard);
  }

  async saveNewCreditCard(creditCard: CreditCard) {
    this.isWaitingResponse = true;

    const receivedCreditCard = {
      next: (creditCard: CreditCard) => {
        if (creditCard) {
          this.dialogRef.close(creditCard);
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED, 'close');
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.creditCardService.saveCreditCard(creditCard)
      .pipe(tap(receivedCreditCard))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async updateCreditCard(creditCard: CreditCard) {
    this.isWaitingResponse = true;
    creditCard['id'] = this.creditCard['id'];

    const creditCardUpdated = {
      next: (creditCard: CreditCard) => {
        this.isWaitingResponse = false;
        this.dialogRef.close(creditCard);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.creditCardService.updateCreditCard(creditCard)
      .pipe(tap(creditCardUpdated))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  get code() {
    return this.crediCardForm.get('code');
  }

  get creditCardNumber() {
    return this.crediCardForm.get('creditCardNumber');
  }

  get ownerName() {
    return this.crediCardForm.get('ownerName');
  }

  get validDate() {
    return this.crediCardForm.get('validDate');
  }
}
