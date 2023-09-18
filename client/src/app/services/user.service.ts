import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import User from "../models/user.model";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private api: string = environment.apiEndpoint + '/api/users/';
  private favoriteApi: string = environment.apiEndpoint + '/api/favorites/';

  constructor(private http: HttpClient) { }

  public RegisterUser(user: User): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<string>(this.api, user, httpOptions);
  }

  public AuthenticateUser(email: string, password: string): Observable<any> {
    const body = { email, password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(this.api + "login", body, httpOptions).pipe(
      tap((response: any) => {
        if (response.customTokenJwt && !response.customTokenJwt.code) {
          return response;
        } else {
          throw new Error("Credenciais inválidas");
        }
      })
    );
  }

  public async GetUserInfo(uid: string): Promise<any> {
    try {
      return await firstValueFrom(this.http.get<any>(this.api + uid));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public UpdateUser(uid: string, user: User, photo: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', user.name ?? "");
    formData.append('cpf', user.cpf ?? "");
    formData.append('telephone_number', user.telephone_number ?? "");
    if (user.username) formData.append('username', user.username ?? "");
    if (user.district) formData.append('district', user.district ?? "");
    if (photo) {
      formData.append('photo', photo, photo.name);
    }
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    return this.http.put<any>(this.api + uid, formData, { headers }).pipe(
      tap((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.log(error);
        return error;
      })
    );
  }

  public deleteFavorite(userId: string, workerUid: string): Promise<any> {
    try {
      return firstValueFrom(this.http.delete<string>(this.favoriteApi + userId + '/' + workerUid));
    }
    catch (error) {
      console.error(error);
      throw error;
    }
  }

  addFavorite(userId: string, workerUid: string) {
    const body = {
      userUid: userId,
      workerUid: workerUid
    };

    try {
      firstValueFrom(this.http.post<any>(this.favoriteApi, body));

    }
    catch (error) {
      console.error(error);
      throw error;
    }
  }
}
