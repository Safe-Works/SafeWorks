import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserAuth } from 'src/app/auth/User.Auth';
import Certification from 'src/app/models/certification.model';
import Portfolio from 'src/app/models/portfolio.model';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  userInfo: any = null;
  userUid: string = '';
  portfolio: Partial<Portfolio> = {};
  certifications: Certification[] = [];
  isMyProfile: boolean = false;
  photoUrl: string = '';
  
  constructor(
    private userService: UserService,
    private portfolioService: PortfolioService,
    public userAuth: UserAuth, 
    public route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.userUid = this.route.snapshot.params['id'] ?? this.userAuth.currentUser?.uid;
    await this.loadUserInfo();
  }

  async loadUserInfo() {
    await this.userService.GetUserInfo(this.userUid)
      .then(async (response) => {
        console.error(response);
        this.userInfo = response.user;
        if (this.userInfo.photo_url) {
          this.photoUrl = this.userInfo.photo_url;
        } else {
          this.photoUrl = 'https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png';
        }
        console.log(this.userInfo);
        if (this.userInfo.name === this.userAuth.currentUser?.displayName) {
          this.isMyProfile = true;
        }
        if (this.userInfo.worker.portfolio) {
          await this.portfolioService.GetPortfolio(this.userInfo.worker.portfolio)
            .then((response) => {
              this.portfolio = response.portfolio;
              this.certifications = response.portfolio.certifications;
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      })
   
  }

}
