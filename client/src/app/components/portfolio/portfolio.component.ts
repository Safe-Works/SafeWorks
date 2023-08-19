import { Component, Input, OnInit } from '@angular/core';
import { UserAuth } from "../../auth/User.Auth";
import { PortfolioService } from 'src/app/services/portfolio.service';
import { UserService } from 'src/app/services/user.service';
import Portfolio from 'src/app/models/portfolio.model';
import Certification from 'src/app/models/certification.model';
import User from 'src/app/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

    @Input() user: Partial<User> = {};
    isLoading: boolean = false;
    userUid: string = '';
    portfolioUid: string = '';
    description = new FormControl('', [Validators.required]);
    years_experience = new FormControl('', [Validators.required]);
    certificationTitle = new FormControl('', [Validators.required]);
    certificationDescription = new FormControl('', [Validators.required]);
    certificationIssueOrganization = new FormControl('', [Validators.required]);
    certificationIssueDate = new FormControl('', [Validators.required]);
    certificationUrl = new FormControl('');
    certifications: Certification[] = [];
    updateForm!: FormGroup;
    certificationForm!: FormGroup;

    constructor(
        private portfolioService: PortfolioService,
        private userAuth: UserAuth,
        private userService: UserService,
        private _snackBar: MatSnackBar,
    ) {
        this.updateForm = new FormGroup({
            description: this.description,
            years_experience: this.years_experience
        });
        this.certificationForm = new FormGroup({
            certificationTitle: this.certificationTitle,
            certificationDescription: this.certificationDescription,
            certificationIssueOrganization: this.certificationIssueOrganization,
            certificationIssueDate: this.certificationIssueDate,
            certificationUrl: this.certificationUrl
        });
    }

    async ngOnInit() {
        await this.getPortfolio();
    }

    openSnackBar(message: string, action: string, className: string) {
        this._snackBar.open(message, action, {
          duration: 20000,
          panelClass: [className],
        });
      }

    async createPortfolio() {
        this.isLoading = true;
        const userUid = this.userAuth.currentUser?.uid;

        const portfolio: Portfolio = {
            user_uid: userUid,
            description: this.updateForm.get('description')?.value,
            years_experience: this.updateForm.get('years_experience')?.value
        }

        await this.portfolioService.CreatePorfolio(portfolio)
            .then((response) => {
                this.openSnackBar("Portfolio criado com sucesso!", "OK", "snackbar-success");
                this.getPortfolio();
                this.isLoading = false;
            })
            .catch((error) => {
                this.openSnackBar("Ocorreu um erro ao criar o portfolio!", "OK", "snackbar-error");
                console.error(error);
                this.isLoading = false;
            });
    }

    async addCertification() {
        this.isLoading = true;
        const portfolioUid = this.portfolioUid ?? '';
        const certification: Certification = {
            title: this.certificationForm.get('certificationTitle')?.value,
            description: this.certificationForm.get('certificationDescription')?.value,
            issue_organization: this.certificationForm.get('certificationIssueOrganization')?.value,
            issue_date: new Date(this.certificationForm.get('certificationIssueDate')?.value),
            certification_url: this.certificationForm.get('certificationUrl')?.value
        };
        
        await this.portfolioService.AddCertification(portfolioUid, certification)
            .then((response) => {
                if (response.statusCode === 201) {
                    this.openSnackBar("Certificação adicionada com sucesso!", "OK", "snackbar-success");
                    this.certifications = response.portfolio.certifications;
                    this.isLoading = false;
                }
            })
            .catch((error) => {
                this.openSnackBar("Ocorreu um erro ao adicionar uma certificação!", "OK", "snackbar-error");
                console.error(error);
                this.isLoading = false;
            });
    }

    async updatePortfolio() {
        this.isLoading = true;
        const portfolioUid = this.portfolioUid ?? '';
        const portfolio: Portfolio = {
            uid: portfolioUid,
            description: this.updateForm.get('description')?.value,
            years_experience: this.updateForm.get('years_experience')?.value
        }

        await this.portfolioService.UpdatePortfolio(portfolio)
            .then((response) => {
                if (response.statusCode === 200) {
                    this.openSnackBar("Portfolio atualizado com sucesso!", "OK", "snackbar-success");
                    const portfolio = response.portfolio;
                    this.description.setValue(portfolio.description);
                    this.years_experience.setValue(portfolio.years_experience);
                    this.isLoading = false;
                }
            })
            .catch((error) => {
                this.openSnackBar("Ocorreu um erro para ao atualizar o portfolio!", "OK", "snackbar-error");
                console.error(error);
                this.isLoading = false;
            })
    }

    async getPortfolio() {
        this.isLoading = true;
        await this.userService.GetUserInfo(this.userAuth.currentUser?.uid ?? '')
            .then((response) => {
                this.portfolioUid = response.user.worker.portfolio
            })
            .catch((error) => {
                this.openSnackBar("Ocorreu um erro para obter o portfolio!", "OK", "snackbar-error");
                console.error(error);
                this.isLoading = false;
            });
        await this.portfolioService.GetPortfolio(this.portfolioUid)
            .then((response) => {
                if (response) {
                    const portfolio = response.portfolio;
                    this.description.setValue(portfolio.description);
                    this.years_experience.setValue(portfolio.years_experience);
                    this.certifications = portfolio.certifications;
                    this.isLoading = false;
                }
            })
            .catch((error) => {
                console.error(error);
                this.openSnackBar("Ocorreu um erro para obter o portfolio!", "OK", "snackbar-error");
                this.isLoading = false;
            });
    }

    public async deleteCertification(certification: Certification) {
        this.isLoading = true;
        const certificationId = certification.id ?? '';
        console.log(certificationId);
        try {
            await this.portfolioService.DeleteCertification(certificationId.slice(0, 20), certificationId)
            .then((response) => {
                this.openSnackBar("Certificação excluída com sucesso!", "OK", "snackbar-success");
                this.certifications = response.portfolio.certifications;
                this.isLoading = false;
            })
            .catch((error) => {
                this.openSnackBar("Ocorreu um erro ao excluir uma certificação!", "OK", "snackbar-error");
                console.error(error);
                this.isLoading = false;
            })
        } catch (error) {
            this.openSnackBar("Ocorreu um erro ao excluir uma certificação!", "OK", "snackbar-error");
            console.error(error);
            this.isLoading = false;
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
