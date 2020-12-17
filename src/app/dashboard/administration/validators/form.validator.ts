import { AbstractControl } from '@angular/forms';

export function DelegationUsers(control: AbstractControl): { [key: string]: boolean } | null {
    const empl = control.value && control.value.KuafID;
    return empl ? null : { 'emptyOrg': true };
}
