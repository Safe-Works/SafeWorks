import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';
import {JobService} from "../../services/job.service";
import {ComplaintService} from "../../services/complaint.service";

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
  open: string = 'Aguardando análise'
  onAnalysis: string = 'Em análise'
  accepted: string = 'Aprovada'
  refused: string = 'Rejeitada'
  isWorker: boolean = false;
  selectOption: string = 'worker_contracts';
  complaints: any = null;
  complaintsList: any[] = []; // Declare uma nova propriedade para armazenar as queixas

  constructor(
    private contractService: ContractService,
    private userAuth: UserAuth,
    public router: Router,
    private _snackBar: MatSnackBar,
    private jobService: JobService,
    private complaintService: ComplaintService,
  ) {}

  async ngOnInit() {
    this.userInfo = this.userAuth.currentUser?.infos;
    this.isWorker = this.userInfo.isWorker;
    if (this.isWorker) {
      this.contracts = await this.contractService.GetAllFromWorker(this.userAuth.currentUser?.uid ?? '');
    } else {
      this.contracts = await this.contractService.GetAllFromClient(this.userAuth.currentUser?.uid ?? '');
    }
    this.complaints = await this.complaintService.GetAll();
    this.complaintsList = this.complaints.complaints;

    // console.log('denuncia')
    // this.complaints.complaints.forEach((complaint: any) => {
    //   console.log(complaint.status);
    // });

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

      try {
        if (result.isConfirmed) {
          this.isLoading = true;
          let response = await this.contractService.FinishContract(contractUid, this.getUserType());
          if (response?.statusCode === 200) {
            this.isLoading = false;
            this.contracts = response;
          }
          else {
            this.isLoading = false;
            this.openSnackBar("Ocorreu um erro ao finalizar o contrato!", "OK", "snackbar-error");
          }
        }
      } catch (error: any) {
        console.error('finishContract error: ', error);
        this.isLoading = false;
        this.openSnackBar("Ocorreu um erro ao finalizar o contrato!", "OK", "snackbar-error");
      }
      await this.evaluateJob(contractUid, result);

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

  setProgressBarStatusComplaint(){
    this.complaints.complaints.forEach((complaint: any) => {
      console.log(complaint.uid);
      this.complaintsList.concat(complaint)
    });

    this.complaints.complaints.forEach((complaint: any) => {
        if (complaint.status === 'open') {
          // console.log(complaint.uid)
          // console.log(complaint.status)
          const element1 = document.getElementById('step1 ' + complaint.uid);
          element1?.classList.remove('active');
          const element2 = document.getElementById('step2 ' + complaint.uid);
          element2?.classList.remove('active');
          const element3 = document.getElementById('step3 ' + complaint.uid);
          element3?.classList.remove('active');
        }
        if (complaint.status === 'onAnalysis') {
          // console.log(complaint.uid)
          // console.log(complaint.status)
          const element1 = document.getElementById('step1 ' + complaint.uid);
          element1?.classList.add('active');
          const element2 = document.getElementById('step2 ' + complaint.uid);
          element2?.classList.remove('active');
          const element3 = document.getElementById('step3 ' + complaint.uid);
          element3?.classList.remove('active');
        }
    });

  }

  setProgressBarStatus(contract: any): void {
    //const id = this.contractService.GetComplaints(contract.uid)
    //const complaints = this.complaintService.GetAll()
   // console.log("chamando progress bar")


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

    this.setProgressBarStatusComplaint();


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
        await this.contractService.EvaluateJob(result.value, contractUid);

        if (result.value) {
          Swal.fire({
            title: 'Avaliação salva com sucesso',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error: any) {
        console.error('evaluateJob error: ', error);
        this.openSnackBar("Ocorreu um erro ao salvar a avaliação!", "OK", "snackbar-error");
      }
    }

  }

  async report(contractUid: string){

    const { value: title } = await Swal.fire({
      title: 'Adicione um título para sua denúncia',
      input: 'text',
      inputPlaceholder: 'Título...',
      showCancelButton: true,
      confirmButtonText: 'próximo',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      inputAttributes: {
        maxlength: '80',
        minlength: '10'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Esse campo é obrigatório!';
        } else {
          return '';
        }
      }
    });

    if (title) {
      const { value: description } = await Swal.fire({
        input: 'textarea',
        title: 'Adicione uma descrição detalhada',
        inputPlaceholder: 'Descrição...',
        showCancelButton: true,
        confirmButtonText: 'enviar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        inputAttributes: {
          maxlength: '300',
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Esse campo é obrigatório!';
          } else {
            return '';
          }
        }
      })

      if (description && title) {
        try {
          this.isLoading = true;
          await this.contractService.SaveComplaints(description, title, contractUid, this.getUserType());
          await this.ngOnInit()
          this.isLoading = false;

          Swal.fire({
            title: 'Denúncia enviada com sucesso!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })

        } catch (error: any) {
          console.error('report error: ', error);
          this.openSnackBar("Ocorreu um erro ao denunciar o serviço!", "OK", "snackbar-error");
        }
      }
    }
  }

  isReported(contract: any) {
    if (contract.reported) {
      return true;
    }
    return false;  }

  cancelReport(contractUid: string) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "A denúncia será removida",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      try {
        this.isLoading = true;
        await this.contractService.DeleteComplaints(contractUid);
        await this.ngOnInit()
        this.contracts = await this.contractService.GetContracts();
        this.isLoading = false;

        if (result.isConfirmed){
          Swal.fire({
            title: 'Denúncia removida com sucesso!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })
        }

      } catch (error: any) {
        console.error('report error: ', error);
        this.openSnackBar("Ocorreu um erro ao remover a denúncia!", "OK", "snackbar-error");
      }
    })
  }
}
