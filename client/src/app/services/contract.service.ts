import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import JobAdvertisement from "../models/job-advertisement.model";
import { UserAuth } from '../auth/User.Auth';

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private api: string = environment.apiEndpoint + '/api/jobContracts';
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
}
