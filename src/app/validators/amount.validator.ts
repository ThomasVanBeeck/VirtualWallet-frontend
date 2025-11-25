import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export function validateAmount(firstControlName: string, secondControlName: string, maxAmount: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) {
      return null;
    }
      
    const firstControl = group.get(firstControlName)
    const secondControl = group.get(secondControlName)

    if (!firstControl || !secondControl) return null;
    if (Number(firstControl.value) > maxAmount && secondControl.value === "Withdrawal") {
      const error = { invalidAmount: true }
      firstControl.setErrors(error)
      return error
    } else {
      if (firstControl.hasError('invalidAmount')) {
        const errors = firstControl.errors
        if (errors) {
          delete errors['invalidAmount']
          firstControl.setErrors(Object.keys(errors).length === 0 ? null : errors)
        }
      }
      return null
    }
  }
}