import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  jobs: JobAdvertisement[] = [];
  totalJobs: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.getJobs();
  }

  getJobs() {
    this.isLoading = true;
    this.jobService.GetJobs(this.currentPage, this.pageSize).subscribe(data => {
      this.jobs = data.jobs;
      this.totalJobs = data.total;
      this.isLoading = false;
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getJobs();
  }
}
