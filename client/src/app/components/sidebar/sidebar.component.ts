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
    var teste = this.userAuth.authUserFromToken();
  }

}
