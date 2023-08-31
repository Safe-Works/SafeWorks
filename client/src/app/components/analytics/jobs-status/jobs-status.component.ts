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
    console.log(this.jobsStatusData);
    this.paginatedJobsData.forEach((job: { advertisement: any[]; contract_price: number; created: string; }) => {
      this.jobsStatusData.push({
        title: job.advertisement[1],
        price: job.contract_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
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
    if (job.canceled) {
      return 'Cancelado';
    }
    if (job.payed) {
      return 'Finalizado/Pago'
    }
    if (job.deleted) {
      return 'Excluído';
    }

    return 'Em Andamento';
  }

  setJobStatusClass(job: any): string {
    if (job.canceled) {
      return 'text-danger';
    }
    if (job.payed) {
      return 'text-success'
    }
    if (job.deleted) {
      return 'text-danger';
    }

    return 'text-warning';
  }

}
