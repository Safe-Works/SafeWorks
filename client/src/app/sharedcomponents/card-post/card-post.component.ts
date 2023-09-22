import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { JobService } from 'src/app/services/job.service';

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
  constructor(private router: Router, private jobService: JobService) { }

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
