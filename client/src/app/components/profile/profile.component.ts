import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserAuth } from 'src/app/auth/User.Auth';
import Certification from 'src/app/models/certification.model';
import Portfolio from 'src/app/models/portfolio.model';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { UserService } from 'src/app/services/user.service';
import {MatSnackBar} from "@angular/material/snack-bar";

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
  deleted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private portfolioService: PortfolioService,
    public userAuth: UserAuth, 
    public route: ActivatedRoute,
    public router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  async ngOnInit() {
    this.userUid = this.route.snapshot.params['id'] ?? this.userAuth.currentUser?.uid;
    await this.loadUserInfo();
    this.deleted = await this.isDeleted(this.userUid);
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

  redirectToEdit() {
    this.router.navigate(['profile/edit', this.userUid]);
  }

  getUserUid(){
      return this.userAuth.currentUser?.uid ?? '';
  }

    async isDeleted(workerUid: string) {
        let userInfo = await this.userService.GetUserInfo(this.getUserUid());
        userInfo = userInfo.user;

        if (userInfo.favorite_list) {
            return userInfo.favorite_list.includes(workerUid);
        } else {
            return false;
        }
    }


    async deleteFavorite(workerUid: string) {
        this.isLoading = true;
        await this.userService.deleteFavorite(this.getUserUid(), workerUid)
        this.ngOnInit();
        this.openSnackBar("Favorito deletado com sucesso!", "OK", "snackbar-success")
        this.isLoading = false;
    }

    async addFavorite(workerUid: string) {
        this.isLoading = true;
        await this.userService.addFavorite(this.getUserUid(), workerUid)
        this.ngOnInit();
        this.openSnackBar("Usuário adicionado aos favoritos", "OK", "snackbar-success")
        this.isLoading = false;
    }

    openSnackBar(message: string, action: string, className: string) {
        this._snackBar.open(message, action, {
            duration: 20000,
            panelClass: [className],
        });
    }
}
