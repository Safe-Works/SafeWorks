import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../auth/User.Auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public userAuth: UserAuth) { }

  ngOnInit(): void {
    this.userAuth.authUserFromToken();
    if(this.userAuth.currentUser?.infos)
    {
      if(!this.userAuth.currentUser.infos.photo_url)
        this.userAuth.currentUser.infos.photo_url = "https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png";
    }
  }

}
