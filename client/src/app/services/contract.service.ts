import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import JobAdvertisement from "../models/job-advertisement.model";
import { UserAuth } from '../auth/User.Auth';
import { firstValueFrom } from "rxjs";
import { ContractCheckout } from "../utils/interfaces/contract-checkout.interface";

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private api: string = environment.apiEndpoint + '/api/jobs/';
    constructor(private http: HttpClient, private user: UserAuth) { }

    public async CreateJobContract(advertisement: JobAdvertisement, external_payment?: boolean, quantity?: number): Promise<any> {
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
            paid: external_payment ? false : true,
            external_payment: external_payment,
            quantity: quantity,
        };
        return await this.http.post<any>(this.api, contractData).toPromise();
    }

    public async GetAllFromClient(userUid: string): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<any>(this.api + 'client/' + userUid));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async GetAllFromWorker(workerUid: string): Promise<any> {
        try {
            return await firstValueFrom(this.http.get<any>(this.api + 'worker/' + workerUid));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async CreatePreference(contractCheckout: ContractCheckout): Promise<any> {
        try {
            return await this.http.post<any>(this.api + 'checkout', contractCheckout).toPromise();
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

    public EvaluateJob(evaluation: number, contractUid: any): Promise<any> {
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

    public SaveComplaints(description: string, title: string, contractUid: string, userType: string): Promise<any> {
        const body = {
            description: description,
            title: title,
            contractUid: contractUid,
            userType: userType,
            clientUid: this.user.currentUser?.uid || "",
            clientName: this.user.currentUser?.displayName || "",
        };


        try {
            return firstValueFrom(this.http.post<string>(this.api + "Complaints", body));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    async DeleteComplaints(contractUid: string) {
        try {
            return firstValueFrom(this.http.delete<string>(this.api + "Complaints/" + contractUid));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetComplaints(contractUid: string) {
        try {
            return firstValueFrom(this.http.get<string>(this.api + "Complaints/" + contractUid));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetContracts() {
        try {
            return firstValueFrom(this.http.get<string>(this.api));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
