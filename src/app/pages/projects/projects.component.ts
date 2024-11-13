import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getProjects } from '../../store/project/project.selector';
import { CommonModule } from '@angular/common';
import { ProjectActions } from '../../store/project/project.action';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private router = inject(Router);
  private store = inject(Store);

  projects: any[] = [];
  total: number = 0;

  ngOnInit() {
    this.store.dispatch(ProjectActions.fetch());
    this.store.select(getProjects).subscribe((projects) => {
      this.projects = [...projects.documents];
      this.total = projects.total;
    });
  }

  addProject() {
    this.router.navigateByUrl('/projects/new');
  }

  editProject(id: any) {
    this.router.navigate([`/projects/edit/${id}`]);
  }

  deleteProject(id: any, index: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects[index] = {
        ...this.projects[index],
        loading: true,
      };
      this.store.dispatch(ProjectActions.deleteProject({ id: id }));
    }
  }
}
