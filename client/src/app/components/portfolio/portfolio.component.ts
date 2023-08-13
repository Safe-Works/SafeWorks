import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from "../../auth/User.Auth";
import { PortfolioService } from 'src/app/services/portfolio.service';
import { UserService } from 'src/app/services/user.service';
import Portfolio from 'src/app/models/portfolio.model';
import Certification from 'src/app/models/certification.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    totalCertifications: number = 0;
    currentPage: number = 1;
    pageSize: number = 10;
    isLoading: boolean = false;

    userUid: string = '';
    description: string = '';
    years_experience: number = 0;
    certificationTitle: string = '';
    certificationDescription: string = '';
    certificationIssue_organization: string = '';
    certificationIssue_date: string = '';
    certificationCertification_url: string = '';
    portfolio: Partial<Portfolio> = {};
    portfolioUid: string = '';
    certification: Partial<Certification> = {};
    certifications: Certification[] = [];

    constructor(
        private portfolioService: PortfolioService,
        private http: HttpClient,
        private router: Router,
        private userAuth: UserAuth,
        private userService: UserService
    ) { }

    async ngOnInit() {
        await this.getPortfolio();
    }

    onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getPortfolio();
    }

    async createPortfolio() {
        const userUid = this.userAuth.currentUser?.uid;

        const portfolio: Portfolio = {
            user_uid: userUid,
            description: this.description,
            years_experience: this.years_experience
        }

        await this.portfolioService.CreatePorfolio(portfolio)
            .then((response) => {
                this.getPortfolio();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async addCertification() {
        const portfolioUid = this.portfolioUid ?? '';
        const certification: Certification = {
            title: this.certificationTitle ?? '',
            description: this.certificationDescription ?? '',
            issue_organization: this.certificationIssue_organization ?? '',
            issue_date: new Date(this.certificationIssue_date),
            certification_url: this.certificationCertification_url ?? ''
        };
        
        await this.portfolioService.AddCertification(portfolioUid, certification)
            .then((response) => {
                this.getPortfolio();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async updatePortfolio() {
        const portfolioUid = this.portfolio.uid ?? '';
        const portfolio: Portfolio = {
            uid: portfolioUid,
            description: this.portfolio.description ?? '',
        }

        await this.portfolioService.UpdatePortfolio(portfolio)
            .then((response) => {

            })
            .catch((error) => {
                console.error(error);
            })
    }

    async getPortfolio() {
        await this.userService.GetUserInfo(this.userAuth.currentUser?.uid ?? '')
            .then((response) => {
                this.portfolioUid = response.user.worker.portfolio
            })
            .catch((error) => {
                console.error(error);
            });
        await this.portfolioService.GetPortfolio(this.portfolioUid)
            .then((response) => {
                if (response) {
                    const portfolio = response.portfolio;

                    this.description = portfolio.description;
                    this.years_experience = portfolio.years_experience;
                    this.certifications = portfolio.certifications;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    public async deleteCertification(certification: Certification) {
        const certificationId = certification.id ?? '';
        try {
            await this.portfolioService.DeleteCertification(certificationId.slice(0, 20), certificationId.charAt(certificationId.length - 1))
            .then((response) => {
                this.getPortfolio();
            })
            .catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
        }
    }

    formatIssueDate(issueDate: any): string {
        const seconds = issueDate._seconds;
        const date = new Date(seconds * 1000); // Multiplica por 1000 para obter milissegundos
        const timeZoneOffset = date.getTimezoneOffset() * 60000; // Converte o offset para milissegundos
        const adjustedDate = new Date(date.getTime() + timeZoneOffset); // Ajusta a data adicionando o offset

        return adjustedDate.toLocaleDateString();
    }


}
