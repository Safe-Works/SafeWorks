import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import JobAdvertisement from 'src/app/models/job-advertisement.model';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.css']
})
export class CardPostComponent<T> {
  @Input() items: any[] = [];
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() isLoading: boolean = false;
  @Input() titleProperty: string = 'title';
  @Input() showActions: boolean = false;
  @Input() editJobHandler: ((job: JobAdvertisement) => void) = () => {};
  @Input() deleteJobHandler: ((job: JobAdvertisement) => void) = () => {};
  constructor(private router: Router) { }

  viewItem(item: any) {
    const jobId = item.uid;
    this.router.navigate(['/jobs', 'view', jobId]);
  }

  truncateTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  }
}
