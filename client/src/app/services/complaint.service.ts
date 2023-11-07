import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ComplaintService {
    private api: string = environment.apiEndpoint + '/api/complaints';
    constructor(private http: HttpClient) { }

    public async Add(description: string, title: string, contractUid: string, applicant: string): Promise<any> {
        try {
            const body = {
                description: description,
                title: title,
                contract_uid: contractUid,
                applicant: applicant,
            };

            return firstValueFrom(this.http.post<any>(this.api, body));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async GetAll(): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<any>(this.api));
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    public async Delete(complaintUid: string): Promise<any> {
        try {
            return firstValueFrom(this.http.delete<any>(this.api + `/${complaintUid}`))
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

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