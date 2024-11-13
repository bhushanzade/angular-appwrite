import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorMsgComponent } from '../../../components/form-error-msg/form-error-msg.component';
import { Store } from '@ngrx/store';
import { ProfileActions } from '../../../store/profile/profile.action';
import {
  getProfileError,
  getProfileUser,
} from '../../../store/profile/profile.selector';
import { getUser } from '../../../store/auth/auth.selector';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorMsgComponent,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent {
  staticPhoto: string =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  picture: any = this.staticPhoto;
  id = '';
  loading = false;
  selectedImage: File | null = null;
  user: any;
  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    gender: new FormControl('', Validators.required),
    age: new FormControl('', [Validators.required, Validators.min(18)]),
    profileSummary: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required),
    education: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
  });

  get f() {
    return this.reactiveForm.controls;
  }

  private store = inject(Store);
  private firestore = inject(FirestoreService);

  ngOnInit() {
    this.store.select(getUser).subscribe((user) => {
      if (user) {
        this.user = user;
        this.store.dispatch(ProfileActions.profile({ id: user.id }));
        this.id = user.id;
        this.reactiveForm.setValue({
          name: user?.name ?? '',
          email: user?.email ?? '',
          mobile: user?.mobile ?? '',
          gender: user?.gender ?? '',
          age: user?.age ?? '',
          profileSummary: user?.profileSummary ?? '',
          designation: user?.designation ?? '',
          education: user?.education ?? '',
          location: user?.location ?? '',
        });
        this.reactiveForm.updateValueAndValidity();
        if (user.pic) {
          this.picture = user.pic;
        }
      }
    });

    this.store.select(getProfileUser).subscribe((user) => {
      if (user) {
        this.reactiveForm.setValue({
          name: user?.name ?? '',
          email: user?.email ?? '',
          mobile: user?.mobile ?? '',
          gender: user?.gender ?? '',
          age: user?.age ?? '',
          profileSummary: user?.profileSummary ?? '',
          designation: user?.designation ?? '',
          education: user?.education ?? '',
          location: user?.location ?? '',
        });
        this.reactiveForm.updateValueAndValidity();
        if (user.pic) {
          this.picture = user.pic;
        }
      }
      this.loading = false;
    });

    this.store.select(getProfileError).subscribe(() => {
      this.loading = false;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.picture = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.reactiveForm.invalid) {
      this.reactiveForm.markAllAsTouched();
      return;
    }

    if (!this.id) {
      return;
    }
    this.loading = true;
    this.store.dispatch(
      ProfileActions.updateProfile({
        id: this.id,
        data: this.reactiveForm.value,
      }),
    );
  }

  changePicture() {
    if (this.selectedImage && this.id) {
      const path = 'profile/' + this.id + '/' + this.selectedImage.name;
      this.firestore.uploadFile(this.selectedImage, path).subscribe((res) => {
        console.log('uploadFile res', res);
      });
    }
  }

  resetPicture() {
    this.selectedImage = null;
    this.picture = this.user?.pic ?? this.staticPhoto;
  }
}
