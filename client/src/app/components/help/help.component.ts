import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';
import { UserService } from 'src/app/services/user.service';
import { HelpRequest } from 'src/app/utils/interfaces/help-request.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

export class HelpComponent {
  isLoading = false;
  helpForm!: FormGroup;
  title = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  contractId = new FormControl('');
  constructor(private userService: UserService, private userAuth: UserAuth, private _snackBar: MatSnackBar, private router: Router) {
    this.helpForm = new FormGroup({
      title: this.title,
      description: this.description,
      contract: this.contractId,
    });
  }
  async requestHelp(): Promise<void> {
    this.isLoading = true;
    const helpRequestInfos: HelpRequest = {
      title: this.helpForm.get('title')?.value,
      description: this.helpForm.get('description')?.value,
      contractId: this.helpForm.get('contractId')?.value,
      user: {
        email: this.userAuth.currentUser?.email || "",
        name: this.userAuth.currentUser?.displayName || "",
        id: this.userAuth.currentUser?.uid || ""
      }
    };
    try {
      let response = await this.userService.HelpRequest(helpRequestInfos);
      
      if (response.statusCode === 201) {
        this.isLoading = false;
        Swal.fire(
          'Sucesso!',
          'Sua solicitação foi enviada. Em breve, um de nossos administradores entrará em contato com você por e-mail.',
          'success'
        )
        this.router.navigate(['/']);
      } else {
        console.log(response.error);
        this.isLoading = false;
        Swal.fire(
          'Erro!',
          'Ocorreu um erro ao enviar a sua solicitação.',
          'error'
        )
      }
    } catch (error) {
      console.error('Erro na solicitação:', error);
      this.isLoading = false;
    }
  }
}
