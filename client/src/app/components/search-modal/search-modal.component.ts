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
  }

  closeModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#searchModal');
    this.renderer.removeClass(modalElement, 'show');
    this.renderer.removeStyle(modalElement, 'display');
    this.renderer.removeStyle(modalElement, 'block');
  }

  findJobAd() {
    const term = this.searchForm.get('searchTerm')?.value;
    const jobs = this.jobService.FindJobAd(term).forEach(
      (response) => {
        alert(response);
        console.log(response);
      }
    );
    
  }
}
