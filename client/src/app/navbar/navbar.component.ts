import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../auth/User.Auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  constructor(public userAuth: UserAuth, private router: Router) {}

  ngOnInit(): void {
    this.userAuth.authUserFromToken();
  }

  logout() {
    this.userAuth.clearUser();
    this.router.navigateByUrl('/login');
  }

}
