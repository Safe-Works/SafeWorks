import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  cpfInvalidLabel = "O CPF é obrigatório*";
  showConfirmPassword = false;
  registerForm!: FormGroup;
  fullName = new FormControl('', [Validators.required]);
  cpf = new FormControl('', [Validators.required]);
  celular = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      fullName: this.fullName,
      cpf: this.cpf,
      celular: this.celular,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
  }
  encryptPassword() {
    const passwordValue = this.registerForm.get('password')?.value;
    const hashedPassword = CryptoJS.SHA256(passwordValue).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    const passwordField = document.querySelector('#password') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showConfirmPassword ? 'text' : 'password';
    }
    const confirmPasswordField = document.querySelector('#confirmPassword') as HTMLInputElement;
    if (confirmPasswordField) {
      confirmPasswordField.type = this.showConfirmPassword ? 'text' : 'password';
    }
  }
}
