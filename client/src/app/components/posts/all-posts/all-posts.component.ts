import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { JobService } from 'src/app/services/job.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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

  constructor(private jobService: JobService, private router: Router) { }

  ngOnInit() {
    this.getJobs();
  }

  async getJobs() {
    this.isLoading = true;
    try {
      const data = await this.jobService.GetJobs(this.currentPage, this.pageSize).toPromise();
      this.jobs = data.jobs;
      this.totalJobs = data.total;
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Swal.fire(
        'Erro!',
        'Ocorreu um erro ao buscar os anúncios.',
        'error'
      )
      this.isLoading = false;
    }
  }
}
