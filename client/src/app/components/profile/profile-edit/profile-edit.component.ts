import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserAuth } from '../../../auth/User.Auth';
import User from '../../../models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { validateCPF } from '../../../utils/validate-cpf';
 
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
  cpfInvalidLabel: string = "O CPF é obrigatório*";
  selectedState: string = "PR";
  selectedCity: string = "CWB";
  selectedDistrict: string;
  districts: { id: string, name: string }[] = [
    { id: '1', name: 'Água Verde' },
    { id: '2', name: 'Alto Boqueirão' },
    { id: '3', name: 'Alto da Glória' },
    { id: '4', name: 'Alto da Rua XV' },
    { id: '5', name: 'Atuba' },
    { id: '6', name: 'Augusta' },
    { id: '7', name: 'Bacacheri' },
    { id: '8', name: 'Bairro Alto' },
    { id: '9', name: 'Barreirinha' },
    { id: '10', name: 'Batel' },
    { id: '11', name: 'Bigorrilho' },
    { id: '12', name: 'Boa Vista' },
    { id: '13', name: 'Bom Retiro' },
    { id: '14', name: 'Boqueirão' },
    { id: '15', name: 'Butiatuvinha' },
    { id: '16', name: 'Cabral' },
    { id: '17', name: 'Cachoeira' },
    { id: '18', name: 'Cajuru' },
    { id: '19', name: 'Campina do Siqueira' },
    { id: '20', name: 'Campo Comprido' },
    { id: '21', name: 'Campo de Santana' },
    { id: '22', name: 'Capão da Imbuia' },
    { id: '23', name: 'Capão Raso' },
    { id: '24', name: 'Cascatinha' },
    { id: '25', name: 'Caximba' },
    { id: '26', name: 'Centro' },
    { id: '27', name: 'Champagnat' },
    { id: '28', name: 'Cidade Industrial' },
    { id: '29', name: 'Cristo Rei' },
    { id: '30', name: 'Fanny' },
    { id: '31', name: 'Fazendinha' },
    { id: '32', name: 'Ganchinho' },
    { id: '33', name: 'Guabirotuba' },
    { id: '34', name: 'Hauer' },
    { id: '35', name: 'Jardim Botânico' },
    { id: '36', name: 'Jardim das Américas' },
    { id: '37', name: 'Jardim Social' },
    { id: '38', name: 'Juvevê' },
    { id: '39', name: 'Lamenha Pequena' },
    { id: '40', name: 'Lindóia' },
    { id: '41', name: 'Mercês' },
    { id: '42', name: 'Mossunguê' },
    { id: '43', name: 'Novo Mundo' },
    { id: '44', name: 'Orleans' },
    { id: '45', name: 'Parolin' },
    { id: '46', name: 'Pilarzinho' },
    { id: '47', name: 'São Braz' },
    { id: '48', name: 'São Francisco' },
    { id: '49', name: 'São João' },
    { id: '50', name: 'São Lourenço' },
    { id: '51', name: 'São Miguel' },
    { id: '52', name: 'São Sebastião' },
    { id: '53', name: 'Seminário' },
    { id: '54', name: 'Sítio Cercado' },
    { id: '55', name: 'Taboão' },
    { id: '56', name: 'Tanguá' },
    { id: '57', name: 'Tarumã' },
    { id: '58', name: 'Tatuquara' },
    { id: '59', name: 'Tingui' },
    { id: '60', name: 'Uberaba' },
    { id: '61', name: 'Umbará' },
    { id: '62', name: 'Vila Izabel' },
    { id: '63', name: 'Vista Alegre' }
  ]
  userInfo: any = null;
  fullName = new FormControl('', [Validators.required]);
  cpf = new FormControl('', [Validators.required, this.validarCpf]);
  telephone = new FormControl('', [Validators.required]);
  imageControl = new FormControl(null);
  username = new FormControl('');
  address = new FormControl('');
  updateForm!: FormGroup;
  urlProfileImage : string = "";
  constructor(private userService: UserService, private userAuth: UserAuth, private _snackBar: MatSnackBar, private cookieService: CookieService, private router: Router) {
    this.selectedDistrict = 'Selecione';
    this.updateForm = new FormGroup({
      fullName: this.fullName,
      cpf: this.cpf,
      telephone: this.telephone,
      username: this.username,
      address: this.address,
      imageControl: this.imageControl
    });
  }
  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
      panelClass: [className],
    });
  }
  ngOnInit() {
    this.loadUserInfo();
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
  

  loadUserInfo() {
    this.userService.GetUserInfo(this.userAuth.currentUser?.uid ?? "").subscribe(
      (response) => {
        this.userInfo = response;
        this.fullName.setValue(this.userInfo.name);
        this.cpf.setValue(this.userInfo.cpf);
        this.telephone.setValue(this.userInfo.telephone_number);
        this.username.setValue(this.userInfo.username);
        this.address.setValue(this.userInfo.address);
        this.urlProfileImage = this.userInfo.photo_url ? this.userInfo.photo_url : "https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png";
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateUser(): void {
    const updatedUser = new User();
    updatedUser.name = this.updateForm.get('fullName')?.value;
    updatedUser.cpf = this.updateForm.get('cpf')?.value;
    updatedUser.telephone_number = this.updateForm.get('telephone')?.value;
    updatedUser.username = this.updateForm.get('username')?.value;
    updatedUser.address = this.updateForm.get('address')?.value;
    const photo = this.updateForm.get('imageControl')?.value
  
    this.userService.UpdateUser(this.userAuth.currentUser?.uid ?? "", updatedUser, photo).subscribe(
      (response) => {
        if (response.status === 200) {
          this.cookieService.set('token', response.token, undefined, '/', undefined, true, 'Strict');
          this.userAuth.authUserFromToken();
          this.openSnackBar("Perfil atualizado com sucesso!", "OK", "snackbar-success");
          this.router.navigateByUrl('/profile');
          this.loadUserInfo();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
}
