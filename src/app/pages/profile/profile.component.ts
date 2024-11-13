import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileActions } from '../../store/profile/profile.action';
import { getUser } from '../../store/auth/auth.selector';
import { getProfileUser } from '../../store/profile/profile.selector';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private store = inject(Store);

  username = '';
  $user = this.store.select(getProfileUser);

  ngOnInit() {
    this.store.select(getUser).subscribe((user) => {
      if (user) {
        this.store.dispatch(ProfileActions.profile({ id: user.id }));
      }
    });
  }
}
