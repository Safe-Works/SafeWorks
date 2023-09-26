import { Component } from '@angular/core';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { UserAuth } from '../../../auth/User.Auth';
import { JobService } from 'src/app/services/job.service';
import { ContractService } from 'src/app/services/contract.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent {
  jobId = "";
  isMyAdvertisement = true;
  isLoading = false;
  isError = false;
  defaultPicUrl = "../../assets/default-pic.png"
  jobInfo = {} as JobAdvertisement;
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });

  constructor(
    private userAuth: UserAuth,
    private router: Router,
    private jobService: JobService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
    this.loadJobInfo();
  }
  contractJob() {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "O serviço será contratado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, contratar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          this.isLoading = true;
          let response = await this.contractService.CreateJobContract(this.jobInfo);
          if (response?.statusCode === 201) {
            this.isLoading = false;
            this.openSnackBar("Serviço contratado com sucesso!", "OK", "snackbar-success");
          } else {
            this.isLoading = false;
            this.openSnackBar("Ocorreu um erro ao contratar o serviço!", "OK", "snackbar-error");
          }
        }
      } catch (error: any) {
        console.error('contractJob error:', error);
        this.isLoading = false;
        if (error.error?.statusCode === 402) {
          Swal.fire({
            title: 'Saldo insuficiente',
            text: "Deseja pagar por outro meio de pagamento?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
          }).then(async (result) => {
            try {
              if (result.isConfirmed) {
              }
            } catch (error: any) {
              this.openSnackBar("Ocorreu um erro ao contratar o serviço!", "OK", "snackbar-error");
            }
          })
        }
        else
          this.openSnackBar("Ocorreu um erro ao contratar o serviço!", "OK", "snackbar-error");
      }
    })
  }
  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
      panelClass: [className],
    });
  }
  loadJobInfo() {
    this.isLoading = true;
    if (this.jobId) {
      this.jobService.GetById(this.jobId).subscribe(
        (response) => {
          this.jobInfo = response.job;
          this.jobInfo.uid = this.jobId;
          if (!this.jobInfo.media || this.jobInfo.media?.length < 1) {
            this.jobInfo.media = [];
            this.jobInfo.media.push(this.defaultPicUrl);
          }
          if (this.jobInfo.worker.id !== this.userAuth.currentUser?.uid)
            this.isMyAdvertisement = false;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isError = true;
          this.isLoading = false;
        }
      );
    }

  }
  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }

  back() {
      this.location.back();
    }
}
