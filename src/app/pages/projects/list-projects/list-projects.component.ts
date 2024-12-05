import { Component, inject } from '@angular/core';
import { ProjectActions } from '../../../store/project/project.action';
import { getProjects } from '../../../store/project/project.selector';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-list-projects',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './list-projects.component.html',
  styleUrl: './list-projects.component.scss',
})
export class ListProjectsComponent {
  private router = inject(Router);
  private store = inject(Store);

  projects: any[] = [];
  total: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  loadingData: boolean = false;

  ngOnInit() {
    this.store.select(getProjects).subscribe((projects) => {
      this.projects = [...projects.documents];
      this.total = projects.total;
      this.loadingData = false;
    });
    this.fetchProjects();
  }

  fetchProjects() {
    const offset = (this.currentPage - 1) * this.pageSize;
    this.loadingData = true;
    this.store.dispatch(
      ProjectActions.fetch({ limit: this.pageSize, offset: offset }),
    );
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

  pageChange(page: number) {
    this.currentPage = Number(page);
    this.fetchProjects();
  }
}
