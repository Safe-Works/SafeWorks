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
    public CreateJobAd(job: Job, photos: any): Observable<string> {
        const formData = new FormData();
        formData.append('worker[name]', job.worker.name);
        formData.append('worker[id]', job.worker.id);
        formData.append('title', job.title);
        formData.append('description', job.description);
        formData.append('category[name]', job.category.name);
        formData.append('category[id]', job.category.id.toString());
        formData.append('district[name]', job.district.name);
        formData.append('district[id]', job.district.id.toString());
        formData.append('price', job.price.toString());
        formData.append('price_type[name]', job.price_type.name);
        formData.append('price_type[id]', job.price_type.id.toString());
      
        for (let i = 0; i < photos.length; i++) {
          formData.append('photos', photos[i].file, photos[i].file.name);
        }
      
        return this.http.post<string>(this.api, formData);
      }
      
      

}