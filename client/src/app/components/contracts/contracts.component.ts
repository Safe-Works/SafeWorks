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
  evaluation: number = 0;
  idContract: any = "testeTiago";
  stars: boolean[] = [false, false, false, false, false];

  constructor(
    private contractService: ContractService,
    private userAuth: UserAuth,
    public router: Router,
    private _snackBar: MatSnackBar,
    private jobService: JobService,
  ) {}

  async ngOnInit() {
    this.contracts = await this.contractService.GetAllFromUser(this.userAuth.currentUser?.uid ?? '');
    this.userInfo = this.userAuth.currentUser?.infos;
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
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          this.isLoading = true;
          let response = await this.contractService.FinishContract(contractUid, this.getUserType());
          if (response?.statusCode === 200) {
            this.isLoading = false;
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
    if (this.userInfo.worker) {
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
    if (contract.worker_finished && contract.client_finished) {
      const element = document.getElementById('step3 ' + contract.uid);
      element?.classList.add('active');
    }
    if (contract.worker_finished || contract.client_finished) {
      const element = document.getElementById('step2 ' + contract.uid);
      element?.classList.add('active');
    }
  }

  async evaluateJob(number: any) {
    const result = await Swal.fire({
      title: 'Qual nota você dá para o serviço prestado?',
      text: "Escolha um valor de 1 a 5",
      icon: 'question',
      input: 'range',
      inputLabel: 'Deslize a barra abaixo para escolher',
      inputValue: this.evaluation,
      inputAttributes: {
        min: '0',
        max: '5',
        step: '1',
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Avaliar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.isLoading = true;
      try {
        let response = this.teste(); // Substitua pelo código real
        // if (response?.statusCode === 200) {
        //   this.isLoading = false;
        //   this.openSnackBar("Contrato finalizado com sucesso!", "OK", "snackbar-success");
        // } else {
        //   this.isLoading = false;
        //   this.openSnackBar("Ocorreu um erro ao finalizar o contrato!", "OK", "snackbar-error");
        // }
      } catch (error: any) {
        console.error('finishContract error: ', error);
        this.isLoading = false;
        this.openSnackBar("Ocorreu um erro ao finalizar o contrato!", "OK", "snackbar-error");
      }
    }

    if (result.value) {
      Swal.fire("Avaliação salva com sucesso");
    }
    this.evaluation = result.value;
  }


  // fillStars(starNumber: number) {
  //   this.resetStars();
  //   for (let i = 0; i < starNumber; i++) {
  //     this.stars[i] = true;
  //   }
  // }

  // resetStars() {
  //   this.stars = [false, false, false, false, false];
  // }
  //
  // evaluateJob(starNumber: number) {
  //   this.evaluation = starNumber;
  // }
  //
  // sendEvaluation(){
  //   this.isLoading = true;
  //   this.jobService.AddEvaluation(this.idContract, this.evaluation)
  //   this.openSnackBar("Avaliação enviada", "OK", "snackbar-success");
  //   this.isLoading = false;
  // }

  teste(){
    alert("oi")

    return null
  }
}
