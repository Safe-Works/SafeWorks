import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private api: string = environment.apiEndpoint + '/api/analytics';
    constructor(private http: HttpClient) { }

    public async GetAllJobAds(): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + '/jobAds'));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async GetAllJobs(): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + '/jobs'));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async GetAllUsers(): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + '/users'));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}