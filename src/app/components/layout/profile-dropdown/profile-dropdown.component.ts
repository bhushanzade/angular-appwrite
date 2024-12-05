import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { OutsideClickDirective } from '../../../directives/outside-click.directive';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.action';
import { AppwriteDBService } from '../../../services/appwrite-db.service';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [OutsideClickDirective],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.scss',
})
export class ProfileDropdownComponent implements OnChanges {
  isDropdownOpen: boolean = false;
  staticPhoto: string =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  picture = this.staticPhoto;
  @Input() user: any;

  private store = inject(Store);
  private appWriteDB = inject(AppwriteDBService);

  ngOnChanges(changes: SimpleChanges) {
    if (this.user && this.user.pic) {
      this.picture = this.appWriteDB.getFileUrl(this.user.pic, 'test-storage');
    }
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.isDropdownOpen = false;
  }

  onImageError(event: any) {
    console.log('event', event);

    // this.picture = this.staticPhoto
  }
}
