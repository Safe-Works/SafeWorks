import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { UserAuth } from './auth/User.Auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SafeWorks';
  constructor(private appService: AppService, public userAuth: UserAuth) {}
  ngOnInit(): void {
    this.userAuth.authUserFromToken();
  }
  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
}
