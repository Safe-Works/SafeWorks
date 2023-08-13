import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import Portfolio from "../models/portfolio.model";
import { firstValueFrom } from "rxjs";
import Certification from "../models/certification.model";

@Injectable({
    providedIn: 'root'
})

export class PortfolioService {
    private api: string = environment.apiEndpoint + '/api/portfolios/';
    constructor(private http: HttpClient) { }

    public async CreatePorfolio(portfolio: Portfolio): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('description', portfolio.description ?? '');
            formData.append('user_uid', portfolio.user_uid ?? '');
            formData.append('years_experience', portfolio.years_experience?.toString() ?? '');

            return await firstValueFrom(this.http.post<any>(this.api, formData));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async UpdatePortfolio(portfolio: Portfolio): Promise<any> {
        try {
            const formData = new FormData();
            const url = this.api + portfolio.uid;
            formData.append('description', portfolio.description ?? '');

            return await firstValueFrom(this.http.put<any>(url, formData));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async AddCertification(portfolioUid: string, certification: Certification): Promise<any> {
        try {
            const url = this.api + portfolioUid + '/certifications';
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            };

            return await firstValueFrom(this.http.post<any>(url, certification, httpOptions));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async GetPortfolio(uid: string): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + uid));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async DeleteCertification(portfolioUid: string, certificationId: string): Promise<any> {
        try {
            return await firstValueFrom(this.http.delete<string>(this.api + portfolioUid + '/certifications/' + certificationId));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}