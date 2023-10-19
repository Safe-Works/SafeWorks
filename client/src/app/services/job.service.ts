import { HttpClient } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import Job from "../models/job-advertisement.model";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../environments/environment";
@Injectable({
    providedIn: 'root'
})

export class JobService {
    private api: string = environment.apiEndpoint + '/api/jobAds';
    constructor(private http: HttpClient) { }
    public CreateJobAd(job: Job, photos: any): Observable<any> {
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
        if (job.displacement_fee)
            formData.append('displacement_fee', job.displacement_fee.toString());
        if (job.delivery_time)
            formData.append('delivery_time', job.delivery_time.toString());
        if (photos) {
            photos = photos.filter((photo: any) => photo.file);
            for (let i = 0; i < photos.length; i++) {
                formData.append('photos', photos[i].file, photos[i].file.name);
            }
        }

        return this.http.post<any>(this.api, formData);
    }

    public UpdateJobAd(job: Job, photos: any): Observable<any> {
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
        if (job.uid)
            formData.append('uid', job.uid);
        if (job.media)
            formData.append('media', job.media);
        if (job.displacement_fee)
            formData.append('displacement_fee', job.displacement_fee.toString());
        if (job.delivery_time)
            formData.append('delivery_time', job.delivery_time.toString());
        if (photos) {
            const photosFilter = photos.filter((photo: any) => photo.file);
            if (photosFilter.length > 0) {
                for (let i = 0; i < photosFilter.length; i++) {
                    formData.append('photos', photosFilter[i].file, photosFilter[i].file.name);
                }
            }
        }

        return this.http.put<any>(this.api, formData);
    }

    public FindJobAd(term: string): Observable<any> {
        return this.http.get<string>(this.api + '/find/' + term).pipe(
            tap((response: any) => {
                return response;
            }),
            catchError((error) => {
                console.error(error);
                return error;
            })
        )
    }

    public GetJobs(page: number, limit: number): Observable<any> {
        return this.http.get<string>(this.api + '?page=' + page + '&limit=' + limit).pipe(
            tap((response: any) => {
                return response;
            }),
            catchError((error) => {
                console.error(error);
                return error;
            })
        )
    };

    public GetJobsByWorkerId(page: number, limit: number, worker_id: string): Observable<any> {
        return this.http.get<string>(this.api + '/worker/'+ worker_id +'?page=' + page + '&limit=' + limit).pipe(
            tap((response: any) => {
                return response;
            }),
            catchError((error) => {
                console.error(error);
                return error;
            })
        )
    };

    public DeleteById(id: string): Observable<any> {
        return this.http.delete<string>(this.api + '/delete?id=' + id).pipe(
            tap((response: any) => {
                return response;
            }),
            catchError((error) => {
                console.error(error);
                return error;
            })
        )
    };

    public GetById(id: string): Observable<any> {
        return this.http.get<string>(this.api + '/' + id).pipe(
            tap((response: any) => {
                return response;
            }),
            catchError((error) => {
                console.error(error);
                return error;
            })
        )
    };
    
    public AddEvaluation(contractId: string, evaluation: number) {
        const body = {
          contractId: contractId,
          evaluation: evaluation
        };
      
        try {
            firstValueFrom(this.http.post<any>('/api/evaluateJob', body));
      
        }
        catch (error) {
          console.error(error);
          throw error;
        }
      }
}