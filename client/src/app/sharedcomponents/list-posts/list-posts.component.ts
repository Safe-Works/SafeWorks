import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { JobService } from 'src/app/services/job.service';
import { UserAuth } from '../../auth/User.Auth';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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
      if(!this.isMyPosts)
        data = await this.jobService.GetJobs(this.currentPage, this.pageSize).toPromise();
      else
        data = await this.jobService.GetJobsByWorkerId(this.currentPage, this.pageSize, this.userAuth.currentUser?.uid ?? "").toPromise();
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
