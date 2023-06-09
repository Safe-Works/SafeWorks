import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
    description: string = '';

    constructor(private http: HttpClient) { }

    adicionarPortfolio() {
        const description = this.description;

        const body = {
            description: description
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



}
