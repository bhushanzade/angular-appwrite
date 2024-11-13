import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.action';
import { getAuth } from '../../store/auth/auth.selector';

@Component({
  selector: 'app-register-popup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register-popup.component.html',
  styleUrl: './register-popup.component.scss',
})
export class RegisterPopupComponent {
  private store = inject(Store);

  @Output() close: EventEmitter<any> = new EventEmitter();

  loginLoader = false;
  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  errorMsg = '';

  get f() {
    return this.reactiveForm.controls;
  }

  ngOnInit() {
    this.store.select(getAuth).subscribe((auth) => {
      if (auth.user) {
        this.close.emit();
      } else if (auth.error) {
        this.errorMsg = auth.error ?? 'Invalid Credentials';
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
    const { name, email, password } = this.reactiveForm.getRawValue();
    this.loginLoader = true;
    this.store.dispatch(AuthActions.register({ name, email, password }));
  }
}
