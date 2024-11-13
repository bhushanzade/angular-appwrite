import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.action';
import { getAuth } from '../../store/auth/auth.selector';

@Component({
  selector: 'app-login-popup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss',
})
export class LoginPopupComponent {
  private store = inject(Store);

  @Output() close: EventEmitter<any> = new EventEmitter();

  loginLoader = false;
  reactiveForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  errorMsg = '';

  get f() {
    return this.reactiveForm.controls;
  }

  ngOnInit() {
    this.store.select(getAuth).subscribe((auth) => {
      if (auth.token) {
        this.close.emit();
      } else if (auth.error) {
        this.errorMsg = auth.error?.message ?? 'Invalid Credentials';
      }
      this.loginLoader = false;
    });
  }

  submit() {
    this.errorMsg = '';
    if (this.reactiveForm.invalid) {
      this.reactiveForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.reactiveForm.getRawValue();
    this.loginLoader = true;
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  loginWithGoogle() {
    this.store.dispatch(AuthActions.googleLogin());
  }
}
