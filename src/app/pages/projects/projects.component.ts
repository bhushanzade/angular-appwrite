import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { Store } from '@ngrx/store';
import { getProjects } from '../../store/project/project.selector';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ListProjectsComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private router = inject(Router);
  private store = inject(Store);

  $projects = this.store.select(getProjects);

  addProject() {
    this.router.navigateByUrl('/projects/new');
  }
}
