import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  snackBarOption: string = 'close';
  snackBarConfig = {
    duration: 3000
  }

  constructor(private snackbar: MatSnackBar) { }

  openSnackBar(message: string, option?: string) {
    this.snackbar.open(message, option ? option : this.snackBarOption, this.snackBarConfig);
  }
}
