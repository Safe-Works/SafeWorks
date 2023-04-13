import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/app/services/user.service';
import { UserAuth } from '../../auth/User.Auth';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  passwordField!: HTMLInputElement;
  showPassword = false;
  loginForm!: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  wrongCredentials = false;
  constructor(private userService: UserService, private userAuth: UserAuth, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.passwordField = document.querySelector('#inputPassword')!;
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  encryptPassword() {
    const passwordValue = this.loginForm.get('password')?.value;
    const hashedPassword = CryptoJS.SHA256(passwordValue).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.passwordField) {
      this.passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }

  login(): void {
    const hashedPassword = this.encryptPassword();
    const email = this.loginForm.get('email')?.value;
    this.userService.AuthenticateUser(email, hashedPassword).subscribe(
      (response) => {
        if (response.userAuth?.stsTokenManager?.accessToken) {
          this.userAuth.setUser(response.userAuth);
          this.cookieService.set('token', response.userAuth.stsTokenManager.accessToken, undefined, '/', undefined, true, 'Strict');
          this.router.navigateByUrl('/');
        } else {
          this.wrongCredentials = true;
        }
      },
      (error) => {
        this.wrongCredentials = true;
        console.log(error);
      }
    );
  }

}
