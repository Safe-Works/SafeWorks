import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { UserAuth } from '../../../auth/User.Auth';
import { JobService } from 'src/app/services/job.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  jobs: JobAdvertisement[] = [];
  totalJobs: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  isMyAdsPage: boolean = true;
  isMyPosts: boolean = true;
  
  constructor(private jobService: JobService, private userAuth: UserAuth, private router: Router) { }

  ngOnInit() {
    this.getJobs();
  }
  
  viewJob(job: JobAdvertisement) {
    const jobId = job.uid;
    this.router.navigate(['/jobs', 'view', jobId]);
  }

  async getJobs() {
    this.isLoading = true;
    try {
      const data = await this.jobService.GetJobsByWorkerId(this.currentPage, this.pageSize, this.userAuth.currentUser?.uid ?? "").toPromise();
      this.jobs = data.jobs;
      this.totalJobs = data.total;
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Swal.fire(
        'Erro!',
        'Ocorreu um erro ao buscar seus anúncios.',
        'error'
      )
      this.isLoading = false;
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getJobs();
  }
  
  editJob(job: JobAdvertisement) {
    const jobId = job.uid;
    this.router.navigate(['/jobs', 'edit', jobId]);
  }

  deleteJob(job: JobAdvertisement) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--interaction-blue)',
      cancelButtonColor: 'var(--interaction-red)',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobService.DeleteById(job.uid ?? "").subscribe((response) => {
          if (response.statusCode === 200) {
            this.getJobs();
            Swal.fire(
              'Deletado!',
              'Seu anúncio foi deletado com sucesso.',
              'success'
            )
          } else {
            Swal.fire(
              'Erro!',
              'Ocorreu um erro ao deletar o anúncio.',
              'error'
            )
          }
        })
      }
    })
  }
}
