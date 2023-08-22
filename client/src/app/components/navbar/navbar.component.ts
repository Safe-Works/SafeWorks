import { AppService } from '../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../auth/User.Auth';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private appService: AppService, public userAuth: UserAuth, private router: Router) { }
  isCollapsed = true;
  ngOnInit(): void {
    this.userAuth.authUserFromToken();
    if(this.userAuth.currentUser?.infos)
    {
      if(!this.userAuth.currentUser.infos.photo_url)
        this.userAuth.currentUser.infos.photo_url = "https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png";
    }
  }
  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
  async logout() {
    this.userAuth.clearUser();
    await this.router.navigateByUrl('/login');
  }
}
