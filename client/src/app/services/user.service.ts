import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import User from "../models/user.model";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private api: string = 'http://localhost:3001/api/users';

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
    return this.http.post<any>(this.api + "/login", body, httpOptions).pipe(
      tap((response: any) => {
        if (response.customTokenJwt && !response.customTokenJwt.code) {
          return response;
        } else {
          throw new Error("Credenciais inválidas");
        }
      })
    );
  }

  public GetUserInfo(uid: string): Observable<any> {
    return this.http.get<any>(this.api + "/" + uid).pipe(
      tap((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.log(error);
        return error;
      })
    );
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
    return this.http.put<any>(`${this.api}/${uid}`, formData, { headers }).pipe(
      tap((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.log(error);
        return error;
      })
    );
  }
  
}
