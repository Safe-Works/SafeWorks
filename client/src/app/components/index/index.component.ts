import { Component } from '@angular/core';
import { UserAuth } from '../../auth/User.Auth';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  constructor(public userAuth: UserAuth) {}
}
