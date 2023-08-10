import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';
import Certification from 'src/app/models/certification.model';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-certification',
  templateUrl: './card-certification.component.html',
  styleUrls: ['./card-certification.component.css']
})
export class CardCertificationComponent {

  @Input() certification: Partial<Certification> = {};
  @Input() portfolioUid: string = '';
  @Input() portfolioService!: PortfolioService;
  @Input() userService!: UserService;
  @Input() deleteCertificationHandler: ((certification: Certification) => void) = () => {};
  @Input() getPortfolio: (() => void) = () => {};

  constructor(private router: Router, private userAuth: UserAuth) { }

  formatIssueDate(issueDate: any): string {
    const seconds = issueDate._seconds;
    const date = new Date(seconds * 1000); // Multiplica por 1000 para obter milissegundos
    const timeZoneOffset = date.getTimezoneOffset() * 60000; // Converte o offset para milissegundos
    const adjustedDate = new Date(date.getTime() + timeZoneOffset); // Ajusta a data adicionando o offset

    return adjustedDate.toLocaleDateString();
  }
}
