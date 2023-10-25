import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import JobAdvertisement from "../models/job-advertisement.model";
import { UserAuth } from '../auth/User.Auth';
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private api: string = environment.apiEndpoint + '/api/jobs/';
    constructor(private http: HttpClient, private user: UserAuth) { }

    public async CreateJobContract(advertisement: JobAdvertisement): Promise<any> {
        const contractData = {
            advertisement: {
                title: advertisement.title,
                id: advertisement.uid || "",
            },
            client: {
                id: this.user.currentUser?.uid || "",
                name: this.user.currentUser?.displayName || "",
            },
            worker: {
                id: advertisement.worker?.id || "",
                name: advertisement.worker?.name || "",
            },
            price: advertisement.price,
        };
        return await this.http.post<any>(this.api, contractData).toPromise();
    }

    public async GetAllFromUser(userUid: string): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<any>(this.api + 'user/' + userUid));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async FinishContract(contractUid: string, userType: string): Promise<any> {
        try {
            return firstValueFrom(this.http.patch<any>(this.api + 'finish/' + contractUid + '/' + userType, {}));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public evaluateJob(evaluation: number, contractUid: any): Promise<any> {
        const body = {
            contractUid: contractUid,
            evaluation: evaluation
        };

        try {
            return firstValueFrom(this.http.post<string>(this.api + "evaluateJob", body));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
