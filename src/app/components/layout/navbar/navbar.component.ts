import { Component, inject } from '@angular/core';
import { ProfileDropdownComponent } from '../profile-dropdown/profile-dropdown.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../modal/modal.component';
import { LoginPopupComponent } from '../../login-popup/login-popup.component';
import { RegisterPopupComponent } from '../../register-popup/register-popup.component';
import { Store } from '@ngrx/store';
import { getAuth } from '../../../store/auth/auth.selector';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ProfileDropdownComponent,
    RouterModule,
    ModalComponent,
    LoginPopupComponent,
    RegisterPopupComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoginModalOpen = false;
  isRegModalOpen = false;
  user: any = null;

  private store = inject(Store);

  ngOnInit() {
    this.store.select(getAuth).subscribe((auth) => {
      this.user = auth.user;
    });
  }

  onCloseModal(event: string) {
    if (event === 'login') {
      this.isRegModalOpen = false;
      this.isLoginModalOpen = true;
    } else if (event === 'register') {
      this.isLoginModalOpen = false;
      this.isRegModalOpen = true;
    } else {
      this.isLoginModalOpen = false;
      this.isRegModalOpen = false;
    }
  }
}
