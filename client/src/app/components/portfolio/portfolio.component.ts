import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from "../../auth/User.Auth";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {

    userUid: string = '';
    description: string = '';
    years_experience: number = 0;
    title: string = '';
    descriptionCertification: string = '';
    issue_organization: string = '';
    issue_date: string = '';
    certification_url: string = '';
    portfolio: any = null;
    certifications: any[] = [];
    portfolioSubscription: Subscription | undefined;
    certificationsSubscription: Subscription | undefined;

    constructor(
        private http: HttpClient,
        private router: Router,
        private userAuth: UserAuth
    ) { }

    ngOnInit() {
        this.getPortfolio();
    }

    ngOnDestroy() {
        if (this.portfolioSubscription) {
            this.portfolioSubscription.unsubscribe();
        }
        if (this.certificationsSubscription) {
            this.certificationsSubscription.unsubscribe();
        }
    }

    createPortfolio() {
        const userUid = this.userAuth.currentUser?.uid ?? '';
        const body = {
            description: this.description,
            years_experience: this.years_experience
        };

        this.http.post<any>('http://localhost:3001/portfolio/' + userUid, body).subscribe(
            response => {
                console.log(response);
                this.getPortfolio(); // Atualiza os dados após a criação
            },
            error => {
                if (error.status === 400) {
                    alert('Dados inválidos. Verifique os campos preenchidos.');
                }
                console.error(error);
            }
        );
    }

    getPortfolio() {
        const userUid = this.userAuth.currentUser?.uid ?? '';

        if (this.portfolioSubscription) {
            this.portfolioSubscription.unsubscribe();
        }

        this.portfolioSubscription = this.http.get<any[]>('http://localhost:3001/portfolio/' + userUid).subscribe(
            response => {
                if (response && response.length > 0) {
                    const portfolio = response[0];

                    this.portfolio = [portfolio];
                    this.certifications = portfolio.certifications;

                    this.description = portfolio.description;
                    this.years_experience = portfolio.years_experience;
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    updatePortfolio() {
        const userUid = this.userAuth.currentUser?.uid ?? '';
        const body = {
            title: this.title,
            description: this.descriptionCertification,
            issue_organization: this.issue_organization,
            issue_date: this.issue_date,
            certification_url: this.certification_url
        };

        this.http.put<any>('http://localhost:3001/portfolio/' + userUid + '/', body).subscribe(
            response => {
                console.log(response);
                this.getPortfolio(); // Atualiza os dados após a atualização
            },
            error => {
                if (error.status === 400) {
                    alert('Dados inválidos. Verifique os campos preenchidos.');
                }
                console.error(error);
            }
        );
    }

    deleteCertification(certification_url: string) {
        const userUid = this.userAuth.currentUser?.uid ?? '';

        this.http.delete<any>('http://localhost:3001/portfolio/' + userUid + '/' + certification_url).subscribe(
            response => {
                console.log(response);
                this.getPortfolio(); // Atualiza os dados após a exclusão
            },
            error => {
                console.error(error);
            }
        );
    }
}
