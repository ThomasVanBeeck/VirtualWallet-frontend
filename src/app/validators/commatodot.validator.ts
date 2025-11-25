import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const commaToDot: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    
    if (!control.value) {
        return null;
    }
    
    if (typeof control.value === 'string' && control.value.includes(',')) {
        const newValue = control.value.replace(/,/g, '.');
        if (control.value !== newValue) {
            control.patchValue(newValue, { emitEvent: false });
        }
    }
    return null;
};