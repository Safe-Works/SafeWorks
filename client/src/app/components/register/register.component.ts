import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import User from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { validateCPF } from '../../utils/validate-cpf';

function passwordMatchValidator(control: FormControl): { [key: string]: boolean } | null {
  const password = control.root.get('password');
  return password && control.value !== password.value ? { 'passwordMatch': true } : null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validarCpf = (control: FormControl): { [s: string]: boolean } | null => {
    const cpf = control;
    if (validateCPF(cpf)) {
      this.cpfInvalidLabel = "O CPF é inválido.";
      return { cpfInvalido: true };
    }
    return null;
  }
  validarSenhaForte = (control: AbstractControl): { [key: string]: boolean } | null => {
    const senha = control.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(senha)) {
      if (senha.length > 0)
        this.passwordInvalidLabel = "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas e minúsculas, números e caracteres especiais.";
      else
        this.passwordInvalidLabel = "A senha é obrigatória.";
    }
    return regex.test(senha) ? null : { senhaFraca: true };
  };
  cpfInvalidLabel = "O CPF é obrigatório*";
  passwordInvalidLabel = "A senha é obrigatória*"
  emailAlreadyExist = false;
  emailInvalidLabel = "O e-mail é obrigatório*";
  showConfirmPassword = false;
  registerForm!: FormGroup;
  fullName = new FormControl('', [Validators.required]);
  cpf = new FormControl('', [Validators.required, this.validarCpf]);
  telephone_number = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, this.validarSenhaForte]);
  confirmPassword = new FormControl('', [Validators.required, passwordMatchValidator]);
  isLoading: boolean = false;

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
    this.isLoading = true;
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
        this.isLoading = false;
      },
      (error) => {
        if (error.status === 409) {
          this.emailAlreadyExist = true;
          this.emailInvalidLabel = "O e-mail já está em uso."
        }
        console.error(error);
        this.isLoading = false;
      }
    );
  }
}
