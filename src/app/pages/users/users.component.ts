import { Component, inject } from '@angular/core';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { getUsers } from '../../store/user/user.selector';
import { UserActions } from '../../store/user/user.action';
import { getUser } from '../../store/auth/auth.selector';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private router = inject(Router);
  private store = inject(Store);

  users: any[] = [];
  total: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  loadingData: boolean = false;
  loggedInUser: any;

  ngOnInit() {
    this.store.select(getUser).subscribe((user) => {
      if (user) {
        this.loggedInUser = { ...user };
        this.fetchUsers();
      }
    });
    this.store.select(getUsers).subscribe((users) => {
      this.users = [...users.documents];
      this.total = users.total;
      this.loadingData = false;
    });
  }

  fetchUsers() {
    const offset = (this.currentPage - 1) * this.pageSize;
    this.loadingData = true;
    this.store.dispatch(
      UserActions.fetch({
        currentUser: this.loggedInUser.id,
        limit: this.pageSize,
        offset: offset,
      }),
    );
  }

  pageChange(page: number) {
    this.currentPage = Number(page);
    this.fetchUsers();
  }

  openChat(user: any) {
    this.router.navigate([`/chat/${user}`]);
  }
}
