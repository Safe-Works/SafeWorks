import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { JobService } from 'src/app/services/job.service';
import { UserAuth } from '../../auth/User.Auth';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class CardPostsComponent<T> {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() totalItems: number = 0;
  @Input() titleProperty: string = 'title';
  @Input() showActions: boolean = false;
  @Input() isMyPosts: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  @Input() editJobHandler: ((job: JobAdvertisement) => void) = () => {};
  @Input() deleteJobHandler: ((job: JobAdvertisement) => void) = () => {};
  constructor(private router: Router, private jobService: JobService, private userAuth: UserAuth) { }

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
  
  async getJobs() {
    this.isLoading = true;
    try {
      let data: any;
      if(this.isMyPosts)
        data = await this.jobService.GetJobs(this.currentPage, this.pageSize).toPromise();
      else
        this.jobService.GetJobsByWorkerId(this.currentPage, this.pageSize, this.userAuth.currentUser?.uid ?? "").toPromise();
      this.items = data.jobs;
      this.totalItems = data.total;
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      this.isLoading = false;
    }
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getJobs();
  }
}
