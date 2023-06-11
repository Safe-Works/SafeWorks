import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { UserAuth } from '../../../auth/User.Auth';
import { JobService } from 'src/app/services/job.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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

  constructor(private jobService: JobService, private userAuth: UserAuth) { }

  ngOnInit() {
    this.getJobs();
  }

  getJobs() {
    this.isLoading = true;
    this.jobService.GetJobsByWorkerId(this.currentPage, this.pageSize, this.userAuth.currentUser?.uid ?? "").subscribe(data => {
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
  editJob(job: JobAdvertisement) {
    // Lógica para editar o job
  }
  
  deleteJob(job: JobAdvertisement) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
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
