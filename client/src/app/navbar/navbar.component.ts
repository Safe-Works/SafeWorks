import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { UserAuth } from '../auth/User.Auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  constructor(public userAuth: UserAuth) {}

  ngOnInit(): void {
    this.userAuth.authUserFromToken();
  }

  logout() {
    this.userAuth.clearUser();
  }

}
