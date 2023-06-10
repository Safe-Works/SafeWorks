import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  jobs: JobAdvertisement[] = [];
  totalJobs: number = 0; 
  currentPage: number = 1; 
  pageSize: number = 10; 

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.getJobs();
  }
  getDescriptionMaxHeight(): number {
    const maxLines = 3; // Defina o número máximo de linhas que deseja exibir
    const lineHeight = 24; // Defina a altura da linha em pixels
    const maxHeight = maxLines * lineHeight;
  
    return maxHeight;
  }
  
  getJobs() {
    this.jobService.GetJobs(this.currentPage, this.pageSize).subscribe(data => {
      this.jobs = data.jobs;
      this.totalJobs = data.total;
    });
  }

  onPageChange(event: PageEvent) {
    // Chamado quando houver uma mudança de página no paginador
    this.currentPage = event.pageIndex + 1; // Atualize a página atual
    this.pageSize = event.pageSize; // Atualize o tamanho da página
    this.getJobs(); // Busque os jobs atualizados com base na nova página
  }
}
