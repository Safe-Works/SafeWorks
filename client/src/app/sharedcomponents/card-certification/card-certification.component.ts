import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Certification from 'src/app/models/certification.model';

@Component({
  selector: 'app-card-certification',
  templateUrl: './card-certification.component.html',
  styleUrls: ['./card-certification.component.css']
})
export class CardCertificationComponent<T> {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() certifications: Certification[] = [];
  @Input() showActions: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() deleteCertificationHandler: ((certification: Certification) => void) = () => {};

  constructor(private router: Router) { }

  formatIssueDate(issueDate: any): string {
    const seconds = issueDate._seconds;
    const date = new Date(seconds * 1000); // Multiplica por 1000 para obter milissegundos
    const timeZoneOffset = date.getTimezoneOffset() * 60000; // Converte o offset para milissegundos
    const adjustedDate = new Date(date.getTime() + timeZoneOffset); // Ajusta a data adicionando o offset

    return adjustedDate.toLocaleDateString();
  }
}
