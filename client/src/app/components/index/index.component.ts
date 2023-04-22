import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../auth/User.Auth';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(public userAuth: UserAuth) {}

  ngOnInit(): void {
    this.userAuth.authUserFromToken();
  }

  logout() {
    this.userAuth.clearUser();
  }

}
