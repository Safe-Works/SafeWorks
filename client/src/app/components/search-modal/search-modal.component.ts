import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from './search-modal.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css']
})
export class SearchModalComponent {
  
  constructor(private jobService: JobService, private elementRef: ElementRef, private renderer: Renderer2, private modalService: ModalService) {}

  searchForm!: FormGroup;
  searchTerm = new FormControl('', [Validators.required]);
  jobs: any[] = [];

  ngOnInit() {
    
    this.modalService.openModalObservable.subscribe(() => {
      this.openModal();
    });
    
    this.searchForm = new FormGroup({
      searchTerm: this.searchTerm,
    });
  }

  openModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#searchModal');
    this.renderer.addClass(modalElement, 'show');
    this.renderer.setStyle(modalElement, 'display', 'block');

    const body = this.elementRef.nativeElement.ownerDocument.body;
    this.renderer.addClass(body, 'modal-open');
    this.renderer.setStyle(body, 'overflow', 'hidden');
    const divElement = this.renderer.createElement('div');
    this.renderer.setAttribute(divElement, 'id', 'divFade');
    this.renderer.addClass(divElement, 'modal-backdrop');
    this.renderer.addClass(divElement, 'fade');
    this.renderer.addClass(divElement, 'show');
    this.renderer.appendChild(body, divElement);
  }

  closeModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#searchModal');
    this.renderer.removeClass(modalElement, 'show');
    this.renderer.removeStyle(modalElement, 'display');
    const body = this.elementRef.nativeElement.ownerDocument.body;
    const divElement = body.querySelector('#divFade');
    if (divElement) {
      this.renderer.removeChild(body, divElement);
    }
  }

  findJobAd() {
    const term = this.searchForm.get('searchTerm')?.value;
    if (term.length >= 1) {
      this.jobService.FindJobAd(term).subscribe(
        (response) => {
          this.jobs = response.jobs;
          if (this.jobs.length === 0) {
            alert("Não foi encontrado nenhum serviço.")
          }
          console.log(response);
        }
      );
    } else {
      alert("Para realizar uma pesquisa é necessário escrever um termo.")
    }
  }
}
