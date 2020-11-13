import { AbstractControl, FormGroup } from '@angular/forms';

export function amountValidator(min: string, max: string) {
  return (form: FormGroup) => {
    const minControl = form.controls[min];
    const maxControl = form.controls[max];

    if (minControl && maxControl) {
      let minErrors = {...minControl.errors};

      if (Number(minControl.value) && Number(minControl.value) > Number(maxControl.value)) {
        minErrors['invalidValue'] = true;
        minControl.markAsTouched();
      } else {
        if (Object.keys(minErrors).length) {
          delete minErrors['invalidValue'];
        }
      }

      minErrors = Object.keys(minErrors).length ? minErrors : null;

      minControl.setErrors(minErrors);
    }
  }
}