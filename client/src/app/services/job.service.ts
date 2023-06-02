import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import Job from "../models/job-advertisement.model";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  
export class JobService {
    private api: string = 'http://localhost:3001/api/job';

    constructor(private http: HttpClient) { }

    public CreateJobAd(job: Job): Observable<string> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<string>(this.api, job, httpOptions);
    }
}