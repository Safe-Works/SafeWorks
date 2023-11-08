import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-jobs-status',
  templateUrl: './jobs-status.component.html',
  styleUrls: ['./jobs-status.component.css']
})
export class JobsStatusComponent implements OnInit {

  @Input() paginatedJobsData: any;
  public jobsStatusData: Array<{title: string, price: string, created: string, status: string, statusClass: string}> = [];
  public jobStatusClass: string = 'text-warning';

  async ngOnInit() {
    this.setJobsStatusData();
  }

  setJobsStatusData() {
    this.paginatedJobsData.forEach((job: { advertisement: {id: number, title: string}; price: number; created: string; }) => {
      this.jobsStatusData.push({
        title: job.advertisement.title,
        price: job.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        created: this.setJobDate(job.created),
        status: this.setJobStatus(job),
        statusClass: this.setJobStatusClass(job),
      });
    });
  }

  setJobDate(created: string): string {
    const date = created.split(' ');
    return date[0];
  }

  setJobStatus(job: any): string {
    if (job.expired) {
      return 'Cancelado';
    }
    if (job.deleted) {
      return 'Excluído';
    }
    if (job.status === 'finished') {
      return 'Finalizado/Pago'
    }
    if (job.status === 'pending') {
      return 'Aguardando Pagamento';
    }
    if (job.status === 'reported') {
      return 'Denunciado';
    }

    return 'Em Andamento';
  }

  setJobStatusClass(job: any): string {
    if (job.expired) {
      return 'text-danger';
    }
    if (job.deleted) {
      return 'text-danger';
    }
    if (job.status === 'finished') {
      return 'text-success'
    }
    if (job.status === 'pending') {
      return 'text-warning';
    }
    if (job.status === 'reported') {
      return 'text-danger';
    }

    return 'text-warning';
  }

}
