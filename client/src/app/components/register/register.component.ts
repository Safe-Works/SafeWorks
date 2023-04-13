import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import User from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

function passwordMatchValidator(control: FormControl): {[key: string]: boolean} | null {
  const password = control.root.get('password');
  return password && control.value !== password.value ? { 'passwordMatch': true } : null;
}

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
  telephone_number = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required, passwordMatchValidator]);

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      fullName: this.fullName,
      cpf: this.cpf,
      telephone_number: this.telephone_number,
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

  register(): void {
    const hashedPassword = this.encryptPassword();
    const newUser = new User(
      this.registerForm.get('email')?.value,
      hashedPassword,
      this.registerForm.get('fullName')?.value,
      this.registerForm.get('cpf')?.value,
      this.registerForm.get('telephone_number')?.value
    );
    this.userService.RegisterUser(newUser).subscribe(
      (response) => {
        this.router.navigateByUrl('/login');
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
