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
import { AppwriteDBService } from '../../../services/appwrite-db.service';

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
  private store = inject(Store);
  private appWriteDB = inject(AppwriteDBService);

  picture: any = this.appWriteDB.staticPhoto;
  id = '';
  loading = false;
  selectedImage: File | null = null;
  user: any;
  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
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

  ngOnInit() {
    this.store.select(getUser).subscribe((user) => {
      if (user) {
        this.user = user;
        this.store.dispatch(ProfileActions.profile({ id: user.id }));
        this.id = user.id;
        this.bindReactiveForm(user);
      }
    });

    this.store.select(getProfileUser).subscribe((user) => {
      if (user) {
        this.bindReactiveForm(user);
      }
      this.loading = false;
    });

    this.store.select(getProfileError).subscribe(() => {
      this.loading = false;
    });
  }

  bindReactiveForm(user: any) {
    this.reactiveForm.setValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      gender: user?.gender ?? '',
      age: user?.age ?? '',
      profileSummary: user?.profileSummary ?? '',
      designation: user?.designation ?? '',
      education: user?.education ?? '',
      location: user?.location ?? '',
    });
    this.reactiveForm.updateValueAndValidity();
    if (user.pic) {
      this.picture = this.appWriteDB.getFileUrl(user.pic, 'test-storage');
    }
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
      this.store.dispatch(
        ProfileActions.updateProfilePic({
          uid: this.id,
          storageId: 'test-storage',
          file: this.selectedImage,
        }),
      );
    }
  }

  resetPicture() {
    this.selectedImage = null;
    this.picture = this.user?.pic ?? this.appWriteDB.staticPhoto;
  }
}
