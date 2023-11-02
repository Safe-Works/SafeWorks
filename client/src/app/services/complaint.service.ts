import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import Complaint from "../models/complaint.model";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ComplaintService {
    private api: string = environment.apiEndpoint + '/api/complaints';
    constructor(private http: HttpClient) { }

    public async GetAll(): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<any>(this.api));
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    public async StartAnalysis(complaintUid: string): Promise<any> {
        try {
            return await firstValueFrom(this.http.patch<any>(this.api + '/status/' + complaintUid , { status: "onAnalysis" }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}