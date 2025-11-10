import { AbstractControl, ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';

export function validateEquivalent(firstControlName: string, secondControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        if (!(group instanceof FormGroup)) {
            return null;
        }

        const firstControl = group.get(firstControlName);
        const secondControl = group.get(secondControlName);

        if (!firstControl || !secondControl) {
            return null;
        }

        if (secondControl.pristine || secondControl.value === '') {
            return null;
        }

        if (firstControl.value !== secondControl.value) {
            const error = { notEquivalent: true };
            secondControl.setErrors(error);
            return error;
        } else {
            if (secondControl.hasError('notEquivalent')) {
                const errors = secondControl.errors;
                if (errors) {
                    delete errors['notEquivalent'];
                    secondControl.setErrors(Object.keys(errors).length === 0 ? null : errors);
                }
            }
            return null;
        }
    };
}