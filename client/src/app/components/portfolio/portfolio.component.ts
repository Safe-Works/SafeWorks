import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from "../../auth/User.Auth";

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {

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

    constructor(
        private http: HttpClient,
        private router: Router,
        private userAuth: UserAuth
    ) { }

    createPortfolio() {
        const userUid = this.userAuth.currentUser?.uid ?? '';
        const body = {
            description: this.description,
            years_experience: this.years_experience
        };

        this.http.post<any>('http://localhost:3001/portfolio/' + userUid, body).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.error(error);
            }
        );
    }

    getPortfolio() {
        const userUid = this.userAuth.currentUser?.uid ?? '';

        this.http.get<any[]>('http://localhost:3001/portfolio/' + userUid).subscribe(
            response => {
                if (response && response.length > 0) {
                    const portfolio = response[0];

                    this.portfolio = [portfolio];
                    this.certifications = portfolio.certifications;
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
            },
            error => {
                console.error(error);
            }
        );
    }

    deleteCertification(title: string) {
        const userUid = this.userAuth.currentUser?.uid ?? '';

        this.http.delete<any>('http://localhost:3001/portfolio/' + userUid + '/' + title).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.error(error);
            }
        );
    }
}
