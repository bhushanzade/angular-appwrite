import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.action';
import { FullPageLoaderComponent } from './components/full-page-loader/full-page-loader.component';
import { getIsAuthLoading } from './store/auth/auth.selector';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FullPageLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tut3';

  private store = inject(Store);

  $loading = this.store.select(getIsAuthLoading);

  ngOnInit() {
    this.store.dispatch(AuthActions.checkAuth());
  }
}
