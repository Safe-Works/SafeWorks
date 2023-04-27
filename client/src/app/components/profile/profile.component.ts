import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserAuth } from 'src/app/auth/User.Auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  userInfo: any = null;
  photoUrl: string = 'https://via.placeholder.com/150';
  
  constructor(private userService: UserService, public userAuth: UserAuth, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.userService.GetUserInfo(this.userAuth.currentUser?.uid ?? "").subscribe(
      (response) => {
        this.userInfo = response;
        this.photoUrl = response.photo_url;
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
