import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Portfolio from '../../../../../server/src/models/Portfolio';
import {UserAuth} from "../../auth/User.Auth";


@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
    description: string = '';
    portfolios: any[] = [];

    constructor(
        private http: HttpClient,
        private router: Router,
        private userAuth: UserAuth) {
    }

    ngOnInit(): void {
    }

    adicionarPortfolio() {
        const description = this.description;

        const body = {
            description: description,
            userUid: this.userAuth.currentUser?.uid ?? ""
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
        const body = {
            uid: this.userAuth.currentUser?.uid ?? ""
        };

        this.http.get<any[]>('http://localhost:3001/portfolio/{uid}').subscribe(
            portfolios => {
                this.portfolios = portfolios.map(portfolio => {
                    return { ...portfolio};
                });
            },
            error => {
                console.error(error);
            }
        );
    }


    editarPortfolio(portfolio: Portfolio) {
        if (portfolio && portfolio.uid) {
            this.router.navigate(['/portfolio/edit', portfolio.uid]);
        } else {
            console.error('Portfolio UID is undefined or empty.');
        }
    }



}
