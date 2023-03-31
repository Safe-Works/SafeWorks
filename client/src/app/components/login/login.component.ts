import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

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

  constructor() { }
  
  ngOnInit(): void {
    this.passwordField = document.querySelector('#inputPassword')!;
    this.loginForm = new FormGroup({
      email: this.email
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
}
