import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  @Output() pageChange = new EventEmitter<number>();
  @Input({ required: true }) totalCount: number = 0;
  @Input({ required: false }) limit: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.totalPages = Math.ceil(this.totalCount / this.limit);
    this.updatePagination();
  }

  updatePagination() {
    const range = 5;
    const start = Math.max(
      1,
      Math.floor((this.currentPage - 1) / range) * range + 1,
    );
    const end = Math.min(start + range - 1, this.totalPages);

    this.pages = [];
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  goToPreviousSet() {
    const prevSet = Math.max(1, Math.floor((this.currentPage - 1) / 5) * 5);
    this.currentPage = prevSet;
    this.pageChange.emit(prevSet);
  }

  goToNextSet() {
    const nextSet = Math.min(
      this.totalPages,
      Math.floor((this.currentPage - 1) / 5) * 5 + 6,
    );
    this.currentPage = nextSet;
    this.pageChange.emit(nextSet);
  }
}
