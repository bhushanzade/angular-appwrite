import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { getAuth } from '../../../store/auth/auth.selector';
import { FormErrorMsgComponent } from '../../../components/form-error-msg/form-error-msg.component';
import { ProjectActions } from '../../../store/project/project.action';
import { getProjectState } from '../../../store/project/project.selector';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormErrorMsgComponent],
  templateUrl: './add-edit-project.component.html',
  styleUrl: './add-edit-project.component.scss',
})
export class AddEditProjectComponent {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  reactiveForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });
  errorMsg = '';
  loading = false;
  user: any = null;
  id: string = '';

  get f() {
    return this.reactiveForm.controls;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') as string;
      this.store.select(getAuth).subscribe((auth) => {
        if (auth.user) {
          this.user = auth.user;
          if (this.id) {
            this.store.dispatch(ProjectActions.fetchById({ id: this.id }));
          } else {
            this.store.dispatch(ProjectActions.resetProject());
          }
          this.store.select(getProjectState).subscribe((auth) => {
            if (auth.project) {
              this.reactiveForm.setValue({
                name: auth.project.name,
                content: auth.project.content,
              });
              this.reactiveForm.updateValueAndValidity();
            }
            if (auth.error) {
              this.errorMsg = auth.error;
            }
            this.loading = false;
          });
        }
      });
    });
  }

  onSubmit() {
    this.errorMsg = '';
    if (this.reactiveForm.invalid) {
      this.reactiveForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    if (this.id) {
      this.store.dispatch(
        ProjectActions.updateProject({
          id: this.id,
          data: {
            ...this.reactiveForm.value,
            updatedAt: new Date(),
          },
        }),
      );
    } else {
      this.store.dispatch(
        ProjectActions.addProject({
          data: {
            ...this.reactiveForm.value,
            user: this.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      );
    }
  }
}
