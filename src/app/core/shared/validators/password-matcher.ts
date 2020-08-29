import { FormGroup, ValidatorFn } from '@angular/forms';

export function passwordMatcher(password: string, confirmPassword: string) {
  return (form: FormGroup) => {
    const passwordControl = form.controls[password];
    const confirmPasswordControl = form.controls[confirmPassword];

    if (passwordControl && confirmPasswordControl) {

      let passwordErrors = {...passwordControl.errors};
      let confirmPasswordErrors = {...confirmPasswordControl.errors};

      if (confirmPasswordControl.value && passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordErrors['notMatch'] = true;
        confirmPasswordControl.markAsTouched();
      } else {
        if (Object.keys(confirmPasswordErrors).length) {
          delete confirmPasswordErrors['notMatch'];
        }
      }

      passwordErrors = Object.keys(passwordErrors).length
        ? passwordErrors
        : null;
      
      confirmPasswordErrors = Object.keys(confirmPasswordErrors).length
        ? confirmPasswordErrors
        : null;

      passwordControl.setErrors(passwordErrors);
      confirmPasswordControl.setErrors(confirmPasswordErrors);
    }
  }  
}