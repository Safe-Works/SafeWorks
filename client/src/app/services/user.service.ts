import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import User from "../models/user.model";
import { Injectable } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';

interface UserAuth {
  userAuth: {
    code: string;
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    isAnonymous: boolean;
    providerData: {
      providerId: string;
      uid: string;
      displayName: string;
      email: string;
      phoneNumber: string | null;
      photoURL: string | null;
    }[];
    stsTokenManager: {
      refreshToken: string;
      accessToken: string;
      expirationTime: number;
    };
    createdAt: string;

    lastLoginAt: string;
    apiKey: string;
    appName: string;
  }
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private api: string = 'http://localhost:3001/api/users';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

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

}
