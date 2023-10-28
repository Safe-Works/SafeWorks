import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';
import {JobService} from "../../services/job.service";

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
  isWorker: boolean = false;
  selectOption: string = 'worker_contracts';

  constructor(
    private contractService: ContractService,
    private userAuth: UserAuth,
    public router: Router,
    private _snackBar: MatSnackBar,
    private jobService: JobService,
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
      cancelButtonText: 'Cancelar',
      input: 'range',
      inputLabel: 'Avalie o serviço, escolha uma nota de 1 a 5',
      inputValue: 0,
      inputAttributes: {
        min: '0',
        max: '5',
        step: '1',
      }
    }).then(async (result) => {
      await this.evaluateJob(contractUid, result);

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
    if (this.isWorker) {
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

  viewAdvertisement(uid: any): void {
    this.router.navigate(['/jobs', 'view', uid]);
  }

  viewProfile(uid: any): void {
    this.router.navigate(['/profile', uid]);
  }

  selectListener(event: any): void {
    const option = event.target.value;
    this.selectOption = option;
    if (option === 'worker_contracts') {
      this.fetchWorkerContracts();
    }
    if (option === 'client_contracts') {
      this.fetchClientContracts();
    }
  }

  async fetchWorkerContracts() {
    this.contracts = await this.contractService.GetAllFromWorker(this.userAuth.currentUser?.uid ?? '');
    this.isWorker = true;
  }

  async fetchClientContracts() {
    this.contracts = await this.contractService.GetAllFromClient(this.userAuth.currentUser?.uid ?? '');
    this.isWorker = false;
  }

  async evaluateJob(contractUid: string, result: any) {
    if (result.isConfirmed) {
      try {
        await this.contractService.evaluateJob(result.value, contractUid);

        if (result.value) {
          Swal.fire("Avaliação salva com sucesso");
        }
      } catch (error: any) {
        console.error('evaluateJob error: ', error);
        this.openSnackBar("Ocorreu um erro ao salvar a avaliação!", "OK", "snackbar-error");
      }
    }

  }
}
