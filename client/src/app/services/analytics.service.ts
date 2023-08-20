import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private api: string = environment.apiEndpoint + '/api/analytics';
    constructor(private http: HttpClient) { }
}