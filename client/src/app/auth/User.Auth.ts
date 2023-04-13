import { Injectable } from '@angular/core';
import UserAuthModel from '../models/user-auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserAuth {
  currentUser: UserAuthModel | null = null;

  constructor() { }

  setUser(user: UserAuthModel): void {
    this.currentUser = user;
  }

  clearUser(): void {
    this.currentUser = null;
  }
}
