import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '@cov/shared/services/notifications.service';

@Component({
  selector: 'cov-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  accountGroup: FormGroup;
  profileGroup: FormGroup;
  hide: boolean = true;
  loading: boolean = false;
  passwordRepeatValid: boolean = true;
  accountControl(value: string): AbstractControl | null { return this.accountGroup ? this.accountGroup.get(value) : null; }
  profileControl(value: string): AbstractControl | null { return this.profileGroup ? this.profileGroup.get(value) : null; }

  constructor(
    public notifications: NotificationsService
  ) {

  }

  ngOnInit() {
    this.createAccountGroup();
    this.createProfileGroup();
  }
  createProfileGroup() {
  }
  createAccountGroup() {
    this.accountGroup = new FormGroup({
      email: new FormControl({
        value: '',
        disabled: false
      }, [Validators.required, Validators.email]),
      phone: new FormControl({
        value: '',
        disabled: false
      }, [Validators.required, Validators.minLength(9)]),
      password: new FormControl({
        value: '',
        disabled: false
      }, [Validators.required, Validators.minLength(9)]),
      passwordRepeat: new FormControl({
        value: '',
        disabled: false
      }, []),

    })
  }

}
