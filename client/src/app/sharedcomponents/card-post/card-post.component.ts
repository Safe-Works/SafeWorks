import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { JobService } from 'src/app/services/job.service';
import { UserAuth } from 'src/app/auth/User.Auth';

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
  constructor(private router: Router, private jobService: JobService, private userAuth: UserAuth) { }

  viewItem(item: any) {
    const jobId = item.uid;
    this.router.navigate(['/jobs', 'view', jobId]);
  }

  async getJobs() {
    this.isLoading = true;
    try {
      const data = await this.jobService.GetJobsByWorkerId(this.currentPage, this.pageSize, this.userAuth.currentUser?.uid ?? "").toPromise();
      this.items = data.jobs;
      this.totalItems = data.total;
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

  truncateTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
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
