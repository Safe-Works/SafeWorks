import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserAuth } from 'src/app/auth/User.Auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  
  constructor(public userAuth: UserAuth, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.userAuth.authUserFromToken();
  }

}
