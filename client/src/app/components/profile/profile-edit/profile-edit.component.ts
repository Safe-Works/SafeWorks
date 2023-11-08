import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserAuth } from '../../../auth/User.Auth';
import User from '../../../models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { validateCPF } from '../../../utils/validate-cpf';
import { districts } from 'enums/districts.enum';
 
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent {
  validarCpf = (control: FormControl): { [s: string]: boolean } | null => {
    const cpf = control;
    if (validateCPF(cpf)) {
      this.cpfInvalidLabel = "O CPF é inválido.";
      return { cpfInvalido: true };
    }
    return null;
  }
  isLoading = false;
  districts = districts;  
  cpfInvalidLabel: string = "O CPF é obrigatório*";
  selectedState: string = "PR";
  selectedCity: string = "CWB";
  selectedDistrict: string;
  userInfo: any = null;
  fullName = new FormControl('', [Validators.required]);
  cpf = new FormControl('', [Validators.required, this.validarCpf]);
  telephone = new FormControl('', [Validators.required]);
  imageControl = new FormControl(null);
  username = new FormControl('');
  district = new FormControl('');
  updateForm!: FormGroup;
  urlProfileImage : string = "";
  constructor(private userService: UserService, private userAuth: UserAuth, private _snackBar: MatSnackBar, private cookieService: CookieService, private router: Router) {
    this.selectedDistrict = 'Selecione';
    this.updateForm = new FormGroup({
      fullName: this.fullName,
      cpf: this.cpf,
      telephone: this.telephone,
      username: this.username,
      district: this.district,
      imageControl: this.imageControl
    });
  }
  
  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
      panelClass: [className],
    });
  }

  async ngOnInit() {
    await this.loadUserInfo();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.openSnackBar("Selecione um arquivo de imagem válido (JPG, PNG ou GIF).", "OK", "snackbar-error");
        return;
      }
      this.imageControl.setValue(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageContainer = document.getElementById('logo-container');
        if (imageContainer && event.target?.result) {
          imageContainer.style.backgroundImage = `url(${event.target.result})`;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  async loadUserInfo() {
    this.isLoading = true;
    await this.userService.GetUserInfo(this.userAuth.currentUser?.uid ?? '')
      .then((response) => {
        this.userInfo = response.user;
        this.fullName.setValue(this.userInfo.name);
        this.cpf.setValue(this.userInfo.cpf);
        this.telephone.setValue(this.userInfo.telephone_number);
        this.username.setValue(this.userInfo.username);
        this.district.setValue(this.userInfo.district);
        this.urlProfileImage = this.userInfo.photo_url ? this.userInfo.photo_url : "https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png";
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
      });
  }

  updateUser(): void {
    this.isLoading = true;
    const updatedUser = new User();
    updatedUser.name = this.updateForm.get('fullName')?.value;
    updatedUser.cpf = this.updateForm.get('cpf')?.value;
    updatedUser.telephone_number = this.updateForm.get('telephone')?.value;
    updatedUser.username = this.updateForm.get('username')?.value;
    updatedUser.district = this.updateForm.get('district')?.value;
    const photo = this.updateForm.get('imageControl')?.value
  
    this.userService.UpdateUser(this.userAuth.currentUser?.uid ?? "", updatedUser, photo).subscribe(
      (response) => {
        if (response.statusCode === 201) {
          this.cookieService.set('token', response.token, undefined, '/', undefined, true, 'Strict');
          this.userAuth.authUserFromToken();
          this.openSnackBar("Perfil atualizado com sucesso!", "OK", "snackbar-success");
          this.router.navigateByUrl('/profile');
          this.loadUserInfo();
          this.isLoading = false;
        }
      },
      (error) => {
        console.error(error);
        this.openSnackBar("Ocorreu um erro ao atualizar o perfil!", "OK", "snackbar-error");
        this.isLoading = false;
      }
    );
  }
  
}
