import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent {

  userInfo: any = null;
  contracts: any = null;
  isLoading: boolean = false;
  firstFinished: string = 'Aguardando conclusão';
  lastFinished: string = 'Finalizado';
  isWorker: string = '';

  constructor(
    private contractService: ContractService,
    private userAuth: UserAuth,
    public router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.userInfo = this.userAuth.currentUser?.infos;
    this.isWorker = this.userInfo.isWorker;
    if (this.isWorker) {
      this.contracts = await this.contractService.GetAllFromWorker(this.userAuth.currentUser?.uid ?? '');
    } else {
      this.contracts = await this.contractService.GetAllFromClient(this.userAuth.currentUser?.uid ?? '');
    }
  }

  finishContract(contractUid: string) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "O contrato será finalizado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, finalizar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          this.isLoading = true;
          let response = await this.contractService.FinishContract(contractUid, this.getUserType());
          if (response?.statusCode === 200) {
            this.isLoading = false;
            this.contracts = response;
            this.openSnackBar("Contrato finalizado com sucesso!", "OK", "snackbar-success");
          } else {
            this.isLoading = false;
            this.openSnackBar("Ocorreu um erro ao finalizar o contrato!", "OK", "snackbar-error");
          }
        }
      } catch (error: any) {
        console.error('finishContract error: ', error);
        this.isLoading = false;
        this.openSnackBar("Ocorreu um erro ao finalizar o contrato!", "OK", "snackbar-error");
      }
    });
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
      panelClass: [className],
    });
  }

  getUserType(): string {
    if (this.userInfo.isWorker) {
      return 'worker';
    } else {
      return 'client';
    }
  }

  isContractFinalized(contract: any): boolean {
    const userType = this.getUserType();
    this.setProgressBarStatus(contract);
    if (userType === 'worker' && contract.worker_finished) {
      return true;
    }
    if (userType === 'client' && contract.client_finished) {
      return true;
    }

    return false;
  }

  setProgressBarStatus(contract: any): void {
    if (contract.paid) {
      const element = document.getElementById('step1 ' + contract.uid);
      element?.classList.add('active');
    }
    if (contract.worker_finished && contract.client_finished) {
      const element = document.getElementById('step3 ' + contract.uid);
      element?.classList.add('active');
    }
    if (contract.worker_finished || contract.client_finished) {
      const element = document.getElementById('step2 ' + contract.uid);
      element?.classList.add('active');
    }
  }

  viewAdvertisement(uid: any) {
    this.router.navigate(['/jobs', 'view', uid]);
  }

  viewProfile(uid: any) {
    this.router.navigate(['/profile', uid]);
  }

}
