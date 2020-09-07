import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditCard } from 'src/app/core/models/credit-card/credit-card.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { CreditCardService } from 'src/app/core/service/credit-card/credit-card.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { CreditCardDetailComponent } from '../credit-card-detail/credit-card-detail.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';

@Component({
  selector: 'es-credit-card-list',
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.css'],
  providers: [CreditCardService]
})
export class CreditCardListComponent implements OnInit, OnDestroy {

  @Input() shouldUpdateList: Observable<any>;
  updateListSubscription: Subscription;

  dialogCreditCardDetailRef: MatDialogRef<CreditCardDetailComponent>;
  dialogConfirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  isLoadingCreditCard: boolean = false;
  creditCards: CreditCard[] = [];
  displayedColumns: string[] = ["code", "creditCardNumber", "ownerName", "validDate", "options"];

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private creditCardService: CreditCardService
  ) { }

  async ngOnInit() {
    this.subscribeToUpdateList();
    await this.loadCreditCards();
  }

  subscribeToUpdateList() {
    this.updateListSubscription = this.shouldUpdateList.subscribe(() => this.loadCreditCards());
  }

  ngOnDestroy() {
    this.updateListSubscription &&
      this.updateListSubscription.unsubscribe;
  }

  editCreditCard(creditCard: CreditCard) {
    this.dialogCreditCardDetailRef = this.dialog.open(CreditCardDetailComponent, {
      data: { creditCard: creditCard },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const creditCardUpdated = {
      next: (response) => {
        if (response) {
          this.loadCreditCards();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      }
    }

    this.dialogCreditCardDetailRef.afterClosed().subscribe(creditCardUpdated);
  }

  removeCreditCard(creditCard: CreditCard) {
    this.dialogConfirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: 'cartão de crédito'},
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const creditCardRemoved = {
      next: (response) => {
        if (response) {
          this.deleteCreditCard(creditCard);
        }
      }
    }

    this.dialogConfirmDialogRef.afterClosed().subscribe(creditCardRemoved);
  }

  async deleteCreditCard(creditCard: CreditCard) {

    const creditCardRemoved = {
      next: (response) => {
        this.loadCreditCards();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.creditCardService.removeCreditCard(creditCard['id'])
      .pipe(tap(creditCardRemoved))
      .toPromise()
      .then(() => true)
      .catch(() => false);

  }

  async loadCreditCards() {
    this.isLoadingCreditCard = true;

    const receivedCreditCards = {
      next: (creditCards: CreditCard[]) => {
        this.creditCards = creditCards;
        this.isLoadingCreditCard = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingCreditCard = false;
      }
    }

    await this.creditCardService.getCreditCards()
      .pipe(tap(receivedCreditCards))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
