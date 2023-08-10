import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserAuth } from 'src/app/auth/User.Auth';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  userInfo: any = null;
  photoUrl: string = '';
  
  constructor(
    private userService: UserService,
    private portfolioService: PortfolioService,
    public userAuth: UserAuth, 
    private router: Router, 
    private cookieService: CookieService
  ) { }

  async ngOnInit() {
    await this.loadUserInfo();
  }

  async loadUserInfo() {
    await this.userService.GetUserInfo(this.userAuth.currentUser?.uid ?? '')
      .then(async (response) => {
        console.error(response);
        this.userInfo = response.user;
        if (response.photo_url) this.photoUrl = response.photo_url;
        else this.photoUrl = 'https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png';

        if (this.userInfo.woker.portfolio) {
          await this.portfolioService.GetPortfolio(this.userInfo.worker.portfolio);
        }
      })
      .catch((error) => {
        console.error(error);
      })
   
  }

}
