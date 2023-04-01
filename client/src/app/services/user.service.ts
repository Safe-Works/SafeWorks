import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import User from "../models/user.model";
import { Injectable } from "@angular/core";

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
}
