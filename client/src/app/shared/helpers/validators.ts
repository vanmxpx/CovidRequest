import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidatorsExtensions {
    public static empty(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }
        return control.value.toString().trim() ? null : { required: true };
    }

    public static moreThenZero(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }
        return Number.parseFloat(control.value) > 0 ? null : { min: true };
    }
}
