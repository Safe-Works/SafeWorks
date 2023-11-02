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
            const body = {
                status: 'accepted',
                result_description: ''
            };

            return await firstValueFrom(this.http.patch<any>(this.api + '/status/' + complaintUid , body));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async AcceptComplaint(complaintUid: string, resultDescription: string): Promise<any> {
        try {
            const body = {
                status: 'accepted',
                result_description: resultDescription
            };

            return await firstValueFrom(this.http.patch<any>(this.api + '/status/' + complaintUid, body));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async RejectComplaint(complaintUid: string, resultDescription: string): Promise<any> {
        try {
            const body = {
                status: 'refused',
                result_description: resultDescription
            };

            return await firstValueFrom(this.http.patch<any>(this.api + '/status/' + complaintUid, body));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}