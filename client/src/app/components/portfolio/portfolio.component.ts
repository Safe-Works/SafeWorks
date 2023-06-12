import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserAuth} from "../../auth/User.Auth";

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {

    description: string = '';
    certificationDescription: string = '';
    certificationTitle: string = '';
    issueOrganization: string = '';
    issueDate: string = '';
    certificationUrl: string = '';
    yearsExperience: number = 0;
    portfolios: any[] = [];
    userUid: string = '';


    constructor(
        private http: HttpClient,
        private router: Router,
        private userAuth: UserAuth) {
    }

    adicionarPortfolio() {
        const body = {
            userUid: this.userAuth.currentUser?.uid ?? '',
            description: this.description,
            certifications: [{
                title: this.certificationTitle,
                description: this.certificationDescription,
                issue_organization: this.issueOrganization,
                issue_date: this.issueDate,
                certification_url: this.certificationUrl
            }],
            years_experience: this.yearsExperience
        };

        this.http.post<any>('http://localhost:3001/portfolio', body).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.error(error);
            }
        );
    }

    ListarPortfolio(): void {
        const userUid = this.userAuth.currentUser?.uid ?? '';


        this.http.get<any[]>('http://localhost:3001/portfolio/' + userUid).subscribe(
            portfolios => {
                this.portfolios = portfolios.map(portfolio => {
                    return {...portfolio};
                });
            },
            error => {
                console.error(error);
            }
        );
    }
}
