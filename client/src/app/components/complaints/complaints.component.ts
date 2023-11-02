import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuth } from 'src/app/auth/User.Auth';
import { ComplaintService } from 'src/app/services/complaint.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent {

  userInfo: any = null;
  complaints: any = null;
  isLoading: boolean = false;

  constructor(
    private complaintService: ComplaintService,
    private userAuth: UserAuth,
    public router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.userInfo = this.userAuth.currentUser?.infos;
    this.complaints = await this.getAllComplaints();
  }

  async getAllComplaints() {
    return this.complaintService.GetAll();
  }

  viewAdvertisement(uid: any): void {
    this.router.navigate(['/jobs', 'view', uid]);
  }

  viewProfile(uid: any): void {
    this.router.navigate(['/profile', uid]);
  }

  setProgressBarStatus(complaint: any): boolean {
    if (complaint.status === 'onAnalysis') {
      const element = document.getElementById('step2 ' + complaint.uid);
      element?.classList.add('active');
      
      return true
    }
    if (complaint.status === 'accepted' || complaint.status === 'refused' || complaint.status === 'canceled') {
      const element = document.getElementById('step3 ' + complaint.uid);
      element?.classList.add('active');

      return true
    }

    return false
  }

  async startAnalysis(complaintUid: string) {
    Swal.fire({
      title: 'Você tem certeza que deseja iniciar a análise?',
      text: "Você terá um prazo de 1h para aceitar ou recusar a denúncia!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, iniciar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          this.isLoading = true;
          let response = await this.complaintService.StartAnalysis(complaintUid);
          if (response?.statusCode === 200) {
            this.isLoading = false;
            this.complaints = response;
          } else {
            this.isLoading = false;
            this.openSnackBar("Ocorreu um erro ao iniciar a análise da denúncia!", "OK", "snackbar-error");
          }
        }
      } catch (error: any) {
        console.error('finishContract error: ', error);
        this.isLoading = false;
        this.openSnackBar("Ocorreu um erro ao iniciar a análise da denúncia!", "OK", "snackbar-error");
      }
    });
    
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
      panelClass: [className],
    });
  }

}
